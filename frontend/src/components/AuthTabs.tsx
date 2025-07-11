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
import styles from "../styles/AuthTabs.module.css"

interface AuthTabsProps {
  user: any
  onLogout: () => void
}

const AuthTabs: React.FC<AuthTabsProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<"machines" | "maintenance" | "complaints" | "directories">("machines")
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false)
  const [showComplaintForm, setShowComplaintForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const userGroups = user.groups || []
  const isManager = userGroups.includes("Менеджеры")
  const isClient = userGroups.includes("Клиенты")
  const isServiceCompany = userGroups.includes("Сервисные организации")

  const canCreateMaintenance = isClient || isServiceCompany || isManager
  const canCreateComplaint = isServiceCompany || isManager

  const handleFormSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "machines":
        return <MachinesPage key={`machines-${refreshKey}`} />
      case "maintenance":
        return <MaintenancePage key={`maintenance-${refreshKey}`} />
      case "complaints":
        return <ComplaintsPage key={`complaints-${refreshKey}`} />
      case "directories":
        return isManager ? <DirectoriesManager key={`directories-${refreshKey}`} /> : null
      default:
        return <MachinesPage key={`machines-${refreshKey}`} />
    }
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
            <p className={styles.userRole}>{userGroups.join(", ") || "Пользователь"}</p>
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
          <button
            className={`${styles.tab} ${activeTab === "maintenance" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("maintenance")}
          >
            <Wrench size={20} />
            <span>ТО</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === "complaints" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("complaints")}
          >
            <AlertTriangle size={20} />
            <span>Рекламации</span>
          </button>
          {isManager && (
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
          {activeTab === "maintenance" && canCreateMaintenance && (
            <button onClick={() => setShowMaintenanceForm(true)} className={styles.addButton}>
              <Plus size={16} />
              Добавить ТО
            </button>
          )}

          {activeTab === "complaints" && canCreateComplaint && (
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
      <MaintenanceForm
        isOpen={showMaintenanceForm}
        onClose={() => setShowMaintenanceForm(false)}
        onSuccess={handleFormSuccess}
      />

      <ComplaintForm
        isOpen={showComplaintForm}
        onClose={() => setShowComplaintForm(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}

export default AuthTabs
