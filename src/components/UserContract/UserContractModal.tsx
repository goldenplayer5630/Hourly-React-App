import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import ContractType from '../../enums/ContractType';
import { UserContractResponse } from '../../interfaces/UserContracts/UserContractResponse';
import { CreateUserContract } from '../../interfaces/UserContracts/CreateUserContract';
import { userContractService } from '../../services/UserContractService';
import Notification from '../Common/Notification';

type UserContractModalMode = 'create' | 'edit' | 'view';

type Props = {
  open: boolean;
  mode: UserContractModalMode;
  selectedUserContract?: UserContractResponse;
  selectedUser: string;
  onClose: () => void;
  onSubmit: () => void;
};

type FormValues = {
  name: string;
  contractType: ContractType;
  userId: string;
  isActive: boolean;
  minWeeklyHours: number;
  maxWeeklyHours: number;
  grossHourlyRate?: number;
  holidayHoursPercentage?: number;
  monthlyPaidHolidayHours: boolean;
  startDate: Date;
  endDate?: Date;
  contractFilePath?: string;
  description?: string;
};

const contractTypeOptions = {
  [ContractType.Undefined]: 'Undefined',
  [ContractType.FullTime]: 'Full Time',
  [ContractType.PartTime]: 'Part Time',
  [ContractType.ZeroHour]: 'Zero Hour',
  [ContractType.MinMax]: 'Min/Max',
  [ContractType.Freelance]: 'Freelance',
}

const UserContractModal: React.FC<Props> = ({
  open,
  mode,
  selectedUserContract,
  selectedUser,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<FormValues>({
    name: '',
    userId: selectedUser,
    contractType: ContractType.Undefined,
    isActive: true,
    minWeeklyHours: 32,
    maxWeeklyHours: 40,
    grossHourlyRate: undefined,
    holidayHoursPercentage: undefined,
    monthlyPaidHolidayHours: false,
    startDate: new Date(),
    endDate: undefined,
    contractFilePath: '',
    description: '',
  });

  const [notification, setNotification] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  useEffect(() => {
    console.log('Selected User Contract:', selectedUserContract);
    console.log('Selected User', selectedUser);
    if (selectedUserContract && (mode === 'edit' || mode === 'view')) {
      setForm({
        name: selectedUserContract.name,
        userId: selectedUser,
        contractType: selectedUserContract.contractType,
        isActive: selectedUserContract.isActive,
        minWeeklyHours: selectedUserContract.minWeeklyHours,
        maxWeeklyHours: selectedUserContract.maxWeeklyHours,
        grossHourlyRate: selectedUserContract.grossHourlyRate,
        holidayHoursPercentage: selectedUserContract.holidayHoursPercentage,
        monthlyPaidHolidayHours: selectedUserContract.monthlyPaidHolidayHours,
        startDate: new Date(selectedUserContract.startDate),
        endDate: selectedUserContract.endDate ? new Date(selectedUserContract.endDate) : undefined,
        contractFilePath: selectedUserContract.contractFilePath || '',
        description: selectedUserContract.description || '',
      });
    }
  }, [selectedUserContract, mode]);

  const handleChange = (field: keyof FormValues, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const {
      name,
      contractType,
      isActive,
      minWeeklyHours,
      maxWeeklyHours,
      grossHourlyRate,
      holidayHoursPercentage,
      monthlyPaidHolidayHours,
      startDate,
      endDate,
      contractFilePath,
      description,
    } = form;

    const request: CreateUserContract = {
      userId: selectedUser,
      name,
      contractType,
      isActive,
      minWeeklyHours,
      maxWeeklyHours,
      grossHourlyRate,
      holidayHoursPercentage,
      monthlyPaidHolidayHours,
      startDate: startDate || new Date(),
      endDate: endDate ? endDate : undefined,
      contractFilePath: contractFilePath || '',
      description: description || '',
    };

    try {
      let created;
      if (mode === 'edit' && selectedUserContract) {
        console.log('updated request:', request);
        await userContractService.update(selectedUserContract.id, request);
        created = selectedUserContract;
      } else if (mode === 'create') {
        created = await userContractService.create(request);
      }

      setNotification({ message: 'Work session saved successfully!', severity: 'success' });
      onSubmit();
    } catch (err: any) {
      const message = err?.message || 'Failed to save work session';
      setNotification({ message, severity: 'error' });
    }
  };

  return (
    <div>
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {mode === 'view' && 'View User Contract'}
        {mode === 'edit' && 'Edit User Contract'}
        {mode === 'create' && 'Create User Contract'}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Contract Name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          fullWidth
          required
          disabled={mode === 'view'}
        />

        <FormControl fullWidth>
          <InputLabel>Contract Type</InputLabel>
          <Select
            value={form.contractType}
            onChange={(e) => handleChange('contractType', Number(e.target.value) as ContractType)}
            disabled={mode === 'view'}
          >
            {Object.entries(contractTypeOptions).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>

        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={form.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              disabled={mode === 'view'}
            />
          }
          label="Active Contract"
        />

        <TextField
          type="number"
          label="Min Weekly Hours"
          value={form.minWeeklyHours}
          onChange={(e) => handleChange('minWeeklyHours', parseInt(e.target.value))}
          fullWidth
          disabled={mode === 'view'}
        />
        <TextField
          type="number"
          label="Max Weekly Hours"
          value={form.maxWeeklyHours}
          onChange={(e) => handleChange('maxWeeklyHours', parseInt(e.target.value))}
          fullWidth
          disabled={mode === 'view'}
        />

        <TextField
          type="number"
          label="Gross Hourly Rate (€)"
          value={form.grossHourlyRate || ''}
          onChange={(e) => handleChange('grossHourlyRate', parseFloat(e.target.value))}
          fullWidth
          disabled={mode === 'view'}
        />
        <TextField
          type="number"
          label="Holiday Hours Percentage (%)"
          value={form.holidayHoursPercentage || ''}
          onChange={(e) => handleChange('holidayHoursPercentage', parseFloat(e.target.value))}
          fullWidth
          disabled={mode === 'view'}
        />

        <FormControlLabel
          control={
            <Switch
              checked={form.monthlyPaidHolidayHours}
              onChange={(e) => handleChange('monthlyPaidHolidayHours', e.target.checked)}
              disabled={mode === 'view'}
            />
          }
          label="Monthly Paid Holiday Hours"
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={dayjs(form.startDate)}
            onChange={(newValue) => handleChange('startDate', newValue?.toDate() ?? new Date())}
            disabled={mode === 'view'}
          />
          <DatePicker
            label="End Date"
            value={form.endDate ? dayjs(form.endDate) : null}
            onChange={(newValue) => handleChange('endDate', newValue?.toDate() ?? undefined)}
            disabled={mode === 'view'}
          />
        </LocalizationProvider>

        <TextField
          label="Contract File Path"
          value={form.contractFilePath}
          onChange={(e) => handleChange('contractFilePath', e.target.value)}
          fullWidth
          disabled={mode === 'view'}
        />
        <TextField
          label="Description"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          multiline
          rows={3}
          fullWidth
          disabled={mode === 'view'}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {mode !== 'view' && (
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        )}
      </DialogActions>
    </Dialog>

    <Notification notification={notification} onClose={() => setNotification(null)} />
    </div>
  );
};

export default UserContractModal;
