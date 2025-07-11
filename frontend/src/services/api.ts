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
  client?: number
  client_name?: string
  service_company?: { id: number; name: string }
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
  machine: { id: number; serial_number: string; technique_model: { name: string } }
  machine_serial: string
  service_company: { id: number; name: string }
  service_company_name: string
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
  machine: { id: number; serial_number: string; technique_model: { name: string } }
  machine_serial: string
  service_company: { id: number; name: string }
  service_company_name: string
}

// Интерфейсы для справочников
export interface Directory {
  id: number
  name: string
  description?: string
}

// Сервисы для работы с API
export const machineService = {
  getAll: () => apiClient.get("/machines/"),
  getById: (id: number) => apiClient.get(`/machines/${id}/`),
  create: (data: Partial<Machine>) => apiClient.post("/machines/", data),
  update: (id: number, data: Partial<Machine>) => apiClient.put(`/machines/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/machines/${id}/`),
  searchBySerial: (serial: string) => apiClient.get(`/machines/search_by_serial/?serial=${encodeURIComponent(serial)}`),
}

export const maintenanceService = {
  getAll: () => apiClient.get("/maintenance/"),
  getById: (id: number) => apiClient.get(`/maintenance/${id}/`),
  create: (data: Partial<Maintenance>) => apiClient.post("/maintenance/", data),
  update: (id: number, data: Partial<Maintenance>) => apiClient.put(`/maintenance/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/maintenance/${id}/`),
}

export const complaintsService = {
  getAll: () => apiClient.get("/complaints/"),
  getById: (id: number) => apiClient.get(`/complaints/${id}/`),
  create: (data: Partial<Complaint>) => apiClient.post("/complaints/", data),
  update: (id: number, data: Partial<Complaint>) => apiClient.put(`/complaints/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/complaints/${id}/`),
}

// Сервисы для справочников
export const directoriesService = {
  techniqueModels: {
    getAll: () => apiClient.get("/directories/technique-models/"),
    create: (data: Partial<Directory>) => apiClient.post("/directories/technique-models/", data),
    update: (id: number, data: Partial<Directory>) => apiClient.put(`/directories/technique-models/${id}/`, data),
    delete: (id: number) => apiClient.delete(`/directories/technique-models/${id}/`),
  },
  engineModels: {
    getAll: () => apiClient.get("/directories/engine-models/"),
    create: (data: Partial<Directory>) => apiClient.post("/directories/engine-models/", data),
    update: (id: number, data: Partial<Directory>) => apiClient.put(`/directories/engine-models/${id}/`, data),
    delete: (id: number) => apiClient.delete(`/directories/engine-models/${id}/`),
  },
  transmissionModels: {
    getAll: () => apiClient.get("/directories/transmission-models/"),
    create: (data: Partial<Directory>) => apiClient.post("/directories/transmission-models/", data),
    update: (id: number, data: Partial<Directory>) => apiClient.put(`/directories/transmission-models/${id}/`, data),
    delete: (id: number) => apiClient.delete(`/directories/transmission-models/${id}/`),
  },
  driveAxleModels: {
    getAll: () => apiClient.get("/directories/drive-axle-models/"),
    create: (data: Partial<Directory>) => apiClient.post("/directories/drive-axle-models/", data),
    update: (id: number, data: Partial<Directory>) => apiClient.put(`/directories/drive-axle-models/${id}/`, data),
    delete: (id: number) => apiClient.delete(`/directories/drive-axle-models/${id}/`),
  },
  steerAxleModels: {
    getAll: () => apiClient.get("/directories/steer-axle-models/"),
    create: (data: Partial<Directory>) => apiClient.post("/directories/steer-axle-models/", data),
    update: (id: number, data: Partial<Directory>) => apiClient.put(`/directories/steer-axle-models/${id}/`, data),
    delete: (id: number) => apiClient.delete(`/directories/steer-axle-models/${id}/`),
  },
  maintenanceTypes: {
    getAll: () => apiClient.get("/directories/maintenance-types/"),
    create: (data: Partial<Directory>) => apiClient.post("/directories/maintenance-types/", data),
    update: (id: number, data: Partial<Directory>) => apiClient.put(`/directories/maintenance-types/${id}/`, data),
    delete: (id: number) => apiClient.delete(`/directories/maintenance-types/${id}/`),
  },
  failureNodes: {
    getAll: () => apiClient.get("/directories/failure-nodes/"),
    create: (data: Partial<Directory>) => apiClient.post("/directories/failure-nodes/", data),
    update: (id: number, data: Partial<Directory>) => apiClient.put(`/directories/failure-nodes/${id}/`, data),
    delete: (id: number) => apiClient.delete(`/directories/failure-nodes/${id}/`),
  },
  recoveryMethods: {
    getAll: () => apiClient.get("/directories/recovery-methods/"),
    create: (data: Partial<Directory>) => apiClient.post("/directories/recovery-methods/", data),
    update: (id: number, data: Partial<Directory>) => apiClient.put(`/directories/recovery-methods/${id}/`, data),
    delete: (id: number) => apiClient.delete(`/directories/recovery-methods/${id}/`),
  },
  serviceCompanies: {
    getAll: () => apiClient.get("/directories/service-companies/"),
    create: (data: Partial<Directory>) => apiClient.post("/directories/service-companies/", data),
    update: (id: number, data: Partial<Directory>) => apiClient.put(`/directories/service-companies/${id}/`, data),
    delete: (id: number) => apiClient.delete(`/directories/service-companies/${id}/`),
  },
}

// Общий API сервис
export const apiService = {
  get: (url: string) => apiClient.get(url),
  post: (url: string, data: any) => apiClient.post(url, data),
  put: (url: string, data: any) => apiClient.put(url, data),
  delete: (url: string) => apiClient.delete(url),
}

export default apiClient
