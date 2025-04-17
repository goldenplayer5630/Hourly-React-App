import { useEffect, useState } from 'react';
import { workSessionService } from '../services/WorkSessionService';
import { WorkSessionResponse } from '../classes/WorkSessionResponse';
import WorkSessionCard from '../components/workSession/WorkSessionCard';

const WorkSessionPage = () => {
  const [sessions, setSessions] = useState<WorkSessionResponse[]>([]);

  useEffect(() => {
    workSessionService.getAll().then(setSessions).catch(console.error);
  }, []);

  return (
    <div>
      <h1>All Sessions</h1>
      {sessions.map((s) => (
        <WorkSessionCard session={s}></WorkSessionCard>
      ))}
    </div>
  );
};

export default WorkSessionPage;