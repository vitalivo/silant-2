"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, RotateCcw, Lock } from "lucide-react"
import { complaintsService, type Complaint } from "../services/api"
import styles from "../styles/DataPage.module.css"
import { usePageTitle } from "../hooks/usePageTitle"

const ComplaintsPage: React.FC = () => {
  usePageTitle("Рекламации")
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthError, setIsAuthError] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    failure_node: "",
    recovery_method: "",
    machine_serial: "",
  })

  const fetchComplaints = async () => {
    setLoading(true)
    setError(null)
    setIsAuthError(false)
    try {
      const response = await complaintsService.getAll()
      setComplaints(response.data.results || response.data)
    } catch (err: any) {
      if (err.response?.status === 403) {
        setIsAuthError(true)
        setError("Для просмотра данных о рекламациях необходима авторизация")
      } else {
        setError("Ошибка при загрузке данных о рекламациях")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    console.log("Поиск с фильтрами:", filters)
  }

  const handleReset = () => {
    setFilters({
      search: "",
      failure_node: "",
      recovery_method: "",
      machine_serial: "",
    })
  }

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      !filters.search ||
      complaint.failure_description.toLowerCase().includes(filters.search.toLowerCase()) ||
      complaint.machine_serial.toLowerCase().includes(filters.search.toLowerCase())

    return matchesSearch
  })

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>📋</div>
            <h1 className={styles.title}>Рекламации</h1>
            <p className={styles.subtitle}>
              Информация о неисправностях техники и проведенных работах по их устранению
            </p>
          </div>
        </div>

        {/* Auth Error */}
        {isAuthError ? (
          <div className={styles.authErrorSection}>
            <div className={styles.authErrorCard}>
              <Lock size={48} className={styles.authErrorIcon} />
              <h3 className={styles.authErrorTitle}>Требуется авторизация</h3>
              <p className={styles.authErrorText}>Для просмотра данных о рекламациях необходимо войти в систему</p>
            </div>
          </div>
        ) : (
          <>
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
                    placeholder="Описание неисправности или серийный номер..."
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
                  <label className={styles.filterLabel}>Способ восстановления</label>
                  <input
                    type="text"
                    className={styles.filterInput}
                    placeholder="Введите способ восстановления..."
                    value={filters.recovery_method}
                    onChange={(e) => handleFilterChange("recovery_method", e.target.value)}
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
                <div className={styles.dataTitle}>🚨 Записи о рекламациях</div>
                <div className={styles.dataCount}>Найдено: {filteredComplaints.length}</div>
              </div>

              <div className={styles.tableContainer}>
                {loading ? (
                  <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner}></div>
                    <p className={styles.loadingText}>Загрузка данных...</p>
                  </div>
                ) : error && !isAuthError ? (
                  <div className={styles.errorState}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h3 className={styles.errorTitle}>Ошибка загрузки</h3>
                    <p className={styles.errorText}>{error}</p>
                  </div>
                ) : filteredComplaints.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>🔍</div>
                    <h3 className={styles.emptyStateTitle}>Рекламации не найдены</h3>
                    <p className={styles.emptyStateText}>Попробуйте изменить параметры поиска или сбросить фильтры</p>
                  </div>
                ) : (
                  <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                      <tr>
                        <th className={styles.tableHeaderCell}>Дата отказа</th>
                        <th className={styles.tableHeaderCell}>Наработка, м/час</th>
                        <th className={styles.tableHeaderCell}>Узел отказа</th>
                        <th className={styles.tableHeaderCell}>Описание отказа</th>
                        <th className={styles.tableHeaderCell}>Способ восстановления</th>
                        <th className={styles.tableHeaderCell}>Время простоя</th>
                        <th className={styles.tableHeaderCell}>Машина</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.map((complaint) => (
                        <tr
                          key={complaint.id}
                          className={`${styles.tableRow} ${styles.tableRowClickable}`}
                          onClick={() => (window.location.href = `/complaints/${complaint.id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          <td className={styles.tableCell}>
                            {complaint.failure_date
                              ? new Date(complaint.failure_date).toLocaleDateString("ru-RU")
                              : "—"}
                          </td>
                          <td className={styles.tableCell}>{complaint.operating_hours || "—"}</td>
                          <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                            {complaint.failure_node?.name || "—"}
                          </td>
                          <td className={styles.tableCell}>
                            <div style={{ maxWidth: "200px", wordWrap: "break-word" }}>
                              {complaint.failure_description || "—"}
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <div>{complaint.recovery_method?.name || "—"}</div>
                            {complaint.spare_parts && (
                              <div className={styles.tableCellMuted}>Запчасти: {complaint.spare_parts}</div>
                            )}
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.tableCellBold}>
                              {complaint.downtime ? `${complaint.downtime} дней` : "—"}
                            </div>
                            {complaint.recovery_date && (
                              <div className={styles.tableCellMuted}>
                                до {new Date(complaint.recovery_date).toLocaleDateString("ru-RU")}
                              </div>
                            )}
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.tableCellBold}>№ {complaint.machine_serial || "—"}</div>
                            <div className={styles.tableCellMuted}>{complaint.service_company_name || "—"}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ComplaintsPage
