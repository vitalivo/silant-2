"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, AlertTriangle, Settings, Clock, FileText } from "lucide-react"
import { complaintService, type Complaint } from "../services/api"
import styles from "../styles/DetailPage.module.css"

const ComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchComplaint = async () => {
      if (!id) return

      setLoading(true)
      setError(null)
      try {
        const response = await complaintService.getById(Number.parseInt(id))
        setComplaint(response.data)
      } catch (err) {
        setError("Ошибка при загрузке данных о рекламации")
      } finally {
        setLoading(false)
      }
    }

    fetchComplaint()
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

  if (error || !complaint) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Ошибка загрузки</h3>
          <p className={styles.errorText}>{error || "Рекламация не найдена"}</p>
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
      title: "Информация об отказе",
      icon: <AlertTriangle size={24} />,
      items: [
        {
          label: "Дата отказа",
          value: complaint.failure_date ? new Date(complaint.failure_date).toLocaleDateString("ru-RU") : "—",
        },
        { label: "Наработка, м/час", value: complaint.operating_hours?.toString() },
        {
          label: "Узел отказа",
          value: complaint.failure_node_name,
        },
        { label: "Описание отказа", value: complaint.failure_description },
      ],
    },
    {
      title: "Восстановление",
      icon: <Settings size={24} />,
      items: [
        {
          label: "Способ восстановления",
          value: complaint.recovery_method_name,
        },
        { label: "Используемые запасные части", value: complaint.spare_parts },
        {
          label: "Дата восстановления",
          value: complaint.recovery_date ? new Date(complaint.recovery_date).toLocaleDateString("ru-RU") : "—",
        },
      ],
    },
    {
      title: "Время простоя",
      icon: <Clock size={24} />,
      items: [
        {
          label: "Время простоя техники",
          value: complaint.downtime ? `${complaint.downtime} дней` : "—",
        },
      ],
    },
    {
      title: "Информация о машине",
      icon: <FileText size={24} />,
      items: [
        { label: "Серийный номер машины", value: complaint.machine_serial || "—" },
        { label: "Модель техники", value: complaint.machine_model || "—" },
        { label: "Сервисная компания", value: complaint.service_company_name },
      ],
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
              style={{ background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" }}
            >
              <AlertTriangle size={48} />
            </div>
            <div>
              <h1 className={styles.title}>Рекламация</h1>
              <p className={styles.subtitle}>
                {complaint.failure_node_name} • № {complaint.machine_serial}
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

export default ComplaintDetailPage
