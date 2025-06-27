import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Tooltip,
  Chip,
} from '@mui/material';
import { UserContractResponse } from '../../interfaces/UserContracts/UserContractResponse';
import { Delete, Edit, RemoveRedEye } from '@mui/icons-material';

type Props = {
  userContract: UserContractResponse;
  onView: (userContract: UserContractResponse) => void;
  onEdit: (userContract: UserContractResponse) => void;
  onDelete: (userContract: UserContractResponse) => void;
};

const formatDate = (date?: Date | null) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('nl-NL', {
    dateStyle: 'medium',
  });
};


const formatTime = (hoursFloat: number) => {
  const totalMinutes = Math.round(hoursFloat * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
};
  

const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? text.slice(0, maxLength) + '…' : text;

const UserContractCard: React.FC<Props> = ({ userContract, onView, onEdit, onDelete }) => {
  const {
    name,
    startDate,
    endDate,
    isActive,
    contractType,
    tvtHourBalance,
    minWeeklyHours,
    maxWeeklyHours,
    contractFilePath,
    description,
    createdAt,
    updatedAt,
    user,
    workSessions,
  } = userContract;

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Grid container alignItems="center" sx={{ mb: 1 }}>
        
          {/* Contract name */}
          <Grid size={2} >
            <Typography variant="subtitle2" color="text.secondary">
              {"Contract:"}
            </Typography>
            <Typography variant="body1">
            {truncate(name, 300)}
            </Typography>
          </Grid>

          {/* Start - End */}
          <Grid size={3} >
            <Typography variant="subtitle2" color="text.secondary">
              {"Start - End:"}
            </Typography>
            <Typography variant="h6" color="text.black">
              {`${formatDate(startDate)} - ${formatDate(endDate)}`}
            </Typography>
          </Grid>

          <Grid size={2}  />

          {/* TVT balance hours */}
          <Grid size={1} >
            {isActive && (
              <>
                <Typography variant="subtitle2" color="text.secondary">
                  {"TVT Hour Balance:"}
                </Typography>
                <Typography variant="h6" color="text.black">
                  {formatTime(tvtHourBalance || 0)}
                </Typography>
              </>
            )}
          </Grid>

          {/* Min weekly hours */}
          <Grid size={1} >
            <Typography variant="subtitle2" color="text.secondary">
              {"Min weekly hours:"}
            </Typography>
            <Typography variant="h6" color="text.black">
              {formatTime(minWeeklyHours)}
            </Typography>
          </Grid>

          {/* Max weekly hours */}
          <Grid size={1} >
            <Typography variant="subtitle2" color="text.secondary">
              {"Max weekly hours:"}
            </Typography>
            <Typography variant="h6" color="text.black">
              {formatTime(maxWeeklyHours)}
            </Typography>
          </Grid>

          {/* Active */}
          <Grid size={1}  >
            <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
              {isActive && <Chip label="Active" color="success" size="medium" />}
              {!isActive && <Chip label="Inactive" color="error" size="medium" />}
            </Box>
          </Grid>

          {/* Action */}
          <Grid size={1} >
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Tooltip title="View">
                <RemoveRedEye onClick={() => onView(userContract)} sx={{ cursor: 'pointer' }} />
              </Tooltip>
      
              <Tooltip title="Edit">
                <Edit onClick={() => onEdit(userContract)} sx={{ cursor: 'pointer' }} />
              </Tooltip>
      
              <Tooltip title="Delete">
                <Delete onClick={() => onDelete(userContract)} sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserContractCard;