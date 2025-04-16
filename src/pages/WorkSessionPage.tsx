import { useEffect, useState } from 'react';
import { workSessionService } from '../services/WorkSessionService';
import { WorkSessionResponse } from '../classes/WorkSessionResponse';

const WorkSessionPage = () => {
  const [sessions, setSessions] = useState<WorkSessionResponse[]>([]);

  useEffect(() => {
    workSessionService.getAll().then(setSessions).catch(console.error);
  }, []);

  return (
    <div>
      <h1>All Sessions</h1>
      {sessions.map((s) => (
        <div key={s.id}>{s.taskDescription}</div>
      ))}
    </div>
  );
};
