import React, { use } from 'react';
import {
    Card,
    CardContent,
    Grid,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
    Autocomplete,
    TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { UserResponse } from '../../interfaces/Users/UserResponse';
import { UserContractResponse } from '../../interfaces/UserContracts/UserContractResponse';

type Props = {
    selectedUser: string;
    onUserChange: (userId: string) => void;
    onAddUserContract: () => void;
    users: UserResponse[];
};

const UserContractHeader: React.FC<Props> = ({
  selectedUser,
  users,
  onUserChange,
  onAddUserContract,
}) => {
  return (
    <Card variant="outlined" sx={{ pt: 1, mb: 2 }}>
    <CardContent>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 0 }}>
                <FormControl fullWidth size="small">
                    <Autocomplete
                        size="small"
                        options={users}
                        getOptionLabel={(option) => option.name}
                        value={users.find((user) => user.id === selectedUser) || null}
                        onChange={(_, newValue) => {
                            if (newValue) onUserChange(newValue.id);
                        }}
                        renderInput={(params) => <TextField {...params} label="Employee" variant="outlined" fullWidth />}
                    />
                </FormControl>
            </Grid>
            <Grid size={{ xs: 10, md: 3 }} sx={{ display: 'flex', justifyContent: 'flex-end' }} offset={{ md: 'auto' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAddUserContract}
                >
                    Add Contract
                </Button>
            </Grid>
        </Grid>
    </CardContent>
</Card>
  );
};

export default UserContractHeader;