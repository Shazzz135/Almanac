//Route Imports
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

//Page Imports
import Landing from "./pages/Landing"
import Auth from "./pages/Auth"
import Board from "./pages/Board"
import Profile from "./pages/Profile"

//Provider Imports
import { AuthProvider } from './provider/AuthProvider'
import Navbar from './components/ui/Navbar'
import Footer from './components/ui/Footer'

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-t from-gray-900 to-gray-950 flex flex-col">
      <AuthProvider>
        <Router>
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center pt-16">
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<Landing />} />

              {/* Auth Routes - all subroutes defined in Auth component */}
              <Route path="/auth/*" element={<Auth />} />

              {/* Board page - shown after login */}
              <Route path="/board" element={<Board />} />

              {/* Profile page - shows user account details */}
              <Route path="/profile" element={<Profile />} />

              {/* Catch-all - must be last */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App