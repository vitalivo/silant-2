"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { directoriesService } from "../services/api"
import styles from "../styles/DirectoriesManager.module.css"

const DirectoriesManager: React.FC = () => {
  const [activeDirectory, setActiveDirectory] = useState("technique-models")
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [newItem, setNewItem] = useState({ name: "", description: "" })
  const [showAddForm, setShowAddForm] = useState(false)

  const directories = [
    { key: "technique-models", name: "Модели техники", service: directoriesService.techniqueModels },
    { key: "engine-models", name: "Модели двигателей", service: directoriesService.engineModels },
    { key: "transmission-models", name: "Модели трансмиссий", service: directoriesService.transmissionModels },
    { key: "drive-axle-models", name: "Модели ведущих мостов", service: directoriesService.driveAxleModels },
    { key: "steer-axle-models", name: "Модели управляемых мостов", service: directoriesService.steerAxleModels },
    { key: "maintenance-types", name: "Виды ТО", service: directoriesService.maintenanceTypes },
    { key: "failure-nodes", name: "Узлы отказов", service: directoriesService.failureNodes },
    { key: "recovery-methods", name: "Способы восстановления", service: directoriesService.recoveryMethods },
    { key: "service-companies", name: "Сервисные компании", service: directoriesService.serviceCompanies },
  ]

  const currentDirectory = directories.find((d) => d.key === activeDirectory)

  useEffect(() => {
    loadItems()
  }, [activeDirectory])

  const loadItems = async () => {
    if (!currentDirectory) return

    setLoading(true)
    try {
      const response = await currentDirectory.service.getAll()
      setItems(response.data.results || response.data)
    } catch (error) {
      console.error("Ошибка загрузки:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!currentDirectory || !newItem.name.trim()) return

    try {
      await currentDirectory.service.create(newItem)
      setNewItem({ name: "", description: "" })
      setShowAddForm(false)
      loadItems()
    } catch (error) {
      console.error("Ошибка создания:", error)
    }
  }

  const handleEdit = async (item: any) => {
    if (!currentDirectory) return

    try {
      await currentDirectory.service.update(item.id, {
        name: item.name,
        description: item.description,
      })
      setEditingItem(null)
      loadItems()
    } catch (error) {
      console.error("Ошибка обновления:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!currentDirectory || !confirm("Вы уверены, что хотите удалить этот элемент?")) return

    try {
      await currentDirectory.service.delete(id)
      loadItems()
    } catch (error) {
      console.error("Ошибка удаления:", error)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>Справочники</h3>
        <div className={styles.directoryList}>
          {directories.map((directory) => (
            <button
              key={directory.key}
              className={`${styles.directoryItem} ${activeDirectory === directory.key ? styles.active : ""}`}
              onClick={() => setActiveDirectory(directory.key)}
            >
              {directory.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>{currentDirectory?.name}</h2>
          <button onClick={() => setShowAddForm(true)} className={styles.addButton}>
            <Plus size={16} />
            Добавить
          </button>
        </div>

        {showAddForm && (
          <div className={styles.addForm}>
            <div className={styles.formRow}>
              <input
                type="text"
                placeholder="Название"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Описание (необязательно)"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className={styles.input}
              />
              <div className={styles.formActions}>
                <button onClick={handleAdd} className={styles.saveButton}>
                  <Save size={16} />
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setNewItem({ name: "", description: "" })
                  }}
                  className={styles.cancelButton}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : (
          <div className={styles.itemsList}>
            {items.map((item: any) => (
              <div key={item.id} className={styles.item}>
                {editingItem?.id === item.id ? (
                  <div className={styles.editForm}>
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className={styles.input}
                    />
                    <input
                      type="text"
                      value={editingItem.description || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className={styles.input}
                      placeholder="Описание"
                    />
                    <div className={styles.itemActions}>
                      <button onClick={() => handleEdit(editingItem)} className={styles.saveButton}>
                        <Save size={16} />
                      </button>
                      <button onClick={() => setEditingItem(null)} className={styles.cancelButton}>
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{item.name}</div>
                      {item.description && <div className={styles.itemDescription}>{item.description}</div>}
                    </div>
                    <div className={styles.itemActions}>
                      <button onClick={() => setEditingItem(item)} className={styles.editButton}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className={styles.deleteButton}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DirectoriesManager
