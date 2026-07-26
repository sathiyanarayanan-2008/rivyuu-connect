import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Review from './pages/Review.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import BusinessDashboard from './pages/BusinessDashboard.jsx';
import Notifications from './pages/Notifications.jsx';
import Settings from './pages/Settings.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" style={{ width: 40, height: 40 }} />
      <span style={{ color: 'var(--text-muted)' }}>Loading...</span>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — no navbar/footer */}
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

        {/* Main app */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/business-dashboard" element={<BusinessDashboard />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/review/new" element={<ProtectedRoute><Review /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="*" element={
                <div className="page-wrapper">
                  <div className="empty-state" style={{ height: '70vh' }}>
                    <span className="empty-icon" style={{ fontSize: '4rem' }}>🔍</span>
                    <h2 className="empty-title">Page Not Found</h2>
                    <p className="empty-desc">The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn btn-primary" style={{ marginTop: 16 }}>Go Home</a>
                  </div>
                </div>
              } />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

