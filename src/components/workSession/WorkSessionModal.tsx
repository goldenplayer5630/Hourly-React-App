import React, { useEffect, useState } from 'react';
import {
  Avatar,
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
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { GitCommitResponse } from '../../interfaces/GitCommits/GitCommitResponse';
import { CreateWorkSessionRequest } from '../../interfaces/WorkSessions/CreateWorkSessionRequest';
import { workSessionService } from '../../services/WorkSessionService';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { WorkSessionResponse } from '../../interfaces/WorkSessions/WorkSessionResponse';
import Notification from '../Common/Notification';
import dayjs from 'dayjs';
import 'dayjs/locale/nl';
import GitHubIcon from '@mui/icons-material/GitHub';
import { gitCommitService } from '../../services/GitCommitService';

dayjs.locale('nl');

type WorkSessionModalMode = 'create' | 'edit' | 'view';
type TvtMode = 'none' | 'accrue' | 'use';

type Props = {
  open: boolean;
  mode: WorkSessionModalMode;
  selectedSession?: WorkSessionResponse;
  selectedUserContract: string;
  selectedUser: string;
  onClose: () => void;
  onSubmit: () => void;
}

interface WorkSessionFormValues {
  taskDescription: string;
  startTime: Date;
  endTime: Date;
  factor: number;
  breakTime: number;
  wbso: boolean;
  tvtMode: TvtMode;
  tvtAccruedHours: number;
  tvtUsedHours: number;
  otherRemarks?: string;
  gitCommitIds: string[];
}

const WorkSessionModal: React.FC<Props> = ({
  open,
  mode,
  selectedSession,
  onClose,
  onSubmit,
  selectedUser,
  selectedUserContract
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
  const [availableGitCommits, setAvailableGitCommits] = useState<GitCommitResponse[]>([]);
  const [selectedGitCommits, setSelectedGitCommits] = useState<GitCommitResponse[]>([]);

  useEffect(() => {
    if (selectedSession) {
      workSessionService.getById(selectedSession.id)
      .then((fullSession) => {
        setForm({
        taskDescription: fullSession.taskDescription,
        startTime: new Date(fullSession.startTime),
        endTime: new Date(fullSession.endTime),
        factor: fullSession.factor,
        breakTime: fullSession.breakTime,
        wbso: fullSession.wbso ?? false,
        tvtMode: fullSession.tvtAccruedHours > 0 ? 'accrue' : fullSession.tvtUsedHours > 0 ? 'use' : 'none',
        tvtAccruedHours: fullSession.tvtAccruedHours,
        tvtUsedHours: fullSession.tvtUsedHours,
        otherRemarks: fullSession.otherRemarks ?? '',
        gitCommitIds: fullSession.gitCommits.map(commit => commit.id),
        });

        setSelectedGitCommits(fullSession.gitCommits);
      })
      .catch((err) => {
        console.error('Error fetching session:', err);
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

      setSelectedGitCommits([]);
      setAvailableGitCommits([]);
    }
  }, [selectedSession, mode]);

  useEffect(() => {
    const fetchCommits = async () => {
      if (!selectedUser || !form.startTime || !open) return;
  
      try {
        const commits = await gitCommitService.filter(undefined, selectedUser, dayjs(form.startTime));
        setAvailableGitCommits(commits);
      } catch (err) {
        console.error('Failed to fetch Git commits', err);
      }
    };
  
    fetchCommits();
  }, [form.startTime, selectedUser, open]);
  
  const mergedGitCommits = Array.from(
    new Map([...availableGitCommits, ...selectedGitCommits].map(commit => [commit.id, commit])).values()
  );


  const handleChange = (field: keyof WorkSessionFormValues, value: any) => {
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
      userContractId: selectedUserContract,
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
            disabled={mode === 'view'}
            value={formatTime(form.breakTime)}
            onChange={(e) => handleChange('breakTime', convertToFloat(e.target.value.toString()))}
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
              disabled={mode === 'view'}
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
              disabled={mode === 'view'}
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
          options={mergedGitCommits}
          value={selectedGitCommits}
          onChange={(_, value) => {
            handleChange('gitCommitIds', value.map(v => v.id));
            setSelectedGitCommits(value);
          }}
          getOptionLabel={(option) => option.extCommitShortId}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              <ListItem disablePadding>
                <ListItemAvatar>
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <GitHubIcon fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <Tooltip title={option.title}>
                  <ListItemText
                    primary={
                      <span>
                        <strong>#{option.extCommitShortId}</strong>{' '}
                        <span style={{ color: '#666' }}>
                            {' - '}{option.title.length > 100
                            ? option.title.slice(0, 100) + '…'
                            : option.title}
                        </span>
                      </span>
                    }
                    secondary={
                      <div>
                        <span style={{ color: '#888' }}>
                            {(option.repository?.name || 'Unknown Repository').length > 40
                              ? (option.repository?.name || 'Unknown Repository').slice(0, 40) + '…'
                              : (option.repository?.name || 'Unknown Repository')}
                        </span>
                        <span style={{ color: '#888' }}>
                          {' - '}
                        </span>
                        <span style={{ color: '#888' }}>
                              {(option.author?.name || 'Unknown Author').length > 30
                                ? (option.author?.name || 'Unknown Author').slice(0, 30) + '…'
                                : (option.author?.name|| 'Unknown Author')}
                          </span>
                      </div>
                    }
                  />
                </Tooltip>
              </ListItem>
            </li>
          )}
            renderValue={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Tooltip key={option.id} title={option.title}>
                  <span
                    {...getTagProps({ index })}
                    style={{
                      backgroundColor: '#f1f1f1',
                      padding: '4px 8px',
                      margin: '2px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div>
                      <div>
                        <a href={option.webUrl} target="_blank" rel="noopener noreferrer">
                            <strong>
                              <span style={{ color: '#111' }}>
                                #{option.extCommitShortId}
                              </span>
                            </strong>
                        </a>
                        <span style={{ color: '#555' }}>
                           {' - '}{option.title.length > 40
                            ? option.title.slice(0, 40) + '…'
                            : option.title}
                        </span>
                      </div>
                      <div>
                        <a href={option.repository?.webUrl} target="_blank" rel="noopener noreferrer">
                          <span style={{ color: '#888' }}>
                              {(option.repository?.name || 'Unknown Repository').length > 50
                                ? (option.repository?.name || 'Unknown Repository').slice(0, 50) + '…'
                                : (option.repository?.name || 'Unknown Repository')}
                          </span>
                        </a>
                      </div>
                    </div>
                  </span>
                </Tooltip>
              ))
            }
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
