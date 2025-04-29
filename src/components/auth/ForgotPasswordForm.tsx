'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ForgotPasswordFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function ForgotPasswordForm({ onClose, onSwitchToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowOtp(true); // Show OTP input
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
        console.log(err);
      setError('An error occurred. Please try again.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/'); // Redirect to home page
        onClose();
      } else {
        setError(data.message || 'OTP verification failed.');
      }
    } catch (err) {
        console.log(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={showOtp ? handleVerifyOtp : handleForgotPassword}>
      {!showOtp ? (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your email"
          />
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter OTP"
          />
        </div>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
      >
        {showOtp ? 'Verify OTP' : 'Send OTP'}
      </button>
      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-500 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </form>
  );
}