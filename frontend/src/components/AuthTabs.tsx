"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Truck, Wrench, AlertTriangle, User, LogOut } from "lucide-react"
import { machineService, maintenanceService, complaintsService } from "../services/api"
import type { Machine, Maintenance, Complaint } from "../services/api"
import styles from "../styles/AuthTabs.module.css"

interface AuthTabsProps {
  user: any // Информация о пользователе
  onLogout: () => void
}

const AuthTabs: React.FC<AuthTabsProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<"machines" | "maintenance" | "complaints">("machines")
  const [machines, setMachines] = useState<Machine[]>([])
  const [maintenance, setMaintenance] = useState<Maintenance[]>([])
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Фильтры для каждой вкладки
  const [machineFilters, setMachineFilters] = useState({
    technique_model: "",
    engine_model: "",
    transmission_model: "",
    drive_axle_model: "",
    steer_axle_model: "",
  })

  const [maintenanceFilters, setMaintenanceFilters] = useState({
    maintenance_type: "",
    machine_serial: "",
    service_company: "",
  })

  const [complaintFilters, setComplaintFilters] = useState({
    failure_node: "",
    recovery_method: "",
    service_company: "",
  })

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      switch (activeTab) {
        case "machines":
          const machinesResponse = await machineService.getAll()
          setMachines(machinesResponse.data.results || machinesResponse.data || [])
          break
        case "maintenance":
          const maintenanceResponse = await maintenanceService.getAll()
          setMaintenance(maintenanceResponse.data.results || maintenanceResponse.data || [])
          break
        case "complaints":
          const complaintsResponse = await complaintsService.getAll()
          setComplaints(complaintsResponse.data.results || complaintsResponse.data || [])
          break
      }
    } catch (err: any) {
      setError(`Ошибка загрузки данных: ${err?.message || "Неизвестная ошибка"}`)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    {
      id: "machines" as const,
      label: "Машины",
      icon: <Truck size={20} />,
      count: machines.length,
    },
    {
      id: "maintenance" as const,
      label: "ТО",
      icon: <Wrench size={20} />,
      count: maintenance.length,
    },
    {
      id: "complaints" as const,
      label: "Рекламации",
      icon: <AlertTriangle size={20} />,
      count: complaints.length,
    },
  ]

  const renderMachinesTable = () => (
    <div className={styles.tableContainer}>
      <div className={styles.filtersRow}>
        <input
          type="text"
          placeholder="Модель техники"
          value={machineFilters.technique_model}
          onChange={(e) => setMachineFilters((prev) => ({ ...prev, technique_model: e.target.value }))}
          className={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Модель двигателя"
          value={machineFilters.engine_model}
          onChange={(e) => setMachineFilters((prev) => ({ ...prev, engine_model: e.target.value }))}
          className={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Модель трансмиссии"
          value={machineFilters.transmission_model}
          onChange={(e) => setMachineFilters((prev) => ({ ...prev, transmission_model: e.target.value }))}
          className={styles.filterInput}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Серийный номер</th>
            <th>Модель техники</th>
            <th>Двигатель</th>
            <th>Трансмиссия</th>
            <th>Дата отгрузки</th>
            <th>Клиент</th>
          </tr>
        </thead>
        <tbody>
          {machines
            .filter((machine) => {
              return (
                (!machineFilters.technique_model ||
                  machine.technique_model?.name
                    ?.toLowerCase()
                    .includes(machineFilters.technique_model.toLowerCase())) &&
                (!machineFilters.engine_model ||
                  machine.engine_model?.name?.toLowerCase().includes(machineFilters.engine_model.toLowerCase())) &&
                (!machineFilters.transmission_model ||
                  machine.transmission_model?.name
                    ?.toLowerCase()
                    .includes(machineFilters.transmission_model.toLowerCase()))
              )
            })
            .map((machine) => (
              <tr
                key={machine.id}
                className={styles.tableRow}
                onClick={() => (window.location.href = `/machines/${machine.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td className={styles.serialCell}>{machine.serial_number}</td>
                <td>{machine.technique_model?.name || "—"}</td>
                <td>
                  <div>{machine.engine_model?.name || "—"}</div>
                  <div className={styles.subText}>№ {machine.engine_serial}</div>
                </td>
                <td>
                  <div>{machine.transmission_model?.name || "—"}</div>
                  <div className={styles.subText}>№ {machine.transmission_serial}</div>
                </td>
                <td>{machine.shipment_date ? new Date(machine.shipment_date).toLocaleDateString("ru-RU") : "—"}</td>
                <td>{machine.client_name || "—"}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )

  const renderMaintenanceTable = () => (
    <div className={styles.tableContainer}>
      <div className={styles.filtersRow}>
        <input
          type="text"
          placeholder="Вид ТО"
          value={maintenanceFilters.maintenance_type}
          onChange={(e) => setMaintenanceFilters((prev) => ({ ...prev, maintenance_type: e.target.value }))}
          className={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Серийный номер машины"
          value={maintenanceFilters.machine_serial}
          onChange={(e) => setMaintenanceFilters((prev) => ({ ...prev, machine_serial: e.target.value }))}
          className={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Сервисная компания"
          value={maintenanceFilters.service_company}
          onChange={(e) => setMaintenanceFilters((prev) => ({ ...prev, service_company: e.target.value }))}
          className={styles.filterInput}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Вид ТО</th>
            <th>Дата ТО</th>
            <th>Наработка, м/час</th>
            <th>№ заказ-наряда</th>
            <th>Машина</th>
            <th>Сервисная компания</th>
          </tr>
        </thead>
        <tbody>
          {maintenance
            .filter((item) => {
              return (
                (!maintenanceFilters.maintenance_type ||
                  item.maintenance_type?.name
                    ?.toLowerCase()
                    .includes(maintenanceFilters.maintenance_type.toLowerCase())) &&
                (!maintenanceFilters.machine_serial ||
                  item.machine_serial?.toLowerCase().includes(maintenanceFilters.machine_serial.toLowerCase())) &&
                (!maintenanceFilters.service_company ||
                  item.service_company_name?.toLowerCase().includes(maintenanceFilters.service_company.toLowerCase()))
              )
            })
            .map((item) => (
              <tr
                key={item.id}
                className={styles.tableRow}
                onClick={() => (window.location.href = `/maintenance/${item.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td className={styles.typeCell}>{item.maintenance_type?.name || "—"}</td>
                <td>{item.maintenance_date ? new Date(item.maintenance_date).toLocaleDateString("ru-RU") : "—"}</td>
                <td>{item.operating_hours || "—"}</td>
                <td>
                  <div>{item.work_order_number || "—"}</div>
                  <div className={styles.subText}>
                    {item.work_order_date ? new Date(item.work_order_date).toLocaleDateString("ru-RU") : ""}
                  </div>
                </td>
                <td className={styles.serialCell}>№ {item.machine_serial}</td>
                <td>{item.service_company_name || "—"}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )

  const renderComplaintsTable = () => (
    <div className={styles.tableContainer}>
      <div className={styles.filtersRow}>
        <input
          type="text"
          placeholder="Узел отказа"
          value={complaintFilters.failure_node}
          onChange={(e) => setComplaintFilters((prev) => ({ ...prev, failure_node: e.target.value }))}
          className={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Способ восстановления"
          value={complaintFilters.recovery_method}
          onChange={(e) => setComplaintFilters((prev) => ({ ...prev, recovery_method: e.target.value }))}
          className={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Сервисная компания"
          value={complaintFilters.service_company}
          onChange={(e) => setComplaintFilters((prev) => ({ ...prev, service_company: e.target.value }))}
          className={styles.filterInput}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Дата отказа</th>
            <th>Наработка, м/час</th>
            <th>Узел отказа</th>
            <th>Описание отказа</th>
            <th>Способ восстановления</th>
            <th>Время простоя</th>
            <th>Машина</th>
          </tr>
        </thead>
        <tbody>
          {complaints
            .filter((complaint) => {
              return (
                (!complaintFilters.failure_node ||
                  complaint.failure_node?.name?.toLowerCase().includes(complaintFilters.failure_node.toLowerCase())) &&
                (!complaintFilters.recovery_method ||
                  complaint.recovery_method?.name
                    ?.toLowerCase()
                    .includes(complaintFilters.recovery_method.toLowerCase())) &&
                (!complaintFilters.service_company ||
                  complaint.service_company_name
                    ?.toLowerCase()
                    .includes(complaintFilters.service_company.toLowerCase()))
              )
            })
            .map((complaint) => (
              <tr
                key={complaint.id}
                className={styles.tableRow}
                onClick={() => (window.location.href = `/complaints/${complaint.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{complaint.failure_date ? new Date(complaint.failure_date).toLocaleDateString("ru-RU") : "—"}</td>
                <td>{complaint.operating_hours || "—"}</td>
                <td className={styles.typeCell}>{complaint.failure_node?.name || "—"}</td>
                <td className={styles.descriptionCell}>{complaint.failure_description || "—"}</td>
                <td>{complaint.recovery_method?.name || "—"}</td>
                <td>
                  <div className={styles.downtimeCell}>{complaint.downtime ? `${complaint.downtime} дней` : "—"}</div>
                  {complaint.recovery_date && (
                    <div className={styles.subText}>
                      до {new Date(complaint.recovery_date).toLocaleDateString("ru-RU")}
                    </div>
                  )}
                </td>
                <td className={styles.serialCell}>№ {complaint.machine_serial}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className={styles.container}>
      {/* User Info Header */}
      <div className={styles.userHeader}>
        <div className={styles.userInfo}>
          <div className={styles.userIcon}>
            <User size={24} />
          </div>
          <div>
            <h3 className={styles.userName}>
              {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
            </h3>
            <p className={styles.userRole}>{user.groups?.length > 0 ? user.groups[0] : "Пользователь"}</p>
          </div>
        </div>
        <button onClick={onLogout} className={styles.logoutButton}>
          <LogOut size={20} />
          Выйти
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsList}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className={styles.tabCount}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <p>Загрузка данных...</p>
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <p className={styles.errorText}>{error}</p>
              <button onClick={loadData} className={styles.retryButton}>
                Повторить
              </button>
            </div>
          ) : (
            <>
              {activeTab === "machines" && renderMachinesTable()}
              {activeTab === "maintenance" && renderMaintenanceTable()}
              {activeTab === "complaints" && renderComplaintsTable()}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthTabs
