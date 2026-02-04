//Route Imports
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

//Page Imports
import Landing from "./pages/Landing"
import { AuthProvider } from './provider/AuthProvider'

function App() {
  return (
    <>
      <div className="justify-center items-center flex h-screen w-screen"> 
        <AuthProvider>
          <Router>
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<Landing />} />

              {/* Catch-all - must be last */}
					    <Route path="*" element={<Navigate to="/" replace />} />
                    
            </Routes>
          </Router>
        </AuthProvider>
      </div>
    </>
  )
}

export default App