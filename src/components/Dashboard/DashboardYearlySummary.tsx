// components/Dashboard/DashboardYearlySummary.tsx
import * as React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Stack,
  Paper,
  Divider,
  Tooltip,
  Box,
} from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { YearlySummary } from '../../interfaces/Summaries/YearlySummary';
// If you have this type, import it; otherwise keep as any
import { UserContractResponse } from '../../interfaces/UserContracts/UserContractResponse';

type Props = {
  yearlySummary?: YearlySummary;
  userContract?: UserContractResponse | null; // NEW
};

const formatTime = (hoursFloat: number) => {
  const totalMinutes = Math.round((hoursFloat ?? 0) * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
};

const Stat: React.FC<{ label: string; value: string | number; hint?: string }> = ({
  label,
  value,
  hint,
}) => (
  <Paper variant="outlined" sx={{ p: 2, flex: 1, minWidth: 220, borderRadius: 2 }}>
    <Stack spacing={0.5}>
      <Box display="flex" alignItems="center" gap={0.75}>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        {hint && (
          <Tooltip title={hint}>
            <InfoOutlined fontSize="small" sx={{ opacity: 0.7 }} />
          </Tooltip>
        )}
      </Box>
      <Typography variant="h5">{value}</Typography>
    </Stack>
  </Paper>
);

const DashboardYearlySummary: React.FC<Props> = ({ yearlySummary, userContract }) => {
  if (!yearlySummary) {
    return (
      <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
        <CardHeader title="Yearly Summary" />
        <Divider />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Select a user contract and year to see the summary.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const {
    year,
    totalRawEffectiveHours,
    totalNetEffectiveHours,
  } = yearlySummary;

  // Try both camelCase and PascalCase for safety
  const tvtBalanceRaw =
    (userContract as any)?.tvtHourBalance ??
    (userContract as any)?.TVTHourBalance ??
    null;

  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
      <CardHeader title="Yearly Summary" subheader={`Year ${year}`} />
      <Divider />
      <CardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          useFlexGap
          flexWrap="wrap"
        >
          {/* NEW: Current TVT Balance (from contract) */}
          <Stat
            label="Current TVT Balance"
            value={tvtBalanceRaw !== null ? formatTime(tvtBalanceRaw) : '—'}
            hint="Running time-for-time balance on the contract."
          />

          <Stat
            label="Total Worked Hours"
            value={formatTime(totalRawEffectiveHours)}
            hint="Before factors and TVT usage are applied."
          />
          <Stat
            label="Total Net Hours"
            value={formatTime(totalNetEffectiveHours)}
            hint="After factors and TVT usage are applied."
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardYearlySummary;
