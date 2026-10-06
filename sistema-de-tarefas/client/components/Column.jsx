import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import TaskCard from './TaskCard.jsx';
export default function Column({id, title, tasks, token}){
  const {setNodeRef} = useDroppable({id});
  return (
    <div ref={setNodeRef} className="col">
      <h3>{title.toUpperCase()}</h3>
      <SortableContext items={tasks.map(t=>t.id)}>
        {tasks.map(t=> <TaskCard key={t.id} task={t} token={token} />)}
      </SortableContext>
    </div>
  );
} 