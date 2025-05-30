/**
 * @copyright 2024 mattxslv
 * @license Apache-2.0
 * @description Auth sync page for the app
 */

/**
 * Node modules
 */
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase'; // <-- ADD THIS LINE

const AuthSyncPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem('firebaseUserId', user.uid);
        navigate('/app/today', { replace: true });
      } else {
        localStorage.removeItem('firebaseUserId');
        navigate('/login', { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return null;
};

export default AuthSyncPage;