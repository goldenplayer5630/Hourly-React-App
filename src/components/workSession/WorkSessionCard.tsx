import React from 'react';
import { WorkSessionResponse } from '../../interfaces/WorkSessionResponse';
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
  Start,
  Edit,
  Delete,
  PanoramaFishEye,
  RemoveRedEye, 
} from '@mui/icons-material';

type Props = {
  session: WorkSessionResponse;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleString('nl-NL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const formatDuration = (start: string, end: string, factor: number) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const duration = (endDate.getTime() - startDate.getTime()) * factor;
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

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
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
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

          {/* Duration */}
          <Grid size={1}>
          < Typography variant="subtitle2" color="text.secondary">
              {"Duration:"}
            </Typography>
            <Typography variant="h6" color="text.black">
              {formatDuration(startTime, endTime, factor)}
            </Typography>
          </Grid>

          {/* WBSO */}
          <Grid size={1}>
            {wbso && <Chip label="WBSO" color="secondary" size="small" />}
          </Grid>

          {/* Task */}
          <Grid size={5}>
            <Tooltip title={taskDescription}>
              <Typography variant="body1">
                {truncate(taskDescription, 150)}
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
                {truncate(otherRemarks, 220)}
              </Typography>
            </Box>
            )}
          </Grid>

          <Grid size={2}>
            <Box display="flex" justifyContent="flex-end" gap={1}>
                <Tooltip title="View">
                  <RemoveRedEye />
                </Tooltip>
                <Tooltip title="Edit">
                  <Edit />
                </Tooltip>
                <Tooltip title="Delete">
                  <Delete />
              </Tooltip>
            </Box>
          </Grid>
        </Grid>

      </CardContent>
    </Card>
  );
};

export default WorkSessionCard;
