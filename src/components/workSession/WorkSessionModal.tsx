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
  FormControl,
  InputLabel,
  FormGroup,
  Radio,
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
type TvtMode = 'none' | 'accrue' | 'use';

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
  breakTime: number;
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
    breakTime: 0,
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
        breakTime: selectedSession.breakTime,
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
        breakTime: 0,
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
    console.log('handleChange', field, value);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const formatTime = (hoursFloat: number) => {
    const totalMinutes = Math.round(hoursFloat * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  };

  const convertToFloat = (timeString: string) => {
    const [h, m] = timeString.split('h').map((part) => parseFloat(part.trim()));
    return h + m / 60;
  }

  const handleSubmit = async () => {
    const {
      taskDescription,
      startTime,
      endTime,
      factor,
      breakTime,
      wbso,
      tvtAccruedHours,
      tvtUsedHours,
      tvtMode,
      otherRemarks,
      gitCommitIds,
    } = form;

    const request: CreateWorkSessionRequest = {
      userId,
      taskDescription,
      startTime,
      endTime,
      factor,
      breakTime,
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
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
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

        <FormGroup row sx={{ justifyContent: 'space-between' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
            <DateTimePicker
              label="Start Time"
              value={dayjs(form.startTime)}
              onChange={(newValue) => handleChange('startTime', newValue?.toDate() ?? new Date())}
              minutesStep={15}
              disabled={mode === 'view'}
              sx={{ flex: 1, marginRight: 2 }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
            <DateTimePicker
              label="End Time"
              value={dayjs(form.endTime)}
              onChange={(newValue) => handleChange('endTime', newValue?.toDate() ?? new Date())}
              minutesStep={15}
              disabled={mode === 'view'}
              sx={{ flex: 1 }}
            />
          </LocalizationProvider>
        </FormGroup>

        <TextField
          label="Factor"
          type="number"
          value={form.factor}
          onChange={(e) => handleChange('factor', parseFloat(e.target.value))}
          fullWidth
          required
          disabled={mode === 'view'}
        />


        <FormControl fullWidth>
          <InputLabel>Break Time</InputLabel>
          <Select
            label="Break Time"
            value={formatTime(form.breakTime)}
            onChange={(e) => handleChange('tvtAccruedHours', convertToFloat(e.target.value.toString()))}
          >
            {Array.from(Array(5).keys()).map(i => (
              <MenuItem key={i} value={formatTime((i * 0.25))}>{formatTime((i * 0.25))}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormGroup row>
          <FormControlLabel
            control={
              <Radio
                checked={form.tvtMode === 'accrue'}
                onChange={() => {
                  handleChange('tvtMode', 'accrue');
                  handleChange('tvtUsedHours', 0);
                }}
                disabled={mode === 'view'}
              />
            }
            label="Accrue T4T Hours"
          />

          <FormControlLabel
            control={
              <Radio
                checked={form.tvtMode === 'use'}
                onChange={() => {
                  handleChange('tvtMode', 'use');
                  handleChange('tvtAccruedHours', 0);
                }}
                disabled={mode === 'view'}
              />
            }
            label="Use T4T Hours"
          />
          {form.tvtMode === 'accrue' && (
          <FormControl fullWidth>
            <InputLabel>TVT Accrued Hours</InputLabel>
            <Select
              label="TVT Accrued Hours"
              value={formatTime(form.tvtAccruedHours)}
              onChange={(e) => handleChange('tvtAccruedHours', convertToFloat(e.target.value.toString()))}
            >
              {Array.from(Array(33).keys()).map(i => (
                <MenuItem key={i} value={formatTime((i * 0.25))}>{formatTime((i * 0.25))}</MenuItem>
              ))}
            </Select>
          </FormControl>
          )}

          {form.tvtMode === 'use' && (
          <FormControl fullWidth>
            <InputLabel>TVT Used Hours</InputLabel>
            <Select
              label="TVT Used Hours"
              value={formatTime(form.tvtUsedHours)}
              onChange={(e) => handleChange('tvtUsedHours', convertToFloat(e.target.value.toString()))}
            >
              {Array.from(Array(33).keys()).map(i => (
                <MenuItem key={i} value={formatTime((i * 0.25))}>{formatTime((i * 0.25))}</MenuItem>
              ))}
            </Select>
          </FormControl>
          )}
        </FormGroup>




        <TextField
          label="Other Remarks"
          value={form.otherRemarks}
          onChange={(e) => handleChange('otherRemarks', e.target.value)}
          fullWidth
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
