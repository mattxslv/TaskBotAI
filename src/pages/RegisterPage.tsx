import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import Head from '@/components/Head';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(firebaseApp);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/auth-sync', { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/auth-sync', { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head title="Create an Account – Tasky AI To-Do List & Project Management App" />
      <section className="min-h-screen flex items-center justify-center bg-base-200 text-gray-900">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Create your account</h1>
          <form className="space-y-4" onSubmit={handleRegister} autoComplete="off">
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                className="input input-bordered w-full mt-1"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Password</span>
              <input
                type="password"
                className="input input-bordered w-full mt-1"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </label>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            <div className="divider text-xs">or</div>
            <button
              type="button"
              className="btn btn-outline w-full flex items-center justify-center gap-2"
              onClick={handleGoogleRegister}
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.1 33.1 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.1 5.1 29.3 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.6 16.1 19.5 13 24 13c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.1 5.1 29.3 3 24 3c-7.2 0-13.2 4.1-16.2 10.1z"/><path fill="#FBBC05" d="M24 43c5.3 0 10.1-1.8 13.8-4.8l-6.4-5.2C29.2 34.9 26.7 36 24 36c-5.6 0-10.1-2.9-11.7-7.5l-7 5.4C10.8 39.9 17 43 24 43z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.1 5.5-7.7 5.5-4.7 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.1 5.1 29.3 3 24 3c-7.2 0-13.2 4.1-16.2 10.1z"/></g></svg>
              Register with Google
            </button>
          </form>
          <div className="text-center mt-6 text-sm">
            Already have an account?{' '}
            <a href="/login" className="link link-primary font-medium">Log In</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterPage;