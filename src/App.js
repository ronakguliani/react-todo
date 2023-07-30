import React, { createContext, useState, useContext, useEffect } from 'react';
import './App.css';

const ThemeContext = createContext();

function withTheme(Component) {
  return function WrapperComponent(props) {
    // Get theme from localStorage or default to 'light'
    const [theme, setTheme] = useState(() => {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme ? savedTheme : 'light';
    });

    const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      // Save theme to localStorage
      localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
      document.body.className = theme;
    }, [theme]);

    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <Component {...props} />
      </ThemeContext.Provider>
    );
  };
}


function TaskForm({ addTask }) {
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task !== '') {
      addTask(task);
      setTask('');
    }
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <div>
      <p>Current Date: {currentDate}</p>
      <form onSubmit={handleSubmit}>
        <input type="text" value={task} onChange={(e) => setTask(e.target.value)} />
        <button type="submit">Add task</button>
      </form>
    </div>
  );
}

function Task({ task, removeTask }) {
  return (
    <li>
      {task}
      <button style={{ color: 'red' }} onClick={() => removeTask(task)}>Remove</button>
    </li>
  );
}

function TaskList({ tasks, removeTask }) {
  return (
    <ul>
      {tasks.map((task, index) => (
        <Task key={index} task={task} removeTask={removeTask} />
      ))}
    </ul>
  );
}

function App() {
  // Initialize state with tasks from localStorage or an empty array if none exist
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const { theme, toggleTheme } = useContext(ThemeContext);

  const addTask = (task) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    // Save tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const removeTask = (taskToRemove) => {
    const newTasks = tasks.filter(task => task !== taskToRemove);
    setTasks(newTasks);
    // Save tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  return (
    <div className={theme}>
      <button onClick={toggleTheme}>Toggle theme</button>
      <TaskForm addTask={addTask} />
      <TaskList tasks={tasks} removeTask={removeTask} />
    </div>
  );
}


export default withTheme(App);
