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

const WorkSessionCard: React.FC<Props> = ({ session, onView, onEdit, onDelete }) => {
  const {
    taskDescription,
    startTime,
    endTime,
    factor,
    breakTime,
    wbso,
    otherRemarks,
    rawEffectiveHours,
    netEffectiveHours,
    tvtAccruedHours,
    tvtUsedHours,
    locked,
    userContract,
    createdAt,
    updatedAt,
  } = session;

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
      <Grid container alignItems="center" sx={{ mb: 1 }}>
        {/* Task */}
        <Grid size={10} >
          <Typography variant="subtitle2" color="text.secondary">
            {"Task:"}
          </Typography>
          <Typography variant="body1">
          {truncate(taskDescription, 300)}
          </Typography>
        </Grid>

        <Grid size={2} >
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



      <Grid container alignItems="center" sx={{ mb: 1 }}>
        <Grid size={6} >
          <Typography variant="subtitle2" color="text.secondary">
            {"Start - End:"}
          </Typography>
          <Typography variant="h6" color="text.black">
            {`${formatDate(startTime)} - ${formatDate(endTime)}`}
          </Typography>
        </Grid>

        <Grid size={1}  >
            {/* WBSO */}
            <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
              {wbso && <Chip label="WBSO" color="secondary" size="small" />}
            </Box>
        </Grid>
        

        <Grid size={5} sx={{ marginLeft: 'auto' }}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            {/* Factor */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
            {"Factor:"}
              </Typography>
              <Typography variant="h6" color="text.black">
                x{factor.toFixed(2)}
              </Typography>
            </Box>

            {/* Break hours */}
            {breakTime > 0 && <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {"Break hours:"}
              </Typography>
              <Typography variant="h6" color="text.black">
                {formatTime(breakTime)}
              </Typography>
            </Box>}

            {/* Total effective hours */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {"Effective hours:"}
              </Typography>
              <Typography variant="h6" color="text.black">
                {formatTime(rawEffectiveHours)}
              </Typography>
            </Box>

            {/* TVT hours */}
            {(tvtAccruedHours > 0 || tvtUsedHours > 0) &&
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {`${tvtAccruedHours > 0 ? `T4T accrued:` : tvtUsedHours > 0 ? `T4T used:` : ''}`}
              </Typography>
              <Typography variant="h6" color="text.black">
                {tvtAccruedHours > 0 ? `${formatTime(tvtAccruedHours)}` : tvtUsedHours > 0 ? `${formatTime(tvtUsedHours)}` : ''}
              </Typography>
            </Box>}

            {/* Net effective hours */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
          {"Net total hours:"}
              </Typography>
              <Typography variant="h6" color="text.black">
          {formatTime(netEffectiveHours)}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

        {otherRemarks && (
        <Grid container alignItems="center">
          <Grid size={8} >
          <Box>
              <Typography variant="subtitle2" color="text.secondary">
              {"Other remarks:"}
              </Typography>
              <Typography variant="caption" color="text.black">
              {truncate(otherRemarks, 200)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkSessionCard;
