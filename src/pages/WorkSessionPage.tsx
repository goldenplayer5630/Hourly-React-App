import { useEffect, useState } from 'react';
import { workSessionService } from '../services/WorkSessionService';
import { WorkSessionResponse } from '../interfaces/WorkSessionResponse';
import WorkSessionList from '../components/workSession/WorkSessionList';
import WorkSessionHeader from '../components/workSession/WorkSessionHeader';

const WorkSessionPage = () => {
  const [sessions, setSessions] = useState<WorkSessionResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('1'); // default user ID
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(new Date().getMonth() + 1).padStart(2, '0')
  );
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear()); // default 2025
  const [wbsoOnly, setWbsoOnly] = useState<boolean>(false);

  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, i) => currentYear - i);
  }

  const handleAddWorkSession = () => {
    // Open a dialog or redirect to a form
  };

  useEffect(() => {
    workSessionService
      .filter(undefined, selectedYear, parseInt(selectedMonth, 10), wbsoOnly)
      .then(setSessions)
      .catch(console.error);
  }, [selectedUser, selectedYear, selectedMonth, wbsoOnly]);
  

  return (
    <div>
      <h1>Work Sessions</h1>
      <WorkSessionHeader
        selectedUser={selectedUser}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onUserChange={setSelectedUser}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
        wbsoOnly={wbsoOnly}
        onToggleWBSO={() => setWbsoOnly((prev) => !prev)}
        onAddWorkSession={handleAddWorkSession}
        users={[{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }]}
        availableYears={getAvailableYears()} // current years,
      />
      <WorkSessionList sessions={sessions}/>
    </div>
  );
};

export default WorkSessionPage;