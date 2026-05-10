import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Google } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Password Strength Checker
  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength += 1;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    setPasswordStrength(strength);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a0a1f]">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md mx-4 p-10 rounded-3xl shadow-2xl border border-white/10 relative z-10"
      >
        <div className="text-center mb-10">
          <motion.h1 
            className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            EARN<span className="text-white">AED</span>
          </motion.h1>
          <p className="text-gray-400 mt-3 text-lg">Earn Real Money Daily</p>
        </div>

        <div className="flex bg-white/5 rounded-2xl p-1 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${isLogin ? 'bg-white text-black shadow-lg' : 'text-gray-400'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${!isLogin ? 'bg-white text-black shadow-lg' : 'text-gray-400'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all"
                required
              />
            </motion.div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-4 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {!isLogin && formData.password && (
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400">
                {passwordStrength <= 2 && "Weak"}
                {passwordStrength === 3 && "Medium"}
                {passwordStrength >= 4 && "Strong"}
              </p>
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-purple-500/30 transition-all disabled:opacity-70"
          >
            {loading ? "Processing..." : isLogin ? "Login Now" : "Create Account"}
          </motion.button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="h-px flex-1 bg-white/10"></div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 border border-white/20 py-4 rounded-2xl font-semibold transition-all"
        >
          <Google size={24} />
          Continue with Google
        </motion.button>

        <p className="text-center text-xs text-gray-500 mt-8">
          By signing up, you agree to our Terms & Privacy Policy
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
