import React, { useState, useEffect } from 'react';
import './EmailVerification.css';

const EmailVerification = ({ token, onVerificationComplete }) => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();
      
      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setUserInfo({ email: data.email, name: data.name });
        if (onVerificationComplete) {
          onVerificationComplete(data);
        }
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Verification failed. Please try again.');
    }
  };

  const resendVerification = async () => {
    if (!userInfo?.email) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/auth/resend-verification?email=${encodeURIComponent(userInfo.email)}`, {
        method: 'POST',
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Verification email sent successfully!');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Failed to resend verification email.');
    }
  };

  return (
    <div className="email-verification">
      <div className="verification-container">
        {status === 'verifying' && (
          <div className="verifying">
            <div className="spinner"></div>
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="success">
            <div className="success-icon">✓</div>
            <h2>Email Verified Successfully!</h2>
            <p>{message}</p>
            {userInfo && (
              <div className="user-info">
                <p>Welcome, <strong>{userInfo.name}</strong>!</p>
                <p>Email: {userInfo.email}</p>
              </div>
            )}
            <button 
              className="login-button"
              onClick={() => window.location.href = '/login'}
            >
              Go to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="error">
            <div className="error-icon">✗</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            {userInfo?.email && (
              <button 
                className="resend-button"
                onClick={resendVerification}
              >
                Resend Verification Email
              </button>
            )}
            <button 
              className="register-button"
              onClick={() => window.location.href = '/register'}
            >
              Register Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
