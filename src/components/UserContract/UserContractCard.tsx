import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Tooltip,
} from '@mui/material';

type Props = {
  contract: {

  };
  onView: (contract: any) => void;
  onEdit: (contract: any) => void;
  onDelete: (contract: any) => void;
};

const UserContractCard: React.FC<Props> = ({ contract, onView, onEdit, onDelete }) => {
  const {

  } = contract;

  return (
    <div>
        
    </div>
  );
};

export default UserContractCard;