import * as React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Paper,
  Typography,
  Stack,
  Box,
  Tooltip,
  Divider,
  Grid,
} from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { MonthlySummary } from '../../interfaces/Summaries/MonthlySummary';

type Props = {
  title?: string;
  year: number;
  data?: MonthlySummary[];     // If undefined/empty, shows an empty state
  loading?: boolean;                // Optional loading state
  onMonthClick?: (month: number) => void; // Optional click handler
};

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const formatTime = (hoursFloat: number) => {
  const totalMinutes = Math.round(hoursFloat * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
};

const StatRow: React.FC<{
  label: string;
  value: string;
  hint?: string;
}> = ({ label, value, hint }) => (
  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      {hint && (
        <Tooltip title={hint}>
          <InfoOutlined fontSize="inherit" sx={{ opacity: 0.7 }} />
        </Tooltip>
      )}
    </Stack>
    <Typography variant="body2">{value}</Typography>
  </Stack>
);

const MonthTile: React.FC<{
  item: MonthlySummary;
  onClick?: (month: number) => void;
}> = ({ item, onClick }) => {
  const handleClick = () => onClick?.(item.month);

  return (
    <Paper
      variant="outlined"
      onClick={handleClick}
      sx={{
        p: 1.5,
        borderRadius: 2,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.15s ease, transform 0.05s ease',
        '&:hover': onClick ? { boxShadow: 2 } : undefined,
        '&:active': onClick ? { transform: 'scale(0.995)' } : undefined,
        minWidth: 220,
      }}
    >
      <Stack spacing={1}>
        <Typography variant="subtitle2">
          {MONTHS[item.month - 1] ?? `M${item.month}`}
        </Typography>
        <Divider />
        <StatRow
          label="Worked"
          hint="Before factors and TVT usage."
          value={formatTime(item.totalRawEffectiveHours)}
        />
        <StatRow
          label="Net"
          hint="After factors and TVT usage."
          value={formatTime(item.totalNetEffectiveHours)}
        />
        <StatRow
          label="TVT +"
          hint="Time-for-time accrued."
          value={formatTime(item.totalTVTHoursAccrued)}
        />
        <StatRow
          label="TVT −"
          hint="Time-for-time used."
          value={formatTime(item.totalTVTHoursUsed)}
        />
      </Stack>
    </Paper>
  );
};

const DashboardMonthlyOverview: React.FC<Props> = ({
  title = 'Monthly Overview',
  year,
  data,
  loading,
  onMonthClick,
}) => {
  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
      <CardHeader title={title} subheader={`Year ${year}`} />
      <Divider />
      <CardContent>
        {loading && (
          <Typography variant="body2" color="text.secondary">
            Loading monthly overview…
          </Typography>
        )}

        {!loading && (!data || data.length === 0) && (
          <Typography variant="body2" color="text.secondary">
            No monthly data available for this selection.
          </Typography>
        )}

        {!loading && data && data.length > 0 && (
          <Grid container spacing={2}>
            {data
              .sort((a, b) => a.month - b.month)
              .map((item) => (
                <Grid key={item.month} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <MonthTile item={item} onClick={onMonthClick} />
                </Grid>
              ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardMonthlyOverview;
