"use client"

import type React from "react"
import { usePermissions } from "../hooks/usePermissions"

interface PermissionsDebugProps {
  user: any
}

const PermissionsDebug: React.FC<PermissionsDebugProps> = ({ user }) => {
  const permissions = usePermissions(user)

  return (
    <div
      style={{
        padding: "20px",
        margin: "20px",
        border: "2px solid #f59e0b",
        borderRadius: "12px",
        backgroundColor: "#fffbeb",
      }}
    >
      <h3
        style={{
          color: "#92400e",
          marginBottom: "16px",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        🐛 Отладка данных пользователя
      </h3>

      {/* Сырые данные пользователя */}
      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ color: "#374151", marginBottom: "8px" }}>📋 Сырые данные пользователя:</h4>
        <pre
          style={{
            backgroundColor: "#f3f4f6",
            padding: "12px",
            borderRadius: "6px",
            fontSize: "12px",
            overflow: "auto",
            maxHeight: "200px",
          }}
        >
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      {/* Анализ полей */}
      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ color: "#374151", marginBottom: "8px" }}>🔍 Анализ полей:</h4>
        <div style={{ display: "grid", gap: "8px" }}>
          <div style={{ padding: "8px", backgroundColor: "#f9fafb", borderRadius: "4px" }}>
            <strong>user.role:</strong> {user?.role ? `"${user.role}"` : "❌ отсутствует или пустое"}
          </div>
          <div style={{ padding: "8px", backgroundColor: "#f9fafb", borderRadius: "4px" }}>
            <strong>user.groups:</strong> {user?.groups ? JSON.stringify(user.groups) : "❌ отсутствует"}
          </div>
          <div style={{ padding: "8px", backgroundColor: "#f9fafb", borderRadius: "4px" }}>
            <strong>user.username:</strong> {user?.username || "❌ отсутствует"}
          </div>
          <div style={{ padding: "8px", backgroundColor: "#f9fafb", borderRadius: "4px" }}>
            <strong>user.email:</strong> {user?.email || "❌ отсутствует"}
          </div>
        </div>
      </div>

      {/* Логика определения ролей */}
      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ color: "#374151", marginBottom: "8px" }}>🧠 Логика определения ролей:</h4>
        <div style={{ display: "grid", gap: "8px" }}>
          <div style={{ padding: "8px", backgroundColor: "#f0f9ff", borderRadius: "4px" }}>
            <strong>По username:</strong>{" "}
            {user?.username?.includes("client")
              ? "✅ Клиент"
              : user?.username?.includes("service")
                ? "✅ Сервисная организация"
                : user?.username?.includes("manager")
                  ? "✅ Менеджер"
                  : "❌ Не определено"}
          </div>
          <div style={{ padding: "8px", backgroundColor: "#f0f9ff", borderRadius: "4px" }}>
            <strong>По email:</strong>{" "}
            {user?.email?.includes("client@")
              ? "✅ Клиент"
              : user?.email?.includes("service@")
                ? "✅ Сервисная организация"
                : user?.email?.includes("manager@")
                  ? "✅ Менеджер"
                  : "❌ Не определено"}
          </div>
        </div>
      </div>

      {/* Результат определения ролей */}
      <div>
        <h4 style={{ color: "#374151", marginBottom: "8px" }}>⚙️ Результат определения ролей:</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px" }}>
          <div
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              backgroundColor: permissions.isManager ? "#dcfce7" : "#fef2f2",
              border: `1px solid ${permissions.isManager ? "#bbf7d0" : "#fecaca"}`,
              color: permissions.isManager ? "#166534" : "#dc2626",
            }}
          >
            {permissions.isManager ? "✅" : "❌"} Менеджер
          </div>
          <div
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              backgroundColor: permissions.isClient ? "#dcfce7" : "#fef2f2",
              border: `1px solid ${permissions.isClient ? "#bbf7d0" : "#fecaca"}`,
              color: permissions.isClient ? "#166534" : "#dc2626",
            }}
          >
            {permissions.isClient ? "✅" : "❌"} Клиент
          </div>
          <div
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              backgroundColor: permissions.isServiceCompany ? "#dcfce7" : "#fef2f2",
              border: `1px solid ${permissions.isServiceCompany ? "#bbf7d0" : "#fecaca"}`,
              color: permissions.isServiceCompany ? "#166534" : "#dc2626",
            }}
          >
            {permissions.isServiceCompany ? "✅" : "❌"} Сервисная организация
          </div>
        </div>
      </div>
    </div>
  )
}

export default PermissionsDebug
