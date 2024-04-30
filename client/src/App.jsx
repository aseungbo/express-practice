import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState('');
  
  const handleInputChange = (e) => {
    setTodo(e.target.value);
  }

  const handleEditChange = (e) => {
    setEditTodoText(e.target.value);
  }

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/todos', {
      method: 'GET',
      mode: 'cors'
    });
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const todos = await response.json();
      setTodoList(todos);
    } catch (error) {
      console.error('Error fetching todos:', error.message);
    }
  };

  const handleAddTodo = async () => {
    try {
      if (todo.trim() !== '') {
        const response = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ text: todo }) 
        });
        if (!response.ok) {
          throw new Error('Failed to add todo');
        }
        fetchData();
        setTodo('');
      }
    } catch (error) {
      console.error('Error adding todo:', error.message);
    }
  };

  const handleDeleteTodo = async (todo) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${todo._id}`, {
        method: 'DELETE',
        mode: 'cors',
      })
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      fetchData();
    } catch (error) {
      console.error(error.message);
    }
  }

  const handleEditTodo = async () => {
    try {
      const response = await fetch('http://localhost:3000/todos', {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({_id: editTodoId, text: editTodoText})
      });
      if (!response.ok) {
        throw new Error('Failed to edit todo');
      } 
      fetchData();
      setEditTodoId(null);
    } catch (error) {
        console.error(error);
    }
  }
  
  useEffect(() => {
    fetchData();
  }, [])

  return (
    <>
      <div>
      <h1>Todo List</h1>
      </div>
      <div className="card">
        <input
          type="text"
          placeholder="Add a new todo"
          value={todo}
          onChange={handleInputChange}
        />

        <button onClick={handleAddTodo}>
          Add
        </button>
      </div>
      <div>
        <ul>
          {todoList.map(todo => (
              <li key={todo._id}>
                {editTodoId !== todo._id ? (
                  <>
                    <span>
                      {todo.text}
                    </span>
                    <button onClick={() => handleDeleteTodo(todo)}>
                      Delete
                    </button>
                    <button onClick={() => setEditTodoId(todo._id)}>
                      Edit
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Edit todo"
                      value={editTodoText.text}
                      onChange={handleEditChange}
                    />
                    <button onClick={handleEditTodo}>Done</button>
                  </>
                )}
              </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
