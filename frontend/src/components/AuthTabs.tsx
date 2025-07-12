"use client"

import type React from "react"
import { useState } from "react"
import { Truck, Wrench, AlertTriangle, User, LogOut, Plus, Settings } from "lucide-react"
import MachinesPage from "../pages/MachinesPage"
import MaintenancePage from "../pages/MaintenancePage"
import ComplaintsPage from "../pages/ComplaintsPage"
import DirectoriesManager from "./DirectoriesManager"
import MaintenanceForm from "./MaintenanceForm"
import ComplaintForm from "./ComplaintForm"
import MachineForm from "./MachineForm"
import styles from "../styles/AuthTabs.module.css"

interface AuthTabsProps {
  user: any
  onLogout: () => void
}

const AuthTabs: React.FC<AuthTabsProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<"machines" | "maintenance" | "complaints" | "directories">("machines")
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false)
  const [showComplaintForm, setShowComplaintForm] = useState(false)
  const [showMachineForm, setShowMachineForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const userGroups = user.groups || []
  const isManager = userGroups.includes("Менеджеры")
  const isClient = userGroups.includes("Клиенты")
  const isServiceCompany = userGroups.includes("Сервисные организации")

  // Права доступа по ролям
  const permissions = {
    canViewMachines: true, // Все авторизованные пользователи
    canViewMaintenance: true, // Все авторизованные пользователи
    canViewComplaints: true, // Все авторизованные пользователи
    canCreateMachine: isManager, // Только менеджеры могут добавлять машины
    canCreateMaintenance: isClient || isServiceCompany || isManager,
    canCreateComplaint: isServiceCompany || isManager,
    canManageDirectories: isManager,
  }

  const handleFormSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "machines":
        return <MachinesPage key={`machines-${refreshKey}`} userRole={getUserRole()} />
      case "maintenance":
        return permissions.canViewMaintenance ? (
          <MaintenancePage key={`maintenance-${refreshKey}`} userRole={getUserRole()} />
        ) : (
          <div className={styles.noAccess}>
            <h3>Нет доступа</h3>
            <p>У вас нет прав для просмотра данных о техническом обслуживании</p>
          </div>
        )
      case "complaints":
        return permissions.canViewComplaints ? (
          <ComplaintsPage key={`complaints-${refreshKey}`} userRole={getUserRole()} />
        ) : (
          <div className={styles.noAccess}>
            <h3>Нет доступа</h3>
            <p>У вас нет прав для просмотра данных о рекламациях</p>
          </div>
        )
      case "directories":
        return permissions.canManageDirectories ? (
          <DirectoriesManager key={`directories-${refreshKey}`} />
        ) : (
          <div className={styles.noAccess}>
            <h3>Нет доступа</h3>
            <p>Только менеджеры могут управлять справочниками</p>
          </div>
        )
      default:
        return <MachinesPage key={`machines-${refreshKey}`} userRole={getUserRole()} />
    }
  }

  const getUserRole = () => {
    if (isManager) return "manager"
    if (isClient) return "client"
    if (isServiceCompany) return "service"
    return "user"
  }

  const getRoleDisplayName = () => {
    if (isManager) return "Менеджер"
    if (isClient) return "Клиент"
    if (isServiceCompany) return "Сервисная организация"
    return "Пользователь"
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
            <p className={styles.userRole}>{getRoleDisplayName()}</p>
            {!isManager && (
              <p className={styles.userLimitation}>
                {isClient && "Доступ к данным ваших машин"}
                {isServiceCompany && "Доступ к данным обслуживаемых машин"}
              </p>
            )}
          </div>
        </div>
        <button onClick={onLogout} className={styles.logoutButton}>
          <LogOut size={20} />
          Выйти
        </button>
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
        </div>

        {/* Action Buttons */}
        <div className={styles.tableActions}>
          {activeTab === "machines" && permissions.canCreateMachine && (
            <button onClick={() => setShowMachineForm(true)} className={styles.addButton}>
              <Plus size={16} />
              Добавить машину
            </button>
          )}

          {activeTab === "maintenance" && permissions.canCreateMaintenance && (
            <button onClick={() => setShowMaintenanceForm(true)} className={styles.addButton}>
              <Plus size={16} />
              Добавить ТО
            </button>
          )}

          {activeTab === "complaints" && permissions.canCreateComplaint && (
            <button onClick={() => setShowComplaintForm(true)} className={styles.addButton}>
              <Plus size={16} />
              Добавить рекламацию
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>{renderTabContent()}</div>

      {/* Модальные окна */}
      {permissions.canCreateMachine && (
        <MachineForm isOpen={showMachineForm} onClose={() => setShowMachineForm(false)} onSuccess={handleFormSuccess} />
      )}

      {permissions.canCreateMaintenance && (
        <MaintenanceForm
          isOpen={showMaintenanceForm}
          onClose={() => setShowMaintenanceForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {permissions.canCreateComplaint && (
        <ComplaintForm
          isOpen={showComplaintForm}
          onClose={() => setShowComplaintForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}

export default AuthTabs
