"use client"

import type React from "react"
import { Lock, AlertCircle } from "lucide-react"

interface AccessDeniedProps {
  title?: string
  message?: string
  suggestion?: string
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = "Нет доступа",
  message = "У вас нет прав для просмотра этого раздела",
  suggestion,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        textAlign: "center",
        backgroundColor: "#fefefe",
        borderRadius: "12px",
        border: "2px dashed #e5e7eb",
        margin: "20px",
        minHeight: "400px",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          backgroundColor: "#fef2f2",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        <Lock size={40} color="#dc2626" />
      </div>

      <h2
        style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#1f2937",
          marginBottom: "12px",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: "16px",
          color: "#6b7280",
          marginBottom: suggestion ? "16px" : "0",
          maxWidth: "400px",
          lineHeight: "1.5",
        }}
      >
        {message}
      </p>

      {suggestion && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 16px",
            backgroundColor: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "8px",
            color: "#92400e",
            fontSize: "14px",
          }}
        >
          <AlertCircle size={16} />
          <span>{suggestion}</span>
        </div>
      )}
    </div>
  )
}

export default AccessDenied
