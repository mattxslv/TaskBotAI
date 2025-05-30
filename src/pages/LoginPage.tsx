import { useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, EmailAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import { StyledFirebaseAuth } from 'react-firebaseui';
import Head from '@/components/Head';
import { useNavigate } from 'react-router';

const auth = getAuth(firebaseApp);

const uiConfig = {
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID,
  ],
  credentialHelper: 'none',
  callbacks: {
    signInSuccessWithAuthResult: () => {
      // Do NOT redirect here!
      return false;
    },
  },
};

const LoginPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        navigate('/auth-sync', { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      <Head title='Log In to Tasky AI – Manage Your To-Do Lists and Projects' />
      <section>
        <div className='container flex justify-center'>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={auth}
          />
        </div>
      </section>
    </>
  );
};

export default LoginPage;
