import React from 'react';
import { WorkSessionResponse } from '../../interfaces/WorkSessions/WorkSessionResponse';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Tooltip,
} from '@mui/material';
import { 
  Edit,
  Delete,
  RemoveRedEye, 
} from '@mui/icons-material';

type Props = {
  key: string;
  session: WorkSessionResponse;
  onView: (session: WorkSessionResponse) => void;
  onEdit: (session: WorkSessionResponse) => void;
  onDelete: (session: WorkSessionResponse) => void;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleString('nl-NL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const formatTime = (hoursFloat: number) => {
  const totalMinutes = Math.round(hoursFloat * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
};

const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? text.slice(0, maxLength) + '…' : text;

const WorkSessionCard: React.FC<Props> = ({ key, session, onView, onEdit, onDelete }) => {
  const {
    taskDescription,
    startTime,
    endTime,
    factor,
    wbso,
    otherRemarks,
    rawEffectiveHours: totalEffectiveHours,
    netEffectiveHours: netEffectiveHours,
    tvtAccruedHours,
    tvtUsedHours,
    locked,
    user,
    createdAt,
    updatedAt,
  } = session;
  key = key;

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={0} alignItems="center" sx={{ mb: 1 }}>
          {/* Time */}
          <Grid size={2}>
            <Typography variant="subtitle2" color="text.secondary">
              {"Start:"}
            </Typography>
            <Typography variant="h6" color="text.black">
              {formatDate(startTime)}
            </Typography>
          </Grid>

          <Grid size={2}>
          < Typography variant="subtitle2" color="text.secondary">
              {"End:"}
            </Typography>
            <Typography variant="h6" color="text.black">
              {formatDate(endTime)}
            </Typography>
          </Grid>

          {/* Factor */}
          <Grid size={1}>
            < Typography variant="subtitle2" color="text.secondary">
                {"Factor:"}
              </Typography>
              <Typography variant="h6" color="text.black">
                x{factor.toFixed(2)}
              </Typography>
          </Grid>

          {/* Total effective hours */}
          <Grid size={1}>
          < Typography variant="subtitle2" color="text.secondary">
              {"Effective hours:"}
            </Typography>
            <Typography variant="h6" color="text.black">
              {formatTime(totalEffectiveHours)}
            </Typography>
          </Grid>

          {/* TVT hours */}
          <Grid size={1}>
          < Typography variant="subtitle2" color="text.secondary">
              {`${tvtAccruedHours > 0 ? `T4T Hours accrued:` : tvtUsedHours > 0 ? `T4T Hours used:` : ''}`}
            </Typography>
            <Typography variant="h6" color="text.black">
              {tvtAccruedHours > 0 ? `${formatTime(tvtAccruedHours)}` : tvtUsedHours > 0 ? `${formatTime(tvtUsedHours)}` : ''}
            </Typography>
          </Grid>

          {/* Net effective hours */}
          <Grid size={1}>
          < Typography variant="subtitle2" color="text.secondary">
              {"Net total hours:"}
            </Typography>
            <Typography variant="h6" color="text.black">
              {formatTime(netEffectiveHours)}
            </Typography>
          </Grid>

          {/* WBSO */}
          <Grid size={1}>
            {wbso && <Chip label="WBSO" color="secondary" size="small" />}
          </Grid>

          {/* Task */}
          <Grid size={3}>
            <Tooltip title={taskDescription}>
              <Typography variant="body1">
                {truncate(taskDescription, 300)}
              </Typography>
            </Tooltip>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center">
          <Grid size={10}>
            {otherRemarks && (
            <Box>
              < Typography variant="subtitle2" color="text.secondary">
                {"Other remarks:"}
              </Typography>
              <Typography variant="caption" color="text.black">
                {truncate(otherRemarks, 200)}
              </Typography>
            </Box>
            )}
          </Grid>

          <Grid size={2}>
            <Box display="flex" justifyContent="flex-end" gap={1}>
            <Tooltip title="View">
              <RemoveRedEye onClick={() => onView(session)} sx={{ cursor: 'pointer' }} />
            </Tooltip>

            <Tooltip title="Edit">
              <Edit onClick={() => onEdit(session)} sx={{ cursor: 'pointer' }} />
            </Tooltip>

            <Tooltip title="Delete">
              <Delete onClick={() => onDelete(session)} sx={{ cursor: 'pointer' }} />
            </Tooltip>

            </Box>
          </Grid>
        </Grid>

      </CardContent>
    </Card>
  );
};

export default WorkSessionCard;
