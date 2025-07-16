"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"

interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  groups: string[]
  role?: string // Добавляем поле role
}

interface AuthServiceProps {
  children: (props: {
    user: User | null
    login: (username: string, password: string) => Promise<void>
    logout: () => void
    loading: boolean
    error: string | null
  }) => React.ReactNode
}

const AuthService: React.FC<AuthServiceProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/auth/user/", {
        withCredentials: true,
      })

      // Логируем полученные данные для отладки
      console.log("🔍 Данные пользователя с бэкенда:", response.data)

      setUser(response.data)
    } catch (err: any) {
      // 401 - это нормально для неавторизованных пользователей
      if (err.response?.status !== 401) {
        console.error("Ошибка проверки авторизации:", err)
      }
      setUser(null)
    }
  }

  const login = async (username: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      // Получаем CSRF токен
      await axios.get("http://localhost:8000/api/auth/csrf/", {
        withCredentials: true,
      })

      // Выполняем вход
      const response = await axios.post(
        "http://localhost:8000/api/auth/login/",
        {
          username,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
        },
      )

      // Логируем данные после входа
      console.log("🔍 Данные пользователя после входа:", response.data.user)

      setUser(response.data.user)

      // Перезагружаем страницу после успешного входа
      setTimeout(() => {
        window.location.href = "/"
      }, 100) // Небольшая задержка для завершения setState
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Ошибка авторизации"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/auth/logout/",
        {},
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
        },
      )
    } catch (err) {
      console.error("Ошибка при выходе:", err)
    } finally {
      setUser(null)

      // Перезагружаем страницу после выхода
      setTimeout(() => {
        window.location.reload()
      }, 100) // Небольшая задержка для завершения setState
    }
  }

  const getCookie = (name: string) => {
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

  return children({ user, login, logout, loading, error })
}

export default AuthService
