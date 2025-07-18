import axios from "axios"

const API_BASE_URL = "http://localhost:8000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Важно! Передаем cookies
})

// Добавляем интерцептор для автоматического добавления CSRF токена
api.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrftoken")
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken
  }
  return config
})

// Функция для получения cookie
function getCookie(name: string): string | null {
  let cookieValue = null
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

// Типы данных
export interface Machine {
  id: number
  serial_number: string

  // Связанные объекты (если есть)
  technique_model: { id: number; name: string } | null
  engine_model: { id: number; name: string } | null

  transmission_model: { id: number; name: string } | null
  drive_axle_model: { id: number; name: string } | null
  steer_axle_model: { id: number; name: string } | null

  // Плоские поля (fallback значения)
  technique_model_name?: string
  engine_model_name?: string
  transmission_model_name?: string
  drive_axle_model_name?: string
  steer_axle_model_name?: string

  // Остальные поля
  engine_serial: string
  transmission_serial: string
  drive_axle_serial: string
  steer_axle_serial: string
  supply_contract: string
  shipment_date: string
  consignee: string
  delivery_address: string
  equipment: string
  client_name: string
  service_organization_name: string
}

export interface Maintenance {
  id: number
  machine: number | { id: number; serial_number: string; technique_model?: { name: string } }
  maintenance_type: number // ID типа ТО
  maintenance_type_name: string // Название типа ТО
  maintenance_date: string
  operating_hours: number
  work_order_number: string
  work_order_date: string
  maintenance_company: string
  machine_serial: string
  machine_model: string
  service_company: { id: number; name: string }
  service_company_name: string
}


export interface Complaint {
  id: number
  machine: number | { id: number; serial_number: string; technique_model?: { name: string } }
  machine_serial: string
  machine_model: string
  failure_date: string
  operating_hours: number
  failure_node: { id: number; name: string; description: string }
  failure_node_name?: string
  failure_description: string
  recovery_method: { id: number; name: string; description?: string }
  recovery_method_name?: string
  used_parts: string
  spare_parts: string
  recovery_date: string
  downtime: number
  service_company: { id: number; name: string }
  service_company_name: string
}

// Типы для справочников
export interface TechniqueModel {
  id: number
  name: string
  description?: string
}

export interface EngineModel {
  id: number
  name: string
  description?: string
}

export interface TransmissionModel {
  id: number
  name: string
  description?: string
}

export interface DriveAxleModel {
  id: number
  name: string
  description?: string
}

export interface SteerAxleModel {
  id: number
  name: string
  description?: string
}

export interface MaintenanceType {
  id: number
  name: string
  description: string
}

export interface FailureNode {
  id: number
  name: string
  description: string
}

export interface ServiceCompany {
  id: number
  name: string
  description?: string
}

export interface RecoveryMethod {
  id: number
  name: string
  description?: string
}

export interface ApiResponse<T> {
  data: T
}

export interface ApiListResponse<T> {
  data: T[]
}

// Основные API сервисы
export const machineService = {
  getAll: (): Promise<ApiListResponse<Machine>> => api.get("/machines/").then((response) => ({ data: response.data })),

  getById: (id: number): Promise<ApiResponse<Machine>> =>
    api.get(`/machines/${id}/`).then((response) => ({ data: response.data })),

  searchBySerial: (serialNumber: string): Promise<ApiResponse<Machine>> =>
    api.get(`/machines/search/?serial_number=${serialNumber}`).then((response) => ({ data: response.data })),

  create: (data: Partial<Machine>): Promise<ApiResponse<Machine>> =>
    api.post("/machines/", data).then((response) => ({ data: response.data })),

  update: (id: number, data: Partial<Machine>): Promise<ApiResponse<Machine>> =>
    api.put(`/machines/${id}/`, data).then((response) => ({ data: response.data })),

  delete: (id: number): Promise<void> => api.delete(`/machines/${id}/`),
}

export const maintenanceService = {
  getAll: (): Promise<ApiListResponse<Maintenance>> =>
    api.get("/maintenance/").then((response) => ({ data: response.data })),

  getById: (id: number): Promise<ApiResponse<Maintenance>> =>
    api.get(`/maintenance/${id}/`).then((response) => ({ data: response.data })),

  create: (data: Partial<Maintenance>): Promise<ApiResponse<Maintenance>> =>
    api.post("/maintenance/", data).then((response) => ({ data: response.data })),

  update: (id: number, data: Partial<Maintenance>): Promise<ApiResponse<Maintenance>> =>
    api.put(`/maintenance/${id}/`, data).then((response) => ({ data: response.data })),

  delete: (id: number): Promise<void> => api.delete(`/maintenance/${id}/`),
}

export const complaintService = {
  getAll: (): Promise<ApiListResponse<Complaint>> =>
    api.get("/complaints/").then((response) => ({ data: response.data })),

  getById: (id: number): Promise<ApiResponse<Complaint>> =>
    api.get(`/complaints/${id}/`).then((response) => ({ data: response.data })),

  create: (data: Partial<Complaint>): Promise<ApiResponse<Complaint>> =>
    api.post("/complaints/", data).then((response) => ({ data: response.data })),

  update: (id: number, data: Partial<Complaint>): Promise<ApiResponse<Complaint>> =>
    api.put(`/complaints/${id}/`, data).then((response) => ({ data: response.data })),

  delete: (id: number): Promise<void> => api.delete(`/complaints/${id}/`),
}

// Сервисы справочников (сокращенно, только основные методы)
export const techniqueModelService = {
  getAll: (): Promise<ApiListResponse<TechniqueModel>> =>
    api.get("/technique-models/").then((response) => ({ data: response.data })),
  getById: (id: number): Promise<ApiResponse<TechniqueModel>> =>
    api.get(`/technique-models/${id}/`).then((response) => ({ data: response.data })),
  create: (data: Partial<TechniqueModel>): Promise<ApiResponse<TechniqueModel>> =>
    api.post("/technique-models/", data).then((response) => ({ data: response.data })),
  update: (id: number, data: Partial<TechniqueModel>): Promise<ApiResponse<TechniqueModel>> =>
    api.put(`/technique-models/${id}/`, data).then((response) => ({ data: response.data })),
  delete: (id: number): Promise<void> => api.delete(`/technique-models/${id}/`),
}

export const engineModelService = {
  getAll: (): Promise<ApiListResponse<EngineModel>> =>
    api.get("/engine-models/").then((response) => ({ data: response.data })),
  getById: (id: number): Promise<ApiResponse<EngineModel>> =>
    api.get(`/engine-models/${id}/`).then((response) => ({ data: response.data })),
  create: (data: Partial<EngineModel>): Promise<ApiResponse<EngineModel>> =>
    api.post("/engine-models/", data).then((response) => ({ data: response.data })),
  update: (id: number, data: Partial<EngineModel>): Promise<ApiResponse<EngineModel>> =>
    api.put(`/engine-models/${id}/`, data).then((response) => ({ data: response.data })),
  delete: (id: number): Promise<void> => api.delete(`/engine-models/${id}/`),
}

export const transmissionModelService = {
  getAll: (): Promise<ApiListResponse<TransmissionModel>> =>
    api.get("/transmission-models/").then((response) => ({ data: response.data })),
  getById: (id: number): Promise<ApiResponse<TransmissionModel>> =>
    api.get(`/transmission-models/${id}/`).then((response) => ({ data: response.data })),
  create: (data: Partial<TransmissionModel>): Promise<ApiResponse<TransmissionModel>> =>
    api.post("/transmission-models/", data).then((response) => ({ data: response.data })),
  update: (id: number, data: Partial<TransmissionModel>): Promise<ApiResponse<TransmissionModel>> =>
    api.put(`/transmission-models/${id}/`, data).then((response) => ({ data: response.data })),
  delete: (id: number): Promise<void> => api.delete(`/transmission-models/${id}/`),
}

export const driveAxleModelService = {
  getAll: (): Promise<ApiListResponse<DriveAxleModel>> =>
    api.get("/drive-axle-models/").then((response) => ({ data: response.data })),
  getById: (id: number): Promise<ApiResponse<DriveAxleModel>> =>
    api.get(`/drive-axle-models/${id}/`).then((response) => ({ data: response.data })),
  create: (data: Partial<DriveAxleModel>): Promise<ApiResponse<DriveAxleModel>> =>
    api.post("/drive-axle-models/", data).then((response) => ({ data: response.data })),
  update: (id: number, data: Partial<DriveAxleModel>): Promise<ApiResponse<DriveAxleModel>> =>
    api.put(`/drive-axle-models/${id}/`, data).then((response) => ({ data: response.data })),
  delete: (id: number): Promise<void> => api.delete(`/drive-axle-models/${id}/`),
}

export const steerAxleModelService = {
  getAll: (): Promise<ApiListResponse<SteerAxleModel>> =>
    api.get("/steer-axle-models/").then((response) => ({ data: response.data })),
  getById: (id: number): Promise<ApiResponse<SteerAxleModel>> =>
    api.get(`/steer-axle-models/${id}/`).then((response) => ({ data: response.data })),
  create: (data: Partial<SteerAxleModel>): Promise<ApiResponse<SteerAxleModel>> =>
    api.post("/steer-axle-models/", data).then((response) => ({ data: response.data })),
  update: (id: number, data: Partial<SteerAxleModel>): Promise<ApiResponse<SteerAxleModel>> =>
    api.put(`/steer-axle-models/${id}/`, data).then((response) => ({ data: response.data })),
  delete: (id: number): Promise<void> => api.delete(`/steer-axle-models/${id}/`),
}

export const maintenanceTypeService = {
  getAll: (): Promise<ApiListResponse<MaintenanceType>> =>
    api.get("/maintenance-types/").then((response) => ({ data: response.data })),
  getById: (id: number): Promise<ApiResponse<MaintenanceType>> =>
    api.get(`/maintenance-types/${id}/`).then((response) => ({ data: response.data })),
  create: (data: Partial<MaintenanceType>): Promise<ApiResponse<MaintenanceType>> =>
    api.post("/maintenance-types/", data).then((response) => ({ data: response.data })),
  update: (id: number, data: Partial<MaintenanceType>): Promise<ApiResponse<MaintenanceType>> =>
    api.put(`/maintenance-types/${id}/`, data).then((response) => ({ data: response.data })),
  delete: (id: number): Promise<void> => api.delete(`/maintenance-types/${id}/`),
}

export const failureNodeService = {
  getAll: (): Promise<ApiListResponse<FailureNode>> =>
    api.get("/failure-nodes/").then((response) => ({ data: response.data })),
  getById: (id: number): Promise<ApiResponse<FailureNode>> =>
    api.get(`/failure-nodes/${id}/`).then((response) => ({ data: response.data })),
  create: (data: Partial<FailureNode>): Promise<ApiResponse<FailureNode>> =>
    api.post("/failure-nodes/", data).then((response) => ({ data: response.data })),
  update: (id: number, data: Partial<FailureNode>): Promise<ApiResponse<FailureNode>> =>
    api.put(`/failure-nodes/${id}/`, data).then((response) => ({ data: response.data })),
  delete: (id: number): Promise<void> => api.delete(`/failure-nodes/${id}/`),
}

export const serviceCompanyService = {
  getAll: (): Promise<ApiListResponse<ServiceCompany>> => {
    // Сервисные компании приходят в составе данных рекламаций через service_company_name
    // Отдельного эндпоинта для них нет
    console.log("🔍 Сервисные компании загружаются из данных рекламаций")
    return Promise.resolve({ data: [] })
  },
  getById: (id: number): Promise<ApiResponse<ServiceCompany>> =>
    api.get(`/service-companies/${id}/`).then((response) => ({ data: response.data })),
  create: (data: Partial<ServiceCompany>): Promise<ApiResponse<ServiceCompany>> =>
    api.post("/service-companies/", data).then((response) => ({ data: response.data })),
  update: (id: number, data: Partial<ServiceCompany>): Promise<ApiResponse<ServiceCompany>> =>
    api.put(`/service-companies/${id}/`, data).then((response) => ({ data: response.data })),
  delete: (id: number): Promise<void> => api.delete(`/service-companies/${id}/`),
}

export const recoveryMethodService = {
  getAll: (): Promise<ApiListResponse<RecoveryMethod>> =>
    api.get("/recovery-methods/").then((response) => ({ data: response.data })),
  getById: (id: number): Promise<ApiResponse<RecoveryMethod>> =>
    api.get(`/recovery-methods/${id}/`).then((response) => ({ data: response.data })),
  create: (data: Partial<RecoveryMethod>): Promise<ApiResponse<RecoveryMethod>> =>
    api.post("/recovery-methods/", data).then((response) => ({ data: response.data })),
  update: (id: number, data: Partial<RecoveryMethod>): Promise<ApiResponse<RecoveryMethod>> =>
    api.put(`/recovery-methods/${id}/`, data).then((response) => ({ data: response.data })),
  delete: (id: number): Promise<void> => api.delete(`/recovery-methods/${id}/`),
}

// Объединенный сервис для всех справочников
export const directoriesService = {
  techniqueModels: techniqueModelService,
  engineModels: engineModelService,
  transmissionModels: transmissionModelService,
  driveAxleModels: driveAxleModelService,
  steerAxleModels: steerAxleModelService,
  maintenanceTypes: maintenanceTypeService,
  failureNodes: failureNodeService,
  serviceCompanies: serviceCompanyService,
  recoveryMethods: recoveryMethodService,

  getAllDirectories: async () => {
    try {
      const [
        techniqueModels,
        engineModels,
        transmissionModels,
        driveAxleModels,
        steerAxleModels,
        maintenanceTypes,
        failureNodes,
        serviceCompanies,
        recoveryMethods,
      ] = await Promise.all([
        techniqueModelService.getAll().catch(() => ({ data: [] })),
        engineModelService.getAll().catch(() => ({ data: [] })),
        transmissionModelService.getAll().catch(() => ({ data: [] })),
        driveAxleModelService.getAll().catch(() => ({ data: [] })),
        steerAxleModelService.getAll().catch(() => ({ data: [] })),
        maintenanceTypeService.getAll().catch(() => ({ data: [] })),
        failureNodeService.getAll().catch(() => ({ data: [] })),
        serviceCompanyService.getAll().catch(() => {return { data: [] }}),
        recoveryMethodService.getAll().catch(() => ({ data: [] })),
      ])

      return {
        data: {
          techniqueModels: techniqueModels.data,
          engineModels: engineModels.data,
          transmissionModels: transmissionModels.data,
          driveAxleModels: driveAxleModels.data,
          steerAxleModels: steerAxleModels.data,
          maintenanceTypes: maintenanceTypes.data,
          failureNodes: failureNodes.data,
          serviceCompanies: serviceCompanies.data,
          recoveryMethods: recoveryMethods.data,
        },
      }
    } catch (error) {
      console.error("Error fetching directories:", error)
      throw error
    }
  },
}

export default api
