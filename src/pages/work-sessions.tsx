// src/pages/work-sessions.tsx
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom'; // NEW
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
import Notification from '../components/Common/Notification';
import WorkSessionSummary from '../components/WorkSession/WorkSessionSummary';
import { MonthlySummary } from '../interfaces/Summaries/MonthlySummary';

const WorkSessionsPage = () => {
  const [searchParams] = useSearchParams();               // NEW
  const desiredContractIdRef = useRef<string | null>(null); // NEW
  const didInitFromParams = useRef(false);                  // NEW

  const [sessions, setSessions] = useState<WorkSessionResponse[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | undefined>(undefined);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [userContracts, setUserContracts] = useState<UserContractResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedUserContract,  setSelectedUserContract] = useState<UserContractResponse | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth() + 1).padStart(2, '0'));
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
          setNotification({ message: 'Sessions locked successfully', severity: 'success' });
          refreshSessions();
        })
        .catch((err) => setNotification({ message: `Error locking sessions: ${err.message}`, severity: 'error' }));
    } else {
      userContractService.unlockMonth(selectedUserContract?.id || '', selectedYear, targetMonth)
        .then(() => {
          setNotification({ message: 'Sessions unlocked successfully', severity: 'success' });
          refreshSessions();
        })
        .catch((err) => setNotification({ message: `Error unlocking sessions: ${err.message}`, severity: 'error' }));
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
        .then(() => setSessions((prev) => prev.filter((s) => s.id !== session.id)))
        .catch((err) => setNotification({ message: `Error deleting session: ${err.message}`, severity: 'error' }));
    }
  };

  const refreshSessions = () => {
    if (!selectedUserContract) return;

    workSessionService
      .filter(selectedUserContract.id, selectedYear, parseInt(selectedMonth, 10), wbsoOnly)
      .then(setSessions)
      .catch(() => setNotification({ message: 'Error fetching work sessions', severity: 'error' }));

    userContractService
      .getMonthlySummary(selectedUserContract.id, selectedYear, parseInt(selectedMonth, 10))
      .then(setMonthlySummary)
      .catch(() => setNotification({ message: 'Error fetching monthly summary', severity: 'error' }));
  };

  // ---- NEW: Initialize from URL query params once on mount
  useEffect(() => {
    if (didInitFromParams.current) return;
    didInitFromParams.current = true;

    const userIdParam = searchParams.get('user') ?? '';
    const contractIdParam = searchParams.get('contract') ?? '';
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');

    if (yearParam && !Number.isNaN(Number(yearParam))) {
      setSelectedYear(Number(yearParam));
    }
    if (monthParam && /^\d{2}$/.test(monthParam)) {
      setSelectedMonth(monthParam);
    }

    if (userIdParam) {
      setSelectedUser(userIdParam);
    }

    // stash desired contract until contracts are loaded
    desiredContractIdRef.current = contractIdParam || null;
  }, [searchParams]);

  // Load users once
  useEffect(() => {
    userService.getAll()
      .then(setUsers)
      .catch(() => setNotification({ message: 'Error fetching users', severity: 'error' }));
  }, []);

  // Load contracts when user changes
  useEffect(() => {
    if (!selectedUser) {
      setUserContracts([]);
      setSelectedUserContract(undefined);
      return;
    }

    userContractService.filter(selectedUser, undefined, undefined)
      .then((contracts) => {
        setUserContracts(contracts);

        // If a desired contract was in the URL, apply it when available
        const desired = desiredContractIdRef.current;
        if (desired) {
          const found = contracts.find((c) => c.id === desired);
          if (found) {
            setSelectedUserContract(found);
            desiredContractIdRef.current = null; // clear to avoid re-applying
          } else {
            // Fallback: clear if not found
            setSelectedUserContract(undefined);
          }
        } else {
          // If current selection no longer exists, clear it
          if (selectedUserContract && !contracts.find((c) => c.id === selectedUserContract.id)) {
            setSelectedUserContract(undefined);
          }
        }
      })
      .catch(() => setNotification({ message: 'Error fetching user contracts', severity: 'error' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  // When contracts list updates and we still have a desired contract, try to set it.
  useEffect(() => {
    const desired = desiredContractIdRef.current;
    if (!desired || userContracts.length === 0) return;
    const found = userContracts.find((c) => c.id === desired);
    if (found) {
      setSelectedUserContract(found);
      desiredContractIdRef.current = null;
    }
  }, [userContracts]);

  // Refresh sessions whenever key filters change
  useEffect(() => {
    refreshSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserContract, selectedYear, selectedMonth, wbsoOnly]);

  // Git commits (your previous code had selectedUser guard, but it ran with [] deps)
  useEffect(() => {
    if (!selectedUser) return;
    gitCommitService.filter().then(setGitCommits);
  }, [selectedUser]);

  return (
    <div>
      <h1>Work Sessions</h1>
      <WorkSessionHeader
        selectedUser={selectedUser}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        selectedUserContract={selectedUserContract || ({} as UserContractResponse)}
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

      {selectedUserContract && monthlySummary && (
        <WorkSessionSummary
          monthlySummary={monthlySummary}
          userContract={selectedUserContract} // if you implemented the min/max summary
        />
      )}

      {selectedUserContract && (
        <WorkSessionList
          sessions={sessions}
          selectedUserContract={selectedUserContract}
          onView={handleViewWorkSession}
          onEdit={handleEditWorkSession}
          onDelete={handleDeleteWorkSession}
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
