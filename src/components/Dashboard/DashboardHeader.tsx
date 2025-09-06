// components/Dashboard/DashboardHeader.tsx
import * as React from 'react';
import {
  Card,
  CardContent,
  Grid,
  FormControl,
  Autocomplete,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Stack,
  Typography,
  Box,
  Tooltip,
  FormHelperText,
} from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { UserResponse } from '../../interfaces/Users/UserResponse';
import { UserContractResponse } from '../../interfaces/UserContracts/UserContractResponse';

type Props = {
  selectedUser: string;
  selectedYear: number;
  selectedUserContract: UserContractResponse | null;

  onUserChange: (userId: string) => void;
  onUserContractChange: (contract: UserContractResponse | null) => void;
  onYearChange: (year: number) => void;

  users: UserResponse[];
  userContracts: UserContractResponse[];
  availableYears: number[];
};

const DashboardHeader: React.FC<Props> = ({
  selectedUser,
  selectedYear,
  selectedUserContract,
  onUserChange,
  onUserContractChange,
  onYearChange,
  users,
  userContracts,
  availableYears,
}) => {
  const userValue =
    users.find((u) => u.id === selectedUser) ?? null;

  const contractValue =
    (selectedUserContract &&
      userContracts.find((c) => c.id === selectedUserContract.id)) ||
    null;

    return (
        <Card variant="outlined" sx={{ pt: 1, mb: 2 }}>
          <CardContent>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              {/* User */}
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth size="small">
                  <Autocomplete<UserResponse>
                    size="small"
                    options={users}
                    getOptionLabel={(o) => o.name}
                    value={userValue}
                    onChange={(_, v) => onUserChange(v?.id ?? '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Employee"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                    // Optional: show name + email in dropdown
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Box>{option.name}</Box>
                        </Box>
                      </li>
                    )}
                  />
                </FormControl>
              </Grid>
    
              {/* Contract (filtered list provided by parent) */}
              <Grid size={{ xs: 12, md: 5 }}>
                <FormControl fullWidth size="small">
                  <Autocomplete<UserContractResponse>
                    size="small"
                    options={userContracts}
                    getOptionLabel={(o) => o.name}
                    value={contractValue}
                    onChange={(_, v) => onUserContractChange(v ?? null)}
                    // Status chip inside the input when a value is selected
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Contract"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {contractValue && (
                                <Tooltip
                                  title={
                                    contractValue.isActive ? 'Active contract' : 'Inactive contract'
                                  }
                                >
                                  <Chip
                                    size="small"
                                    color={contractValue.isActive ? 'success' : 'default'}
                                    label={contractValue.isActive ? 'Active' : 'Inactive'}
                                    icon={<InfoOutlined fontSize="small" />}
                                    variant={contractValue.isActive ? 'filled' : 'outlined'}
                                  />
                                </Tooltip>
                              )}
                              {/* Keep default adornments (clear icon, loading, etc.) */}
                              {params.InputProps.endAdornment}
                            </Box>
                          ),
                        }}
                      />
                    )}
                    // Show status chip in the dropdown options too
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            justifyContent: 'space-between',
                            gap: 1,
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                            <Box sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {option.name}
                            </Box>
                          </Box>
                          <Chip
                            size="small"
                            color={option.isActive ? 'success' : 'default'}
                            label={option.isActive ? 'Active' : 'Inactive'}
                            variant={option.isActive ? 'filled' : 'outlined'}
                          />
                        </Box>
                      </li>
                    )}
                  />
                  {/* Optional helper line for quick context (remove if you want it cleaner) */}
                  {contractValue && (
                    <FormHelperText sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InfoOutlined fontSize="small" sx={{ opacity: 0.7 }} />
                      {contractValue.isActive ? 'This contract is active.' : 'This contract is inactive.'}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
    
              {/* Year */}
              <Grid size={{ xs: 12, md: 3 }}>
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
                  {/* If you want a subtle hint under the field, keep this; else remove */}
                  {/* <FormHelperText>Showing data for {selectedYear}</FormHelperText> */}
                </FormControl>
              </Grid>
    
              {/* (Removed the Selection bar entirely) */}
            </Grid>
          </CardContent>
        </Card>
      );
};

export default DashboardHeader;
