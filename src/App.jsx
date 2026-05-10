import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import Withdrawal from './pages/Withdrawal';
import Invite from './pages/Invite';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import { Toaster } from 'react-hot-toast';   // Optional - for nice notifications

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />

            <Route path="/tasks" element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="/withdrawal" element={
              <ProtectedRoute>
                <Withdrawal />
              </ProtectedRoute>
            } />

            <Route path="/invite" element={
              <ProtectedRoute>
                <Invite />
              </ProtectedRoute>
            } />

            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } />

            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global Toast Notification */}
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#1f1f3a',
                color: '#fff',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
              }
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
