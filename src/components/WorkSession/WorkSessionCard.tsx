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
import { UserContractResponse } from '../../interfaces/UserContracts/UserContractResponse';

type Props = {
  key: string;
  session: WorkSessionResponse;
  userContract: UserContractResponse;
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
  } = session;

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Grid container alignItems="center" sx={{ mb: 1 }}>
          {/* Task */}
          <Grid size={11} >
            <Typography variant="subtitle2" color="text.secondary">
              {"Task:"}
            </Typography>
            <Typography variant="body1">
            {truncate(taskDescription, 300)}
            </Typography>
          </Grid>
          
          {/* Locked */}
          <Grid size={1}  >
            <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
              {locked && <Chip label="Locked" color="error" size="medium" />}
            </Box>
          </Grid>
        </Grid>

        {/* Row */}
        <Grid container alignItems="center" sx={{ mb: 1 }}>
          {/* Start - End */}
          <Grid size={3} >
            <Typography variant="subtitle2" color="text.secondary">
              {"Start - End:"}
            </Typography>
            <Typography variant="h6" color="text.black">
              {`${formatDate(startTime)} - ${formatDate(endTime)}`}
            </Typography>
          </Grid>

          <Grid size={2}  ></Grid>

          {/* WBSO */}
          <Grid size={1}  >
              <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                {wbso && <Chip label="WBSO" color="primary" size="medium" />}
              </Box>
          </Grid>
        
          {/* Factor */}
          <Grid size={1}>
            <Typography variant="subtitle2" color="text.secondary">
            {"Factor:"}
            </Typography>
            <Typography variant="h6" color="text.black">
              x{factor.toFixed(2)}
            </Typography>
          </Grid>

          {/* Break hours */}
          <Grid size={1}>
          {breakTime > 0 && (
            <>
            <Typography variant="subtitle2" color="text.secondary">
              {"Break hours:"}
            </Typography>
            <Typography variant="h6" color="text.black">
              {formatTime(breakTime)}
            </Typography>
            </>
            )}
          </Grid>

          {/* Total effective hours */}
          <Grid size={1}>
            <Typography variant="subtitle2" color="text.secondary">
                {"Effective hours:"}
              </Typography>
              <Typography variant="h6" color="text.black">
                {formatTime(rawEffectiveHours)}
            </Typography>
          </Grid>

          {/* TVT hours */}
          <Grid size={1}>
            {(tvtAccruedHours > 0 || tvtUsedHours > 0) && (
              <>
                <Typography variant="subtitle2" color="text.secondary">
                  {tvtAccruedHours > 0 ? 'T4T accrued:' : 'T4T used:'}
                </Typography>
                <Typography variant="h6" color="text.black">
                  {formatTime(tvtAccruedHours > 0 ? tvtAccruedHours : tvtUsedHours)}
                </Typography>
              </>
            )}
          </Grid>

          {/* Net effective hours */}
          <Grid size={1}>
            <Typography variant="subtitle2" color="text.secondary">
              {"Net total hours:"}
            </Typography>
            <Typography variant="h6" color="text.black">
              {formatTime(netEffectiveHours)}
            </Typography>
          </Grid>

          {/* Actions */}
          <Grid size={1} >
            <Box display="flex" justifyContent="flex-end" gap={1}>
            <Tooltip title="View">
              <RemoveRedEye onClick={() => onView(session)} sx={{ cursor: 'pointer' }} />
            </Tooltip>

            {!locked && userContract?.isActive && <Tooltip title="Edit">
              <Edit onClick={() => onEdit(session)} sx={{ cursor: 'pointer' }} />
            </Tooltip>}

            {!locked && userContract?.isActive &&  <Tooltip title="Delete">
              <Delete onClick={() => onDelete(session)} sx={{ cursor: 'pointer' }} />
            </Tooltip>}
            </Box>
          </Grid>

        </Grid>

        {/*  Other remarks */}
        
        <Grid container alignItems="center">
        <Grid size={8} >
          {otherRemarks && (
          <Box>
              <Typography variant="subtitle2" color="text.secondary">
              {"Other remarks:"}
              </Typography>
              <Typography variant="caption" color="text.black">
              {truncate(otherRemarks, 200)}
              </Typography>
            </Box>
          )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WorkSessionCard;
