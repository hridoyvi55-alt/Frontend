import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from '../lib/firebase';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });
  const [firebaseError, setFirebaseError] = useState('');

  // Calculate password strength
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-orange-500';
    if (strength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = (strength: number) => {
    if (strength <= 25) return 'Weak';
    if (strength <= 50) return 'Fair';
    if (strength <= 75) return 'Good';
    return 'Strong';
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setFirebaseError('');
    try {
      const user = await signInWithGoogle();
      if (!user) {
        throw new Error('Google sign-in failed');
      }

      const result = await api.syncUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

      if (result.success) {
        api.setToken(result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        toast.success('Welcome back!');
        navigate('/home');
      } else {
        toast.success('Welcome! Please complete your profile.');
        navigate('/home');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      const errorMsg = error.message || 'Google login failed. Please try again.';
      setFirebaseError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!isLogin && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setFirebaseError('');

    try {
      if (isLogin) {
        const user = await signInWithEmail(formData.email, formData.password);
        if (!user) {
          throw new Error('Email sign-in failed');
        }

        const result = await api.syncUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });

        if (result.success) {
          api.setToken(result.data.token);
          localStorage.setItem('user', JSON.stringify(result.data.user));
          toast.success('Welcome back!');
          navigate('/home');
        } else {
          toast.success('Welcome back!');
          navigate('/home');
        }
      } else {
        if (!formData.displayName) {
          toast.error('Please enter your name');
          setLoading(false);
          return;
        }

        const user = await signUpWithEmail(formData.email, formData.password, formData.displayName);
        if (!user) {
          throw new Error('Email sign-up failed');
        }

        const result = await api.syncUser({
          uid: user.uid,
          email: user.email,
          displayName: formData.displayName || user.displayName,
        });

        if (result.success) {
          api.setToken(result.data.token);
          localStorage.setItem('user', JSON.stringify(result.data.user));
          toast.success('Account created successfully!');
          navigate('/home');
        } else {
          toast.success('Account created! Welcome!');
          navigate('/home');
        }
      }
    } catch (error: any) {
      console.error('Email auth error:', error);
      let errorMsg = error.message || 'Authentication failed';

      // Map Firebase error codes to user-friendly messages
      if (error.code === 'auth/user-not-found') {
        errorMsg = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect password';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already registered';
      } else if (error.code === 'auth/weak-password') {
        errorMsg = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address';
      }

      setFirebaseError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animated-bg">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center pulse-glow"
          >
            <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </motion.div>
          <h1 className="text-4xl font-bold neon-text mb-2">{t('appName')}</h1>
          <p className="text-gray-400 text-lg">{t('welcome')}</p>
        </div>

        {/* Auth Card */}
        <div className="card-gradient p-8 glass">
          <div className="flex mb-8 bg-[#12121a] rounded-full p-1">
            <button
              onClick={() => {
                setIsLogin(true);
                setFirebaseError('');
              }}
              className={`flex-1 py-3 rounded-full transition-all ${
                isLogin ? 'gradient-primary text-black font-semibold' : 'text-gray-400'
              }`}
            >
              {t('signIn')}
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setFirebaseError('');
              }}
              className={`flex-1 py-3 rounded-full transition-all ${
                !isLogin ? 'gradient-primary text-black font-semibold' : 'text-gray-400'
              }`}
            >
              {t('signUp')}
            </button>
          </div>

          {/* Error Message */}
          {firebaseError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm"
            >
              {firebaseError}
            </motion.div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    placeholder={t('displayName')}
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="input-neon pl-12"
                  />
                </div>
              </motion.div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="email"
                placeholder={t('email')}
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setFirebaseError('');
                }}
                className="input-neon pl-12"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('password')}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setFirebaseError('');
                }}
                className="input-neon pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {!isLogin && formData.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Password Strength</span>
                  <span className={`
                    ${passwordStrength <= 25 ? 'text-red-400' : ''}
                    ${passwordStrength > 25 && passwordStrength <= 50 ? 'text-orange-400' : ''}
                    ${passwordStrength > 50 && passwordStrength <= 75 ? 'text-yellow-400' : ''}
                    ${passwordStrength > 75 ? 'text-green-400' : ''}
                  `}>
                    {getStrengthLabel(passwordStrength)}
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength}%` }}
                    className={`h-full rounded-full transition-all ${getStrengthColor(passwordStrength)}`}
                  />
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full ${
                        passwordStrength >= level * 25 ? getStrengthColor(passwordStrength) : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <button
              onClick={handleEmailAuth}
              disabled={loading}
              className="btn-neon w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="spinner w-5 h-5" />
              ) : (
                isLogin ? t('signIn') : t('signUp')
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="px-4 text-gray-500 text-sm">{t('orContinueWith')}</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn-ghost w-full flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t('google')}
          </button>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 blur-3xl float-up" />
        <div className="absolute bottom-40 right-20 w-40 h-40 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl float-up-delay" />
      </motion.div>
    </div>
  );
}
