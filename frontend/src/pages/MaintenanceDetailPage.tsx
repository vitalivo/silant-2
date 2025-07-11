"use client"

import type React from "react"
import { useParams } from "react-router-dom"

const MaintenanceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Детали ТО #{id}</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Страница в разработке...</p>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceDetailPage
