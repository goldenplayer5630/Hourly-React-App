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
import Notification, { NotificationState } from '../components/Common/Notification';

const WorkSessionsPage = () => {
  const [sessions, setSessions] = useState<WorkSessionResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [userContracts, setUserContracts] = useState<UserContractResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedUserContract,  setSelectedUserContract] = useState<UserContractResponse | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(new Date().getMonth() + 1).padStart(2, '0')
  );
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [wbsoOnly, setWbsoOnly] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [gitCommits, setGitCommits] = useState<GitCommitResponse[]>([]);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedSession, setSelectedSession] = useState<WorkSessionResponse | undefined>();
  const [notification, setNotification] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);


  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, i) => currentYear - i);
  };

  const handleAddWorkSession = () => {
    setModalMode('create');
    setSelectedSession(undefined);
    setOpenModal(true);
  };

  const handleLockSessions = (lock: boolean) => {
    if (lock) {
      if (!window.confirm('Are you sure you want to lock all sessions for this month?')) return;
    } else {
      if (!window.confirm('Are you sure you want to unlock all sessions for this month?')) return;
    }
  
    const targetMonth = parseInt(selectedMonth, 10);

    if (lock) {
      userContractService.lockMonth(selectedUserContract?.id || '', selectedYear, targetMonth)
        .then(() => {
          setNotification({
            message: 'Sessions locked successfully',
            severity: 'success',
          });
          refreshSessions();
        })
        .catch((err) => {
          setNotification({
            message: `Error locking sessions: ${err.message}`,
            severity: 'error',
          });
        });
    } else {
      userContractService.unlockMonth(selectedUserContract?.id || '', selectedYear, targetMonth)
        .then(() => {
          setNotification({
            message: 'Sessions unlocked successfully',
            severity: 'success',
          });
          refreshSessions();
        })
        .catch((err) => {
          setNotification({
            message: `Error unlocking sessions: ${err.message}`,
            severity: 'error',
          });
        });
    }

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
        .catch((err) => {
          setNotification({
            message: `Error deleting session: ${err.message}`,
            severity: 'error',
          });
        });
    }
  };

  const refreshSessions = () => {
    if (!selectedUserContract) return;

    workSessionService
      .filter(selectedUserContract.id, selectedYear, parseInt(selectedMonth, 10), wbsoOnly)
      .then(setSessions)
      .catch((err) => {
        setNotification({
          message: 'Error fetching work sessions',
          severity: 'error',
        });
      });
  };

  useEffect(() => {
    userService.getAll()
      .then(setUsers)
      .catch((err) => setNotification({
        message: 'Error fetching users',
        severity: 'error',
      }));

  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    userContractService.filter(selectedUser, undefined, undefined)
      .then(setUserContracts)
      .catch((err) => setNotification({
        message: 'Error fetching user contracts',
        severity: 'error',
      }));

  }, [selectedUser]);

  useEffect(() => {
    refreshSessions();
  }, [selectedUserContract, selectedYear, selectedMonth, wbsoOnly]);

  useEffect(() => {
    if (!selectedUser) return;

    gitCommitService.filter()
      .then(setGitCommits);
  }, []);

  return (
    <div>
      <h1>Work Sessions</h1>
      <WorkSessionHeader
        selectedUser={selectedUser}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        selectedUserContract={selectedUserContract || {} as UserContractResponse}
        onUserChange={setSelectedUser}
        onUserContractChange={setSelectedUserContract}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
        wbsoOnly={wbsoOnly}
        onToggleWBSO={() => setWbsoOnly((prev) => !prev)}
        onAddWorkSession={handleAddWorkSession}
        onLockSessions={() => handleLockSessions(true)}
        onUnlockSessions={() => handleLockSessions(false)}
        users={users}
        userContracts={userContracts}
        sessions={sessions}
        availableYears={getAvailableYears()}
      />
      
      {selectedUserContract && (
        <WorkSessionList
          sessions={sessions}
          selectedUserContract={selectedUserContract}
          onView={selectedSession => handleViewWorkSession(selectedSession)}
          onEdit={selectedSession => handleEditWorkSession(selectedSession)}
          onDelete={selectedSession => handleDeleteWorkSession(selectedSession)}
        />
      )}


      {selectedUserContract && (
        <WorkSessionModal
          open={openModal}
          mode={modalMode}
          selectedSession={selectedSession}
          onClose={() => setOpenModal(false)}
          onSubmit={() => {
            setOpenModal(false);
            refreshSessions();
          }}
          selectedUser={selectedUser}
          selectedUserContract={selectedUserContract}
        />
      )}

    <Notification notification={notification} onClose={() => setNotification(null)} />
    </div>
  );
};

export default WorkSessionsPage;
