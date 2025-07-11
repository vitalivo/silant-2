"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { complaintsService, directoriesService, machineService } from "../services/api"
import FormModal from "./FormModal"
import styles from "../styles/Modal.module.css"

interface ComplaintFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  complaint?: any
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ isOpen, onClose, onSuccess, complaint }) => {
  const [formData, setFormData] = useState({
    failure_date: "",
    operating_hours: "",
    failure_node: "",
    failure_description: "",
    recovery_method: "",
    spare_parts: "",
    recovery_date: "",
    machine: "",
  })

  const [failureNodes, setFailureNodes] = useState([])
  const [recoveryMethods, setRecoveryMethods] = useState([])
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  useEffect(() => {
    if (complaint) {
      setFormData({
        failure_date: complaint.failure_date || "",
        operating_hours: complaint.operating_hours || "",
        failure_node: complaint.failure_node?.id || "",
        failure_description: complaint.failure_description || "",
        recovery_method: complaint.recovery_method?.id || "",
        spare_parts: complaint.spare_parts || "",
        recovery_date: complaint.recovery_date || "",
        machine: complaint.machine?.id || "",
      })
    }
  }, [complaint])

  const loadData = async () => {
    try {
      const [nodesResponse, methodsResponse, machinesResponse] = await Promise.all([
        directoriesService.failureNodes.getAll(),
        directoriesService.recoveryMethods.getAll(),
        machineService.getAll(),
      ])

      setFailureNodes(nodesResponse.data.results || nodesResponse.data)
      setRecoveryMethods(methodsResponse.data.results || methodsResponse.data)
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

      if (complaint) {
        await complaintsService.update(complaint.id, data)
      } else {
        await complaintsService.create(data)
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
    <FormModal isOpen={isOpen} onClose={onClose} title={complaint ? "Редактировать рекламацию" : "Добавить рекламацию"}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

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
            {failureNodes.map((node: any) => (
              <option key={node.id} value={node.id}>
                {node.name}
              </option>
            ))}
          </select>
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
            {recoveryMethods.map((method: any) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="spare_parts">Используемые запасные части</label>
          <textarea
            id="spare_parts"
            name="spare_parts"
            value={formData.spare_parts}
            onChange={handleChange}
            rows={2}
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="recovery_date">Дата восстановления *</label>
          <input
            type="date"
            id="recovery_date"
            name="recovery_date"
            value={formData.recovery_date}
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

export default ComplaintForm
