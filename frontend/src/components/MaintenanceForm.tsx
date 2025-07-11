"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { maintenanceService, directoriesService, machineService } from "../services/api"
import FormModal from "./FormModal"
import styles from "../styles/Modal.module.css"

interface MaintenanceFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  maintenance?: any
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ isOpen, onClose, onSuccess, maintenance }) => {
  const [formData, setFormData] = useState({
    maintenance_type: "",
    maintenance_date: "",
    operating_hours: "",
    work_order_number: "",
    work_order_date: "",
    maintenance_company: "",
    machine: "",
  })

  const [maintenanceTypes, setMaintenanceTypes] = useState([])
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  useEffect(() => {
    if (maintenance) {
      setFormData({
        maintenance_type: maintenance.maintenance_type?.id || "",
        maintenance_date: maintenance.maintenance_date || "",
        operating_hours: maintenance.operating_hours || "",
        work_order_number: maintenance.work_order_number || "",
        work_order_date: maintenance.work_order_date || "",
        maintenance_company: maintenance.maintenance_company || "",
        machine: maintenance.machine?.id || "",
      })
    }
  }, [maintenance])

  const loadData = async () => {
    try {
      const [typesResponse, machinesResponse] = await Promise.all([
        directoriesService.maintenanceTypes.getAll(),
        machineService.getAll(),
      ])

      setMaintenanceTypes(typesResponse.data.results || typesResponse.data)
      setMachines(machinesResponse.data.results || machinesResponse.data)
    } catch (err) {
      console.error("Ошибка загрузки данных:", err)
      setError("Ошибка загрузки данных")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = {
        ...formData,
        operating_hours: Number.parseInt(formData.operating_hours) || 0,
      }

      if (maintenance) {
        await maintenanceService.update(maintenance.id, data)
      } else {
        await maintenanceService.create(data)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error("Ошибка сохранения:", err)
      setError(err.response?.data?.detail || "Ошибка сохранения")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <FormModal isOpen={isOpen} onClose={onClose} title={maintenance ? "Редактировать ТО" : "Добавить ТО"}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="maintenance_type">Вид ТО *</label>
          <select
            id="maintenance_type"
            name="maintenance_type"
            value={formData.maintenance_type}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">Выберите вид ТО</option>
            {maintenanceTypes.map((type: any) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="machine">Машина *</label>
          <select
            id="machine"
            name="machine"
            value={formData.machine}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">Выберите машину</option>
            {machines.map((machine: any) => (
              <option key={machine.id} value={machine.id}>
                {machine.serial_number} - {machine.technique_model?.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="maintenance_date">Дата проведения ТО *</label>
            <input
              type="date"
              id="maintenance_date"
              name="maintenance_date"
              value={formData.maintenance_date}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="operating_hours">Наработка, м/час *</label>
            <input
              type="number"
              id="operating_hours"
              name="operating_hours"
              value={formData.operating_hours}
              onChange={handleChange}
              required
              min="0"
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="work_order_number">№ заказ-наряда *</label>
            <input
              type="text"
              id="work_order_number"
              name="work_order_number"
              value={formData.work_order_number}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="work_order_date">Дата заказ-наряда *</label>
            <input
              type="date"
              id="work_order_date"
              name="work_order_date"
              value={formData.work_order_date}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="maintenance_company">Организация, проводившая ТО *</label>
          <input
            type="text"
            id="maintenance_company"
            name="maintenance_company"
            value={formData.maintenance_company}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            Отмена
          </button>
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </FormModal>
  )
}

export default MaintenanceForm
