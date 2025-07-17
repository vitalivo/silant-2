"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Edit } from "lucide-react"
import { complaintService, type Complaint } from "../services/api"
import { usePermissions } from "../hooks/usePermissions"
import PermissionButton from "../components/PermissionButton"
import ComplaintForm from "../components/ComplaintForm"
import styles from "../styles/DataPage.module.css"
import { usePageTitle } from "../hooks/usePageTitle"

interface ComplaintsPageProps {
  userRole?: string
  user?: any
}

const ComplaintsPage: React.FC<ComplaintsPageProps> = ({ user }) => {
  usePageTitle("Рекламации")
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Состояние для форм
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingComplaint, setEditingComplaint] = useState<Complaint | undefined>(undefined)

  // Получаем права доступа
  const permissions = usePermissions(user)

  const fetchComplaints = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await complaintService.getAll()
      const data = response.data
      setComplaints(Array.isArray(data) ? data : data.results || [])
    } catch (err) {
      console.error("Ошибка при загрузке данных о рекламациях:", err)
      setError("Ошибка при загрузке данных о рекламациях")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (permissions.canViewComplaints) {
      fetchComplaints()
    }
  }, [permissions.canViewComplaints])

  const handleCreateComplaint = () => {
    console.log("🔍 handleCreateComplaint вызван")
    setEditingComplaint(undefined)
    setIsFormOpen(true)
  }

  const handleEditComplaint = (complaint: Complaint) => {
    console.log("🔍 handleEditComplaint вызван для рекламации:", complaint.id)
    setEditingComplaint(complaint)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    fetchComplaints() // Перезагружаем список
    setIsFormOpen(false)
    setEditingComplaint(undefined)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingComplaint(undefined)
  }

  // Если нет прав на просмотр
  if (!permissions.canViewComplaints) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <h2>Нет доступа к рекламациям</h2>
            <p>У вас нет прав для просмотра данных о рекламациях</p>
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
            <div className={styles.headerIcon}>📋</div>
            <div>
              <h1 className={styles.title}>Рекламации</h1>
              <p className={styles.subtitle}>Информация о рекламациях и методах восстановления</p>
            </div>
          </div>

          {/* Кнопка добавления рекламации */}
          <div style={{ marginLeft: "auto" }}>
            <PermissionButton
              hasPermission={permissions.canCreateComplaint}
              onClick={handleCreateComplaint}
              variant="primary"
              tooltip="Добавить рекламацию"
            >
              <Plus size={20} />
              Добавить рекламацию
            </PermissionButton>
          </div>
        </div>

        {/* Data Table */}
        <div className={styles.dataSection}>
          <div className={styles.dataHeader}>
            <div className={styles.dataTitle}>📊 Список рекламаций</div>
            <div className={styles.dataCount}>Найдено: {complaints.length}</div>
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
            ) : complaints.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>🔍</div>
                <h3 className={styles.emptyStateTitle}>Рекламации не найдены</h3>
                <p className={styles.emptyStateText}>Пока нет записей о рекламациях</p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className={styles.tableHeaderCell}>Машина</th>
                    <th className={styles.tableHeaderCell}>Дата отказа</th>
                    <th className={styles.tableHeaderCell}>Узел отказа</th>
                    <th className={styles.tableHeaderCell}>Способ восстановления</th>
                    <th className={styles.tableHeaderCell}>Время простоя</th>
                    <th className={styles.tableHeaderCell}>Сервисная компания</th>
                    {permissions.canEditComplaint && (
                      <th className={styles.tableHeaderCell} style={{ width: "120px" }}>
                        Действия
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint.id} className={styles.tableRow}>
                      <td
                        className={`${styles.tableCell} ${styles.tableCellBold}`}
                        onClick={() => (window.location.href = `/complaints/${complaint.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {complaint.machine_serial || `ID: ${complaint.machine}`}
                      </td>
                      <td
                        className={styles.tableCell}
                        onClick={() => (window.location.href = `/complaints/${complaint.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {complaint.failure_date ? new Date(complaint.failure_date).toLocaleDateString("ru-RU") : "—"}
                      </td>
                      <td
                        className={styles.tableCell}
                        onClick={() => (window.location.href = `/complaints/${complaint.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {complaint.failure_node_name}
                      </td>
                      <td
                        className={styles.tableCell}
                        onClick={() => (window.location.href = `/complaints/${complaint.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {complaint.recovery_method_name}
                      </td>
                      <td
                        className={styles.tableCell}
                        onClick={() => (window.location.href = `/complaints/${complaint.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {complaint.downtime ? `${complaint.downtime} дн.` : "—"}
                      </td>
                      <td
                        className={styles.tableCell}
                        onClick={() => (window.location.href = `/complaints/${complaint.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {complaint.service_company?.name || complaint.service_company_name || "—"}
                      </td>
                      {permissions.canEditComplaint && (
                        <td className={styles.tableCell}>
                          <PermissionButton
                            hasPermission={permissions.canEditComplaint}
                            onClick={() => handleEditComplaint(complaint)}
                            variant="secondary"
                            size="small"
                            tooltip="Редактировать рекламацию"
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
      <ComplaintForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        complaint={editingComplaint}
        user={user}
      />
    </div>
  )
}

export default ComplaintsPage
