import React, { use, useState, useEffect } from 'react';
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
    TextField,
    Box,
    IconButton,
    Menu
} from '@mui/material';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AddIcon from '@mui/icons-material/Add';
import { UserResponse } from '../../interfaces/Users/UserResponse';
import { UserContractResponse } from '../../interfaces/UserContracts/UserContractResponse';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { WorkSessionResponse } from '../../interfaces/WorkSessions/WorkSessionResponse';
import { userContractService } from '../../services/UserContractService';

type Props = {
    selectedUser: string;
    selectedYear: number;
    selectedMonth: string;
    selectedUserContract: UserContractResponse ;
    onUserChange: (userId: string) => void;
    onUserContractChange: (userContractId: UserContractResponse) => void;
    onYearChange: (year: number) => void;
    onMonthChange: (value: string) => void;
    wbsoOnly: boolean;
    onToggleWBSO: () => void;
    onAddWorkSession: () => void;
    onLockSessions: () => void;
    onUnlockSessions: () => void;
    users: UserResponse[];
    userContracts: UserContractResponse[];
    sessions: WorkSessionResponse[];
    availableYears: number[];
};


const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

const WorkSessionHeader: React.FC<Props> = ({
    selectedUser,
    selectedYear,
    selectedMonth,
    selectedUserContract,
    onMonthChange,
    onYearChange,
    onUserChange,
    onUserContractChange,
    wbsoOnly,
    onToggleWBSO,
    onAddWorkSession,
    onLockSessions,
    onUnlockSessions,
    users,
    userContracts,
    sessions,
    availableYears
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
    setAnchorEl(null);
    };

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
                    <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 0 }}>
                        <FormControl fullWidth size="small">
                            <Autocomplete
                                size="small"
                                options={userContracts}
                                getOptionLabel={(option) => option.name}
                                value={userContracts.find((userContract) => userContract.id === selectedUserContract.id) || null}
                                onChange={(_, newValue) => {
                                    if (newValue) onUserContractChange(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} label="Contract" variant="outlined" fullWidth />}
                            />
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 6, md: 1.5 }} offset={{ xs: 3, md: 0 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="year-select-label">Year</InputLabel>
                            <Select
                                labelId="year-select-label"
                                value={selectedYear}
                                label="Year"
                                onChange={(e) => onYearChange(Number(e.target.value))}
                            >
                                {availableYears.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 6, md: 1.5 }} offset={{ xs: 3, md: 0 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="month-select-label">Month</InputLabel>
                            <Select
                                labelId="month-select-label"
                                value={selectedMonth}
                                label="Month"
                                onChange={(e) => onMonthChange(e.target.value)}
                            >
                                {months.map((month) => (
                                    <MenuItem key={month.value} value={month.value}>
                                        {month.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 4, md: 1 }} offset={{ xs: 3, md: 0 }}>
                        <FormControlLabel
                            control={<Switch checked={wbsoOnly} onChange={onToggleWBSO} />}
                            label="WBSO only"
                        />
                    </Grid>
                    <Grid size={{ xs: 10, md: 3.5 }} sx={{ display: 'flex', justifyContent: 'flex-end' }} offset={{ md: 'auto' }}>
                    <IconButton
                        aria-label="actions"
                        aria-controls={openMenu ? 'actions-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMenu ? 'true' : undefined}
                        onClick={handleMenuClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="actions-menu"
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                        <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            onAddWorkSession();
                        }}
                        disabled={!selectedUserContract.isActive || !selectedUser || !selectedYear || !selectedMonth}
                        >
                        <AddIcon fontSize="small" sx={{ mr: 1 }} />
                        Add Work Session
                        </MenuItem>
                        <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            onLockSessions();
                        }}
                        disabled={!selectedUserContract.isActive ||  sessions.length < 1 || !selectedYear || !selectedMonth}
                        >
                        <LockOutlineIcon fontSize="small" sx={{ mr: 1 }} />
                        Lock Sessions
                        </MenuItem>
                        <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            onUnlockSessions();
                        }}
                        disabled={!selectedUserContract.isActive || sessions.length < 1 || !selectedYear || !selectedMonth}
                        >
                        <LockOpenIcon fontSize="small" sx={{ mr: 1 }} />
                        Unlock Sessions
                        </MenuItem>
                    </Menu>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default WorkSessionHeader;
