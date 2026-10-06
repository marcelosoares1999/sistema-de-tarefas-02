import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

export default function TaskCard({
  task,
  token,
  onRefresh
}) {
  async function deleteTask() {
    if (!confirm('Excluir esta tarefa?')) return;

    try {
      await axios.delete(
        `${API}/api/tasks/${task.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      onRefresh();

    } catch (error) {
      console.error(error);
      alert('Erro ao excluir tarefa');
    }
  }

  async function changeStatus(status) {
    try {
      await axios.put(
        `${API}/api/tasks/${task.id}`,
        {
          title: task.title,
          description: task.description,
          status,
          position: task.position,
          due_date: task.due_date
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      onRefresh();

    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar tarefa');
    }
  }

  return (
    <div className="card">

      <div>
        <strong>{task.title}</strong>

        {task.description && (
          <p>{task.description}</p>
        )}

        {task.due_date && (
          <small>
            Prazo:{' '}
            {new Date(task.due_date)
              .toLocaleDateString('pt-BR')}
          </small>
        )}
      </div>

      <div className="card-actions">

        {task.status !== 'todo' && (
          <button
            onClick={() => changeStatus('todo')}
          >
            A fazer
          </button>
        )}

        {task.status !== 'doing' && (
          <button
            onClick={() => changeStatus('doing')}
          >
            Andamento
          </button>
        )}

        {task.status !== 'done' && (
          <button
            onClick={() => changeStatus('done')}
          >
            Concluir
          </button>
        )}

        <button
          className="danger"
          onClick={deleteTask}
        >
          Excluir
        </button>

      </div>

    </div>
  );
}