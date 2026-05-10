import { useState } from 'react';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

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

  const login = async (e) => {
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

  const signup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
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
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.08]" />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/8 backdrop-blur-2xl shadow-[0_25px_90px_rgba(0,0,0,0.55)] p-6">
          <div className="text-center mb-7">
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

          <form onSubmit={login} className="space-y-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full rounded-2xl bg-white/8 border border-white/10 px-4 py-3 outline-none focus:border-indigo-400/70 focus:bg-white/10 transition placeholder:text-white/30"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full rounded-2xl bg-white/8 border border-white/10 px-4 py-3 outline-none focus:border-indigo-400/70 focus:bg-white/10 transition placeholder:text-white/30"
            />
            <button
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 py-3.5 font-bold shadow-[0_15px_40px_rgba(99,102,241,0.35)] hover:brightness-110 transition"
            >
              Sign In
            </button>
          </form>

          <button
            onClick={signup}
            disabled={loading}
            className="mt-3 w-full rounded-2xl border border-white/12 bg-white/6 py-3.5 font-bold hover:bg-white/10 transition"
          >
            Create Account
          </button>

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
