"use client"
import type React from "react"
import { useState } from "react"
import { Search, RotateCcw } from 'lucide-react'
import styles from "../styles/HomePage.module.css"
import AuthService from "../services/AuthService"
import AuthTabsUpdated from "../components/AuthTabsUpdated"
import { machineService, type Machine } from "../services/api"
import { usePageTitle } from "../hooks/usePageTitle"

const HomePage: React.FC = () => {
  usePageTitle("Главная")
  
  // Состояние для поиска одной машины (для неавторизованных)
  const [foundMachine, setFoundMachine] = useState<Machine | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Поиск машины по серийному номеру
 // Замените функцию searchMachineBySerial в HomePage.tsx:
const searchMachineBySerial = async () => {
  if (!searchQuery.trim()) {
    setError("Введите серийный номер машины")
    return
  }

  setLoading(true)
  setError(null)
  setFoundMachine(null)
  setHasSearched(true)

  try {
    // Временно используем getAll и ищем на клиенте
    const response = await machineService.getAll()
    const machines = Array.isArray(response.data) ? response.data : response.data.results || []
    
    const foundMachine = machines.find(machine => 
      machine.serial_number.toLowerCase() === searchQuery.trim().toLowerCase()
    )

    if (foundMachine) {
      setFoundMachine(foundMachine)
      console.log("🎉 Машина найдена:", foundMachine)
    } else {
      setError("Данных о машине с таким заводским номером нет в системе")
      setFoundMachine(null)
    }
  } catch (err) {
    console.error("❌ Ошибка поиска:", err)
    setError("Ошибка при поиске машины")
    setFoundMachine(null)
  } finally {
    setLoading(false)
  }
}

  // Сброс поиска
  const handleReset = () => {
    setSearchQuery("")
    setFoundMachine(null)
    setError(null)
    setHasSearched(false)
  }

  // Обработка Enter в поле ввода
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchMachineBySerial()
    }
  }

  return (
    <div className={styles.container}>
      <AuthService>
        {({ user, logout }) => (
          <>
            {user ? (
              // Авторизованный пользователь - показываем полный интерфейс
              <AuthTabsUpdated user={user} onLogout={logout} />
            ) : (
              // Неавторизованный пользователь - простой поиск по серийному номеру
              <>
                <section className={styles.machinesSection}>
                  <div className={styles.machinesContainer}>
                    <div className={styles.machinesHeader}>
                      <h2 className={styles.machinesTitle}>
                        📊 Проверьте комплектацию и технические характеристики техники Силант
                      </h2>
                    </div>

                    {/* Простая форма поиска по серийному номеру */}
                    <div className={styles.filtersSection}>
                      <h3 className={styles.filtersTitle}>
                        🔍 Поиск машины по заводскому номеру
                      </h3>
                      
                      <div className={styles.searchForm}>
                        <div className={styles.searchInputGroup}>
                          <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Введите серийный номер машины..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                          />
                          <button 
                            className={styles.searchButton} 
                            onClick={searchMachineBySerial}
                            disabled={loading}
                          >
                            <Search size={20} />
                            {loading ? "Поиск..." : "Поиск"}
                          </button>
                          <button 
                            className={styles.resetButton} 
                            onClick={handleReset}
                            disabled={loading}
                          >
                            <RotateCcw size={20} />
                            Сбросить
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Результаты поиска */}
                    <div className={styles.tableContainer}>
                      {loading ? (
                        <div className={styles.loadingState}>
                          <div className={styles.loadingSpinner}></div>
                          <p className={styles.loadingText}>Поиск машины...</p>
                        </div>
                      ) : error ? (
                        <div className={styles.errorState}>
                          <div className={styles.errorIcon}>❌</div>
                          <h3 className={styles.errorTitle}>Машина не найдена</h3>
                          <p className={styles.errorText}>{error}</p>
                          <button className={styles.retryButton} onClick={handleReset}>
                            🔄 Попробовать снова
                          </button>
                        </div>
                      ) : !hasSearched ? (
                        <div className={styles.emptyState}>
                          <div className={styles.emptyIcon}>🔍</div>
                          <h3 className={styles.emptyTitle}>Введите серийный номер</h3>
                          <p className={styles.emptyText}>
                            Введите заводской номер машины и нажмите "Поиск" для получения информации о комплектации
                          </p>
                        </div>
                      ) : foundMachine ? (
                        <div className={styles.tableWrapper}>
                          <div className={styles.successMessage}>
                            ✅ Машина найдена: <strong>{foundMachine.serial_number}</strong>
                          </div>
                          
                          <table className={styles.machinesTable}>
                            <thead className={styles.tableHeader}>
                              <tr>
                                <th className={styles.tableHeaderCell}>Серийный №</th>
                                <th className={styles.tableHeaderCell}>Модель техники</th>
                                <th className={styles.tableHeaderCell}>Двигатель</th>
                                <th className={styles.tableHeaderCell}>Трансмиссия</th>
                                <th className={styles.tableHeaderCell}>Мосты</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className={styles.tableRow}>
                                <td className={`${styles.tableCell} ${styles.serialCell}`}>
                                  {foundMachine.serial_number}
                                </td>
                                <td className={styles.tableCell}>
                                  {foundMachine.technique_model?.name || foundMachine.technique_model_name || "—"}
                                </td>
                                <td className={styles.tableCell}>
                                  <div className={styles.componentInfo}>
                                    <div className={styles.componentModel}>
                                      {foundMachine.engine_model?.name || foundMachine.engine_model_name || "—"}
                                    </div>
                                    <div className={styles.componentSerial}>№ {foundMachine.engine_serial || "—"}</div>
                                  </div>
                                </td>
                                <td className={styles.tableCell}>
                                  <div className={styles.componentInfo}>
                                    <div className={styles.componentModel}>
                                      {foundMachine.transmission_model?.name || foundMachine.transmission_model_name || "—"}
                                    </div>
                                    <div className={styles.componentSerial}>
                                      № {foundMachine.transmission_serial || "—"}
                                    </div>
                                  </div>
                                </td>
                                <td className={styles.tableCell}>
                                  <div className={styles.axlesInfo}>
                                    <div className={styles.axleItem}>
                                      <span className={styles.axleLabel}>Ведущий:</span>
                                      <div className={styles.axleDetails}>
                                        <div className={styles.componentModel}>
                                          {foundMachine.drive_axle_model?.name || foundMachine.drive_axle_model_name || "—"}
                                        </div>
                                        <div className={styles.componentSerial}>
                                          № {foundMachine.drive_axle_serial || "—"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className={styles.axleItem}>
                                      <span className={styles.axleLabel}>Управляемый:</span>
                                      <div className={styles.axleDetails}>
                                        <div className={styles.componentModel}>
                                          {foundMachine.steer_axle_model?.name || foundMachine.steer_axle_model_name || "—"}
                                        </div>
                                        <div className={styles.componentSerial}>
                                          № {foundMachine.steer_axle_serial || "—"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          
                          <div className={styles.tableFooter}>
                            <div className={styles.tableInfo}>
                              <span className={styles.tableNote}>
                                Для просмотра полной информации войдите в систему
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : null}
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