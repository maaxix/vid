// components/AuthForms/AuthForms.tsx
'use client';

import { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

import './auth.css';

export default function AuthForms({ onClose }: { onClose: () => void }) {
  const [activeForm, setActiveForm] = useState<'login' | 'register' | 'forgotPassword'>('login');

  // Close modal when clicking outside the form
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  // Handle browser back button
  useEffect(() => {
    // Add a new entry to the history stack when the modal opens
    history.pushState({ modalOpen: true }, '');

    const handlePopState = (e: PopStateEvent) => {
      // Check if the modal is open
      if (e.state?.modalOpen) {
        onClose(); // Close the modal
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);

      // Clean up the history state when the modal closes
      if (history.state?.modalOpen) {
        history.back(); // Remove the modal state from the history stack
      }
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={handleBackdropClick} // Close modal when clicking outside
    >
      <div className="movie-card p-6 rounded-lg w-96" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <h2 className="text-xl font-bold mb-4 text-center">
          {activeForm === 'login' && 'Login'}
          {activeForm === 'register' && 'Register'}
          {activeForm === 'forgotPassword' && 'Forgot Password'}
        </h2>

        {/* Forms */}
        {activeForm === 'login' && (
          <LoginForm
            onClose={onClose}
            onSwitchToRegister={() => setActiveForm('register')}
            onSwitchToForgotPassword={() => setActiveForm('forgotPassword')}
          />
        )}
        {activeForm === 'register' && (
          <RegisterForm
            onClose={onClose}
            onSwitchToLogin={() => setActiveForm('login')}
          />
        )}
        {activeForm === 'forgotPassword' && (
          <ForgotPasswordForm
            onClose={onClose}
            onSwitchToLogin={() => setActiveForm('login')}
          />
        )}
      </div>
    </div>
  );
}