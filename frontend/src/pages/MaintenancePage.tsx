"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { maintenanceService, type Maintenance } from "../services/api"
import { Search, Calendar, Wrench } from "lucide-react"

const MaintenancePage: React.FC = () => {
  const [maintenance, setMaintenance] = useState<Maintenance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadMaintenance()
  }, [])

  const loadMaintenance = async () => {
    try {
      setLoading(true)
      const response = await maintenanceService.getAll()
      setMaintenance(response.data.results || response.data || [])
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки данных")
    } finally {
      setLoading(false)
    }
  }

  const filteredMaintenance = maintenance.filter(
    (item) =>
      item.machine_serial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.maintenance_type?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.service_company_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={loadMaintenance} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Повторить
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Техническое обслуживание</h1>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Поиск по машине, типу ТО или сервисной компании..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="text-sm text-gray-600 mb-4">
            Найдено: {filteredMaintenance.length} из {maintenance.length} записей ТО
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип ТО
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата ТО
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Машина
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Наработка
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сервисная компания
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaintenance.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Wrench className="text-green-600 mr-2" size={16} />
                        <span className="text-sm font-medium text-gray-900">{item.maintenance_type?.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="text-gray-400 mr-2" size={16} />
                        <span className="text-sm text-gray-900">
                          {item.maintenance_date ? new Date(item.maintenance_date).toLocaleDateString("ru-RU") : "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">№ {item.machine_serial}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{item.operating_hours} м/час</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{item.service_company_name || "—"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredMaintenance.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Записи ТО не найдены</p>
            <p className="text-gray-400 mt-2">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MaintenancePage
