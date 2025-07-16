"use client"

import type React from "react"
import { useState } from "react"
import { Truck, Wrench, AlertTriangle, User, Settings } from "lucide-react"
import MachinesPage from "../pages/MachinesPage"
import MaintenancePage from "../pages/MaintenancePage"
import ComplaintsPage from "../pages/ComplaintsPage"
import DirectoriesManager from "./DirectoriesManager"
import PermissionsTest from "./PermissionsTest"
import PermissionsDebug from "./PermissionsDebug"
import AccessDenied from "./AccessDenied"
import { usePermissions } from "../hooks/usePermissions"
import styles from "../styles/AuthTabs.module.css"

interface AuthTabsProps {
  user: any
  onLogout: () => void
}

const AuthTabsUpdated: React.FC<AuthTabsProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<
    "machines" | "maintenance" | "complaints" | "directories" | "test" | "debug"
  >("machines") // Начинаем с машин
  const [refreshKey, setRefreshKey] = useState(0)

  // Используем хук прав доступа
  const permissions = usePermissions(user)

  const renderTabContent = () => {
    switch (activeTab) {
      case "machines":
        return <MachinesPage key={`machines-${refreshKey}`} userRole={getUserRole()} />
      case "maintenance":
        return permissions.canViewMaintenance ? (
          <MaintenancePage key={`maintenance-${refreshKey}`} userRole={getUserRole()} user={user} />
        ) : (
          <AccessDenied
            title="Нет доступа к ТО"
            message="У вас нет прав для просмотра данных о техническом обслуживании"
            suggestion="Обратитесь к администратору для получения доступа"
          />
        )
      case "complaints":
        return permissions.canViewComplaints ? (
          <ComplaintsPage key={`complaints-${refreshKey}`} userRole={getUserRole()} />
        ) : (
          <AccessDenied
            title="Нет доступа к рекламациям"
            message="У вас нет прав для просмотра данных о рекламациях"
            suggestion="Обратитесь к администратору для получения доступа"
          />
        )
      case "directories":
        return permissions.canManageDirectories ? (
          <DirectoriesManager key={`directories-${refreshKey}`} />
        ) : (
          <AccessDenied
            title="Нет доступа к справочникам"
            message="Только менеджеры могут управлять справочниками"
            suggestion="Данный раздел доступен только пользователям с ролью 'Менеджер'"
          />
        )
      case "test":
        return <PermissionsTest user={user} />
      case "debug":
        return <PermissionsDebug user={user} />
      default:
        return <MachinesPage key={`machines-${refreshKey}`} userRole={getUserRole()} />
    }
  }

  const getUserRole = () => {
    if (permissions.isManager) return "manager"
    if (permissions.isClient) return "client"
    if (permissions.isServiceCompany) return "service"
    return "user"
  }

  const getRoleDisplayName = () => {
    if (permissions.isManager) return "Менеджер"
    if (permissions.isClient) return "Клиент"
    if (permissions.isServiceCompany) return "Сервисная организация"
    return "Пользователь"
  }

  const getRoleColor = () => {
    if (permissions.isManager) return "#059669" // green
    if (permissions.isClient) return "#0284c7" // blue
    if (permissions.isServiceCompany) return "#7c3aed" // purple
    return "#6b7280" // gray
  }

  return (
    <div className={styles.container}>
      {/* User Info Header */}
      <div className={styles.userHeader}>
        <div className={styles.userInfo}>
          <div className={styles.userIcon}>
            <User size={24} />
          </div>
          <div>
            <h3 className={styles.userName}>
              {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
            </h3>
            <p className={styles.userRole} style={{ color: getRoleColor() }}>
              {getRoleDisplayName()}
            </p>
            {!permissions.isManager && (
              <p className={styles.userLimitation}>
                {permissions.isClient && "Доступ к данным ваших машин"}
                {permissions.isServiceCompany && "Доступ к данным обслуживаемых машин"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsList}>
          <button
            className={`${styles.tab} ${activeTab === "machines" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("machines")}
          >
            <Truck size={20} />
            <span>Машины</span>
          </button>

          {permissions.canViewMaintenance && (
            <button
              className={`${styles.tab} ${activeTab === "maintenance" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("maintenance")}
            >
              <Wrench size={20} />
              <span>ТО</span>
            </button>
          )}

          {permissions.canViewComplaints && (
            <button
              className={`${styles.tab} ${activeTab === "complaints" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("complaints")}
            >
              <AlertTriangle size={20} />
              <span>Рекламации</span>
            </button>
          )}

          {permissions.canManageDirectories && (
            <button
              className={`${styles.tab} ${activeTab === "directories" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("directories")}
            >
              <Settings size={16} />
              <span>Справочники</span>
            </button>
          )}

          {/* Отладочные вкладки - показываем только в development */}
          {
            <>
              <button
                className={`${styles.tab} ${activeTab === "test" ? styles.tabActive : ""}`}
                onClick={() => setActiveTab("test")}
                style={{
                  backgroundColor: "#fef3c7",
                  borderColor: "#f59e0b",
                  opacity: 0.7,
                  fontSize: "12px",
                }}
              >
                🧪 <span>Тест (временно)</span>
              </button>

              <button
                className={`${styles.tab} ${activeTab === "debug" ? styles.tabActive : ""}`}
                onClick={() => setActiveTab("debug")}
                style={{
                  backgroundColor: "#fef3c7",
                  borderColor: "#f59e0b",
                  opacity: 0.7,
                  fontSize: "12px",
                }}
              >
                🐛 <span>Отладка (временно)</span>
              </button>
            </>
          }
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>{renderTabContent()}</div>
    </div>
  )
}

export default AuthTabsUpdated
