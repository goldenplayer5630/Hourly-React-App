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
  Autocomplete,
  Snackbar,
  Alert,
  MenuItem,
  Select,
} from '@mui/material';
import { GitCommitResponse } from '../../interfaces/GitCommitResponse';
import { CreateWorkSessionRequest } from '../../interfaces/WorkSessions/CreateWorkSessionRequest';
import { workSessionService } from '../../services/WorkSessionService';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { WorkSessionResponse } from '../../interfaces/WorkSessions/WorkSessionResponse';
import Notification from '../Common/Notification';
import dayjs from 'dayjs';
import 'dayjs/locale/nl';
import { Padding } from '@mui/icons-material';

dayjs.locale('nl');

type WorkSessionModalMode = 'create' | 'edit' | 'view';

interface CreateWorkSessionModalProps {
  open: boolean;
  mode: WorkSessionModalMode;
  selectedSession?: WorkSessionResponse;
  onClose: () => void;
  onSubmit: () => void;
  availableGitCommits: GitCommitResponse[];
  userId: string;
}

interface WorkSessionFormValues {
  taskDescription: string;
  startTime: Date;
  endTime: Date;
  factor: number;
  wbso: boolean;
  tvtMode: string;
  tvtAccruedHours: number;
  tvtUsedHours: number;
  otherRemarks?: string;
  gitCommitIds: string[];
}

const WorkSessionModal: React.FC<CreateWorkSessionModalProps> = ({
  open,
  mode,
  selectedSession,
  onClose,
  onSubmit,
  availableGitCommits,
  userId,
}) => {
  const [form, setForm] = useState<WorkSessionFormValues>({
    taskDescription: '',
    startTime: new Date(),
    endTime: new Date(),
    factor: 1.0,
    wbso: false,
    tvtMode: 'none',
    tvtAccruedHours: 0,
    tvtUsedHours: 0,
    otherRemarks: '',
    gitCommitIds: [],
  });

  const [notification, setNotification] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (selectedSession) {
      setForm({
        taskDescription: selectedSession.taskDescription,
        startTime: new Date(selectedSession.startTime),
        endTime: new Date(selectedSession.endTime),
        factor: selectedSession.factor,
        wbso: selectedSession.wbso ?? false,
        tvtMode: selectedSession.tvtAccruedHours > 0 ? 'accrue' : selectedSession.tvtUsedHours > 0 ? 'use' : 'none',
        tvtAccruedHours: selectedSession.tvtAccruedHours,
        tvtUsedHours: selectedSession.tvtUsedHours,
        otherRemarks: selectedSession.otherRemarks ?? '',
        gitCommitIds: selectedSession.gitCommits.map(commit => commit.id),
      });
    } else if (mode === 'create') {
      setForm({
        taskDescription: '',
        startTime: new Date(),
        endTime: new Date(),
        factor: 1.0,
        wbso: false,
        tvtMode: 'none',
        tvtAccruedHours: 0,
        tvtUsedHours: 0,
        otherRemarks: '',
        gitCommitIds: [],
      });
    }
  }, [selectedSession, mode]);

  const handleChange = (field: keyof WorkSessionFormValues, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const {
      taskDescription,
      startTime,
      endTime,
      factor,
      wbso,
      tvtAccruedHours,
      tvtUsedHours,
      otherRemarks,
      gitCommitIds,
    } = form;

    const request: CreateWorkSessionRequest = {
      userId,
      taskDescription,
      startTime,
      endTime,
      factor,
      tvtAccruedHours,
      tvtUsedHours,
      wbso,
      otherRemarks,
      gitCommitIds,
    };

    try {
      let created;
      if (mode === 'edit' && selectedSession) {
        await workSessionService.update(selectedSession.id, request);
        created = selectedSession;
      } else if (mode === 'create') {
        created = await workSessionService.create(request);
      }

      setNotification({ message: 'Work session saved successfully!', severity: 'success' });
      onSubmit();
    } catch (err: any) {
      const message = err?.message|| 'Failed to save work session';
      setNotification({ message, severity: 'error' });
    }
  };

  return (
    <div>
      <div style={{ padding: '5px' }}/>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === 'view' && 'View Work Session'}
        {mode === 'edit' && 'Edit Work Session'}
        {mode === 'create' && 'Create Work Session'}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Task Description"
          value={form.taskDescription}
          onChange={(e) => handleChange('taskDescription', e.target.value)}
          fullWidth
          required
          error={!form.taskDescription.trim()}
          helperText={!form.taskDescription.trim() ? 'Task Description is required' : ''}
          disabled={mode === 'view'}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
          <DateTimePicker
            label="Start Time"
            value={dayjs(form.startTime)}
            onChange={(newValue) => handleChange('startTime', newValue?.toDate() ?? new Date())}
            minutesStep={15}
            disabled={mode === 'view'}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
          <DateTimePicker
            label="End Time"
            value={dayjs(form.endTime)}
            onChange={(newValue) => handleChange('endTime', newValue?.toDate() ?? new Date())}
            minutesStep={15}
            disabled={mode === 'view'}
          />
        </LocalizationProvider>

        <TextField
          label="Factor"
          type="number"
          value={form.factor}
          onChange={(e) => handleChange('factor', parseFloat(e.target.value))}
          fullWidth
          required
          disabled={mode === 'view'}
        />

        <FormControlLabel
          control={
            <Switch
              checked={form.wbso}
              onChange={(e) => handleChange('wbso', e.target.checked)}
              disabled={mode === 'view'}
            />
          }
          label="WBSO"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.tvtAccruedHours > 0 || form.tvtUsedHours > 0}
              onChange={(e) => {
                if (!e.target.checked) {
                  handleChange('tvtAccruedHours', 0);
                  handleChange('tvtUsedHours', 0);
                }
              }}
              disabled={mode === 'view'}
            />
          }
          label="Display TVT Hours"
        />

        {form.tvtMode === 'accrue' && (
          <Select
            label="TVT Accrued Hours"
            value={form.tvtAccruedHours}
            onChange={(e) => handleChange('tvtAccruedHours', parseFloat(e.target.value.toString()))}
          >
            {Array.from(Array(33).keys()).map(i => (
              <MenuItem key={i} value={i * 0.25}>{(i * 0.25).toFixed(2)} uur</MenuItem>
            ))}
          </Select>

        )}

        {form.tvtMode === 'use' && (
          <TextField
            label="TVT Used Hours"
            type="number"
            value={form.tvtUsedHours}
            inputProps={{ step: 0.25, min: 0 }}
            onChange={(e) => handleChange('tvtUsedHours', parseFloat(e.target.value))}
            fullWidth
            required
            disabled={mode === 'view'}
          />
        )}


        <TextField
          label="Other Remarks"
          value={form.otherRemarks}
          onChange={(e) => handleChange('otherRemarks', e.target.value)}
          fullWidth
          disabled={mode === 'view'}
        />

        <Autocomplete
          multiple
          options={availableGitCommits}
          getOptionLabel={(option) => option.title}
          value={availableGitCommits.filter(commit => form.gitCommitIds.includes(commit.id))}
          onChange={(_, value) => handleChange('gitCommitIds', value.map((v) => v.id))}
          renderInput={(params) => (
            <TextField {...params} label="Git Commits" placeholder="Select commits" />
          )}
          disabled={mode === 'view'}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {mode !== 'view' && (
          <Button onClick={handleSubmit} variant="contained">Submit</Button>
        )}
      </DialogActions>
    </Dialog>

    <Notification notification={notification} onClose={() => setNotification(null)} />
    </div>

  );
};

export default WorkSessionModal;
