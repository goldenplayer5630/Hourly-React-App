// src/pages/yearly-dashboard.tsx
import { useEffect, useState } from 'react';
import { userService } from '../services/UserService';
import { userContractService } from '../services/UserContractService';
import { UserResponse } from '../interfaces/Users/UserResponse';
import { UserContractResponse } from '../interfaces/UserContracts/UserContractResponse';
import Notification from '../components/Common/Notification';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import DashboardYearlySummary from '../components/Dashboard/DashboardYearlySummary';
import { YearlySummary } from '../interfaces/Summaries/YearlySummary';
import DashboardMonthlyOverview from '../components/Dashboard/DashboardMonthlyOverview';
import { MonthlySummary } from '../interfaces/Summaries/MonthlySummary';
import DashboardYearlyHoursLineChart from '../components/Dashboard/DashboardYearlyHoursLineChart';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [userContracts, setUserContracts] = useState<UserContractResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedUserContract, setSelectedUserContract] = useState<UserContractResponse | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [monthlyOverview, setMonthlyOverview] = useState<MonthlySummary[] | undefined>(undefined);

  const [yearlySummary, setYearlySummary] = useState<YearlySummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, i) => currentYear - i);
  };

  const navigate = useNavigate();

  const refreshYearData = async () => {
    if (!selectedUserContract) return;
    setLoading(true);
    try {
      const summary = await userContractService.getYearlySummary(
        selectedUserContract.id,
        selectedYear
      );
      setYearlySummary(summary);
    } catch (err: any) {
      setNotification({
        message: 'Error fetching yearly summary',
        severity: 'error',
      });
      setYearlySummary(null);
    } finally {
      setLoading(false);
    }
  };

  // Load users once
  useEffect(() => {
    userService
      .getAll()
      .then(setUsers)
      .catch(() =>
        setNotification({
          message: 'Error fetching users',
          severity: 'error',
        })
      );
  }, []);
  

  // Build/clear monthly overview when yearly summary changes
  useEffect(() => {
    if (!yearlySummary) {
      setMonthlyOverview(undefined);
      return;
    }

    // If your API returns a monthly breakdown, adapt this mapping:
    // e.g. yearlySummary.months: Array<{ month: number, totalRawEffectiveHours: number, ... }>
    const months: any[] | undefined = (yearlySummary as YearlySummary).monthlySummaries;
    if (Array.isArray(months)) {
      const items: MonthlySummary[] = months.map((m) => ({
        month: m.month,
        totalRawEffectiveHours: m.totalRawEffectiveHours ?? 0,
        totalNetEffectiveHours: m.totalNetEffectiveHours ?? 0,
        totalTVTHoursAccrued: m.totalTVTHoursAccrued ?? 0,
        totalTVTHoursUsed: m.totalTVTHoursUsed ?? 0,
        userContractId: selectedUserContract?.id ?? '',
        year: selectedYear,
      }));
      setMonthlyOverview(items);
    } else {
      setMonthlyOverview(undefined);
    }
  }, [yearlySummary]);

  // Load contracts when user changes
  useEffect(() => {
    if (!selectedUser) {
      setUserContracts([]);
      setSelectedUserContract(null);
      return;
    }

    userContractService
      .filter(selectedUser, undefined, undefined)
      .then((contracts) => {
        setUserContracts(contracts);
        if (selectedUserContract && !contracts.find((c) => c.id === selectedUserContract.id)) {
          setSelectedUserContract(null);
        }
      })
      .catch(() =>
        setNotification({
          message: 'Error fetching user contracts',
          severity: 'error',
        })
      );
  }, [selectedUser]);

  // Refresh yearly data on selection changes
  useEffect(() => {
    refreshYearData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserContract, selectedYear]);

  return (
    <div>
      <h1>Dashboard</h1>

      <DashboardHeader
        selectedUser={selectedUser}
        selectedYear={selectedYear}
        selectedUserContract={selectedUserContract}
        onUserChange={setSelectedUser}
        onUserContractChange={setSelectedUserContract}
        onYearChange={setSelectedYear}
        users={users}
        userContracts={userContracts}
        availableYears={getAvailableYears()}
      />

      {selectedUserContract && yearlySummary && (
        <DashboardYearlySummary 
        yearlySummary={yearlySummary}
        userContract={selectedUserContract} />
      )}

      {selectedUserContract && (
        <DashboardMonthlyOverview
          year={selectedYear}
          data={monthlyOverview}
          loading={loading}
          onMonthClick={(m) => {
            navigate(
              `/work-sessions?user=${selectedUser}` +
              `&contract=${selectedUserContract.id}` +
              `&year=${selectedYear}` +
              `&month=${String(m).padStart(2, '0')}`
            );
          }}
          selectedUserContract={selectedUserContract}
        />
      )}

      {selectedUserContract && (
        <DashboardYearlyHoursLineChart
          year={selectedYear}
          data={monthlyOverview} // MonthlyOverviewItem[]
          loading={loading}
          title="Hours worked vs. Net hours (per month)"
          selectedUserContract={selectedUserContract}
        />
      )}

      <Notification notification={notification} onClose={() => setNotification(null)} />
    </div>
  );
};

export default DashboardPage;
