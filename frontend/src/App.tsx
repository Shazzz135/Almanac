//Route Imports
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

//Page Imports
import Landing from "./pages/Landing"
import Auth from "./pages/Auth"
import Board from "./pages/Board"
import Profile from "./pages/Profile"

//Provider Imports
import { AuthProvider } from './provider/AuthProvider'
import { CalendarProvider } from './provider/CalendarProvider'
import Navbar from './components/ui/Navbar'
import Footer from './components/ui/Footer'
import { useAuth } from './hooks/auth/useAuth'

// ============================================================================
// PROTECTED LANDING COMPONENT
// ============================================================================

/**
 * Component that protects the landing page from authenticated users
 * If user is logged in and authenticated, redirects to /board
 * Otherwise, displays the Landing page
 */
function ProtectedLanding() {
  const { isAuthenticated, isLoading } = useAuth();

  // If still loading, show nothing (will show briefly on app startup)
  if (isLoading) {
    return null;
  }

  // If user is authenticated, redirect to board
  if (isAuthenticated) {
    return <Navigate to="/board" replace />;
  }

  // Otherwise, show the landing page
  return <Landing />;
}

/**
 * Component that handles catch-all routes (*) and redirects appropriately
 * If user is authenticated, redirects to /board
 * Otherwise, redirects to /
 */
function CatchAllRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  // If still loading, show nothing
  if (isLoading) {
    return null;
  }

  // If user is authenticated, redirect to board
  if (isAuthenticated) {
    return <Navigate to="/board" replace />;
  }

  // Otherwise, redirect to landing page
  return <Navigate to="/" replace />;
}

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-t from-gray-900 to-gray-950 flex flex-col">
      <AuthProvider>
        <CalendarProvider>
          <Router>
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-6">
              <Routes>
                {/* Main Pages - Protected: authenticated users are redirected to /board */}
                <Route path="/" element={<ProtectedLanding />} />

                {/* Auth Routes - all subroutes defined in Auth component */}
                <Route path="/auth/*" element={<Auth />} />

                {/* Board page - shown after login */}
                <Route path="/board" element={<Board />} />

              {/* Profile page - shows user account details */}
              <Route path="/profile" element={<Profile />} />

              {/* Catch-all - redirects authenticated users to /board, others to / */}
              <Route path="*" element={<CatchAllRedirect />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </CalendarProvider>
      </AuthProvider>
    </div>
  )
}

export default App