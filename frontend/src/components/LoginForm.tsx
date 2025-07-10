"use client"

import type React from "react"
import { useState } from "react"
import { LogIn } from "lucide-react"

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>
  loading: boolean
  error: string | null
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading, error }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return

    try {
      await onLogin(username, password)
    } catch (err) {
      // Ошибка обрабатывается в AuthService
    }
  }

  return (
    <div style={{ width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <LogIn size={28} style={{ color: "#3b82f6", marginBottom: "12px" }} />
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#0f172a",
            marginBottom: "8px",
            fontFamily: "PT Astra Sans, system-ui, sans-serif",
          }}
        >
          Вход в систему
        </h2>
        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
            fontFamily: "PT Astra Sans, system-ui, sans-serif",
          }}
        >
          Для доступа к полной информации о технике и сервисе
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "6px",
              fontFamily: "PT Astra Sans, system-ui, sans-serif",
            }}
          >
            Логин
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              fontSize: "16px",
              transition: "all 0.2s ease",
              fontFamily: "PT Astra Sans, system-ui, sans-serif",
              background: "#f9fafb",
              outline: "none",
            }}
            placeholder="Введите логин"
            disabled={loading}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6"
              e.target.style.background = "white"
              e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb"
              e.target.style.background = "#f9fafb"
              e.target.style.boxShadow = "none"
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "6px",
              fontFamily: "PT Astra Sans, system-ui, sans-serif",
            }}
          >
            Пароль
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              fontSize: "16px",
              transition: "all 0.2s ease",
              fontFamily: "PT Astra Sans, system-ui, sans-serif",
              background: "#f9fafb",
              outline: "none",
            }}
            placeholder="Введите пароль"
            disabled={loading}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6"
              e.target.style.background = "white"
              e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb"
              e.target.style.background = "#f9fafb"
              e.target.style.boxShadow = "none"
            }}
          />
        </div>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              color: "#dc2626",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "16px",
              fontFamily: "PT Astra Sans, system-ui, sans-serif",
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 20px",
            background: loading ? "#9ca3af" : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            fontFamily: "PT Astra Sans, system-ui, sans-serif",
            transform: loading ? "none" : "translateY(0)",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 10px 25px -3px rgba(59, 130, 246, 0.3)"
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "none"
            }
          }}
        >
          {loading ? "Вход..." : "Войти в систему"}
        </button>
      </form>

      {/* Убрали блок с тестовыми учетными данными */}
      <div
        style={{
          textAlign: "center",
          padding: "16px",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: "#64748b",
            margin: "0",
            fontFamily: "PT Astra Sans, system-ui, sans-serif",
          }}
        >
          💼 Обратитесь к администратору для получения учетных данных
        </p>
      </div>
    </div>
  )
}

export default LoginForm

