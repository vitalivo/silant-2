"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { directoriesService, machineService, type Machine } from "../services/api"
import { usePermissions } from "../hooks/usePermissions"
import FormModal from "./FormModal"
import AccessDenied from "./AccessDenied"
import styles from "../styles/Modal.module.css"

interface MachineFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  machine?: Machine
  user?: any
}

const MachineForm: React.FC<MachineFormProps> = ({ isOpen, onClose, onSuccess, machine, user }) => {
  const [formData, setFormData] = useState({
    serial_number: "",
    technique_model: "",
    engine_model: "",
    engine_serial: "",
    transmission_model: "",
    transmission_serial: "",
    drive_axle_model: "",
    drive_axle_serial: "",
    steer_axle_model: "",
    steer_axle_serial: "",
    supply_contract: "",
    shipment_date: "",
    consignee: "",
    delivery_address: "",
    equipment: "",
    client_name: "",
    service_company_name: "",
  })

  const [directories, setDirectories] = useState({
    techniqueModels: [],
    engineModels: [],
    transmissionModels: [],
    driveAxleModels: [],
    steerAxleModels: [],
    maintenanceTypes: [],
    failureNodes: [],
    recoveryMethods: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [directoriesLoading, setDirectoriesLoading] = useState(false)

  // Получаем права доступа
  const permissions = usePermissions(user)

  // Проверяем права доступа
  const hasPermission = machine ? permissions.canEditMachine : permissions.canCreateMachine

  useEffect(() => {
    if (isOpen) {
      loadDirectories()
    }
  }, [isOpen])

  useEffect(() => {
    if (machine) {
      setFormData({
        serial_number: machine.serial_number || "",
        technique_model: machine.technique_model?.id?.toString() || "",
        engine_model: machine.engine_model?.id?.toString() || "",
        engine_serial: machine.engine_serial || "",
        transmission_model: machine.transmission_model?.id?.toString() || "",
        transmission_serial: machine.transmission_serial || "",
        drive_axle_model: machine.drive_axle_model?.id?.toString() || "",
        drive_axle_serial: machine.drive_axle_serial || "",
        steer_axle_model: machine.steer_axle_model?.id?.toString() || "",
        steer_axle_serial: machine.steer_axle_serial || "",
        supply_contract: machine.supply_contract || "",
        shipment_date: machine.shipment_date || "",
        consignee: machine.consignee || "",
        delivery_address: machine.delivery_address || "",
        equipment: machine.equipment || "",
        client_name: machine.client_name || "",
        service_company_name: machine.service_organization_name || "",
      })
    } else {
      // Сброс формы для создания новой машины
      setFormData({
        serial_number: "",
        technique_model: "",
        engine_model: "",
        engine_serial: "",
        transmission_model: "",
        transmission_serial: "",
        drive_axle_model: "",
        drive_axle_serial: "",
        steer_axle_model: "",
        steer_axle_serial: "",
        supply_contract: "",
        shipment_date: "",
        consignee: "",
        delivery_address: "",
        equipment: "",
        client_name: "",
        service_company_name: "",
      })
    }
  }, [machine])

  const loadDirectories = async () => {
    setDirectoriesLoading(true)
    try {
      console.log("🔍 Загружаем справочники...")
      const response = await directoriesService.getAllDirectories()
      console.log("🔍 Ответ справочников:", response)

      // Проверяем структуру ответа и адаптируем имена полей
      const data = response.data || response
      console.log("🔍 Данные справочников:", data)

      // Адаптируем структуру данных - извлекаем results из пагинированных ответов
      setDirectories({
        techniqueModels: Array.isArray(data.techniqueModels?.results)
          ? data.techniqueModels.results
          : Array.isArray(data.techniqueModels)
            ? data.techniqueModels
            : [],
        engineModels: Array.isArray(data.engineModels?.results)
          ? data.engineModels.results
          : Array.isArray(data.engineModels)
            ? data.engineModels
            : [],
        transmissionModels: Array.isArray(data.transmissionModels?.results)
          ? data.transmissionModels.results
          : Array.isArray(data.transmissionModels)
            ? data.transmissionModels
            : [],
        driveAxleModels: Array.isArray(data.driveAxleModels?.results)
          ? data.driveAxleModels.results
          : Array.isArray(data.driveAxleModels)
            ? data.driveAxleModels
            : [],
        steerAxleModels: Array.isArray(data.steerAxleModels?.results)
          ? data.steerAxleModels.results
          : Array.isArray(data.steerAxleModels)
            ? data.steerAxleModels
            : [],
        maintenanceTypes: Array.isArray(data.maintenanceTypes?.results)
          ? data.maintenanceTypes.results
          : Array.isArray(data.maintenanceTypes)
            ? data.maintenanceTypes
            : [],
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
      })

      // Очищаем ошибку если загрузка прошла успешно
      if (error && error.includes("справочников")) {
        setError(null)
      }
    } catch (err: any) {
      console.error("Ошибка загрузки справочников:", err)

      let errorMessage = "Ошибка загрузки справочников. Некоторые поля могут быть недоступны."
      if (err.response?.status === 403) {
        errorMessage = "Нет доступа к справочникам. Обратитесь к администратору."
      } else if (err.response?.status === 500) {
        errorMessage = "Ошибка сервера при загрузке справочников. Попробуйте позже."
      }

      setError(errorMessage)

      // Устанавливаем пустые массивы, чтобы форма не падала
      setDirectories({
        techniqueModels: [],
        engineModels: [],
        transmissionModels: [],
        driveAxleModels: [],
        steerAxleModels: [],
        maintenanceTypes: [],
        failureNodes: [],
        recoveryMethods: [],
      })
    } finally {
      setDirectoriesLoading(false)
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
      console.log("🔍 Отправляем данные формы:", formData)

      // Преобразуем данные для API
      const submitData = {
        serial_number: formData.serial_number,
        technique_model: formData.technique_model ? Number.parseInt(formData.technique_model) : null,
        engine_model: formData.engine_model ? Number.parseInt(formData.engine_model) : null,
        engine_serial: formData.engine_serial,
        transmission_model: formData.transmission_model ? Number.parseInt(formData.transmission_model) : null,
        transmission_serial: formData.transmission_serial,
        drive_axle_model: formData.drive_axle_model ? Number.parseInt(formData.drive_axle_model) : null,
        drive_axle_serial: formData.drive_axle_serial,
        steer_axle_model: formData.steer_axle_model ? Number.parseInt(formData.steer_axle_model) : null,
        steer_axle_serial: formData.steer_axle_serial,
        supply_contract: formData.supply_contract,
        shipment_date: formData.shipment_date,
        consignee: formData.consignee,
        delivery_address: formData.delivery_address,
        equipment: formData.equipment,
        client_name: formData.client_name,
        service_organization_name: formData.service_company_name, // Исправляем название поля
      }

      console.log("🔍 Преобразованные данные для API:", submitData)

      if (machine) {
        await machineService.update(machine.id, submitData)
      } else {
        await machineService.create(submitData)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error("Ошибка сохранения:", err)

      // Улучшенная обработка ошибок
      let errorMessage = "Ошибка сохранения"

      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error
        } else {
          // Показываем первую ошибку валидации
          const firstError = Object.values(err.response.data)[0]
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0]
          } else if (typeof firstError === "string") {
            errorMessage = firstError
          }
        }
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
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
          title={machine ? "Нет прав на редактирование" : "Нет прав на создание"}
          message={machine ? "У вас нет прав для редактирования машин" : "У вас нет прав для создания новых машин"}
          suggestion="Только менеджеры могут создавать и редактировать машины"
        />
      </FormModal>
    )
  }

  return (
    <FormModal isOpen={isOpen} onClose={onClose} title={machine ? "Редактировать машину" : "Добавить машину"}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && !error.includes("справочников") && <div className={styles.error}>{error}</div>}

        {error && error.includes("справочников") && (
          <div
            style={{
              padding: "10px",
              backgroundColor: "#fef2f2",
              borderRadius: "4px",
              marginBottom: "16px",
              border: "1px solid #fecaca",
            }}
          >
            <div style={{ color: "#dc2626", marginBottom: "8px" }}>❌ {error}</div>
            <button
              type="button"
              onClick={loadDirectories}
              disabled={directoriesLoading}
              style={{
                padding: "6px 12px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              {directoriesLoading ? "⏳ Загрузка..." : "🔄 Повторить загрузку"}
            </button>
          </div>
        )}

        {directoriesLoading && (
          <div style={{ padding: "10px", backgroundColor: "#fef3c7", borderRadius: "4px", marginBottom: "16px" }}>
            ⏳ Загрузка справочников...
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="serial_number">Серийный номер машины *</label>
          <input
            type="text"
            id="serial_number"
            name="serial_number"
            value={formData.serial_number}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="technique_model">Модель техники *</label>
            <select
              id="technique_model"
              name="technique_model"
              value={formData.technique_model}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Выберите модель техники</option>
              {directories.techniqueModels.map((model: any) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="shipment_date">Дата отгрузки с завода *</label>
            <input
              type="date"
              id="shipment_date"
              name="shipment_date"
              value={formData.shipment_date}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="engine_model">Модель двигателя *</label>
            <select
              id="engine_model"
              name="engine_model"
              value={formData.engine_model}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Выберите модель двигателя</option>
              {directories.engineModels.map((model: any) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="engine_serial">Серийный номер двигателя *</label>
            <input
              type="text"
              id="engine_serial"
              name="engine_serial"
              value={formData.engine_serial}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="transmission_model">Модель трансмиссии *</label>
            <select
              id="transmission_model"
              name="transmission_model"
              value={formData.transmission_model}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Выберите модель трансмиссии</option>
              {directories.transmissionModels.map((model: any) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="transmission_serial">Серийный номер трансмиссии *</label>
            <input
              type="text"
              id="transmission_serial"
              name="transmission_serial"
              value={formData.transmission_serial}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="drive_axle_model">Модель ведущего моста *</label>
            <select
              id="drive_axle_model"
              name="drive_axle_model"
              value={formData.drive_axle_model}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Выберите модель ведущего моста</option>
              {directories.driveAxleModels.map((model: any) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="drive_axle_serial">Серийный номер ведущего моста *</label>
            <input
              type="text"
              id="drive_axle_serial"
              name="drive_axle_serial"
              value={formData.drive_axle_serial}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="steer_axle_model">Модель управляемого моста *</label>
            <select
              id="steer_axle_model"
              name="steer_axle_model"
              value={formData.steer_axle_model}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Выберите модель управляемого моста</option>
              {directories.steerAxleModels.map((model: any) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="steer_axle_serial">Серийный номер управляемого моста *</label>
            <input
              type="text"
              id="steer_axle_serial"
              name="steer_axle_serial"
              value={formData.steer_axle_serial}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="supply_contract">Договор поставки №</label>
          <input
            type="text"
            id="supply_contract"
            name="supply_contract"
            value={formData.supply_contract}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="consignee">Грузополучатель</label>
          <input
            type="text"
            id="consignee"
            name="consignee"
            value={formData.consignee}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="delivery_address">Адрес поставки</label>
          <textarea
            id="delivery_address"
            name="delivery_address"
            value={formData.delivery_address}
            onChange={handleChange}
            rows={2}
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="equipment">Комплектация (доп. опции)</label>
          <textarea
            id="equipment"
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            rows={2}
            className={styles.textarea}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="client_name">Клиент</label>
            <input
              type="text"
              id="client_name"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="service_company_name">Сервисная компания</label>
            <input
              type="text"
              id="service_company_name"
              name="service_company_name"
              value={formData.service_company_name}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
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

export default MachineForm
