// components/AuthForms/AuthForms.tsx
'use client';

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

import './auth.css';

export default function AuthForms({ onClose }: { onClose: () => void }) {
  const [activeForm, setActiveForm] = useState<'login' | 'register' | 'forgotPassword'>('login');
  const navigate = useNavigate()
  const location = useLocation()

  // Close modal when clicking outside the form
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
 
    // Save current location
    const currentPath = location.pathname + location.search
    // Push a dummy modal route (not used, just for history stack)
    navigate(currentPath + '#modal', { replace: false })

    const handlePopState = () => {
      //if (e.state?.modalOpen) {
      //  onClose();
      //}
      if (window.location.hash !== '#modal') {
        onClose()
      }
    };
  
    // Setup
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscapeKey);
    window.addEventListener('popstate', handlePopState);
  
    // Cleanup
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscapeKey);
      window.removeEventListener('popstate', handlePopState);
      //if (history.state?.modalOpen) {
      //  history.back();
      //}
      if (window.location.hash === '#modal') {
        navigate(currentPath, { replace: true })
      }
    };
  }, []);
//  }, [onClose]);

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