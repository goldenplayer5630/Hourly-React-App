import './App.css';
import React, { useEffect, useState } from 'react';
import WorkSessionList from './components/workSession/WorkSessionList';
import { WorkSessionResponse } from './classes/WorkSessionResponse';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<WorkSessionResponse[]>([]);

  useEffect(() => {
    fetch('https://localhost:7280/api/worksession')
      .then(res => res.json())
      .then(data => setSessions(data))
      .catch(err => console.error('Error fetching work sessions:', err));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Work Sessions</h1>
      <WorkSessionList sessions={sessions} />
    </div>
  );
};

export default App;
