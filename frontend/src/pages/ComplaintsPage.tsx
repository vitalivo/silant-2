"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, RotateCcw, Plus, Edit } from "lucide-react"
import { complaintService, type Complaint } from "../services/api"
import { usePermissions } from "../hooks/usePermissions"
import PermissionButton from "../components/PermissionButton"
import ComplaintForm from "../components/ComplaintForm"
import styles from "../styles/DataPage.module.css"
import { usePageTitle } from "../hooks/usePageTitle"

interface ComplaintFilters {
  search: string
  failure_node: string
  machine_serial: string
  service_company: string
}

interface ComplaintsPageProps {
  userRole?: string
  user?: any
}

const ComplaintsPage: React.FC<ComplaintsPageProps> = ({ user }) => {
  usePageTitle("Рекламации")
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ComplaintFilters>({
    search: "",
    failure_node: "",
    machine_serial: "",
    service_company: "",
  })

  // Состояние сортировки
  const [sortField, setSortField] = useState<keyof Complaint>("failure_date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc") // По умолчанию новые сначала

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

  const handleFilterChange = (key: keyof ComplaintFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    // Фильтрация происходит автоматически через filteredComplaints
  }

  const handleReset = () => {
    setFilters({
      search: "",
      failure_node: "",
      machine_serial: "",
      service_company: "",
    })
  }

  // Функция обработки клика по заголовку
  const handleSort = (field: keyof Complaint) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Компонент заголовка таблицы с сортировкой
  const SortableHeader = ({ field, children }: { field: keyof Complaint; children: React.ReactNode }) => (
    <th
      className={`${styles.tableHeaderCell} ${styles.sortableHeader || ""}`}
      onClick={() => handleSort(field)}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {children}
        {sortField === field && <span style={{ fontSize: "12px" }}>{sortDirection === "asc" ? "↑" : "↓"}</span>}
      </div>
    </th>
  )

  const handleCreateComplaint = () => {
    setEditingComplaint(undefined)
    setIsFormOpen(true)
  }

  const handleEditComplaint = (complaint: Complaint) => {
    setEditingComplaint(complaint)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    fetchComplaints()
    setIsFormOpen(false)
    setEditingComplaint(undefined)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingComplaint(undefined)
  }

  // Фильтрация данных
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      !filters.search ||
      (complaint.machine_serial || "").toLowerCase().includes(filters.search.toLowerCase()) ||
      (complaint.failure_description || "").toLowerCase().includes(filters.search.toLowerCase())

    const matchesFailureNode =
      !filters.failure_node ||
      (complaint.failure_node_name || complaint.failure_node_name || "")
        .toLowerCase()
        .includes(filters.failure_node.toLowerCase())

    const matchesMachineSerial =
      !filters.machine_serial ||
      (complaint.machine_serial || "").toLowerCase().includes(filters.machine_serial.toLowerCase())

    const matchesServiceCompany =
      !filters.service_company ||
      (complaint.service_company?.name || complaint.service_company_name || "")
        .toLowerCase()
        .includes(filters.service_company.toLowerCase())

    return matchesSearch && matchesFailureNode && matchesMachineSerial && matchesServiceCompany
  })

  // Сортировка данных
  const sortedAndFilteredComplaints = [...filteredComplaints].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (!aValue && !bValue) return 0
    if (!aValue) return 1
    if (!bValue) return -1

    let comparison = 0
    if (sortField === "failure_date") {
      // Специальная обработка для дат
      const dateA = new Date(aValue as string)
      const dateB = new Date(bValue as string)
      comparison = dateA.getTime() - dateB.getTime()
    } else if (typeof aValue === "object" && aValue !== null && "name" in aValue) {
      // Для объектов с полем name (failure_node, recovery_method, service_company)
      const nameA = (aValue as any).name || ""
      const nameB = (bValue as any).name || ""
      comparison = nameA.localeCompare(nameB)
    } else if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.localeCompare(bValue)
    } else {
      comparison = String(aValue).localeCompare(String(bValue))
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

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

        {/* Filters */}
        <div className={styles.filtersSection}>
          <h2 className={styles.filtersTitle}>
            <Filter size={24} />
            Фильтры поиска
          </h2>

          <div className={styles.filtersGrid}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Общий поиск</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Серийный номер машины или описание отказа..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Узел отказа</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Введите узел отказа..."
                value={filters.failure_node}
                onChange={(e) => handleFilterChange("failure_node", e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Зав. номер машины</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Введите серийный номер машины..."
                value={filters.machine_serial}
                onChange={(e) => handleFilterChange("machine_serial", e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Сервисная компания</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Введите название сервисной компании..."
                value={filters.service_company}
                onChange={(e) => handleFilterChange("service_company", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.filterButtons}>
            <button className={`${styles.filterButton} ${styles.filterButtonPrimary}`} onClick={handleSearch}>
              <Search size={20} />
              Найти
            </button>
            <button className={`${styles.filterButton} ${styles.filterButtonSecondary}`} onClick={handleReset}>
              <RotateCcw size={20} />
              Сбросить
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className={styles.dataSection}>
          <div className={styles.dataHeader}>
            <div className={styles.dataTitle}>📊 Список рекламаций</div>
            <div className={styles.dataCount}>Найдено: {sortedAndFilteredComplaints.length}</div>
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
            ) : sortedAndFilteredComplaints.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>🔍</div>
                <h3 className={styles.emptyStateTitle}>Рекламации не найдены</h3>
                <p className={styles.emptyStateText}>Пока нет записей о рекламациях</p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <SortableHeader field="machine_serial">Машина</SortableHeader>
                    <SortableHeader field="failure_date">Дата отказа</SortableHeader>
                    <SortableHeader field="failure_node">Узел отказа</SortableHeader>
                    <SortableHeader field="recovery_method">Способ восстановления</SortableHeader>
                    <SortableHeader field="downtime">Время простоя</SortableHeader>
                    <SortableHeader field="service_company_name">Сервисная компания</SortableHeader>
                    {permissions.canEditComplaint && (
                      <th className={styles.tableHeaderCell} style={{ width: "120px" }}>
                        Действия
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredComplaints.map((complaint) => (
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
                        {complaint.failure_node_name || complaint.failure_node_name || "—"}
                      </td>
                      <td
                        className={styles.tableCell}
                        onClick={() => (window.location.href = `/complaints/${complaint.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {complaint.recovery_method_name || complaint.recovery_method_name || "—"}
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
