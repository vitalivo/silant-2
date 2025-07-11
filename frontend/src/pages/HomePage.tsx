"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { Truck, Wrench, AlertTriangle, Users } from "lucide-react"

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Truck size={48} />,
      title: "Управление машинами",
      description: "Полный контроль за парком техники, отслеживание состояния и характеристик",
      link: "/machines",
      color: "bg-blue-500",
    },
    {
      icon: <Wrench size={48} />,
      title: "Техническое обслуживание",
      description: "Планирование и учет технического обслуживания оборудования",
      link: "/maintenance",
      color: "bg-green-500",
    },
    {
      icon: <AlertTriangle size={48} />,
      title: "Рекламации",
      description: "Управление жалобами и рекламациями по технике",
      link: "/complaints",
      color: "bg-orange-500",
    },
    {
      icon: <Users size={48} />,
      title: "Управление пользователями",
      description: "Система ролей и доступа для разных типов пользователей",
      link: "#",
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Система управления техникой
            <span className="block text-blue-600 mt-2">СИЛАНТ</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Комплексное решение для мониторинга, обслуживания и управления промышленной техникой. Контролируйте весь
            жизненный цикл оборудования в одной системе.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/machines"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Просмотреть технику
            </Link>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Узнать больше
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Возможности системы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`${feature.color} text-white p-3 rounded-lg inline-block mb-4`}>{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                {feature.link !== "#" && (
                  <Link to={feature.link} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                    Подробнее →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Единиц техники</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
              <div className="text-gray-600">Выполненных ТО</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-gray-600">Сервисных организаций</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
