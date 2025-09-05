// components/WorkSession/WorkSessionSummary.tsx
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
import { MonthlySummary } from '../../interfaces/Summaries/MonthlySummary';

type Props = {
  // Make it optional so the parent can render safely during first load
  monthlySummary?: MonthlySummary;
};

const formatTime = (hoursFloat: number) => {
  const totalMinutes = Math.round(hoursFloat * 60);
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

const WorkSessionSummary: React.FC<Props> = ({ monthlySummary }) => {
  if (!monthlySummary) {
    return (
      <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
        <CardHeader title="Monthly Summary" />
        <Divider />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Select a user contract and period to see the summary.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { month, year, totalRawEffectiveHours, totalNetEffectiveHours, totalTVTHoursAccrued, totalTVTHoursUsed } =
    monthlySummary;

  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          useFlexGap
          flexWrap="wrap"
        >
        <Stat
            label="TVT Hours Accrued"
            value={formatTime(totalTVTHoursAccrued)}
            hint="Time-for-time earned this month."
          />
          <Stat
            label="TVT Hours Used"
            value={formatTime(totalTVTHoursUsed)}
            hint="Time-for-time consumed this month."
          />
          <Stat
            label="Total Raw Effective Hours"
            value={formatTime(totalRawEffectiveHours)}
            hint="Before breaks and TVT usage are applied."
          />
          <Stat
            label="Total Net Hours"
            value={formatTime(totalNetEffectiveHours)}
            hint="After breaks and TVT usage are applied."
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WorkSessionSummary;
