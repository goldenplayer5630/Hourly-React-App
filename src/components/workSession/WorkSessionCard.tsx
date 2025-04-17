import React from 'react';
import { WorkSessionResponse } from '../../classes/WorkSessionResponse';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Tooltip,
} from '@mui/material';

type Props = {
  session: WorkSessionResponse;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleString('nl-NL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? text.slice(0, maxLength) + '…' : text;

const WorkSessionCard: React.FC<Props> = ({ session }) => {
  const {
    taskDescription,
    startTime,
    endTime,
    factor,
    wbso,
    otherRemarks,
    user,
    createdAt,
    updatedAt,
  } = session;

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Time */}
          <Grid size={2}>
            <Typography variant="body2" color="text.secondary">
              {formatDate(startTime)} – {formatDate(endTime)}
            </Typography>
          </Grid>

          {/* Task */}
          <Grid size={4}>
            <Tooltip title={taskDescription}>
              <Typography variant="body1" noWrap>
                {truncate(taskDescription, 50)}
              </Typography>
            </Tooltip>
          </Grid>

          {/* Factor */}
          <Grid size={1}>
            <Typography variant="body2">x{factor.toFixed(2)}</Typography>
          </Grid>

          {/* WBSO */}
          <Grid size={2}>
            {wbso && <Chip label="WBSO" color="primary" size="small" />}
          </Grid>

          {/* User */}
          <Grid size={2}>
            <Typography variant="body2" color="text.secondary">
              {/* {user?.name ?? 'Unknown'} */}
            </Typography>
          </Grid>
        </Grid>

        {/* Remarks (Optional below row) */}
        {otherRemarks && (
          <Box mt={1}>
            <Typography variant="caption" color="text.secondary">
              {otherRemarks}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkSessionCard;
