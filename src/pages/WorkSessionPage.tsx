import { useEffect, useState } from 'react';
import { workSessionService } from '../services/WorkSessionService';
import { GitCommitResponse } from '../interfaces/GitCommitResponse';
import { WorkSessionResponse } from '../interfaces/WorkSessions/WorkSessionResponse';
import WorkSessionList from '../components/workSession/WorkSessionList';
import WorkSessionHeader from '../components/workSession/WorkSessionHeader';
import { userService } from '../services/UserService';
import { UserResponse } from '../interfaces/UserResponse';
import { gitCommitService } from '../services/GitCommitService';
import WorkSessionModal from '../components/workSession/WorkSessionModal';

const WorkSessionPage = () => {
  const [sessions, setSessions] = useState<WorkSessionResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('1');
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(new Date().getMonth() + 1).padStart(2, '0')
  );
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [wbsoOnly, setWbsoOnly] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [gitCommits, setGitCommits] = useState<GitCommitResponse[]>([]);

  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, i) => currentYear - i);
  };

  const handleAddWorkSession = () => {
    setOpenModal(true);
  };

  const refreshSessions = () => {
    workSessionService
      .filter(selectedUser, selectedYear, parseInt(selectedMonth, 10), wbsoOnly)
      .then(setSessions)
      .catch(console.error);
  };

  useEffect(() => {
    userService.getAll()
      .then(setUsers)
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  useEffect(() => {
    refreshSessions();
  }, [selectedUser, selectedYear, selectedMonth, wbsoOnly]);

  useEffect(() => {
    gitCommitService.getAll()
      .then(setGitCommits);
  }, []);

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
        users={users}
        availableYears={getAvailableYears()}
      />
      <WorkSessionList sessions={sessions} />

      <WorkSessionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={() => {
          setOpenModal(false);
          refreshSessions();
        }}
        availableGitCommits={gitCommits}
        userId={selectedUser}
      />
    </div>
  );
};

export default WorkSessionPage;
