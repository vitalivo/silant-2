"use client"

import type React from "react"
import { usePermissions } from "../hooks/usePermissions"

interface PermissionsTestProps {
  user: any
}

const PermissionsTest: React.FC<PermissionsTestProps> = ({ user }) => {
  const permissions = usePermissions(user)

  const testCases = [
    { label: "Просмотр машин", value: permissions.canViewMachines },
    { label: "Просмотр ТО", value: permissions.canViewMaintenance },
    { label: "Просмотр рекламаций", value: permissions.canViewComplaints },
    { label: "Создание машин", value: permissions.canCreateMachine },
    { label: "Создание ТО", value: permissions.canCreateMaintenance },
    { label: "Создание рекламаций", value: permissions.canCreateComplaint },
    { label: "Управление справочниками", value: permissions.canManageDirectories },
  ]

  const roleInfo = [
    { label: "Менеджер", value: permissions.isManager },
    { label: "Клиент", value: permissions.isClient },
    { label: "Сервисная организация", value: permissions.isServiceCompany },
    { label: "Авторизован", value: permissions.isAuthenticated },
  ]

  return (
    <div
      style={{
        padding: "20px",
        margin: "20px",
        border: "2px solid #e2e8f0",
        borderRadius: "12px",
        backgroundColor: "#f8fafc",
      }}
    >
      <h3
        style={{
          color: "#1e293b",
          marginBottom: "16px",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        🧪 Тест системы прав доступа
      </h3>

      {/* Информация о пользователе */}
      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ color: "#374151", marginBottom: "8px" }}>
          👤 Пользователь:{" "}
          {user
            ? `${user.username} (role: ${user.role || "не указана"}${user.groups?.length ? `, groups: ${user.groups.join(", ")}` : ""})`
            : "Не авторизован"}
        </h4>
      </div>

      {/* Роли */}
      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ color: "#374151", marginBottom: "8px" }}>🎭 Роли:</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px" }}>
          {roleInfo.map((role, index) => (
            <div
              key={index}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: role.value ? "#dcfce7" : "#fef2f2",
                border: `1px solid ${role.value ? "#bbf7d0" : "#fecaca"}`,
                color: role.value ? "#166534" : "#dc2626",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {role.value ? "✅" : "❌"} {role.label}
            </div>
          ))}
        </div>
      </div>

      {/* Права доступа */}
      <div>
        <h4 style={{ color: "#374151", marginBottom: "8px" }}>🔐 Права доступа:</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "8px" }}>
          {testCases.map((test, index) => (
            <div
              key={index}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: test.value ? "#dcfce7" : "#fef2f2",
                border: `1px solid ${test.value ? "#bbf7d0" : "#fecaca"}`,
                color: test.value ? "#166534" : "#dc2626",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {test.value ? "✅" : "❌"} {test.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PermissionsTest
