import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState('light');
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('todos');
    if (stored) setTodos(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { text: input, completed: false, priority: 'medium' }]);
    setInput('');
  };

  const toggleComplete = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newTodos = [...todos];
    [newTodos[index - 1], newTodos[index]] = [newTodos[index], newTodos[index - 1]];
    setTodos(newTodos);
  };

  const moveDown = (index) => {
    if (index === todos.length - 1) return;
    const newTodos = [...todos];
    [newTodos[index + 1], newTodos[index]] = [newTodos[index], newTodos[index + 1]];
    setTodos(newTodos);
  };

  const changePriority = (index, newPriority) => {
    const newTodos = [...todos];
    newTodos[index].priority = newPriority;
    setTodos(newTodos);
  };

  const sortByPriority = () => {
    const priorityMap = { high: 2, medium: 1, low: 0 };
    const sortedTodos = [...todos].sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);
    setTodos(sortedTodos);
  };

  const handleDragStart = (e, index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    const newTodos = [...todos];
    const draggedItem = newTodos[dragItem.current];
    newTodos.splice(dragItem.current, 1);
    newTodos.splice(dragOverItem.current, 0, draggedItem);

    dragItem.current = null;
    dragOverItem.current = null;
    setTodos(newTodos);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>My To-Do List</h1>
        <div className="theme-switcher">
          <button onClick={() => changeTheme('light')} className={theme === 'light' ? 'active' : ''}>☀️</button>
          <button onClick={() => changeTheme('dark')} className={theme === 'dark' ? 'active' : ''}>🌙</button>
          <button onClick={() => changeTheme('purple')} className={theme === 'purple' ? 'active' : ''}>🟣</button>
          <button onClick={() => changeTheme('ocean')} className={theme === 'ocean' ? 'active' : ''}>🌊</button>
        </div>

        <div className="input-box">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs to be done?"
          />
          <button className="add-btn" onClick={addTodo}>
            Add
          </button>
        </div>

        <button className="sort-btn" onClick={sortByPriority}>Sort by Priority</button>

        <ul className="todo-list">
          {todos.map((todo, index) => (
            <li
              key={index}
              className={`todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={handleDragEnd}>
              <span className="todo-text" onClick={() => toggleComplete(index)}>
                {todo.text}
              </span>

              <select
                value={todo.priority}
                onChange={(e) => changePriority(index, e.target.value)}
                className="priority-select"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <button className="move-btn" onClick={() => moveUp(index)} disabled={index === 0}>↑</button>
              <button className="move-btn" onClick={() => moveDown(index)} disabled={index === todos.length - 1}>↓</button>

              <button
                className="delete-btn"
                onClick={() => deleteTodo(index)}
                aria-label="Delete task"
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="empty-state">No tasks yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}

export default App;