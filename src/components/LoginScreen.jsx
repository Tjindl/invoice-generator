import React, { useState } from 'react';

// Get password from environment variable
const CORRECT_PASSWORD = import.meta.env.VITE_APP_PASSWORD;

if (!CORRECT_PASSWORD) {
  console.error('Password environment variable is not set!');
}

const LoginScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      onLogin();
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="login-screen">
      <div className="login-box">
        <h2>Estimate Generator</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;