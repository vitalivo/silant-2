"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, RotateCcw } from "lucide-react"
import { machineService, type Machine } from "../services/api"
import styles from "../styles/DataPage.module.css"
import { usePageTitle } from "../hooks/usePageTitle"

const MachinesPage: React.FC = () => {
  usePageTitle("Машины")
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    search: "",
    technique_model: "",
    engine_model: "",
    transmission_model: "",
  })

  const fetchMachines = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await machineService.getAll()
      setMachines(response.data.results || response.data)
    } catch (err) {
      setError("Ошибка при загрузке данных о машинах")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMachines()
  }, [])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    // Здесь можно добавить логику фильтрации
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
            <h1 className={styles.title}>Машины СИЛАНТ</h1>
            <p className={styles.subtitle}>
              Полная информация о технике, её комплектации и технических характеристиках
            </p>
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
                <p className={styles.emptyStateText}>Попробуйте изменить параметры поиска или сбросить фильтры</p>
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
                  </tr>
                </thead>
                <tbody>
                  {filteredMachines.map((machine) => (
                    <tr
                      key={machine.id}
                      className={`${styles.tableRow} ${styles.tableRowClickable}`}
                      onClick={() => (window.location.href = `/machines/${machine.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className={`${styles.tableCell} ${styles.tableCellBold}`}>{machine.serial_number}</td>
                      <td className={styles.tableCell}>{machine.technique_model?.name || "—"}</td>
                      <td className={styles.tableCell}>
                        <div>{machine.engine_model?.name || "—"}</div>
                        <div className={styles.tableCellMuted}>№ {machine.engine_serial || "—"}</div>
                      </td>
                      <td className={styles.tableCell}>
                        <div>{machine.transmission_model?.name || "—"}</div>
                        <div className={styles.tableCellMuted}>№ {machine.transmission_serial || "—"}</div>
                      </td>
                      <td className={styles.tableCell}>
                        {machine.shipment_date ? new Date(machine.shipment_date).toLocaleDateString("ru-RU") : "—"}
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

export default MachinesPage
