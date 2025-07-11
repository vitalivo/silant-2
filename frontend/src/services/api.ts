// API endpoints - безопасный доступ к переменным окружения
const getApiBaseUrl = (): string => {
  // Проверяем наличие process и его env
  if (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }

  // Fallback для браузерной среды
  return "http://localhost:8000/api"
}

const API_BASE_URL = getApiBaseUrl()

// Types
export interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  role: "client" | "service_company" | "manager"
  service_company?: {
    id: number
    name: string
  }
}

export interface Machine {
  id: number
  factory_number: string
  machine_model: {
    id: number
    name: string
    description: string
  }
  engine_model: {
    id: number
    name: string
    description: string
  }
  engine_number: string
  transmission_model: {
    id: number
    name: string
    description: string
  }
  transmission_number: string
  drive_axle_model: {
    id: number
    name: string
    description: string
  }
  drive_axle_number: string
  steerable_axle_model: {
    id: number
    name: string
    description: string
  }
  steerable_axle_number: string
  supply_contract: string
  shipment_date: string
  consignee: string
  delivery_address: string
  equipment: string
  client: {
    id: number
    first_name: string
    last_name: string
  }
  service_company: {
    id: number
    name: string
  }
}

export interface Maintenance {
  id: number
  type: {
    id: number
    name: string
    description: string
  }
  maintenance_date: string
  operating_hours: number
  order_number: string
  order_date: string
  organization: {
    id: number
    name: string
    description: string
  }
  machine: {
    id: number
    factory_number: string
  }
  service_company: {
    id: number
    name: string
  }
}

export interface Complaint {
  id: number
  failure_date: string
  operating_hours: number
  failure_node: {
    id: number
    name: string
    description: string
  }
  failure_description: string
  recovery_method: {
    id: number
    name: string
    description: string
  }
  used_spare_parts: string
  recovery_date: string
  downtime: number
  machine: {
    id: number
    factory_number: string
  }
  service_company: {
    id: number
    name: string
  }
}

// Utility function for role badge styling
export function getRoleBadgeClass(role: string): string {
  switch (role) {
    case "client":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "service_company":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "manager":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

// Utility function for role display names
export function getRoleDisplayName(role: string): string {
  switch (role) {
    case "client":
      return "Клиент"
    case "service_company":
      return "Сервисная компания"
    case "manager":
      return "Менеджер"
    default:
      return "Неизвестная роль"
  }
}

// API functions
export async function getAuthToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}

export async function setAuthToken(token: string): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token)
  }
}

export async function removeAuthToken(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
  }
}

export async function login(username: string, password: string): Promise<{ token: string; user: User }> {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    throw new Error("Неверные учетные данные")
  }

  const data = await response.json()
  await setAuthToken(data.token)
  return data
}

export async function logout(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
  }
}

export async function getCurrentUser(): Promise<User> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error("Токен не найден")
  }

  const response = await fetch(`${API_BASE_URL}/auth/user/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Не удалось получить данные пользователя")
  }

  return response.json()
}

export async function getMachines(): Promise<Machine[]> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error("Токен не найден")
  }

  const response = await fetch(`${API_BASE_URL}/machines/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Не удалось получить данные о машинах")
  }

  return response.json()
}

export async function getMachine(id: number): Promise<Machine> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error("Токен не найден")
  }

  const response = await fetch(`${API_BASE_URL}/machines/${id}/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Не удалось получить данные о машине")
  }

  return response.json()
}

export async function getMaintenances(): Promise<Maintenance[]> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error("Токен не найден")
  }

  const response = await fetch(`${API_BASE_URL}/maintenances/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Не удалось получить данные о ТО")
  }

  return response.json()
}

