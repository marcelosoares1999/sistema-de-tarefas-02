import Column from './Column.jsx';

export default function Board({
  tasks,
  token,
  onRefresh
}) {
  const todo = tasks.filter(
    task => task.status === 'todo'
  );

  const doing = tasks.filter(
    task => task.status === 'doing'
  );

  const done = tasks.filter(
    task => task.status === 'done'
  );

  return (
    <div className="board">

      <Column
        id="todo"
        title="A fazer"
        tasks={todo}
        token={token}
        onRefresh={onRefresh}
      />

      <Column
        id="doing"
        title="Em andamento"
        tasks={doing}
        token={token}
        onRefresh={onRefresh}
      />

      <Column
        id="done"
        title="Concluído"
        tasks={done}
        token={token}
        onRefresh={onRefresh}
      />

    </div>
  );
}

