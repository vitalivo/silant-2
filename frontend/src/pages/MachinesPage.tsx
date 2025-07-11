"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { machineService, type Machine } from "../services/api"
import { Search, Filter, Eye } from "lucide-react"
import { Link } from "react-router-dom"

const MachinesPage: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadMachines()
  }, [])

  const loadMachines = async () => {
    try {
      setLoading(true)
      const response = await machineService.getAll()
      setMachines(response.data.results || response.data || [])
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки данных")
    } finally {
      setLoading(false)
    }
  }

  const filteredMachines = machines.filter(
    (machine) =>
      machine.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.technique_model?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.client_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
          <button onClick={loadMachines} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Машины</h1>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Поиск по серийному номеру, модели или клиенту..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={20} />
              Фильтры
            </button>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            Найдено: {filteredMachines.length} из {machines.length} машин
          </div>
        </div>

        {/* Machines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMachines.map((machine) => (
            <div key={machine.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {machine.technique_model?.name || "Неизвестная модель"}
                  </h3>
                  <Link to={`/machines/${machine.id}`} className="text-blue-600 hover:text-blue-700">
                    <Eye size={20} />
                  </Link>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Серийный номер:</span>
                    <span className="ml-2 text-gray-900">{machine.serial_number}</span>
                  </div>

                  {machine.client_name && (
                    <div>
                      <span className="font-medium text-gray-700">Клиент:</span>
                      <span className="ml-2 text-gray-900">{machine.client_name}</span>
                    </div>
                  )}

                  {machine.shipment_date && (
                    <div>
                      <span className="font-medium text-gray-700">Дата отгрузки:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(machine.shipment_date).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                  )}

                  {machine.engine_model?.name && (
                    <div>
                      <span className="font-medium text-gray-700">Двигатель:</span>
                      <span className="ml-2 text-gray-900">{machine.engine_model.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMachines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Машины не найдены</p>
            <p className="text-gray-400 mt-2">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MachinesPage
