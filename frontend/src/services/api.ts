import axios from "axios"

const API_BASE_URL = "http://localhost:8000/api"

// Создаем экземпляр axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Интерфейсы для типизации
export interface Machine {
  id: number
  serial_number: string
  technique_model: { id: number; name: string; description?: string }
  engine_model: { id: number; name: string; description?: string }
  engine_serial: string
  transmission_model: { id: number; name: string; description?: string }
  transmission_serial: string
  drive_axle_model: { id: number; name: string; description?: string }
  drive_axle_serial: string
  steer_axle_model: { id: number; name: string; description?: string }
  steer_axle_serial: string
  supply_contract?: string
  shipment_date: string
  consignee?: string
  delivery_address?: string
  equipment?: string
  client_name?: string
  service_company_name?: string
}

export interface Maintenance {
  id: number
  maintenance_type: { id: number; name: string; description?: string }
  maintenance_date: string
  operating_hours: number
  work_order_number: string
  work_order_date: string
  maintenance_company: string
  machine_serial: string
  service_company_name: string
  machine: {
    id: number
    serial_number: string
    technique_model: { name: string }
  }
}

export interface Complaint {
  id: number
  failure_date: string
  operating_hours: number
  failure_node: { id: number; name: string; description?: string }
  failure_description: string
  recovery_method: { id: number; name: string; description?: string }
  spare_parts: string
  recovery_date: string
  downtime: number
  machine_serial: string
  service_company_name: string
  machine: {
    id: number
    serial_number: string
    technique_model: { name: string }
  }
}

// Сервисы для работы с API
export const machineService = {
  getAll: () => apiClient.get("/machines/"),
  getById: (id: number) => apiClient.get(`/machines/${id}/`),
  searchBySerial: (serial: string) => apiClient.get(`/machines/search_by_serial/?serial=${encodeURIComponent(serial)}`),
}

export const maintenanceService = {
  getAll: () => apiClient.get("/maintenance/"),
  getById: (id: number) => apiClient.get(`/maintenance/${id}/`),
}

export const complaintsService = {
  getAll: () => apiClient.get("/complaints/"),
  getById: (id: number) => apiClient.get(`/complaints/${id}/`),
}

// Общий API сервис
export const apiService = {
  get: (url: string) => apiClient.get(url),
  post: (url: string, data: any) => apiClient.post(url, data),
  put: (url: string, data: any) => apiClient.put(url, data),
  delete: (url: string) => apiClient.delete(url),
}

export default apiClient
