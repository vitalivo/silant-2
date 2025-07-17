"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Wrench, Calendar, FileText, User } from "lucide-react"
import { maintenanceService, type Maintenance } from "../services/api"
import { machineService, type Machine } from "../services/api"
import styles from "../styles/DetailPage.module.css"
import { usePageTitle } from "../hooks/usePageTitle"

const MaintenanceDetailPage: React.FC = () => {
  usePageTitle("ТО")
  const { id } = useParams<{ id: string }>()
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMaintenance = async () => {
      if (!id) return

      setLoading(true)
      setError(null)
      try {
        const response = await maintenanceService.getById(Number.parseInt(id))
        setMaintenance(response.data)
      } catch (err) {
        setError("Ошибка при загрузке данных о техническом обслуживании")
      } finally {
        setLoading(false)
      }
    }

    fetchMaintenance()
  }, [id])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Загрузка данных...</p>
        </div>
      </div>
    )
  }

  if (error || !maintenance) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Ошибка загрузки</h3>
          <p className={styles.errorText}>{error || "Запись о ТО не найдена"}</p>
          <Link to="/" className={styles.backButton}>
            <ArrowLeft size={20} />
            Вернуться к списку
          </Link>
        </div>
      </div>
    )
  }

  const sections = [
    {
      title: "Информация о ТО",
      icon: <Wrench size={24} />,
      items: [
        {
          label: "Вид ТО",
          value: maintenance.maintenance_type_name,
        },
        {
          label: "Дата проведения ТО",
          value: maintenance.maintenance_date
            ? new Date(maintenance.maintenance_date).toLocaleDateString("ru-RU")
            : "—",
        },
        { label: "Наработка, м/час", value: maintenance.operating_hours?.toString() },
      ],
    },
    {
      title: "Документы",
      icon: <FileText size={24} />,
      items: [
        { label: "№ заказ-наряда", value: maintenance.work_order_number },
        {
          label: "Дата заказ-наряда",
          value: maintenance.work_order_date ? new Date(maintenance.work_order_date).toLocaleDateString("ru-RU") : "—",
        },
        { label: "Организация, проводившая ТО", value: maintenance.maintenance_company },
      ],
    },
    {
      title: "Машина",
      icon: <Calendar size={24} />,
      items: [
        { label: "Серийный номер машины", value: maintenance.machine_serial },
        { label: "Модель техники", value: maintenance.machine_model },
      ],
    },
    {
      title: "Сервисная информация",
      icon: <User size={24} />,
      items: [{ label: "Сервисная компания", value: maintenance.service_company_name }],
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <Link to="/" className={styles.backButton}>
            <ArrowLeft size={20} />
            Назад к списку
          </Link>

          <div className={styles.headerContent}>
            <div
              className={styles.headerIcon}
              style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
            >
              <Wrench size={48} />
            </div>
            <div>
              <h1 className={styles.title}>Техническое обслуживание</h1>
              <p className={styles.subtitle}>
                {maintenance.machine_model} • № {maintenance.machine_serial}
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className={styles.sectionsGrid}>
          {sections.map((section, index) => (
            <div key={index} className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>{section.icon}</div>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
              </div>

              <div className={styles.sectionContent}>
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className={styles.specItem}>
                    <div className={styles.specLabel}>{item.label}</div>
                    <div className={styles.specValue}>{item.value || "—"}</div>
                    {item.description && <div className={styles.specDescription}>{item.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MaintenanceDetailPage
