"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Truck, Settings, Calendar, User, Package } from "lucide-react"
import { machineService, type Machine } from "../services/api"
import styles from "../styles/DetailPage.module.css"
import { usePageTitle } from "../hooks/usePageTitle"

const MachineDetailPage: React.FC = () => {
  usePageTitle("Машины")
  const { id } = useParams<{ id: string }>()
  const [machine, setMachine] = useState<Machine | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMachine = async () => {
      if (!id) return

      setLoading(true)
      setError(null)
      try {
        const response = await machineService.getById(Number.parseInt(id))
        setMachine(response.data)
      } catch (err) {
        setError("Ошибка при загрузке данных о машине")
      } finally {
        setLoading(false)
      }
    }

    fetchMachine()
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

  if (error || !machine) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Ошибка загрузки</h3>
          <p className={styles.errorText}>{error || "Машина не найдена"}</p>
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
      title: "Основная информация",
      icon: <Truck size={24} />,
      items: [
        { label: "Серийный номер машины", value: machine.serial_number },
        {
          label: "Модель техники",
          value: machine.technique_model_name,
        },
        {
          label: "Дата отгрузки с завода",
          value: machine.shipment_date ? new Date(machine.shipment_date).toLocaleDateString("ru-RU") : "—",
        },
      ],
    },
    {
      title: "Двигатель",
      icon: <Settings size={24} />,
      items: [
        {
          label: "Модель двигателя",
          value: machine.engine_model_name,
        },
        { label: "Серийный номер двигателя", value: machine.engine_serial },
      ],
    },
    {
      title: "Трансмиссия",
      icon: <Settings size={24} />,
      items: [
        {
          label: "Модель трансмиссии",
          value: machine.transmission_model_name,
        },
        { label: "Серийный номер трансмиссии", value: machine.transmission_serial },
      ],
    },
    {
      title: "Мосты",
      icon: <Package size={24} />,
      items: [
        {
          label: "Модель ведущего моста",
          value: machine.drive_axle_model_name,
        },
        { label: "Серийный номер ведущего моста", value: machine.drive_axle_serial },
        {
          label: "Модель управляемого моста",
          value: machine.steer_axle_model_name,
        },
        { label: "Серийный номер управляемого моста", value: machine.steer_axle_serial },
      ],
    },
    {
      title: "Договор поставки",
      icon: <Calendar size={24} />,
      items: [
        { label: "Договор поставки №", value: machine.supply_contract },
        { label: "Грузополучатель", value: machine.consignee },
        { label: "Адрес поставки", value: machine.delivery_address },
        { label: "Комплектация", value: machine.equipment },
      ],
    },
    {
      title: "Клиент и сервис",
      icon: <User size={24} />,
      items: [
        { label: "Клиент", value: machine.client_name },
        { label: "Сервисная компания", value: machine.service_organization_name },
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
            <div className={styles.headerIcon}>
              <Truck size={48} />
            </div>
            <div>
              <h1 className={styles.title}>Машина СИЛАНТ</h1>
              <p className={styles.subtitle}>
                {machine.technique_model_name} • № {machine.serial_number}
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

export default MachineDetailPage
