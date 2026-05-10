import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import Invite from './pages/Invite';
import Leaderboard from './pages/Leaderboard';
import Withdrawal from './pages/Withdrawal';
import Settings from './pages/Settings';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-slate-950 text-white">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <BottomNav />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/home" element={<ProtectedRoute user={user}><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user}><Profile /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute user={user}><Tasks /></ProtectedRoute>} />
        <Route path="/invite" element={<ProtectedRoute user={user}><Invite /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute user={user}><Leaderboard /></ProtectedRoute>} />
        <Route path="/withdrawal" element={<ProtectedRoute user={user}><Withdrawal /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute user={user}><Settings /></ProtectedRoute>} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}
