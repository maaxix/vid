'use client'; // Mark as a Client Component

import { useEffect, useState } from 'react';
import AuthForms from './AuthForms';

export default function LoginButton() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
    //const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [, setUserRole] = useState<string | null>(null);
    const [, setIsLoading] = useState(true);
  
    // Fetch authentication status and user role from cookies
    useEffect(() => {
      const userId = document.cookie.split('; ').find((row) => row.startsWith('userId='))?.split('=')[1];
      const role = document.cookie.split('; ').find((row) => row.startsWith('userRole='))?.split('=')[1];
  
      if (userId && role) {
        setIsLoggedIn(true);
        setUserRole(role);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
  
      setIsLoading(false);
    }, []);
  
    const handleLogout = async () => {
      // Call the logout API to clear all cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
  
      // Update the state and redirect to the home page
      setIsLoggedIn(false);
      setUserRole(null);
      window.location.reload();
    };
  
    const openAuthModal = () => {
      setIsAuthModalOpen(true);
    };
  
    const closeAuthModal = () => {
      setIsAuthModalOpen(false);
    };
  
    return (
      <>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn primary">Logout</button>
          ) : (
            <button onClick={openAuthModal} className="btn primary">Login</button>
          )}
  
        {/* AuthForms Modal */}
        {isAuthModalOpen && <AuthForms onClose={closeAuthModal} />}
      </>
    );
  }