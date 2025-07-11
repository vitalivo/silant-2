"use client"

import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, LogIn, UserIcon } from "lucide-react"
import { useState } from "react"
import styles from "../styles/Header.module.css"
import { type User, getRoleDisplayName, getRoleBadgeClass } from "../services/api"

interface HeaderProps {
  user?: User | null
  onShowLogin?: () => void
  onLogout?: () => void
}

const Header: React.FC<HeaderProps> = ({ user, onShowLogin, onLogout }) => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: "/", label: "Главная", icon: "🏠" },
    { path: "/machines", label: "Машины", icon: "🚛" },
    { path: "/maintenance", label: "ТО", icon: "🔧", requiresAuth: true },
    { path: "/complaints", label: "Рекламации", icon: "📋", requiresAuth: true },
  ]

  // Фильтруем навигацию в зависимости от авторизации
  const visibleNavItems = navItems.filter((item) => !item.requiresAuth || user)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Logo */}
          <Link to="/" className={styles.logoLink}>
            <div className={styles.logoContainer}>
              <img src="/public/images/Logo1.jpg" alt="Силант" className={styles.logo} />
            </div>
            <div className={styles.logoText}>
              <h1 className={styles.logoTitle}>СИЛАНТ</h1>
              <p className={styles.logoSubtitle}>Чебоксарский завод</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            {visibleNavItems.map((item) => (
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
                  <div className={styles.userAvatar}>
                    <UserIcon size={20} />
                  </div>
                  <div className={styles.userDetails}>
                    <span className={styles.userName}>
                      {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
                    </span>
                    <span className={`${styles.userRole} ${styles[getRoleBadgeClass(user.role)]}`}>
                      {user.is_superuser ? "Администратор" : getRoleDisplayName(user.role)}
                    </span>
                  </div>
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
              {visibleNavItems.map((item) => (
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

            {/* Mobile User Info */}
            {user && (
              <div className={styles.mobileUserInfo}>
                <div className={styles.mobileUserDetails}>
                  <span className={styles.mobileUserName}>
                    {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
                  </span>
                  <span className={`${styles.mobileUserRole} ${styles[getRoleBadgeClass(user.role)]}`}>
                    {user.is_superuser ? "Администратор" : getRoleDisplayName(user.role)}
                  </span>
                </div>
                <button onClick={onLogout} className={styles.mobileLogoutButton}>
                  Выйти
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
