"use client"

import type React from "react"
import type { ReactNode } from "react"

interface PermissionButtonProps {
  hasPermission: boolean
  onClick: () => void
  children: ReactNode
  variant?: "primary" | "secondary" | "danger"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  tooltip?: string
}

const PermissionButton: React.FC<PermissionButtonProps> = ({
  hasPermission,
  onClick,
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  tooltip,
}) => {
  const getVariantStyles = () => {
    if (!hasPermission) {
      return {
        backgroundColor: "#f3f4f6",
        color: "#9ca3af",
        border: "1px solid #e5e7eb",
        cursor: "not-allowed",
      }
    }

    switch (variant) {
      case "primary":
        return {
          backgroundColor: "#3b82f6",
          color: "white",
          border: "1px solid #3b82f6",
          cursor: "pointer",
        }
      case "secondary":
        return {
          backgroundColor: "white",
          color: "#374151",
          border: "1px solid #d1d5db",
          cursor: "pointer",
        }
      case "danger":
        return {
          backgroundColor: "#dc2626",
          color: "white",
          border: "1px solid #dc2626",
          cursor: "pointer",
        }
      default:
        return {
          backgroundColor: "#3b82f6",
          color: "white",
          border: "1px solid #3b82f6",
          cursor: "pointer",
        }
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          padding: "6px 12px",
          fontSize: "12px",
        }
      case "medium":
        return {
          padding: "8px 16px",
          fontSize: "14px",
        }
      case "large":
        return {
          padding: "12px 24px",
          fontSize: "16px",
        }
      default:
        return {
          padding: "8px 16px",
          fontSize: "14px",
        }
    }
  }

  const handleClick = () => {
    if (hasPermission && !disabled) {
      onClick()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={!hasPermission || disabled}
      title={!hasPermission ? tooltip || "У вас нет прав для этого действия" : undefined}
      style={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        borderRadius: "6px",
        fontWeight: "500",
        transition: "all 0.2s",
        opacity: disabled ? 0.5 : 1,
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
      onMouseOver={(e) => {
        if (hasPermission && !disabled) {
          const target = e.currentTarget
          if (variant === "primary") {
            target.style.backgroundColor = "#2563eb"
          } else if (variant === "secondary") {
            target.style.backgroundColor = "#f9fafb"
          } else if (variant === "danger") {
            target.style.backgroundColor = "#b91c1c"
          }
        }
      }}
      onMouseOut={(e) => {
        if (hasPermission && !disabled) {
          const target = e.currentTarget
          const styles = getVariantStyles()
          target.style.backgroundColor = styles.backgroundColor
        }
      }}
    >
      {children}
    </button>
  )
}

export default PermissionButton
