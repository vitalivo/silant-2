"use client"

import { useMemo } from "react"

interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  groups?: string[]
  role?: string
}

interface Permissions {
  // Просмотр данных
  canViewMachines: boolean
  canViewMaintenance: boolean
  canViewComplaints: boolean
  canViewDirectories: boolean

  // Создание записей
  canCreateMachine: boolean
  canCreateMaintenance: boolean
  canCreateComplaint: boolean

  // Редактирование
  canEditMachine: boolean
  canEditMaintenance: boolean
  canEditComplaint: boolean

  // Управление справочниками
  canManageDirectories: boolean

  // Роли для удобства
  isManager: boolean
  isClient: boolean
  isServiceCompany: boolean
  isAuthenticated: boolean

  // Функции проверки
  canAccessMachine: (machineId: number) => boolean
  canAccessMaintenance: (maintenanceId: number) => boolean
  canAccessComplaint: (complaintId: number) => boolean
}

export const usePermissions = (user: User | null): Permissions => {
  return useMemo(() => {
    // Если пользователь не авторизован
    if (!user) {
      return {
        canViewMachines: true, // Неавторизованные могут видеть машины (поля 1-10)
        canViewMaintenance: false,
        canViewComplaints: false,
        canViewDirectories: false,

        canCreateMachine: false,
        canCreateMaintenance: false,
        canCreateComplaint: false,

        canEditMachine: false,
        canEditMaintenance: false,
        canEditComplaint: false,

        canManageDirectories: false,

        isManager: false,
        isClient: false,
        isServiceCompany: false,
        isAuthenticated: false,

        canAccessMachine: () => false,
        canAccessMaintenance: () => false,
        canAccessComplaint: () => false,
      }
    }

    // Определяем роли на основе поля role из бэкенда
    const userRole = user.role || ""
    const isManager = userRole === "manager"
    const isClient = userRole === "client"
    const isServiceCompany = userRole === "service"

    // Дополнительная проверка по группам (если используются)
    const userGroups = user.groups || []
    const isManagerByGroup = userGroups.includes("Менеджеры")
    const isClientByGroup = userGroups.includes("Клиенты")
    const isServiceByGroup = userGroups.includes("Сервисные организации")

    // Итоговые роли (приоритет у поля role)
    const finalIsManager = isManager || isManagerByGroup
    const finalIsClient = isClient || isClientByGroup
    const finalIsServiceCompany = isServiceCompany || isServiceByGroup

    return {
      // Просмотр данных
      canViewMachines: true, // Все авторизованные пользователи могут видеть машины
      canViewMaintenance: true, // Все авторизованные пользователи могут видеть ТО
      canViewComplaints: true, // Все авторизованные пользователи могут видеть рекламации
      canViewDirectories: finalIsManager, // Только менеджеры могут видеть справочники

      // Создание записей
      canCreateMachine: finalIsManager, // Только менеджеры могут добавлять машины
      canCreateMaintenance: finalIsClient || finalIsServiceCompany || finalIsManager,
      canCreateComplaint: finalIsServiceCompany || finalIsManager, // Только сервисные организации и менеджеры

      // Редактирование
      canEditMachine: finalIsManager, // Только менеджеры могут редактировать машины
      canEditMaintenance: finalIsClient || finalIsServiceCompany || finalIsManager,
      canEditComplaint: finalIsServiceCompany || finalIsManager,

      // Управление справочниками
      canManageDirectories: finalIsManager,

      // Роли
      isManager: finalIsManager,
      isClient: finalIsClient,
      isServiceCompany: finalIsServiceCompany,
      isAuthenticated: true,

      // Функции проверки доступа к конкретным записям
      canAccessMachine: (machineId: number) => {
        if (finalIsManager) return true // Менеджеры видят все
        // TODO: Проверить принадлежность машины клиенту/сервисной организации
        return true // Пока возвращаем true, логику добавим позже
      },

      canAccessMaintenance: (maintenanceId: number) => {
        if (finalIsManager) return true // Менеджеры видят все
        // TODO: Проверить принадлежность ТО пользователю
        return true // Пока возвращаем true
      },

      canAccessComplaint: (complaintId: number) => {
        if (finalIsManager) return true // Менеджеры видят все
        // TODO: Проверить принадлежность рекламации пользователю
        return true // Пока возвращаем true
      },
    }
  }, [user])
}
