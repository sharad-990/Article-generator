import React, { useState, useEffect } from 'react';
import './OtpVerification.css';

const OtpVerification = ({ email, onVerificationComplete }) => {
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtpCode(value);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otpCode: otpCode
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Email verified successfully! Redirecting...');
        setTimeout(() => {
          if (onVerificationComplete) {
            onVerificationComplete(data);
          }
        }, 2000);
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (error) {
      setError('Network error. Please check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/api/auth/resend-otp?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('OTP code sent successfully!');
        setTimeLeft(600); // Reset timer
        setOtpCode('');
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-verification">
      <div className="otp-container">
        <div className="otp-header">
          <div className="otp-icon">📧</div>
          <h2>Verify Your Email</h2>
          <p>We've sent a 6-digit OTP code to</p>
          <p className="email-address">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-input-group">
            <label htmlFor="otp">Enter OTP Code</label>
            <input
              type="text"
              id="otp"
              value={otpCode}
              onChange={handleOtpChange}
              placeholder="000000"
              maxLength="6"
              className="otp-input"
              disabled={isLoading}
            />
            <div className="otp-timer">
              {timeLeft > 0 ? (
                <span className="timer-text">Code expires in {formatTime(timeLeft)}</span>
              ) : (
                <span className="timer-expired">Code expired</span>
              )}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button 
            type="submit" 
            className="verify-button"
            disabled={isLoading || otpCode.length !== 6 || timeLeft === 0}
          >
            {isLoading ? (
              <div className="button-spinner"></div>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>

        <div className="otp-footer">
          <p>Didn't receive the code?</p>
          <button 
            type="button" 
            className="resend-button"
            onClick={handleResendOtp}
            disabled={isLoading || timeLeft > 0}
          >
            {timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
