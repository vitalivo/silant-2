"use client"

import type React from "react"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import MachinesPage from "./pages/MachinesPage"
import MaintenancePage from "./pages/MaintenancePage"
import ComplaintsPage from "./pages/ComplaintsPage"
import MachineDetailPage from "./pages/MachineDetailPage"
import MaintenanceDetailPage from "./pages/MaintenanceDetailPage"
import ComplaintDetailPage from "./pages/ComplaintDetailPage"
import AuthService from "./services/AuthService"
import LoginForm from "./components/LoginForm"
import DirectoriesManager from "./components/DirectoriesManager"
import { X } from "lucide-react"
import "./styles/reset.css"
import styles from "./styles/Modal.module.css"

// Компонент для защищенных роутов
const ProtectedRoute = ({ user, children }: { user: any; children: React.ReactNode }) => {
  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            padding: "3rem",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔒</div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "1rem",
              fontFamily: "PT Astra Sans, system-ui, sans-serif",
            }}
          >
            Требуется авторизация
          </h2>
          <p
            style={{
              color: "#64748b",
              marginBottom: "2rem",
              fontSize: "1rem",
              lineHeight: "1.6",
              fontFamily: "PT Astra Sans, system-ui, sans-serif",
            }}
          >
            Для доступа к данным о техническом обслуживании и рекламациях необходимо войти в систему
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "PT Astra Sans, system-ui, sans-serif",
            }}
          >
            ← Вернуться назад
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

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

              {/* Защищенные роуты - только для авторизованных пользователей */}
              <Route
                path="/maintenance"
                element={
                  <ProtectedRoute user={user}>
                    <MaintenancePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/maintenance/:id"
                element={
                  <ProtectedRoute user={user}>
                    <MaintenanceDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/complaints"
                element={
                  <ProtectedRoute user={user}>
                    <ComplaintsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/complaints/:id"
                element={
                  <ProtectedRoute user={user}>
                    <ComplaintDetailPage />
                  </ProtectedRoute>
                }
              />
             <Route
                path="/directories"
                element={
                  <ProtectedRoute user={user}>
                    <DirectoriesManager />
                  </ProtectedRoute>
                }
              />

              {/* Fallback для несуществующих роутов */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      )}
    </AuthService>
  )
}

export default App

