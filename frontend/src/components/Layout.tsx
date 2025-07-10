"use client"

import type React from "react"
import Header from "./Header"
import styles from "../styles/Layout.module.css"

interface LayoutProps {
  children: React.ReactNode
  user?: any
  onShowLogin?: () => void
  onLogout?: () => void
}

const Layout: React.FC<LayoutProps> = ({ children, user, onShowLogin, onLogout }) => {
  return (
    <div className={styles.layout}>
      <Header user={user} onShowLogin={onShowLogin} onLogout={onLogout} />
      <main className={styles.main}>{children}</main>

      {/* Красивый футер с градиентами и анимациями */}
      <footer className={styles.footer}>
        {/* Анимированный фон */}
        <div className={styles.footerBackground} />

        <div className={styles.footerContainer}>
          {/* Основной контент футера */}
          <div className={styles.footerContent}>
            {/* Информация о компании */}
            <div className={styles.companyInfo}>
              <div className={styles.companyHeader}>
                <div className={styles.companyLogo}>
                  <img src="/public/images/Logo1.jpg" alt="Силант" className={styles.companyLogoImg} />
                </div>
                <div>
                  <h3 className={styles.companyTitle}>СИЛАНТ</h3>
                  <p className={styles.companySubtitle}>Чебоксарский завод</p>
                </div>
              </div>
              <p className={styles.companyDescription}>
                Система мониторинга и управления техникой. Полный контроль за состоянием, обслуживанием и эксплуатацией
                вашей техники.
              </p>
            </div>

            {/* Быстрые ссылки */}
            <div className={styles.quickLinks}>
              <h4 className={styles.sectionTitle}>🔗 Быстрые ссылки</h4>
              <ul className={styles.linksList}>
                {[
                  { label: "🚛 Машины", href: "/machines" },
                  { label: "🔧 Техническое обслуживание", href: "/maintenance" },
                  { label: "📋 Рекламации", href: "/complaints" },
                ].map((link, index) => (
                  <li key={index} className={styles.linkItem}>
                    <a href={link.href} className={styles.footerLink}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Контактная информация */}
            <div className={styles.contactInfo}>
              <h4 className={styles.sectionTitle}>📞 Контакты</h4>
              <div className={styles.contactDetails}>
                <div className={styles.contactItem}>
                  <span>🏭</span>
                  <span>г. Чебоксары, Чебоксарский завод</span>
                </div>
                <div className={styles.contactItem}>
                  <span>🛠️</span>
                  <span>Техническая поддержка 24/7</span>
                </div>
                <div className={styles.contactItem}>
                  <span>📧</span>
                  <span>support@silant.ru</span>
                </div>
              </div>
            </div>
          </div>

          {/* Разделитель */}
          <div className={styles.footerDivider} />

          {/* Copyright */}
          <div className={styles.footerBottom}>
            <p className={styles.copyright}>© 2024 СИЛАНТ. Все права защищены.</p>
            <div className={styles.footerMeta}>
              <span className={styles.footerMetaText}>Сделано с ❤️ для эффективного управления техникой</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
