/*
  # Add notifications system

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `expense_id` (uuid, references expenses)
      - `recipient_role` (text)
      - `type` (text)
      - `title` (text)
      - `content` (text)
      - `is_read` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `notifications` table
    - Add policies for notification access
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id uuid REFERENCES expenses(id),
  recipient_role text NOT NULL CHECK (recipient_role IN ('approver', 'admin', 'user')),
  type text NOT NULL CHECK (type IN ('new_expense', 'expense_approved', 'expense_rejected')),
  title text NOT NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view notifications for their role"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (
    (recipient_role = (
      SELECT role FROM profiles WHERE id = auth.uid()
    ))
    OR
    (recipient_role = 'user' AND EXISTS (
      SELECT 1 FROM expenses
      WHERE expenses.id = notifications.expense_id
      AND expenses.user_id = auth.uid()
    ))
  );

-- Add trigger for updated_at
CREATE TRIGGER notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create function for sending notification emails
CREATE OR REPLACE FUNCTION notify_expense_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for approvers
  INSERT INTO notifications (
    expense_id,
    recipient_role,
    type,
    title,
    content
  )
  VALUES (
    NEW.id,
    'approver',
    'new_expense',
    '新規経費申請',
    format(
      '%sから新しい経費申請（¥%s）が提出されました。',
      (SELECT email FROM profiles WHERE id = NEW.user_id),
      NEW.amount
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for expense submissions
CREATE TRIGGER expense_submission_notification
  AFTER INSERT ON expenses
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION notify_expense_submission();