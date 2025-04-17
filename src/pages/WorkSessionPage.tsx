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
        <WorkSessionCard startTime={s.startTime} endTime={s.endTime} taskDescription={s.taskDescription} wbso={s.wbso} factor={s.factor}></WorkSessionCard>
      ))}
    </div>
  );
};

export default WorkSessionPage;