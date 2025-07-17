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
  })

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
      console.error("🔍 fetchMachines - ошибка при загрузке:", err)
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
    console.log("Поиск с фильтрами:", filters)
  }

  const handleReset = () => {
    setFilters({
      search: "",
      technique_model: "",
      engine_model: "",
      transmission_model: "",
    })
  }

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

  const filteredMachines = machines.filter((machine) => {
    const matchesSearch =
      !filters.search ||
      machine.serial_number.toLowerCase().includes(filters.search.toLowerCase()) ||
      machine.engine_serial.toLowerCase().includes(filters.search.toLowerCase())

    return matchesSearch
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
            <div className={styles.dataCount}>Найдено: {filteredMachines.length}</div>
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
            ) : filteredMachines.length === 0 ? (
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
                    <th className={styles.tableHeaderCell}>Серийный номер</th>
                    <th className={styles.tableHeaderCell}>Модель техники</th>
                    <th className={styles.tableHeaderCell}>Двигатель</th>
                    <th className={styles.tableHeaderCell}>Трансмиссия</th>
                    <th className={styles.tableHeaderCell}>Дата отгрузки</th>
                    {permissions.canEditMachine && (
                      <th className={styles.tableHeaderCell} style={{ width: "120px" }}>
                        Действия
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredMachines.map((machine) => (
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
