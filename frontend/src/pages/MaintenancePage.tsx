"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, RotateCcw } from "lucide-react"
import { maintenanceService, type Maintenance } from "../services/api"
import styles from "../styles/DataPage.module.css"
import { usePageTitle } from "../hooks/usePageTitle"

const MaintenancePage: React.FC = () => {
  usePageTitle("ТО")
  const [maintenance, setMaintenance] = useState<Maintenance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    search: "",
    maintenance_type: "",
    machine_serial: "",
    service_company: "",
  })

  const fetchMaintenance = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await maintenanceService.getAll()

      // Проверяем структуру данных и извлекаем массив
      let maintenanceData: Maintenance[] = []

      if (Array.isArray(response.data)) {
        // Если response.data уже массив
        maintenanceData = response.data
      } else if (response.data && Array.isArray(response.data.results)) {
        // Если данные в response.data.results (пагинация Django)
        maintenanceData = response.data.results
      } else if (response.data && typeof response.data === "object") {
        // Если это объект, попробуем найти массив в нем
        const possibleArrays = Object.values(response.data).filter(Array.isArray)
        if (possibleArrays.length > 0) {
          maintenanceData = possibleArrays[0] as Maintenance[]
        }
      }

      setMaintenance(maintenanceData)
    } catch (err: any) {
      console.error("Ошибка при загрузке данных о ТО:", err)
      setError("Ошибка при загрузке данных о техническом обслуживании")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaintenance()
  }, [])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {

  }

  const handleReset = () => {
    setFilters({
      search: "",
      maintenance_type: "",
      machine_serial: "",
      service_company: "",
    })
  }

  const handleRetry = () => {
    fetchMaintenance()
  }

  // Безопасная фильтрация - убеждаемся, что maintenance это массив
  const filteredMaintenance = Array.isArray(maintenance)
    ? maintenance.filter((item) => {
        const matchesSearch =
          !filters.search ||
          item.work_order_number?.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.machine_serial?.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.work_order?.toLowerCase().includes(filters.search.toLowerCase())

        return matchesSearch
      })
    : []

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>🔧</div>
            <h1 className={styles.title}>Техническое обслуживание</h1>
            <p className={styles.subtitle}>Информация о проведенных работах по техническому обслуживанию машин</p>
          </div>
        </div>

        {/* Debug Info */}
        <div
          style={{
            background: "#f3f4f6",
            padding: "12px",
            margin: "16px 0",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#374151",
          }}
        >
       
        </div>

        {/* Filters */}
        <div className={styles.filtersSection}>
          <h2 className={styles.filtersTitle}>
            <Filter size={24} />
            Фильтры поиска
          </h2>

          <div className={styles.filtersGrid}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Поиск</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Номер наряда или серийный номер..."
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
              <label className={styles.filterLabel}>Серийный номер машины</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Введите серийный номер..."
                value={filters.machine_serial}
                onChange={(e) => handleFilterChange("machine_serial", e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Сервисная компания</label>
              <input
                type="text"
                className={styles.filterInput}
                placeholder="Введите название компании..."
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
            <div className={styles.dataTitle}>📋 Записи о ТО</div>
            <div className={styles.dataCount}>Найдено: {filteredMaintenance.length}</div>
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
                <button onClick={handleRetry} style={{ marginTop: "1rem", padding: "8px 16px" }}>
                  Повторить попытку
                </button>
              </div>
            ) : filteredMaintenance.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>🔍</div>
                <h3 className={styles.emptyStateTitle}>Записи о ТО не найдены</h3>
                <p className={styles.emptyStateText}>Попробуйте изменить параметры поиска или сбросить фильтры</p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className={styles.tableHeaderCell}>Вид ТО</th>
                    <th className={styles.tableHeaderCell}>Дата ТО</th>
                    <th className={styles.tableHeaderCell}>Наработка, м/час</th>
                    <th className={styles.tableHeaderCell}>№ заказ-наряда</th>
                    <th className={styles.tableHeaderCell}>Машина</th>
                    <th className={styles.tableHeaderCell}>Сервисная компания</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaintenance.map((item) => (
                    <tr
                      key={item.id}
                      className={`${styles.tableRow} ${styles.tableRowClickable}`}
                      onClick={() => (window.location.href = `/maintenance/${item.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                        {item.maintenance_type?.name || "—"}
                      </td>
                      <td className={styles.tableCell}>
                        {item.maintenance_date ? new Date(item.maintenance_date).toLocaleDateString("ru-RU") : "—"}
                      </td>
                      <td className={styles.tableCell}>{item.operating_hours || "—"}</td>
                      <td className={styles.tableCell}>
                        <div>{item.work_order_number || item.work_order || "—"}</div>
                        <div className={styles.tableCellMuted}>
                          {item.work_order_date ? new Date(item.work_order_date).toLocaleDateString("ru-RU") : ""}
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.tableCellBold}>№ {item.machine_serial || "—"}</div>
                      </td>
                      <td className={styles.tableCell}>
                        {item.service_company?.name || item.service_company_name || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaintenancePage
