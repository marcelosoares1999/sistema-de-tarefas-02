import { useEffect, useState } from 'react';
import axios from 'axios';

import Board from './components/Board.jsx';
import './app.css';

const API = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  const [token, setToken] = useState(
    localStorage.getItem('token')
  );

  const [tasks, setTasks] = useState([]);

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: ''
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    due_date: ''
  });

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  async function fetchTasks() {
    if (!token) return;

    try {
      const response = await axios.get(
        `${API}/api/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTasks(response.data);

    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        logout();
      }
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [token]);

  async function handleAuth(e) {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin
        ? '/api/auth/login'
        : '/api/auth/register';

      const response = await axios.post(
        `${API}${endpoint}`,
        form
      );

      localStorage.setItem(
        'token',
        response.data.token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      );

      setToken(response.data.token);
      setUser(response.data.user);

    } catch (error) {
      setError(
        error.response?.data?.error ||
        'Erro ao realizar operação'
      );
    }
  }

  async function addTask(e) {
    e.preventDefault();

    if (!taskForm.title.trim()) return;

    try {
      await axios.post(
        `${API}/api/tasks`,
        taskForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTaskForm({
        title: '',
        description: '',
        status: 'todo',
        due_date: ''
      });

      fetchTasks();

    } catch (error) {
      console.error(error);
      alert('Erro ao criar tarefa');
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
    setTasks([]);
  }

  if (!user) {
    return (
      <div className="auth">
        <h1>📋 Sistema de Tarefas</h1>

        <form onSubmit={handleAuth}>
          {!isLogin && (
            <input
              placeholder="Nome"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />

          <input
            type="password"
            placeholder="Senha"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
          />

          <button>
            {isLogin ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <button
          className="secondary"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
        >
          {isLogin
            ? 'Criar uma conta'
            : 'Já tenho uma conta'}
        </button>
      </div>
    );
  }

  return (
    <div className="app">

      <header className="header">
        <div>
          <h1>📋 Minhas Tarefas</h1>
          <span>
            Olá, {user.name}
          </span>
        </div>

        <button onClick={logout}>
          Sair
        </button>
      </header>

      <form className="add" onSubmit={addTask}>
        <input
          placeholder="Nova tarefa..."
          value={taskForm.title}
          onChange={(e) =>
            setTaskForm({
              ...taskForm,
              title: e.target.value
            })
          }
        />

        <input
          type="date"
          value={taskForm.due_date}
          onChange={(e) =>
            setTaskForm({
              ...taskForm,
              due_date: e.target.value
            })
          }
        />

        <button>
          Adicionar
        </button>
      </form>

      <Board
        tasks={tasks}
        token={token}
        onRefresh={fetchTasks}
      />

    </div>
  );
}