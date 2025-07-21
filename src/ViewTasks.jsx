import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './App.css'
import { useNavigate } from 'react-router-dom'

function ViewTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setTasks(data || [])
    setLoading(false)
  }

  // Delete operation
  const deleteTask = async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
      if (error) {
        console.error('Error deleting task:', error)
        return
      }
      setTasks(tasks.filter(task => task.id !== id))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  // Edit operations
  const startEdit = (task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description)
  }

  const saveEdit = async () => {
    if (editTitle.trim() && editDescription.trim()) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .update({
            title: editTitle.trim(),
            description: editDescription.trim()
          })
          .eq('id', editingId)
          .select()
        if (error) {
          console.error('Error updating task:', error)
          return
        }
        setTasks(tasks.map(task =>
          task.id === editingId ? data[0] : task
        ))
        setEditingId(null)
        setEditTitle('')
        setEditDescription('')
      } catch (error) {
        console.error('Error updating task:', error)
      }
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
  }

  return (
    <div className="app">
      <h1>All Tasks (Full Operations)</h1>
      <button onClick={() => navigate('/')} className="back-button">Back to Main</button>
      <div className="tasks-section">
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="no-tasks">No tasks found.</div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task-card">
              {editingId === task.id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="task-input"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="task-textarea"
                  />
                  <div className="edit-buttons">
                    <button onClick={saveEdit} className="save-button">
                      Save
                    </button>
                    <button onClick={cancelEdit} className="cancel-button">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="task-title">{task.title}</h3>
                  <p className="task-description">{task.description}</p>
                  <div className="task-buttons">
                    <button onClick={() => startEdit(task)} className="edit-button">
                      Edit
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="delete-button">
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ViewTasks 