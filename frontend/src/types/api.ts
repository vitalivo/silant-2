// Интерфейсы для типизации (обновленные)
export interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  role: "client" | "service" | "manager" | null
  is_superuser: boolean
  is_staff: boolean
}

export interface Machine {
  id: number
  serial_number: string
  technique_model?: { id: number; name: string; description?: string }
  technique_model_name?: string
  engine_model?: { id: number; name: string; description?: string }
  engine_model_name?: string
  engine_serial: string
  transmission_model?: { id: number; name: string; description?: string }
  transmission_model_name?: string
  transmission_serial: string
  drive_axle_model?: { id: number; name: string; description?: string }
  drive_axle_model_name?: string
  drive_axle_serial: string
  steer_axle_model?: { id: number; name: string; description?: string }
  steer_axle_model_name?: string
  steer_axle_serial: string
  supply_contract?: string
  shipment_date?: string
  consignee?: string
  delivery_address?: string
  equipment?: string
  client?: number
  client_name?: string
  service_organization?: number
  service_organization_name?: string
}

export interface Maintenance {
  id: number
  maintenance_type?: { id: number; name: string; description?: string }
  maintenance_type_name?: string
  maintenance_date: string
  operating_hours: number
  work_order_number: string
  work_order_date: string
  maintenance_company: string
  machine: number
  machine_serial?: string
  machine_model?: string
  service_company?: { id: number; name: string; description?: string }
  service_company_name?: string
  created_by?: number
}

export interface Complaint {
  id: number
  failure_date: string
  operating_hours: number
  failure_node?: { id: number; name: string; description?: string }
  failure_node_name?: string
  failure_description: string
  recovery_method?: { id: number; name: string; description?: string }
  recovery_method_name?: string
  spare_parts?: string
  recovery_date: string
  downtime: number
  machine: number
  machine_serial?: string
  machine_model?: string
  service_company?: { id: number; name: string; description?: string }
  service_company_name?: string
  created_by?: number
}

// Утилиты для работы с ролями
export const getRoleDisplayName = (role: User["role"]): string => {
  switch (role) {
    case "client":
      return "Клиент"
    case "service":
      return "Сервисная организация"
    case "manager":
      return "Менеджер"
    default:
      return "Пользователь"
  }
}

export const getRoleBadgeClass = (role: User["role"]): string => {
  switch (role) {
    case "client":
      return "roleClient"
    case "service":
      return "roleService"
    case "manager":
      return "roleManager"
    default:
      return "roleDefault"
  }
}

// Проверки доступа
export const canViewMaintenance = (user: User | null): boolean => {
  return user !== null // Все авторизованные пользователи могут просматривать ТО
}

export const canCreateMaintenance = (user: User | null): boolean => {
  if (!user) return false
  return user.role === "client" || user.role === "service" || user.role === "manager" || user.is_superuser
}

export const canViewComplaints = (user: User | null): boolean => {
  return user !== null // Все авторизованные пользователи могут просматривать рекламации
}

export const canCreateComplaints = (user: User | null): boolean => {
  if (!user) return false
  return user.role === "service" || user.role === "manager" || user.is_superuser
}

export const canViewAllData = (user: User | null): boolean => {
  if (!user) return false
  return user.role === "manager" || user.is_superuser
}
