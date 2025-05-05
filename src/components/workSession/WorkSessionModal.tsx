import React, { useState } from 'react';
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
} from '@mui/material';
import { GitCommitResponse } from '../../interfaces/GitCommitResponse';
import { CreateWorkSessionRequest } from '../../interfaces/WorkSessions/CreateWorkSessionRequest';
import { workSessionService } from '../../services/WorkSessionService';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/nl'; // 🇳🇱 Load Dutch locale

dayjs.locale('nl');

interface CreateWorkSessionModalProps {
  open: boolean;
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
  otherRemarks?: string;
  gitCommitIds: string[];
}

const toInputDateTimeValue = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

const WorkSessionModal: React.FC<CreateWorkSessionModalProps> = ({
  open,
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
    otherRemarks: '',
    gitCommitIds: [],
  });

  console.log(userId);

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
      otherRemarks,
      gitCommitIds,
    } = form;

    const request: CreateWorkSessionRequest = {
      userId,
      taskDescription,
      startTime: startTime,
      endTime: endTime,
      factor,
      wbso,
      otherRemarks,
    };
    

    try {
        console.log('Work session created:', request);

      const created = await workSessionService.create(request);

      for (const commitId of gitCommitIds) {
        await workSessionService.addGitCommit(created.id, commitId);
      }

      onSubmit();
    } catch (err) {
      console.error('Failed to create work session', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Work Session</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Task Description"
          value={form.taskDescription}
          onChange={(e) => handleChange('taskDescription', e.target.value)}
          fullWidth
        />

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
          <DateTimePicker
            label="Start Time"
            value={dayjs(form.startTime)}
            onChange={(newValue) => handleChange('startTime', newValue?.toDate() ?? new Date())}
            minutesStep={15}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
          <DateTimePicker
            label="End Time"
            value={dayjs(form.endTime)}
            onChange={(newValue) => handleChange('endTime', newValue?.toDate() ?? new Date())}
            minutesStep={15}

          />
        </LocalizationProvider>

        <TextField
          label="Factor"
          type="number"
          value={form.factor}
          onChange={(e) => handleChange('factor', parseFloat(e.target.value))}
          fullWidth
        />

        <FormControlLabel
          control={
            <Switch
              checked={form.wbso}
              onChange={(e) => handleChange('wbso', e.target.checked)}
            />
          }
          label="WBSO"
        />

        <TextField
          label="Other Remarks"
          value={form.otherRemarks}
          onChange={(e) => handleChange('otherRemarks', e.target.value)}
          fullWidth
        />

        <Autocomplete
          multiple
          options={availableGitCommits}
          getOptionLabel={(option) => option.title}
          onChange={(_, value) => handleChange('gitCommitIds', value.map((v) => v.id))}
          renderInput={(params) => (
            <TextField {...params} label="Git Commits" placeholder="Select commits" />
          )}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkSessionModal;
