import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';

function App() {
  return (
    <Router>
      <AuthProvider />
    </Router>
  );
}

export default App;