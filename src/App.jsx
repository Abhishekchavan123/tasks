import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import './App.css'
import { useNavigate } from 'react-router-dom'

function App() {
  // State management for tasks and form inputs
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  
  // State management for editing functionality
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  
  // Loading state for better UX
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  // ===== READ OPERATION =====
  // Load tasks from Supabase on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  // Function to fetch all tasks from Supabase database
  const fetchTasks = async () => {
    try {
      setLoading(true)
      // SELECT * FROM tasks ORDER BY created_at DESC
      const { data, error } = await supabase
        .from('tasks')           // Target table name
        .select('*')             // Select all columns
        .order('created_at', { ascending: false })  // Order by newest first

      if (error) {
        console.error('Error fetching tasks:', error)
        return
      }

      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  // ===== CREATE OPERATION (INSERT) =====
  // Function to add a new task to Supabase database
  const addTask = async () => {
    if (title.trim() && description.trim()) {
      try {
        // INSERT INTO tasks (title, description) VALUES (?, ?) RETURNING *
        const { data, error } = await supabase
          .from('tasks')           // Target table name
          .insert([                // Insert operation with array of objects
            {
              title: title.trim(),
              description: description.trim()
            }
          ])
          .select()                // Return the inserted data

        if (error) {
          console.error('Error adding task:', error)
          return
        }

        // Add new task to the beginning of the list (newest first)
        setTasks([data[0], ...tasks])
        setTitle('')
        setDescription('')
      } catch (error) {
        console.error('Error adding task:', error)
      }
    }
  }

  // ===== DELETE OPERATION =====
  // Function to delete a task from Supabase database
  const deleteTask = async (id) => {
    try {
      // DELETE FROM tasks WHERE id = ?
      const { error } = await supabase
        .from('tasks')           // Target table name
        .delete()                // Delete operation
        .eq('id', id)            // WHERE clause: id equals the provided id

      if (error) {
        console.error('Error deleting task:', error)
        return
      }

      // Remove task from local state
      setTasks(tasks.filter(task => task.id !== id))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  // ===== UPDATE OPERATION (EDIT) =====
  // Function to start editing mode for a task
  const startEdit = (task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description)
  }

  // Function to save edited task to Supabase database
  const saveEdit = async () => {
    if (editTitle.trim() && editDescription.trim()) {
      try {
        // UPDATE tasks SET title = ?, description = ? WHERE id = ? RETURNING *
        const { data, error } = await supabase
          .from('tasks')           // Target table name
          .update({                // Update operation with object of new values
            title: editTitle.trim(),
            description: editDescription.trim()
          })
          .eq('id', editingId)     // WHERE clause: id equals the editing task id
          .select()                // Return the updated data

        if (error) {
          console.error('Error updating task:', error)
          return
        }

        // Update task in local state with the returned data
        setTasks(tasks.map(task => 
          task.id === editingId ? data[0] : task
        ))
        
        // Reset editing state
        setEditingId(null)
        setEditTitle('')
        setEditDescription('')
      } catch (error) {
        console.error('Error updating task:', error)
      }
    }
  }

  // Function to cancel editing mode
  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
  }

  return (
    <div className="app">
      <h1>Task Manager CRUD</h1>
      <button onClick={() => navigate('/view-tasks')} className="view-tasks-button">View All Tasks</button>
      {/* ===== CREATE TASK SECTION ===== */}
      <div className="add-task-section">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="task-input"
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="task-textarea"
        />
        {/* Button triggers INSERT operation */}
        <button onClick={addTask} className="add-button">
          Add Task
        </button>
      </div>

      {/* ===== DISPLAY TASKS SECTION ===== */}
      <div className="tasks-section">
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="no-tasks">No tasks found. Add your first task above!</div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task-card">
              {editingId === task.id ? (
                // ===== EDIT MODE =====
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
                    {/* Button triggers UPDATE operation */}
                    <button onClick={saveEdit} className="save-button">
                      Save
                    </button>
                    <button onClick={cancelEdit} className="cancel-button">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // ===== VIEW MODE =====
                <>
                  <h3 className="task-title">{task.title}</h3>
                  <p className="task-description">{task.description}</p>
                  <div className="task-buttons">
                    {/* Button triggers EDIT mode (not database operation yet) */}
                    <button onClick={() => startEdit(task)} className="edit-button">
                      Edit
                    </button>
                    {/* Button triggers DELETE operation */}
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

export default App
