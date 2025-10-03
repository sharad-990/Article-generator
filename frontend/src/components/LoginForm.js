import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LoginForm.css';

const LoginForm = ({ onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      onClose();
    } else {
      // Check if it's an email verification error
      if (result.error && result.error.includes('verify your email')) {
        setError(result.error);
        setShowResend(true);
      } else {
        setError(result.error || 'Login failed');
        setShowResend(false);
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/auth/resend-verification?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });
      const data = await response.json();
      setResendMessage(data.message);
    } catch (error) {
      setResendMessage('Failed to resend verification email.');
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <h2>Welcome Back! 👋</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {showResend && (
            <div className="resend-verification">
              <button 
                type="button" 
                className="resend-btn" 
                onClick={handleResendVerification}
              >
                Resend Verification Email
              </button>
              {resendMessage && <div className="resend-message">{resendMessage}</div>}
            </div>
          )}
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <button onClick={onSwitchToRegister} className="link-btn">Sign up</button></p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
