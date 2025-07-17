"use client"

import type React from "react"
import { useState } from "react"
import { Search, Filter, RotateCcw } from "lucide-react"
import styles from "../styles/HomePage.module.css"
import AuthService from "../services/AuthService"
import AuthTabsUpdated from "../components/AuthTabsUpdated"
import { machineService, type Machine } from "../services/api"
import { usePageTitle } from "../hooks/usePageTitle"

interface MachineFilters {
  search: string
  technique_model: string
  engine_model: string
  transmission_model: string
  drive_axle_model: string
  steer_axle_model: string
}

const HomePage: React.FC = () => {
  usePageTitle("Главная")
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Состояние фильтров
  const [filters, setFilters] = useState<MachineFilters>({
    search: "",
    technique_model: "",
    engine_model: "",
    transmission_model: "",
    drive_axle_model: "",
    steer_axle_model: "",
  })

  // Состояние сортировки
  const [sortField, setSortField] = useState<keyof Machine>("serial_number")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Загрузка машин для неавторизованных пользователей
  const fetchMachinesForGuests = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await machineService.getAll()
      const data = response.data
      const machinesArray = Array.isArray(data) ? data : data.results || []
      setMachines(machinesArray)
      setDataLoaded(true)
    } catch (err) {
      console.error("Ошибка при загрузке машин:", err)
      setError("Ошибка загрузки данных")
    } finally {
      setLoading(false)
    }
  }

  // Обработка изменения фильтров
  const handleFilterChange = (key: keyof MachineFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // Обработка поиска
  const handleSearch = () => {
    // Фильтрация происходит автоматически через filteredMachines
  }

  // Сброс фильтров
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

  // Функция обработки клика по заголовку для сортировки
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
    <th className={`${styles.tableHeaderCell} ${styles.sortableHeader}`} onClick={() => handleSort(field)}>
      <div className={styles.sortableHeaderContent}>
        {children}
        {sortField === field && <span className={styles.sortIndicator}>{sortDirection === "asc" ? "↑" : "↓"}</span>}
      </div>
    </th>
  )

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
    if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.localeCompare(bValue)
    } else {
      comparison = String(aValue).localeCompare(String(bValue))
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  return (
    <div className={styles.container}>
      <AuthService>
        {({ user, logout }) => (
          <>
            {user ? (
              // Авторизованный пользователь - показываем полный интерфейс
              <AuthTabsUpdated user={user} onLogout={logout} />
            ) : (
              // Неавторизованный пользователь - показываем компактную таблицу
              <>
                {/* Hero Section */}
                <section className={styles.hero}>
                  <div className={styles.heroContent}>
                    <div className={styles.logoContainer}>
                      <img src="/images/Logo1.jpg" alt="Силант" className={styles.logo} />
                    </div>

                    <div className={styles.badge}>
                      <span style={{ marginRight: "8px" }}>⚡</span>
                      Система мониторинга техники СИЛАНТ
                    </div>

                    <h1 className={styles.title}>
                      Технические характеристики
                      <span className={styles.titleGradient}>машин СИЛАНТ</span>
                    </h1>

                    <p className={styles.subtitle}>
                      Основные технические параметры выпущенной техники. Войдите в систему для получения полной
                      информации о поставках и сервисном обслуживании.
                    </p>
                  </div>
                </section>
                {/* Секция с фильтрами и таблицей */}
                <section className={styles.machinesSection}>
                  <div className={styles.machinesContainer}>
                    <div className={styles.machinesHeader}>
                      <h2 className={styles.machinesTitle}>📊 Технические характеристики машин</h2>
                      <button className={styles.loadDataButton} onClick={fetchMachinesForGuests} disabled={loading}>
                        {loading ? "⏳ Загрузка..." : "🔄 Загрузить данные"}
                      </button>
                    </div>

                    {/* Фильтры - показываем только если данные загружены */}
                    {dataLoaded && (
                      <div className={styles.filtersSection}>
                        <h3 className={styles.filtersTitle}>
                          <Filter size={24} />
                          Фильтры поиска
                        </h3>

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
                          <button className={styles.filterButtonPrimary} onClick={handleSearch}>
                            <Search size={20} />
                            Найти
                          </button>
                          <button className={styles.filterButtonSecondary} onClick={handleReset}>
                            <RotateCcw size={20} />
                            Сбросить
                          </button>
                        </div>
                      </div>
                    )}

                    <div className={styles.tableContainer}>
                      {loading ? (
                        <div className={styles.loadingState}>
                          <div className={styles.loadingSpinner}></div>
                          <p className={styles.loadingText}>Загрузка технических характеристик...</p>
                        </div>
                      ) : error ? (
                        <div className={styles.errorState}>
                          <div className={styles.errorIcon}>⚠️</div>
                          <h3 className={styles.errorTitle}>Ошибка загрузки</h3>
                          <p className={styles.errorText}>{error}</p>
                          <button className={styles.retryButton} onClick={fetchMachinesForGuests}>
                            🔄 Попробовать снова
                          </button>
                        </div>
                      ) : !dataLoaded ? (
                        <div className={styles.emptyState}>
                          <div className={styles.emptyIcon}>📋</div>
                          <h3 className={styles.emptyTitle}>Данные не загружены</h3>
                          <p className={styles.emptyText}>Нажмите "Загрузить данные" для просмотра характеристик</p>
                        </div>
                      ) : sortedAndFilteredMachines.length === 0 ? (
                        <div className={styles.emptyState}>
                          <div className={styles.emptyIcon}>🔍</div>
                          <h3 className={styles.emptyTitle}>Машины не найдены</h3>
                          <p className={styles.emptyText}>Попробуйте изменить параметры поиска или сбросить фильтры</p>
                        </div>
                      ) : (
                        <div className={styles.tableWrapper}>
                          <table className={styles.machinesTable}>
                            <thead className={styles.tableHeader}>
                              <tr>
                                <SortableHeader field="serial_number">Серийный №</SortableHeader>
                                <SortableHeader field="technique_model_name">Модель техники</SortableHeader>
                                <SortableHeader field="engine_model_name">Двигатель</SortableHeader>
                                <SortableHeader field="transmission_model_name">Трансмиссия</SortableHeader>
                                <th className={styles.tableHeaderCell}>Мосты</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sortedAndFilteredMachines.map((machine) => (
                                <tr key={machine.id} className={styles.tableRow}>
                                  <td className={`${styles.tableCell} ${styles.serialCell}`}>
                                    {machine.serial_number}
                                  </td>
                                  <td className={styles.tableCell}>
                                    {machine.technique_model?.name || machine.technique_model_name || "—"}
                                  </td>
                                  <td className={styles.tableCell}>
                                    <div className={styles.componentInfo}>
                                      <div className={styles.componentModel}>
                                        {machine.engine_model?.name || machine.engine_model_name || "—"}
                                      </div>
                                      <div className={styles.componentSerial}>№ {machine.engine_serial || "—"}</div>
                                    </div>
                                  </td>
                                  <td className={styles.tableCell}>
                                    <div className={styles.componentInfo}>
                                      <div className={styles.componentModel}>
                                        {machine.transmission_model?.name || machine.transmission_model_name || "—"}
                                      </div>
                                      <div className={styles.componentSerial}>
                                        № {machine.transmission_serial || "—"}
                                      </div>
                                    </div>
                                  </td>
                                  <td className={styles.tableCell}>
                                    <div className={styles.axlesInfo}>
                                      <div className={styles.axleItem}>
                                        <span className={styles.axleLabel}>Ведущий:</span>
                                        <div className={styles.axleDetails}>
                                          <div className={styles.componentModel}>
                                            {machine.drive_axle_model?.name || machine.drive_axle_model_name || "—"}
                                          </div>
                                          <div className={styles.componentSerial}>
                                            № {machine.drive_axle_serial || "—"}
                                          </div>
                                        </div>
                                      </div>
                                      <div className={styles.axleItem}>
                                        <span className={styles.axleLabel}>Управляемый:</span>
                                        <div className={styles.axleDetails}>
                                          <div className={styles.componentModel}>
                                            {machine.steer_axle_model?.name || machine.steer_axle_model_name || "—"}
                                          </div>
                                          <div className={styles.componentSerial}>
                                            № {machine.steer_axle_serial || "—"}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          <div className={styles.tableFooter}>
                            <div className={styles.tableInfo}>
                              <span className={styles.tableCount}>
                                Найдено: {sortedAndFilteredMachines.length} из {machines.length} машин
                              </span>
                              <span className={styles.tableNote}>
                                Для просмотра полной информации войдите в систему
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </AuthService>
    </div>
  )
}

export default HomePage
