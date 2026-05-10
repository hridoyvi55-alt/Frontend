import { useMemo, useState } from 'react';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

function strengthScore(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export default function Login() {
  const [mode, setMode] = useState('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const score = useMemo(() => strengthScore(password), [password]);
  const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][score];
  const strengthClass =
    score <= 1 ? 'bg-red-500' : score === 2 ? 'bg-orange-500' : score === 3 ? 'bg-yellow-400' : 'bg-emerald-500';

  const googleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      nav('/home');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: fullName });
      nav('/home');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      nav('/home');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.45),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.25),_transparent_26%),linear-gradient(135deg,_rgba(15,23,42,1)_0%,_rgba(2,6,23,1)_100%)]" />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/8 backdrop-blur-2xl shadow-[0_25px_90px_rgba(0,0,0,0.55)] p-6">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 h-20 w-20 rounded-[1.8rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_15px_45px_rgba(99,102,241,0.45)] grid place-items-center text-3xl ring-1 ring-white/20">
              💎
            </div>
            <h1 className="text-4xl font-black tracking-tight">RealEarn</h1>
            <p className="text-white/65 mt-2">Verified tasks. Real AED. Premium experience.</p>
          </div>

          <button
            onClick={googleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white text-slate-900 py-3.5 font-semibold hover:scale-[1.01] active:scale-[0.99] transition shadow-lg"
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/15" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-white/45">OR</span>
            <div className="h-px flex-1 bg-white/15" />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-white/6 p-1 border border-white/10">
            <button
              onClick={() => setMode('signup')}
              className={`rounded-xl py-2 text-sm font-semibold ${mode === 'signup' ? 'bg-white text-slate-950' : 'text-white/60'}`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setMode('login')}
              className={`rounded-xl py-2 text-sm font-semibold ${mode === 'login' ? 'bg-white text-slate-950' : 'text-white/60'}`}
            >
              Login
            </button>
          </div>

          <form onSubmit={mode === 'signup' ? handleSignup : handleLogin} className="space-y-4">
            {mode === 'signup' && (
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="Full name"
                className="w-full rounded-2xl bg-white/8 border border-white/10 px-4 py-3 outline-none focus:border-indigo-400/70 focus:bg-white/10 transition placeholder:text-white/30"
              />
            )}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full rounded-2xl bg-white/8 border border-white/10 px-4 py-3 outline-none focus:border-indigo-400/70 focus:bg-white/10 transition placeholder:text-white/30"
            />
            <div className="space-y-2">
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  className="w-full rounded-2xl bg-white/8 border border-white/10 px-4 py-3 pr-12 outline-none focus:border-indigo-400/70 focus:bg-white/10 transition placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/70"
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>

              {mode === 'signup' && (
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-white/50">
                    <span>Password strength</span>
                    <span>{strengthText}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full ${strengthClass} transition-all`}
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 py-3.5 font-bold shadow-[0_15px_40px_rgba(99,102,241,0.35)] hover:brightness-110 transition"
            >
              {mode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-white/65">
            <div className="rounded-2xl bg-white/6 p-3 border border-white/10">Secure login</div>
            <div className="rounded-2xl bg-white/6 p-3 border border-white/10">Unique UID</div>
            <div className="rounded-2xl bg-white/6 p-3 border border-white/10">Photo sync</div>
          </div>
        </div>
      </div>
    </div>
  );
}
