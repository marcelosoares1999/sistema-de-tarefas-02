import TaskCard from './TaskCard.jsx';

export default function Column({
  id,
  title,
  tasks,
  token,
  onRefresh
}) {
  return (
    <div className="col">

      <h3>{title}</h3>

      {tasks.length === 0 && (
        <p className="empty">
          Nenhuma tarefa
        </p>
      )}

      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          token={token}
          onRefresh={onRefresh}
        />
      ))}

    </div>
  );
}