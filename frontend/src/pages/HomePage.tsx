"use client"

import type React from "react"
import styles from "../styles/HomePage.module.css"
import AuthService from "../services/AuthService"
import AuthTabs from "../components/AuthTabs"
import { usePageTitle } from "../hooks/usePageTitle"

const HomePage: React.FC = () => {
  usePageTitle("Главная")

  return (
    <div className={styles.container}>
      <AuthService>
        {({ user, logout }) => (
          <>
            {user ? (
              // Авторизованный пользователь - показываем вкладки с данными
              <AuthTabs user={user} onLogout={logout} />
            ) : (
              // Неавторизованный пользователь - показываем информацию без поиска
              <>
                {/* Hero Section без поиска */}
                <section className={styles.hero}>
                  <div className={styles.heroContent}>
                    <div className={styles.logoContainer}>
                      <div className={styles.logoWrapper}>
                        <img src="/images/Logo1.jpg" alt="Силант" className={styles.logo} />
                      </div>
                    </div>

                    <div className={styles.badge}>
                      <span style={{ marginRight: "8px" }}>⚡</span>
                      Система мониторинга техники СИЛАНТ
                    </div>

                    <h1 className={styles.title}>
                      Добро пожаловать в систему
                      <span className={styles.titleGradient}>СИЛАНТ</span>
                    </h1>

                    <p className={styles.subtitle}>
                      Войдите в систему для получения полной информации о комплектации, техническом обслуживании и
                      характеристиках вашей техники
                    </p>

                    {/* Убрали форму поиска для неавторизованных */}
                  </div>
                </section>

                {/* Информационная секция для неавторизованных */}
                <section className={styles.machineSection}>
                  <div className={styles.machineContainer}>
                    <div className={styles.machineCard}>
                      <div className={styles.machineHeader}>
                        <div className={styles.machineHeaderContent}>
                          <div className={styles.machineIcon}>🔐</div>
                          <div>
                            <h2 className={styles.machineTitle}>Возможности системы</h2>
                            <p className={styles.machineSerial}>Авторизуйтесь для получения доступа</p>
                          </div>
                        </div>
                      </div>

                      <div className={styles.machineContent}>
                        <div className={styles.machineGrid}>
                          {[
                            { label: "Информация о машинах", value: "Полные технические характеристики", icon: "🚛" },
                            { label: "Техническое обслуживание", value: "История и планирование ТО", icon: "🔧" },
                            { label: "Рекламации", value: "Учет и обработка рекламаций", icon: "📋" },
                            { label: "Мониторинг", value: "Отслеживание состояния техники", icon: "📊" },
                            { label: "Отчеты", value: "Детальная аналитика и отчеты", icon: "📈" },
                            { label: "Поддержка", value: "Техническая поддержка 24/7", icon: "🛠️" },
                          ].map((item, index) => (
                            <div key={index} className={styles.machineItem}>
                              <div className={styles.machineItemHeader}>
                                <span className={styles.machineItemIcon}>{item.icon}</span>
                                <h3 className={styles.machineItemLabel}>{item.label}</h3>
                              </div>
                              <p className={styles.machineItemValue}>{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
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
