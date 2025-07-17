"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, RotateCcw, Plus, Edit } from "lucide-react"
import { machineService, type Machine } from "../services/api"
import { usePermissions } from "../hooks/usePermissions"
import PermissionButton from "../components/PermissionButton"
import MachineForm from "../components/MachineForm"
import styles from "../styles/DataPage.module.css"
import { usePageTitle } from "../hooks/usePageTitle"

interface MachineFilters {
  search: string
  technique_model: string
  engine_model: string
  transmission_model: string
  drive_axle_model: string
  steer_axle_model: string
}

interface MachinesPageProps {
  userRole?: string
  user?: any
}

const MachinesPage: React.FC<MachinesPageProps> = ({ user }) => {
  usePageTitle("Машины")
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<MachineFilters>({
    search: "",
    technique_model: "",
    engine_model: "",
    transmission_model: "",
    drive_axle_model: "",
    steer_axle_model: "",
  })

  // Состояние сортировки
  const [sortField, setSortField] = useState<keyof Machine>("shipment_date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc") // По умолчанию новые сначала

  // Состояние для форм
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMachine, setEditingMachine] = useState<Machine | undefined>(undefined)

  // Получаем права доступа
  const permissions = usePermissions(user)

  const fetchMachines = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await machineService.getAll()
      const data = response.data
      const machinesArray = Array.isArray(data) ? data : data.results || []
      setMachines(machinesArray)
    } catch (err) {
      console.error("Ошибка при загрузке:", err)
      setError("Ошибка при загрузке данных о машинах")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (permissions.canViewMachines) {
      fetchMachines()
    } else {
      setLoading(false)
    }
  }, [permissions.canViewMachines])

  const handleFilterChange = (key: keyof MachineFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    // Фильтрация происходит автоматически через filteredMachines
  }

  const handleReset = () => {
    setFilters({
      search: "",
      technique_model: "",
      engine_model: "",
      transmission_model: "",
      drive_axle_model: "",
      steer_axle_model: "",
    })
  }

  // Функция обработки клика по заголовку
  const handleSort = (field: keyof Machine) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Компонент заголовка таблицы с сортировкой
  const SortableHeader = ({ field, children }: { field: keyof Machine; children: React.ReactNode }) => (
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

  const handleCreateMachine = () => {
    setEditingMachine(undefined)
    setIsFormOpen(true)
  }

  const handleEditMachine = (machine: Machine) => {
    setEditingMachine(machine)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    fetchMachines()
    setIsFormOpen(false)
    setEditingMachine(undefined)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingMachine(undefined)
  }

  // Фильтрация данных
  const filteredMachines = machines.filter((machine) => {
    const matchesSearch =
      !filters.search ||
      machine.serial_number.toLowerCase().includes(filters.search.toLowerCase()) ||
      machine.engine_serial.toLowerCase().includes(filters.search.toLowerCase())

    const matchesTechniqueModel =
      !filters.technique_model ||
      (machine.technique_model_name || "").toLowerCase().includes(filters.technique_model.toLowerCase())

    const matchesEngineModel =
      !filters.engine_model ||
      (machine.engine_model_name || "").toLowerCase().includes(filters.engine_model.toLowerCase())

    const matchesTransmissionModel =
      !filters.transmission_model ||
      (machine.transmission_model_name || "").toLowerCase().includes(filters.transmission_model.toLowerCase())

    const matchesDriveAxleModel =
      !filters.drive_axle_model ||
      (machine.drive_axle_model_name || "").toLowerCase().includes(filters.drive_axle_model.toLowerCase())

    const matchesSteerAxleModel =
      !filters.steer_axle_model ||
      (machine.steer_axle_model_name || "").toLowerCase().includes(filters.steer_axle_model.toLowerCase())

    return (
      matchesSearch &&
      matchesTechniqueModel &&
      matchesEngineModel &&
      matchesTransmissionModel &&
      matchesDriveAxleModel &&
      matchesSteerAxleModel
    )
  })

  // Сортировка данных
  const sortedAndFilteredMachines = [...filteredMachines].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (!aValue && !bValue) return 0
    if (!aValue) return 1
    if (!bValue) return -1

    let comparison = 0
    if (sortField === "shipment_date") {
      // Специальная обработка для дат
      const dateA = new Date(aValue as string)
      const dateB = new Date(bValue as string)
      comparison = dateA.getTime() - dateB.getTime()
    } else if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.localeCompare(bValue)
    } else {
      comparison = String(aValue).localeCompare(String(bValue))
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>🚛</div>
            <div>
              <h1 className={styles.title}>Машины СИЛАНТ</h1>
              <p className={styles.subtitle}>
                Полная информация о технике, её комплектации и технических характеристиках
              </p>
            </div>
          </div>

          {/* Кнопки */}
          <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
            <PermissionButton
              hasPermission={permissions.canCreateMachine}
              onClick={handleCreateMachine}
              variant="primary"
              tooltip="Только менеджеры могут добавлять машины"
            >
              <Plus size={20} />
              Добавить машину
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
              <label className={styles.filterLabel}>Поиск по номеру</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Серийный номер машины или двигателя..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Модель техники</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Введите модель техники..."
                value={filters.technique_model}
                onChange={(e) => handleFilterChange("technique_model", e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Модель двигателя</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Введите модель двигателя..."
                value={filters.engine_model}
                onChange={(e) => handleFilterChange("engine_model", e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Модель трансмиссии</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Введите модель трансмиссии..."
                value={filters.transmission_model}
                onChange={(e) => handleFilterChange("transmission_model", e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Модель ведущего моста</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Введите модель ведущего моста..."
                value={filters.drive_axle_model}
                onChange={(e) => handleFilterChange("drive_axle_model", e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Модель управляемого моста</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Введите модель управляемого моста..."
                value={filters.steer_axle_model}
                onChange={(e) => handleFilterChange("steer_axle_model", e.target.value)}
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
            <div className={styles.dataTitle}>📊 Список машин</div>
            <div className={styles.dataCount}>Найдено: {sortedAndFilteredMachines.length}</div>
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
            ) : sortedAndFilteredMachines.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>🔍</div>
                <h3 className={styles.emptyStateTitle}>Машины не найдены</h3>
                <p className={styles.emptyStateText}>
                  {permissions.isClient
                    ? "У вас пока нет привязанных машин. Обратитесь к менеджеру для добавления машин к вашему аккаунту."
                    : "Попробуйте изменить параметры поиска или сбросить фильтры"}
                </p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <SortableHeader field="serial_number">Серийный номер</SortableHeader>
                    <SortableHeader field="technique_model_name">Модель техники</SortableHeader>
                    <SortableHeader field="engine_model_name">Двигатель</SortableHeader>
                    <SortableHeader field="transmission_model_name">Трансмиссия</SortableHeader>
                    <SortableHeader field="shipment_date">Дата отгрузки</SortableHeader>
                    {permissions.canEditMachine && (
                      <th className={styles.tableHeaderCell} style={{ width: "120px" }}>
                        Действия
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredMachines.map((machine) => (
                    <tr key={machine.id} className={styles.tableRow}>
                      <td
                        className={`${styles.tableCell} ${styles.tableCellBold}`}
                        onClick={() => (window.location.href = `/machines/${machine.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {machine.serial_number}
                      </td>
                      <td
                        className={styles.tableCell}
                        onClick={() => (window.location.href = `/machines/${machine.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {machine.technique_model_name || "—"}
                      </td>
                      <td
                        className={styles.tableCell}
                        onClick={() => (window.location.href = `/machines/${machine.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <div>{machine.engine_model_name || "—"}</div>
                        <div className={styles.tableCellMuted}>№ {machine.engine_serial || "—"}</div>
                      </td>
                      <td
                        className={styles.tableCell}
                        onClick={() => (window.location.href = `/machines/${machine.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <div>{machine.transmission_model_name || "—"}</div>
                        <div className={styles.tableCellMuted}>№ {machine.transmission_serial || "—"}</div>
                      </td>
                      <td
                        className={styles.tableCell}
                        onClick={() => (window.location.href = `/machines/${machine.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {machine.shipment_date ? new Date(machine.shipment_date).toLocaleDateString("ru-RU") : "—"}
                      </td>
                      {permissions.canEditMachine && (
                        <td className={styles.tableCell}>
                          <PermissionButton
                            hasPermission={permissions.canEditMachine}
                            onClick={() => handleEditMachine(machine)}
                            variant="secondary"
                            size="small"
                            tooltip="Редактировать машину"
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
      <MachineForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        machine={editingMachine}
        user={user}
      />
    </div>
  )
}

export default MachinesPage
