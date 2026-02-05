//Route Imports
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

//Page Imports
import Landing from "./pages/Landing"
import Auth from "./pages/Auth"
import Bench from "./pages/Bench"
import { AuthProvider } from './provider/AuthProvider'

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-t from-gray-900 to-gray-950 flex flex-col items-center justify-center">
      <AuthProvider>
        <Router>
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
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App