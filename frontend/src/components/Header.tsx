"use client"
import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, LogIn, Phone, MessageCircle } from 'lucide-react'
import { useState } from "react"
import styles from "../styles/Header.module.css"

interface HeaderProps {
  user?: any
  onShowLogin?: () => void
  onLogout?: () => void
}

const Header: React.FC<HeaderProps> = ({ user, onShowLogin, onLogout }) => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  // Базовые ссылки для всех пользователей
  const publicNavItems = []

  // Дополнительные ссылки только для авторизованных пользователей
  const authNavItems = []

  // Определяем какие ссылки показывать
  const navItems = user ? [...authNavItems] : publicNavItems

  return (
    <header className={styles.header}>
      {/* Контакты сверху */}
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.contacts}>
            <a href="tel:+78352202101" className={styles.contactLink}>
              <Phone size={16} />
              +7 (8352) 20-21-01
            </a>
            <a href="https://t.me/silant_service" className={styles.contactLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} />
              Telegram
            </a>
          </div>
        </div>
      </div>

      {/* Основной хедер */}
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Logo */}
          <Link to="#" className={styles.logoLink}>
            <div className={styles.logoContainer}>
              <img src="/images/Logo1.jpg" alt="Силант" className={styles.logo} />
            </div>
            <div className={styles.logoText}>
              <h1 className={styles.logoTitle}>СИЛАНТ</h1>
              <p className={styles.logoSubtitle}>Чебоксарский завод</p>
            </div>
          </Link>

          {/* Электронная сервисная книжка */}
          <div className={styles.serviceBook}>
            <div className={styles.serviceBookIcon}>⚡</div>
            <div className={styles.serviceBookText}>
              <span className={styles.serviceBookTitle}>Электронная сервисная книжка</span>
              <span className={styles.serviceBookSubtitle}>"Мой Силант"</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${isActive(item.path) ? styles.navLinkActive : styles.navLinkInactive}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className={styles.authSection}>
            {user ? (
              <div className={styles.userSection}>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>
                    {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
                  </span>
                </div>
                <button onClick={onLogout} className={styles.logoutButton}>
                  Выйти
                </button>
              </div>
            ) : (
              <button onClick={onShowLogin} className={styles.loginButton}>
                <LogIn size={16} />
                Войти
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button className={styles.mobileMenuButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <nav className={styles.mobileNav}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.mobileNavLink} ${
                    isActive(item.path) ? styles.mobileNavLinkActive : styles.mobileNavLinkInactive
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header