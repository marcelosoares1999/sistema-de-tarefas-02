import { useDraggable } from '@dnd-kit/core';
import axios from 'axios';
export default function TaskCard({task, token}){
  const {attributes, listeners, setNodeRef, transform} = useDraggable({id: task.id});
  const style = transform? {transform:`translate(${transform.x}px, ${transform.y}px)`} : undefined;
  const del = async () => { await axios.delete(`/api/tasks/${task.id}`, {headers:{Authorization:`Bearer ${token}`}}); };
  return (
    <div ref={setNodeRef} style={style} className="card">
      <div {...listeners} {...attributes} className="drag-handle">⠿ {task.title}</div>
      {task.due_date && <small>Prazo: {new Date(task.due_date).toLocaleDateString()}</small>}
      <button onClick={del}>x</button>
    </div>
  );
}