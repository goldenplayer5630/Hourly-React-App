import React from 'react';
import WorkSessionCard from './WorkSessionCard';
import { WorkSessionResponse } from '../../classes/WorkSessionResponse'; // or wherever your model is

type Props = {
  sessions: WorkSessionResponse[]; // ✅ Make sure it's plural
};

const WorkSessionList: React.FC<Props> = ({ sessions }) => {
  if (!sessions.length) return <p>No sessions available.</p>;

  return (
    <h1>tyf op</h1>
  );
};

export default WorkSessionList;
