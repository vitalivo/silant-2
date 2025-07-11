"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import type { User } from "../types/api"

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
      const response = await axios.get("http://localhost:8000/api/accounts/api/profile/", {
        withCredentials: true,
      })
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
      // Выполняем вход через Django сессионную аутентификацию
      const response = await axios.post(
        "http://localhost:8000/api/accounts/login/",
        {
          username,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      )

      // После успешного входа получаем информацию о пользователе
      await checkAuthStatus()
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
      await axios.get("http://localhost:8000/api/accounts/logout/", {
        withCredentials: true,
      })
    } catch (err) {
      console.error("Ошибка при выходе:", err)
    } finally {
      setUser(null)
    }
  }

  return children({ user, login, logout, loading, error })
}

export default AuthService
