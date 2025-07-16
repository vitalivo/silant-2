"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Edit } from "lucide-react"
import { maintenanceService, type Maintenance } from "../services/api"
import { usePermissions } from "../hooks/usePermissions"
import PermissionButton from "../components/PermissionButton"
import MaintenanceForm from "../components/MaintenanceForm"
import styles from "../styles/DataPage.module.css"
import { usePageTitle } from "../hooks/usePageTitle"

interface MaintenancePageProps {
  userRole?: string
  user?: any
}

const MaintenancePage: React.FC<MaintenancePageProps> = ({ user }) => {
  usePageTitle("Техническое обслуживание")
  const [maintenance, setMaintenance] = useState<Maintenance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Состояние для форм
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | undefined>(undefined)

  // Получаем права доступа
  const permissions = usePermissions(user)

  console.log("🔍 MaintenancePage - user:", user)
  console.log("🔍 MaintenancePage - permissions:", permissions)

  const fetchMaintenance = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await maintenanceService.getAll()
      const data = response.data
      setMaintenance(Array.isArray(data) ? data : data.results || [])
    } catch (err) {
      console.error("Ошибка при загрузке данных о ТО:", err)
      setError("Ошибка при загрузке данных о техническом обслуживании")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (permissions.canViewMaintenance) {
      fetchMaintenance()
    }
  }, [permissions.canViewMaintenance])

  const handleCreateMaintenance = () => {
    console.log("🔍 handleCreateMaintenance вызван")
    setEditingMaintenance(undefined)
    setIsFormOpen(true)
  }

  const handleEditMaintenance = (maintenance: Maintenance) => {
    console.log("🔍 handleEditMaintenance вызван для ТО:", maintenance.id)
    setEditingMaintenance(maintenance)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    fetchMaintenance() // Перезагружаем список
    setIsFormOpen(false)
    setEditingMaintenance(undefined)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingMaintenance(undefined)
  }

  // Если нет прав на просмотр
  if (!permissions.canViewMaintenance) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <h2>Нет доступа к данным ТО</h2>
            <p>У вас нет прав для просмотра данных о техническом обслуживании</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>🔧</div>
            <div>
              <h1 className={styles.title}>Техническое обслуживание</h1>
              <p className={styles.subtitle}>Информация о проведенном и планируемом техническом обслуживании</p>
            </div>
          </div>

          {/* Кнопка добавления ТО */}
          <div style={{ marginLeft: "auto" }}>
            <PermissionButton
              hasPermission={permissions.canCreateMaintenance}
              onClick={handleCreateMaintenance}
              variant="primary"
              tooltip="Добавить запись о техническом обслуживании"
            >
              <Plus size={20} />
              Добавить ТО
            </PermissionButton>
          </div>
        </div>

        {/* Отладочная информация */}
        <div
          style={{
            padding: "10px",
            backgroundColor: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "6px",
            margin: "10px 0",
            fontSize: "12px",
          }}
        >
          <strong>🐛 Отладка прав:</strong> canView: {permissions.canViewMaintenance ? "✅" : "❌"}, canCreate:{" "}
          {permissions.canCreateMaintenance ? "✅" : "❌"}, canEdit: {permissions.canEditMaintenance ? "✅" : "❌"}
        </div>

        {/* Data Table */}
        <div className={styles.dataSection}>
          <div className={styles.dataHeader}>
            <div className={styles.dataTitle}>📊 Список ТО</div>
            <div className={styles.dataCount}>Найдено: {maintenance.length}</div>
          </div>

          <div className={styles.tableContainer}>
            {loading ? (
              <div className={styles.loadingState}>
                <div className={styles.loadingSpinner}></div>
                <p className={styles.loadingText}>Загрузка данных...</p>
              </div>
            ) : error ? (
              <div className={styles.errorState}>
                <div className={styles.errorIcon}>⚠️</div>
                <h3 className={styles.errorTitle}>Ошибка загрузки</h3>
                <p className={styles.errorText}>{error}</p>
              </div>
            ) : maintenance.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>🔍</div>
                <h3 className={styles.emptyStateTitle}>Записи о ТО не найдены</h3>
                <p className={styles.emptyStateText}>Пока нет записей о техническом обслуживании</p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className={styles.tableHeaderCell}>Машина</th>
                    <th className={styles.tableHeaderCell}>Тип ТО</th>
                    <th className={styles.tableHeaderCell}>Дата ТО</th>
                    <th className={styles.tableHeaderCell}>Наработка</th>
                    <th className={styles.tableHeaderCell}>Сервисная компания</th>
                    {permissions.canEditMaintenance && (
                      <th className={styles.tableHeaderCell} style={{ width: "120px" }}>
                        Действия
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {maintenance.map((item) => (
                    <tr key={item.id} className={styles.tableRow}>
                      <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                        {item.machine_serial || `ID: ${item.machine}`}
                      </td>
                      <td className={styles.tableCell}>{item.maintenance_type?.name || "—"}</td>
                      <td className={styles.tableCell}>
                        {item.maintenance_date ? new Date(item.maintenance_date).toLocaleDateString("ru-RU") : "—"}
                      </td>
                      <td className={styles.tableCell}>{item.operating_hours ? `${item.operating_hours} ч` : "—"}</td>
                      <td className={styles.tableCell}>
                        {item.service_company?.name || item.service_company_name || "—"}
                      </td>
                      {permissions.canEditMaintenance && (
                        <td className={styles.tableCell}>
                          <PermissionButton
                            hasPermission={permissions.canEditMaintenance}
                            onClick={() => handleEditMaintenance(item)}
                            variant="secondary"
                            size="small"
                            tooltip="Редактировать запись ТО"
                          >
                            <Edit size={16} />
                          </PermissionButton>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Форма создания/редактирования */}
      <MaintenanceForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        maintenance={editingMaintenance}
        user={user}
      />
    </div>
  )
}

export default MaintenancePage
