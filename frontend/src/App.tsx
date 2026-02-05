//Route Imports
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

//Page Imports
import Landing from "./pages/Landing"
import Auth from "./pages/Auth"
import Bench from "./pages/Bench"
import { AuthProvider } from './provider/AuthProvider'
import Navbar from './components/ui/Navbar'

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-t from-gray-900 to-gray-950">
      <AuthProvider>
        <Router>
          <Navbar />
          <div className="flex flex-col items-center justify-center pt-16">
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<Landing />} />

              {/* Auth Routes - all subroutes defined in Auth component */}
              <Route path="/auth/*" element={<Auth />} />

              {/* Bench page - shown after login */}
              <Route path="/bench" element={<Bench />} />

              {/* Catch-all - must be last */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App