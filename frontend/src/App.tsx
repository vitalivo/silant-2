"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import MachinesPage from "./pages/MachinesPage"
import MaintenancePage from "./pages/MaintenancePage"
import ComplaintsPage from "./pages/ComplaintsPage"
import MachineDetailPage from "./pages/MachineDetailPage"
import MaintenanceDetailPage from "./pages/MaintenanceDetailPage"
import ComplaintDetailPage from "./pages/ComplaintDetailPage"
import AuthService from "./components/AuthService"
import LoginForm from "./components/LoginForm"
import { X } from "lucide-react"
import styles from "./styles/Modal.module.css"

function App() {
  const [showLoginForm, setShowLoginForm] = useState(false)

  return (
    <AuthService>
      {({ user, login, logout, loading: authLoading, error: authError }) => (
        <Router>
          {/* Модальное окно входа */}
          {showLoginForm && !user && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <button onClick={() => setShowLoginForm(false)} className={styles.modalCloseButton}>
                  <X size={20} />
                </button>
                <LoginForm
                  onLogin={async (username, password) => {
                    await login(username, password)
                    setShowLoginForm(false)
                  }}
                  loading={authLoading}
                  error={authError}
                />
              </div>
            </div>
          )}

          <Layout user={user} onShowLogin={() => setShowLoginForm(true)} onLogout={logout}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/machines" element={<MachinesPage />} />
              <Route path="/machines/:id" element={<MachineDetailPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/maintenance/:id" element={<MaintenanceDetailPage />} />
              <Route path="/complaints" element={<ComplaintsPage />} />
              <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
            </Routes>
          </Layout>
        </Router>
      )}
    </AuthService>
  )
}

export default App

