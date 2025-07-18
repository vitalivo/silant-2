"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { directoriesService, complaintService, machineService, type Complaint } from "../services/api"
import { usePermissions } from "../hooks/usePermissions"
import FormModal from "./FormModal"
import AccessDenied from "./AccessDenied"
import styles from "../styles/Modal.module.css"

interface ComplaintFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  complaint?: Complaint
  user?: any
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ isOpen, onClose, onSuccess, complaint, user }) => {
  const [formData, setFormData] = useState({
    machine: "",
    failure_date: "",
    operating_hours: "",
    failure_node: "",
    failure_description: "",
    recovery_method: "",
    used_parts: "",
    spare_parts: "",
    recovery_date: "",
    downtime: "",
    service_company: "",
  })

  const [directories, setDirectories] = useState({
    failureNodes: [],
    recoveryMethods: [],
    serviceCompanies: [],
  })
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [directoriesLoading, setDirectoriesLoading] = useState(false)

  // Получаем права доступа
  const permissions = usePermissions(user)

  // Проверяем права доступа
  const hasPermission = complaint ? permissions.canEditComplaint : permissions.canCreateComplaint

  useEffect(() => {
    if (isOpen) {
      loadDirectories()
      loadMachines()
    }
  }, [isOpen])

  useEffect(() => {
    if (complaint) {
      setFormData({
        machine: complaint.machine?.toString() || "",
        failure_date: complaint.failure_date || "",
        operating_hours: complaint.operating_hours?.toString() || "",
        failure_node: complaint.failure_node?.id?.toString() || "",
        failure_description: complaint.failure_description || "",
        recovery_method: complaint.recovery_method?.id?.toString() || "",
        used_parts: complaint.used_parts || "",
        spare_parts: complaint.spare_parts || "",
        recovery_date: complaint.recovery_date || "",
        downtime: complaint.downtime?.toString() || "",
        service_company: complaint.service_company?.id?.toString() || "",
      })
    } else {
      // Сброс формы для создания новой рекламации
      setFormData({
        machine: "",
        failure_date: "",
        operating_hours: "",
        failure_node: "",
        failure_description: "",
        recovery_method: "",
        used_parts: "",
        spare_parts: "",
        recovery_date: "",
        downtime: "",
        service_company: "",
      })
    }
  }, [complaint])

  const loadDirectories = async () => {
    setDirectoriesLoading(true)
    try {
      const response = await directoriesService.getAllDirectories()
      const data = response.data || response

      setDirectories({
        failureNodes: Array.isArray(data.failureNodes?.results)
          ? data.failureNodes.results
          : Array.isArray(data.failureNodes)
            ? data.failureNodes
            : [],
        recoveryMethods: Array.isArray(data.recoveryMethods?.results)
          ? data.recoveryMethods.results
          : Array.isArray(data.recoveryMethods)
            ? data.recoveryMethods
            : [],
        serviceCompanies: Array.isArray(data.serviceCompanies?.results)
          ? data.serviceCompanies.results
          : Array.isArray(data.serviceCompanies)
            ? data.serviceCompanies
            : [],
      })

      // Извлекаем сервисные компании из рекламаций
      await extractServiceCompanies()
    } catch (err) {
      console.error("Ошибка загрузки справочников:", err)
      setError("Ошибка загрузки справочников. Некоторые поля могут быть недоступны.")
      setDirectories({
        failureNodes: [],
        recoveryMethods: [],
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

  // Добавьте следующую функцию для извлечения сервисных компаний из рекламаций
  // после функции loadMachines()
  const extractServiceCompanies = async () => {
    try {
      const response = await complaintService.getAll()
      const complaintsData = response.data
      const complaints = Array.isArray(complaintsData) ? complaintsData : complaintsData.results || []

      // Извлекаем уникальные сервисные компании из рекламаций
      const uniqueCompanies = new Map()
      let idCounter = 1
      complaints.forEach((complaint) => {
        if (complaint.service_company_name && !uniqueCompanies.has(complaint.service_company_name)) {
          uniqueCompanies.set(complaint.service_company_name, {
            id: idCounter++, // Используем счетчик для уникальных ID
            name: complaint.service_company_name,
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
      console.error("❌ Ошибка при извлечении сервисных компаний:", err)
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
        operating_hours: formData.operating_hours ? Number.parseInt(formData.operating_hours) : null,
        failure_node: Number.parseInt(formData.failure_node),
        recovery_method: Number.parseInt(formData.recovery_method),
        downtime: formData.downtime ? Number.parseInt(formData.downtime) : null,
        service_company: formData.service_company ? Number.parseInt(formData.service_company) : null,
      }

      if (complaint) {
        await complaintService.update(complaint.id, submitData)
      } else {
        await complaintService.create(submitData)
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
          title={complaint ? "Нет прав на редактирование" : "Нет прав на создание"}
          message={
            complaint ? "У вас нет прав для редактирования рекламаций" : "У вас нет прав для создания новых рекламаций"
          }
          suggestion="Только сервисные организации и менеджеры могут создавать рекламации"
        />
      </FormModal>
    )
  }

  return (
    <FormModal isOpen={isOpen} onClose={onClose} title={complaint ? "Редактировать рекламацию" : "Добавить рекламацию"}>
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
            <label htmlFor="failure_date">Дата отказа *</label>
            <input
              type="date"
              id="failure_date"
              name="failure_date"
              value={formData.failure_date}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
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

          <div className={styles.formGroup}>
            <label htmlFor="failure_node">Узел отказа *</label>
            <select
              id="failure_node"
              name="failure_node"
              value={formData.failure_node}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Выберите узел отказа</option>
              {directories.failureNodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="failure_description">Описание отказа *</label>
          <textarea
            id="failure_description"
            name="failure_description"
            value={formData.failure_description}
            onChange={handleChange}
            required
            rows={3}
            className={styles.textarea}
            placeholder="Подробное описание характера отказа..."
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="recovery_method">Способ восстановления *</label>
          <select
            id="recovery_method"
            name="recovery_method"
            value={formData.recovery_method}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">Выберите способ восстановления</option>
            {directories.recoveryMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="used_parts">Используемые запасные части</label>
          <textarea
            id="used_parts"
            name="used_parts"
            value={formData.used_parts}
            onChange={handleChange}
            rows={2}
            className={styles.textarea}
            placeholder="Перечень использованных запасных частей..."
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="spare_parts">Запасные части</label>
          <textarea
            id="spare_parts"
            name="spare_parts"
            value={formData.spare_parts}
            onChange={handleChange}
            rows={2}
            className={styles.textarea}
            placeholder="Дополнительная информация о запасных частях..."
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="recovery_date">Дата восстановления</label>
            <input
              type="date"
              id="recovery_date"
              name="recovery_date"
              value={formData.recovery_date}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="downtime">Время простоя, дни</label>
            <input
              type="number"
              id="downtime"
              name="downtime"
              value={formData.downtime}
              onChange={handleChange}
              className={styles.input}
              min="0"
            />
          </div>
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

export default ComplaintForm
