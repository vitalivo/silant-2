"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, RotateCcw, Plus, Edit } from "lucide-react"
import { maintenanceService, type Maintenance } from "../services/api"
import { usePermissions } from "../hooks/usePermissions"
import PermissionButton from "../components/PermissionButton"
import MaintenanceForm from "../components/MaintenanceForm"
import styles from "../styles/DataPage.module.css"
import { usePageTitle } from "../hooks/usePageTitle"

interface MaintenanceFilters {
  search: string
  maintenance_type: string
  machine_serial: string
  service_company: string
}

interface MaintenancePageProps {
  userRole?: string
  user?: any
}

const MaintenancePage: React.FC<MaintenancePageProps> = ({ user }) => {
  usePageTitle("ТО")
  const [maintenance, setMaintenance] = useState<Maintenance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<MaintenanceFilters>({
    search: "",
    maintenance_type: "",
    machine_serial: "",
    service_company: "",
  })

  // Состояние сортировки
  const [sortField, setSortField] = useState<keyof Maintenance>("maintenance_date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc") // По умолчанию новые сначала

  // Состояние для форм
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | undefined>(undefined)

  // Получаем права доступа
  const permissions = usePermissions(user)

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

  const handleFilterChange = (key: keyof MaintenanceFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    // Фильтрация происходит автоматически через filteredMaintenance
  }

  const handleReset = () => {
    setFilters({
      search: "",
      maintenance_type: "",
      machine_serial: "",
      service_company: "",
    })
  }

  // Функция обработки клика по заголовку
  const handleSort = (field: keyof Maintenance) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Компонент заголовка таблицы с сортировкой
  const SortableHeader = ({ field, children }: { field: keyof Maintenance; children: React.ReactNode }) => (
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

  const handleCreateMaintenance = () => {
    setEditingMaintenance(undefined)
    setIsFormOpen(true)
  }

  const handleEditMaintenance = (maintenance: Maintenance) => {
    setEditingMaintenance(maintenance)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    fetchMaintenance()
    setIsFormOpen(false)
    setEditingMaintenance(undefined)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingMaintenance(undefined)
  }

  // Фильтрация данных
  const filteredMaintenance = maintenance.filter((item) => {
    const matchesSearch =
      !filters.search ||
      (item.machine_serial || "").toLowerCase().includes(filters.search.toLowerCase()) ||
      (item.work_order_number || "").toLowerCase().includes(filters.search.toLowerCase())

    const matchesMaintenanceType =
      !filters.maintenance_type ||
      (item.maintenance_type?.name || "").toLowerCase().includes(filters.maintenance_type.toLowerCase())

    const matchesMachineSerial =
      !filters.machine_serial ||
      (item.machine_serial || "").toLowerCase().includes(filters.machine_serial.toLowerCase())

    const matchesServiceCompany =
      !filters.service_company ||
      (item.service_company?.name || item.service_company_name || "")
        .toLowerCase()
        .includes(filters.service_company.toLowerCase())

    return matchesSearch && matchesMaintenanceType && matchesMachineSerial && matchesServiceCompany
  })

  // Сортировка данных
  const sortedAndFilteredMaintenance = [...filteredMaintenance].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (!aValue && !bValue) return 0
    if (!aValue) return 1
    if (!bValue) return -1

    let comparison = 0
    if (sortField === "maintenance_date") {
      // Специальная обработка для дат
      const dateA = new Date(aValue as string)
      const dateB = new Date(bValue as string)
      comparison = dateA.getTime() - dateB.getTime()
    } else if (typeof aValue === "object" && aValue !== null && "name" in aValue) {
      // Для объектов с полем name (maintenance_type, service_company)
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
                placeholder="Серийный номер машины или номер заказ-наряда..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Вид ТО</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Введите вид ТО..."
                value={filters.maintenance_type}
                onChange={(e) => handleFilterChange("maintenance_type", e.target.value)}
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
            <div className={styles.dataTitle}>📊 Список ТО</div>
            <div className={styles.dataCount}>Найдено: {sortedAndFilteredMaintenance.length}</div>
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
            ) : sortedAndFilteredMaintenance.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>🔍</div>
                <h3 className={styles.emptyStateTitle}>Записи о ТО не найдены</h3>
                <p className={styles.emptyStateText}>Пока нет записей о техническом обслуживании</p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <SortableHeader field="machine_serial">Машина</SortableHeader>
                    <SortableHeader field="maintenance_type">Вид ТО</SortableHeader>
                    <SortableHeader field="maintenance_date">Дата ТО</SortableHeader>
                    <SortableHeader field="operating_hours">Наработка</SortableHeader>
                    <SortableHeader field="service_company_name">Сервисная компания</SortableHeader>
                    {permissions.canEditMaintenance && (
                      <th className={styles.tableHeaderCell} style={{ width: "120px" }}>
                        Действия
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredMaintenance.map((item) => (
                    <tr key={item.id} className={styles.tableRow}>
                      <td
                        className={`${styles.tableCell} ${styles.tableCellBold}`}
                        onClick={() => (window.location.href = `/maintenance/${item.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {item.machine_serial || `ID: ${item.machine}`}
                      </td>
                      <td
                        className={styles.tableCell}
                        onClick={() => (window.location.href = `/maintenance/${item.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {item.maintenance_type_name || "—"}
                      </td>
                      <td
                        className={styles.tableCell}
                        onClick={() => (window.location.href = `/maintenance/${item.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {item.maintenance_date ? new Date(item.maintenance_date).toLocaleDateString("ru-RU") : "—"}
                      </td>
                      <td
                        className={styles.tableCell}
                        onClick={() => (window.location.href = `/maintenance/${item.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {item.operating_hours ? `${item.operating_hours} ч` : "—"}
                      </td>
                      <td
                        className={styles.tableCell}
                        onClick={() => (window.location.href = `/maintenance/${item.id}`)}
                        style={{ cursor: "pointer" }}
                      >
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
