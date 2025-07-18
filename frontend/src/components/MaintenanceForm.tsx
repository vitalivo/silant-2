"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { directoriesService, maintenanceService, machineService, type Maintenance } from "../services/api"
import { usePermissions } from "../hooks/usePermissions"
import FormModal from "./FormModal"
import AccessDenied from "./AccessDenied"
import styles from "../styles/Modal.module.css"

interface MaintenanceFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  maintenance?: Maintenance
  user?: any
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ isOpen, onClose, onSuccess, maintenance, user }) => {
  const [formData, setFormData] = useState({
    machine: "",
    maintenance_type: "",
    maintenance_date: "",
    operating_hours: "",
    work_order: "",
    work_order_date: "",
    work_order_number: "",
    maintenance_company: "",
    service_company: "",
  })

  const [directories, setDirectories] = useState({
    maintenanceTypes: [],
    serviceCompanies: [],
  })
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [directoriesLoading, setDirectoriesLoading] = useState(false)

  // Получаем права доступа
  const permissions = usePermissions(user)

  // Проверяем права доступа
  const hasPermission = maintenance ? permissions.canEditMaintenance : permissions.canCreateMaintenance

  useEffect(() => {
    if (isOpen) {
      loadDirectories()
      loadMachines()
    }
  }, [isOpen])

  useEffect(() => {
    if (maintenance) {
      setFormData({
        machine: maintenance.machine?.toString() || "",
        maintenance_type: maintenance.maintenance_type?.id?.toString() || "",
        maintenance_date: maintenance.maintenance_date || "",
        operating_hours: maintenance.operating_hours?.toString() || "",
        work_order: maintenance.work_order || "",
        work_order_date: maintenance.work_order_date || "",
        work_order_number: maintenance.work_order_number || "",
        maintenance_company: maintenance.maintenance_company || "",
        service_company: maintenance.service_company?.id?.toString() || "",
      })
    } else {
      // Сброс формы для создания нового ТО
      setFormData({
        machine: "",
        maintenance_type: "",
        maintenance_date: "",
        operating_hours: "",
        work_order: "",
        work_order_date: "",
        work_order_number: "",
        maintenance_company: "",
        service_company: "",
      })
    }
  }, [maintenance])

  const loadDirectories = async () => {
    setDirectoriesLoading(true)
    try {
      const response = await directoriesService.getAllDirectories()
      const data = response.data || response

      const maintenanceTypes = Array.isArray(data.maintenanceTypes?.results)
        ? data.maintenanceTypes.results
        : Array.isArray(data.maintenanceTypes)
          ? data.maintenanceTypes
          : []

      const serviceCompanies = Array.isArray(data.serviceCompanies?.results)
        ? data.serviceCompanies.results
        : Array.isArray(data.serviceCompanies)
          ? data.serviceCompanies
          : []

      setDirectories({
        maintenanceTypes,
        serviceCompanies,
      })

      // Извлекаем сервисные компании из данных ТО
      await extractServiceCompanies()
    } catch (err) {
      console.error("Ошибка загрузки справочников:", err)
      setError("Ошибка загрузки справочников. Некоторые поля могут быть недоступны.")
      setDirectories({
        maintenanceTypes: [],
        serviceCompanies: [],
      })
    } finally {
      setDirectoriesLoading(false)
    }
  }

  const loadMachines = async () => {
    try {
      const response = await machineService.getAll()
      const data = response.data
      const machinesArray = Array.isArray(data) ? data : data.results || []
      setMachines(machinesArray)
    } catch (err) {
      console.error("Ошибка загрузки машин:", err)
      setMachines([])
    }
  }

  // Функция для извлечения сервисных компаний из данных ТО
  const extractServiceCompanies = async () => {
    try {
      const response = await maintenanceService.getAll()
      const maintenanceData = response.data
      const maintenanceRecords = Array.isArray(maintenanceData) ? maintenanceData : maintenanceData.results || []

      // Извлекаем уникальные сервисные компании из записей ТО
      const uniqueCompanies = new Map()
      let idCounter = 1
      maintenanceRecords.forEach((maintenance) => {
        if (maintenance.service_company_name && !uniqueCompanies.has(maintenance.service_company_name)) {
          uniqueCompanies.set(maintenance.service_company_name, {
            id: idCounter++, // Используем счетчик для уникальных ID
            name: maintenance.service_company_name,
          })
        }
      })

      const serviceCompanies = Array.from(uniqueCompanies.values())

      // Обновляем справочники с извлеченными сервисными компаниями
      setDirectories((prev) => ({
        ...prev,
        serviceCompanies: serviceCompanies,
      }))

      return serviceCompanies
    } catch (err) {
      console.error("❌ Ошибка при извлечении сервисных компаний из ТО:", err)
      return []
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!hasPermission) {
      setError("У вас нет прав для выполнения этого действия")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Преобразуем данные для отправки
      const submitData = {
        ...formData,
        machine: Number.parseInt(formData.machine),
        maintenance_type: Number.parseInt(formData.maintenance_type),
        operating_hours: formData.operating_hours ? Number.parseInt(formData.operating_hours) : null,
        service_company: formData.service_company ? Number.parseInt(formData.service_company) : null,
      }

      if (maintenance) {
        await maintenanceService.update(maintenance.id, submitData)
      } else {
        await maintenanceService.create(submitData)
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error("Ошибка сохранения:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Ошибка сохранения")
      }
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

  // Если нет прав доступа, показываем сообщение об ошибке
  if (!hasPermission) {
    return (
      <FormModal isOpen={isOpen} onClose={onClose} title="Нет доступа">
        <AccessDenied
          title={maintenance ? "Нет прав на редактирование" : "Нет прав на создание"}
          message={
            maintenance
              ? "У вас нет прав для редактирования записей ТО"
              : "У вас нет прав для создания новых записей ТО"
          }
          suggestion="Клиенты и сервисные организации могут создавать записи ТО"
        />
      </FormModal>
    )
  }

  return (
    <FormModal isOpen={isOpen} onClose={onClose} title={maintenance ? "Редактировать ТО" : "Добавить ТО"}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        {directoriesLoading && (
          <div style={{ padding: "10px", backgroundColor: "#fef3c7", borderRadius: "4px", marginBottom: "16px" }}>
            ⏳ Загрузка справочников...
          </div>
        )}

        <div className={styles.formRow}>
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
              {machines.map((machine) => (
                <option key={machine.id} value={machine.id}>
                  {machine.serial_number} ({machine.technique_model_name || "Модель не указана"})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="maintenance_type">Тип ТО *</label>
            <select
              id="maintenance_type"
              name="maintenance_type"
              value={formData.maintenance_type}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Выберите тип ТО</option>
              {directories.maintenanceTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
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
            <label htmlFor="operating_hours">Наработка, м/час</label>
            <input
              type="number"
              id="operating_hours"
              name="operating_hours"
              value={formData.operating_hours}
              onChange={handleChange}
              className={styles.input}
              min="0"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="work_order">№ заказ-наряда</label>
            <input
              type="text"
              id="work_order"
              name="work_order"
              value={formData.work_order}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="work_order_date">Дата заказ-наряда</label>
            <input
              type="date"
              id="work_order_date"
              name="work_order_date"
              value={formData.work_order_date}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="work_order_number">Номер заказ-наряда</label>
          <input
            type="text"
            id="work_order_number"
            name="work_order_number"
            value={formData.work_order_number}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="maintenance_company">Организация, проводившая ТО</label>
          <input
            type="text"
            id="maintenance_company"
            name="maintenance_company"
            value={formData.maintenance_company}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="service_company">Сервисная компания</label>
          <select
            id="service_company"
            name="service_company"
            value={formData.service_company}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Выберите сервисную компанию</option>
            {directories.serviceCompanies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            Отмена
          </button>
          <button type="submit" disabled={loading || directoriesLoading} className={styles.submitButton}>
            {loading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </FormModal>
  )
}

export default MaintenanceForm
