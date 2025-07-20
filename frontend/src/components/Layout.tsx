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


      {/* Простейший футер по макету */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLeft}>
            +7-8352-20-12-09, telegram
          </div>
          <div className={styles.footerRight}>
          Мой Силант 2022
        </div>
    </div>
</footer>
    </div>
  )
}

export default Layout