export async function getComplaints(): Promise<Complaint[]> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error("Токен не найден")
  }

  const response = await fetch(`${API_BASE_URL}/complaints/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Не удалось получить данные о рекламациях")
  }

  return response.json()
}

// Machine service object
export const machineService = {
  getAll: getMachines,
  getById: getMachine,

  async create(machineData: Partial<Machine>): Promise<Machine> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/machines/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(machineData),
    })

    if (!response.ok) {
      throw new Error("Не удалось создать машину")
    }

    return response.json()
  },

  async update(id: number, machineData: Partial<Machine>): Promise<Machine> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/machines/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(machineData),
    })

    if (!response.ok) {
      throw new Error("Не удалось обновить машину")
    }

    return response.json()
  },

  async delete(id: number): Promise<void> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/machines/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Не удалось удалить машину")
    }
  },

  async search(query: string): Promise<Machine[]> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/machines/?search=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Не удалось выполнить поиск машин")
    }

    return response.json()
  },
}

// Maintenance service object
export const maintenanceService = {
  getAll: getMaintenances,

  async getById(id: number): Promise<Maintenance> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/maintenances/${id}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Не удалось получить данные о ТО")
    }

    return response.json()
  },

  async create(maintenanceData: Partial<Maintenance>): Promise<Maintenance> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/maintenances/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(maintenanceData),
    })

    if (!response.ok) {
      throw new Error("Не удалось создать запись о ТО")
    }

    return response.json()
  },

  async update(id: number, maintenanceData: Partial<Maintenance>): Promise<Maintenance> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/maintenances/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(maintenanceData),
    })

    if (!response.ok) {
      throw new Error("Не удалось обновить запись о ТО")
    }

    return response.json()
  },

  async delete(id: number): Promise<void> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/maintenances/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Не удалось удалить запись о ТО")
    }
  },

  async getByMachine(machineId: number): Promise<Maintenance[]> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/maintenances/?machine=${machineId}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Не удалось получить данные о ТО для машины")
    }

    return response.json()
  },

  async search(query: string): Promise<Maintenance[]> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/maintenances/?search=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Не удалось выполнить поиск записей о ТО")
    }

    return response.json()
  },
}

// Complaints service object
export const complaintsService = {
  getAll: getComplaints,

  async getById(id: number): Promise<Complaint> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/complaints/${id}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Не удалось получить данные о рекламации")
    }

    return response.json()
  },

  async create(complaintData: Partial<Complaint>): Promise<Complaint> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/complaints/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(complaintData),
    })

    if (!response.ok) {
      throw new Error("Не удалось создать рекламацию")
    }

    return response.json()
  },

  async update(id: number, complaintData: Partial<Complaint>): Promise<Complaint> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/complaints/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(complaintData),
    })

    if (!response.ok) {
      throw new Error("Не удалось обновить рекламацию")
    }

    return response.json()
  },

  async delete(id: number): Promise<void> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/complaints/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Не удалось удалить рекламацию")
    }
  },

  async getByMachine(machineId: number): Promise<Complaint[]> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/complaints/?machine=${machineId}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Не удалось получить рекламации для машины")
    }

    return response.json()
  },

  async search(query: string): Promise<Complaint[]> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/complaints/?search=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Не удалось выполнить поиск рекламаций")
    }

    return response.json()
  },

  async getByDateRange(startDate: string, endDate: string): Promise<Complaint[]> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(
      `${API_BASE_URL}/complaints/?failure_date_after=${startDate}&failure_date_before=${endDate}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Не удалось получить рекламации за период")
    }

    return response.json()
  },

  async getStatistics(): Promise<{
    total: number
    byFailureNode: Record<string, number>
    averageDowntime: number
    totalDowntime: number
  }> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/complaints/statistics/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Не удалось получить статистику рекламаций")
    }

    return response.json()
  },
}

// Auth service object
export const authService = {
  login,
  logout,
  getCurrentUser,
  getAuthToken,
  setAuthToken,
  removeAuthToken,

  async isAuthenticated(): Promise<boolean> {
    const token = await getAuthToken()
    return !!token
  },

  async refreshToken(): Promise<string> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Не удалось обновить токен")
    }

    const data = await response.json()
    await setAuthToken(data.token)
    return data.token
  },

  async register(userData: {
    username: string
    password: string
    first_name: string
    last_name: string
    email?: string
  }): Promise<{ token: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Ошибка регистрации")
    }

    const data = await response.json()
    await setAuthToken(data.token)
    return data
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/auth/change-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    })

    if (!response.ok) {
      throw new Error("Не удалось изменить пароль")
    }
  },

  async resetPassword(email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error("Не удалось отправить запрос на сброс пароля")
    }
  },

  async updateProfile(profileData: Partial<User>): Promise<User> {
    const token = await getAuthToken()
    if (!token) {
      throw new Error("Токен не найден")
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      throw new Error("Не удалось обновить профиль")
    }

    return response.json()
  },

  async getProfile(): Promise<User | null> {
    try {
      const token = await getAuthToken()
      if (!token) {
        return null // Возвращаем null вместо ошибки, если токена нет
      }
      return await getCurrentUser()
    } catch (error) {
      console.warn("Не удалось получить профиль пользователя:", error)
      return null // Возвращаем null при любой ошибке
    }
  },

  async checkAuth(): Promise<{ isAuthenticated: boolean; user: User | null }> {
    try {
      const token = await getAuthToken()
      if (!token) {
        return { isAuthenticated: false, user: null }
      }

      const user = await getCurrentUser()
      return { isAuthenticated: true, user }
    } catch (error) {
      // Если токен недействителен, удаляем его
      await removeAuthToken()
      return { isAuthenticated: false, user: null }
    }
  },
}
