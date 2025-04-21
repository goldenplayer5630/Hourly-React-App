import React from 'react';
import WorkSessionCard from './WorkSessionCard';
import { WorkSessionResponse } from '../../interfaces/WorkSessionResponse'; // or wherever your model is

type Props = {
  sessions: WorkSessionResponse[]; // ✅ Make sure it's plural
};

const WorkSessionList: React.FC<Props> = ({ sessions }) => {
  if (!sessions.length) return <p>No sessions available.</p>;

  return (
    <div>
      <h1>All Sessions</h1>
      {sessions.map((s) => (
        <WorkSessionCard session={s}></WorkSessionCard>
      ))}
    </div>
  );
};

export default WorkSessionList;
