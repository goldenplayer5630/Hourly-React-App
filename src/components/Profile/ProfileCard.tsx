import * as React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Stack,
  TextField,
} from '@mui/material';
import { UpdateUserRequest } from '../../interfaces/Users/UpdateUserRequest';

type Props = {
  user: Pick<
    UpdateUserRequest,
    'name' | 'email' | 'role' | 'department'
  >;
  title?: string;
};

const ProfileCard: React.FC<Props> = ({ user, title = 'Profile' }) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardHeader title={title} />
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          <TextField
            label="Name"
            value={user.name ?? ''}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Email"
            value={user.email ?? ''}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Role"
            value={user.role?.name ?? '—'}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Department"
            value={user.department?.name ?? '—'}
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
