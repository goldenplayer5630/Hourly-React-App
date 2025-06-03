import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Tooltip,
} from '@mui/material';
import { UserContractResponse } from '../../interfaces/UserContracts/UserContractResponse';

type Props = {
  userContract: UserContractResponse;
  onView: (userContract: UserContractResponse) => void;
  onEdit: (userContract: UserContractResponse) => void;
  onDelete: (userContract: UserContractResponse) => void;
};

const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? text.slice(0, maxLength) + '…' : text;

const UserContractCard: React.FC<Props> = ({ userContract, onView, onEdit, onDelete }) => {
  const {
    name,
    startDate,
    endDate,
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
        {/* Task */}
        <Grid size={10} >
          <Typography variant="subtitle2" color="text.secondary">
            {"Contract:"}
          </Typography>
          <Typography variant="body1">
          {truncate(name, 300)}
          </Typography>
        </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserContractCard;

// id: string;
//     userId: string;
//     name: string;
//     contractType: ContractType;
//     isActive: boolean;
//     minWeeklyHours: number;
//     maxWeeklyHours: number;
//     grossHourlyRate?: number;
//     holidayHoursPercentage?: number;
//     monthlyPaidHolidayHours: boolean;
//     minimumHoursPerMonth: number;
//     maximumHoursPerMonth: number;
//     startDate: Date;
//     endDate?: Date;
//     contractFilePath?: string;
//     description?: string;
//     createdAt: Date;
//     updatedAt?: Date;
//     user: UserResponse;
//     workSessions: WorkSessionResponse[];