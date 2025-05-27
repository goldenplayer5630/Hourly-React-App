import { useEffect, useState } from 'react';
import { workSessionService } from '../services/WorkSessionService';
import { GitCommitResponse } from '../interfaces/GitCommits/GitCommitResponse';
import { WorkSessionResponse } from '../interfaces/WorkSessions/WorkSessionResponse';
import WorkSessionList from '../components/WorkSession/WorkSessionList';
import WorkSessionHeader from '../components/WorkSession/WorkSessionHeader';
import { userService } from '../services/UserService';
import { UserResponse } from '../interfaces/Users/UserResponse';
import { gitCommitService } from '../services/GitCommitService';
import WorkSessionModal from '../components/WorkSession/WorkSessionModal';
import { userContractService } from '../services/UserContractService';
import { UserContractResponse } from '../interfaces/UserContracts/UserContractResponse';

const WorkSessionsPage = () => {
  const [sessions, setSessions] = useState<WorkSessionResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [userContracts, setUserContracts] = useState<UserContractResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedUserContract,  setSelectedUserContract] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(new Date().getMonth() + 1).padStart(2, '0')
  );
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [wbsoOnly, setWbsoOnly] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [gitCommits, setGitCommits] = useState<GitCommitResponse[]>([]);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedSession, setSelectedSession] = useState<WorkSessionResponse | undefined>();


  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, i) => currentYear - i);
  };

  const handleAddWorkSession = () => {
    setModalMode('create');
    setSelectedSession(undefined);
    setOpenModal(true);
  };

  const handleEditWorkSession = (session: WorkSessionResponse) => {
    setModalMode('edit');
    setSelectedSession(session);
    setOpenModal(true);
  };

  const handleViewWorkSession = (session: WorkSessionResponse) => {
    setModalMode('view');
    setSelectedSession(session);
    setOpenModal(true);
  };

  const handleDeleteWorkSession = (session: WorkSessionResponse) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      workSessionService.delete(session.id)
        .then(() => {
          setSessions((prev) => prev.filter((s) => s.id !== session.id));
        })
        .catch(console.error);
    }
  };

  const refreshSessions = () => {
    if (!selectedUserContract) return;

    workSessionService
      .filter(selectedUserContract, selectedYear, parseInt(selectedMonth, 10), wbsoOnly)
      .then(setSessions)
      .catch(console.error);
  };

  useEffect(() => {
    userService.getAll()
      .then(setUsers)
      .catch((err) => console.error('Error fetching users:', err));

  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    userContractService.filter(selectedUser, undefined, undefined)
      .then(setUserContracts)
      .catch((err) => console.error('Error fetching user contracts:', err));

  }, [selectedUser]);

  useEffect(() => {
    refreshSessions();
  }, [selectedUserContract, selectedYear, selectedMonth, wbsoOnly]);

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
        selectedUserContract={selectedUserContract}
        onUserChange={setSelectedUser}
        onUserContractChange={setSelectedUserContract}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
        wbsoOnly={wbsoOnly}
        onToggleWBSO={() => setWbsoOnly((prev) => !prev)}
        onAddWorkSession={handleAddWorkSession}
        users={users}
        userContracts={userContracts}
        availableYears={getAvailableYears()}
      />
      
      <WorkSessionList
        sessions={sessions}
        onView={selectedSession => handleViewWorkSession(selectedSession)}
        onEdit={selectedSession => handleEditWorkSession(selectedSession)}
        onDelete={selectedSession => handleDeleteWorkSession(selectedSession)}
      />


      <WorkSessionModal
        open={openModal}
        mode={modalMode}
        selectedSession={selectedSession}
        onClose={() => setOpenModal(false)}
        onSubmit={() => {
          setOpenModal(false);
          refreshSessions();
        }}
        availableGitCommits={gitCommits}
        userContractId={selectedUserContract}
      />
    </div>
  );
};

export default WorkSessionsPage;
