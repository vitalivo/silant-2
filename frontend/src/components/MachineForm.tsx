"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  machineService,
  directoriesService,
  type Machine,
  type MachineFormData,
  type DirectoriesData,
} from "../services/api"
import FormModal from "./FormModal"
import styles from "../styles/Modal.module.css"

interface MachineFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  machine?: Machine
}

const MachineForm: React.FC<MachineFormProps> = ({ isOpen, onClose, onSuccess, machine }) => {
  const [formData, setFormData] = useState<MachineFormData>({
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

  const [directories, setDirectories] = useState<DirectoriesData>({
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

  useEffect(() => {
    if (isOpen) {
      loadDirectories()
    }
  }, [isOpen])

  useEffect(() => {
    if (machine) {
      setFormData({
        serial_number: machine.serial_number || "",
        technique_model: machine.technique_model?.id || "",
        engine_model: machine.engine_model?.id || "",
        engine_serial: machine.engine_serial || "",
        transmission_model: machine.transmission_model?.id || "",
        transmission_serial: machine.transmission_serial || "",
        drive_axle_model: machine.drive_axle_model?.id || "",
        drive_axle_serial: machine.drive_axle_serial || "",
        steer_axle_model: machine.steer_axle_model?.id || "",
        steer_axle_serial: machine.steer_axle_serial || "",
        supply_contract: machine.supply_contract || "",
        shipment_date: machine.shipment_date || "",
        consignee: machine.consignee || "",
        delivery_address: machine.delivery_address || "",
        equipment: machine.equipment || "",
        client_name: machine.client_name || "",
        service_company_name: machine.service_company_name || "",
      })
    }
  }, [machine])

  const loadDirectories = async () => {
    try {
      const response = await directoriesService.getAllDirectories()
      setDirectories(response.data)
    } catch (err) {
      console.error("Ошибка загрузки справочников:", err)
      setError("Ошибка загрузки справочников")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (machine) {
        await machineService.update(machine.id, formData)
      } else {
        await machineService.create(formData)
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

  return (
    <FormModal isOpen={isOpen} onClose={onClose} title={machine ? "Редактировать машину" : "Добавить машину"}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

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
              {directories.techniqueModels?.map((model) => (
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
              {directories.engineModels?.map((model) => (
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
              {directories.transmissionModels?.map((model) => (
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
              {directories.driveAxleModels?.map((model) => (
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
              {directories.steerAxleModels?.map((model) => (
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
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </FormModal>
  )
}

export default MachineForm
