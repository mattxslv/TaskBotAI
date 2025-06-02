import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import Head from '@/components/Head';

const auth = getAuth(firebaseApp);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        navigate('/auth-sync', { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/auth-sync', { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/auth-sync', { replace: true });
    } catch (err: any) {
      // Only show error if it's not popup closed by user
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head title="Log In to TaskBot AI – Manage Your To-Do Lists and Projects" />
      <section className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="w-full max-w-md bg-neutral-900/90 rounded-xl shadow-2xl px-6 py-8 text-gray-100 border border-neutral-800 backdrop-blur-md">
          <h1 className="text-2xl font-extrabold mb-3 text-center tracking-tight">Log in to your account</h1>
          <p className="text-center text-gray-400 mb-6 text-sm">
            Access your workspace and manage your projects efficiently.
          </p>
          <form className="space-y-4" onSubmit={handleLogin} autoComplete="off">
            <label className="block">
              <span className="text-sm font-semibold">Email</span>
              <input
                type="email"
                className="input input-bordered w-full mt-1 bg-neutral-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Password</span>
              <input
                type="password"
                className="input input-bordered w-full mt-1 bg-neutral-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </label>
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="btn btn-primary w-full rounded-full font-semibold tracking-wide shadow-md transition hover:scale-[1.02] active:scale-95"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            <div className="divider text-xs text-gray-500">or</div>
            <button
              type="button"
              className="btn btn-outline w-full flex items-center justify-center gap-2 rounded-full font-semibold shadow-sm hover:bg-neutral-800/60 transition"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <g>
                  <circle cx="24" cy="24" r="24" fill="#fff"/>
                  <path d="M34.6 24.3c0-.8-.1-1.6-.2-2.3H24v4.5h7.7c-.3 1.5-1.2 2.8-2.5 3.7v3h4c2.3-2.1 3.6-5.2 3.6-8.9z" fill="#4285F4"/>
                  <path d="M24 38c3.2 0 5.9-1.1 7.9-2.9l-4-3.1c-1.1.7-2.5 1.2-3.9 1.2-3 0-5.6-2-6.5-4.7h-4.1v3.1C16.1 35.7 19.8 38 24 38z" fill="#34A853"/>
                  <path d="M17.5 28.5c-.3-.8-.5-1.6-.5-2.5s.2-1.7.5-2.5v-3.1h-4.1c-.8 1.6-1.3 3.3-1.3 5.6s.5 4 1.3 5.6l4.1-3.1z" fill="#FBBC05"/>
                  <path d="M24 15.5c1.7 0 3.2.6 4.4 1.7l3.3-3.3C29.9 11.7 27.2 10.5 24 10.5c-4.2 0-7.9 2.3-10 5.8l4.1 3.1c.9-2.7 3.5-4.7 6.5-4.7z" fill="#EA4335"/>
                </g>
              </svg>
              Log In with Google
            </button>
          </form>
          <div className="text-center mt-6 text-sm">
            <span className="text-gray-400">Don't have an account?</span>{' '}
            <a href="/register" className="link link-primary font-semibold">Register</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;