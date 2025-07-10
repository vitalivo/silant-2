"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { machineService } from "../services/api"
import styles from "../styles/HomePage.module.css"
import AuthService from "../components/AuthService"
import AuthTabs from "../components/AuthTabs"
import { usePageTitle } from "../hooks/usePageTitle"

const HomePage: React.FC = () => {
  usePageTitle("Главная")
  const [serialNumber, setSerialNumber] = useState("")
  const [machine, setMachine] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!serialNumber.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await machineService.searchBySerial(serialNumber)
      setMachine(response.data)
    } catch (err: any) {
      console.error("Ошибка поиска:", err)
      if (err.response?.status === 404) {
        setError("Машина с таким серийным номером не найдена")
      } else {
        setError(`Ошибка при поиске: ${err.message || "Неизвестная ошибка"}`)
      }
      setMachine(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <AuthService>
        {({ user, logout }) => (
          <>
            {user ? (
              // Авторизованный пользователь - показываем вкладки с данными
              <AuthTabs user={user} onLogout={logout} />
            ) : (
              // Неавторизованный пользователь - показываем поиск
              <>
                {/* Hero Section с поиском */}
                <section className={styles.hero}>
                  <div className={styles.heroContent}>
                    <div className={styles.logoContainer}>
                      <div className={styles.logoWrapper}>
                        <img src="/public/images/Logo1.jpg" alt="Силант" className={styles.logo} />
                      </div>
                    </div>

                    <div className={styles.badge}>
                      <span style={{ marginRight: "8px" }}>⚡</span>
                      Система мониторинга техники СИЛАНТ
                    </div>

                    <h1 className={styles.title}>
                      Проверьте свою
                      <span className={styles.titleGradient}>технику СИЛАНТ</span>
                    </h1>

                    <p className={styles.subtitle}>
                      Введите заводской номер для получения информации о комплектации и технических характеристиках
                      вашей техники
                    </p>

                    <form onSubmit={handleSearch} className={styles.searchForm}>
                      <div className={styles.searchContainer}>
                        <input
                          type="text"
                          value={serialNumber}
                          onChange={(e) => setSerialNumber(e.target.value)}
                          placeholder="Введите заводской номер машины..."
                          className={styles.searchInput}
                        />
                        <button type="submit" disabled={loading} className={styles.searchButton}>
                          <Search size={20} />
                          {loading ? "Поиск..." : "Найти"}
                        </button>
                      </div>
                    </form>
                  </div>
                </section>

                {/* Error Message */}
                {error && (
                  <section className={styles.errorSection}>
                    <div className={styles.errorContainer}>
                      <div className={styles.errorCard}>
                        <span style={{ fontSize: "24px" }}>⚠️</span>
                        <p className={styles.errorText}>{error}</p>
                      </div>
                    </div>
                  </section>
                )}

                {/* Machine Info */}
                {machine && (
                  <section className={styles.machineSection}>
                    <div className={styles.machineContainer}>
                      <div className={styles.machineCard}>
                        <div className={styles.machineHeader}>
                          <div className={styles.machineHeaderContent}>
                            <div className={styles.machineIcon}>🏆</div>
                            <div>
                              <h2 className={styles.machineTitle}>Информация о машине</h2>
                              <p className={styles.machineSerial}>Серийный номер: {machine.serial_number}</p>
                            </div>
                          </div>
                        </div>

                        <div className={styles.machineContent}>
                          <div className={styles.machineGrid}>
                            {[
                              { label: "Модель техники", value: machine.technique_model?.name, icon: "🚛" },
                              { label: "Модель двигателя", value: machine.engine_model?.name, icon: "⚙️" },
                              { label: "Серийный номер двигателя", value: machine.engine_serial, icon: "🔢" },
                              { label: "Модель трансмиссии", value: machine.transmission_model?.name, icon: "🔧" },
                              { label: "Серийный номер трансмиссии", value: machine.transmission_serial, icon: "🔢" },
                              {
                                label: "Дата отгрузки",
                                value: machine.shipment_date
                                  ? new Date(machine.shipment_date).toLocaleDateString("ru-RU")
                                  : "—",
                                icon: "📅",
                              },
                            ].map((item, index) => (
                              <div key={index} className={styles.machineItem}>
                                <div className={styles.machineItemHeader}>
                                  <span className={styles.machineItemIcon}>{item.icon}</span>
                                  <h3 className={styles.machineItemLabel}>{item.label}</h3>
                                </div>
                                <p className={styles.machineItemValue}>{item.value || "—"}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </AuthService>
    </div>
  )
}

export default HomePage
