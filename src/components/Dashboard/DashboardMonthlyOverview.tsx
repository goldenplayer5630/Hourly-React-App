// components/Dashboard/DashboardMonthlyOverview.tsx
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
  Chip,
} from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { MonthlySummary } from '../../interfaces/Summaries/MonthlySummary';
import { UserContractResponse } from '../../interfaces/UserContracts/UserContractResponse';

type Props = {
  title?: string;
  year: number;
  data?: MonthlySummary[];           // If undefined/empty, shows an empty state
  loading?: boolean;                 // Optional loading state
  onMonthClick?: (month: number) => void; // Optional click handler
  selectedUserContract?: UserContractResponse;
};

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const formatTime = (hoursFloat: number) => {
  const totalMinutes = Math.round((hoursFloat ?? 0) * 60);
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

const MiniComplianceBar: React.FC<{
  net: number;
  selectedUserContract?: UserContractResponse;
}> = ({ net, selectedUserContract }) => {
  const minHoursPerMonth = selectedUserContract?.minimumHoursPerMonth;
  const maxHoursPerMonth = selectedUserContract?.maximumHoursPerMonth;
  const min = typeof minHoursPerMonth === 'number' ? minHoursPerMonth : null;
  const max = typeof maxHoursPerMonth === 'number' ? maxHoursPerMonth : null;

  // Scale to show over-max too
  const scaleLimit = Math.max(
    net || 0,
    min ?? 0,
    max ?? 0,
  );
  if (scaleLimit <= 0) return null;

  const pct = (val: number | null) =>
    val != null ? Math.min(100, Math.max(0, (val / scaleLimit) * 100)) : null;

  const netPct = pct(net);
  const minPct = pct(min);
  const maxPct = pct(max);
  const overMax = max != null ? net > max : false;

  return (
    <Box sx={{ mt: 1 }}>
      {/* Track */}
      <Box
        sx={{
          position: 'relative',
          height: 10,
          borderRadius: 1,
          bgcolor: 'action.hover',
          overflow: 'hidden',
        }}
      >
        {/* Net fill */}
        {netPct != null && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${netPct}%`,
              bgcolor: overMax ? 'error.main' : 'success.main',
              transition: 'width 200ms ease',
            }}
          />
        )}

        {/* Min marker */}
        {minPct != null && (
          <Tooltip title={`Min ${formatTime(min!)}`}>
            <Box
              sx={{
                position: 'absolute',
                top: -3,
                bottom: -3,
                left: `${minPct}%`,
                width: 2,
                bgcolor: 'warning.main',
              }}
            />
          </Tooltip>
        )}

        {/* Max marker */}
        {maxPct != null && (
          <Tooltip title={`Max ${formatTime(max!)}`}>
            <Box
              sx={{
                position: 'absolute',
                top: -3,
                bottom: -3,
                left: `${maxPct}%`,
                width: 2,
                bgcolor: 'primary.main',
              }}
            />
          </Tooltip>
        )}
      </Box>

      {/* Scale label (right-aligned, compact) */}
      <Box display="flex" justifyContent="space-between" mt={0.25}>
        <Typography variant="caption" color="text.secondary">0h</Typography>
        <Typography variant="caption" color="text.secondary">
          {formatTime(net)} / {formatTime(scaleLimit)}
        </Typography>
      </Box>
    </Box>
  );
};

const MonthTile: React.FC<{
  item: MonthlySummary;
  onClick?: (month: number) => void;
  selectedUserContract?: UserContractResponse;
}> = ({ item, onClick, selectedUserContract }) => {
  const handleClick = () => onClick?.(item.month);

  const minHoursPerMonth = selectedUserContract?.minimumHoursPerMonth;
  const maxHoursPerMonth = selectedUserContract?.maximumHoursPerMonth;

  const net = item.totalNetEffectiveHours ?? 0;
  const min = typeof minHoursPerMonth === 'number' ? minHoursPerMonth : null;
  const max = typeof maxHoursPerMonth === 'number' ? maxHoursPerMonth : null;

  const minMet = min != null ? net >= min : undefined;
  const overMax = max != null ? net > max : undefined;

  let chipColor: 'default' | 'success' | 'warning' | 'error' = 'default';
  let chipLabel = '—';
  if (overMax === true) {
    chipColor = 'error';
    chipLabel = 'Over max';
  } else if (minMet === false) {
    chipColor = 'warning';
    chipLabel = 'Below min';
  } else if (minMet === true && (overMax === false || overMax === undefined)) {
    chipColor = 'success';
    chipLabel = 'Within range';
  }

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
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
          <Typography variant="subtitle2">
            {MONTHS[item.month - 1] ?? `M${item.month}`}
          </Typography>
          {(min != null || max != null) && (
            <Chip size="small" color={chipColor} label={chipLabel} />
          )}
        </Box>

        <Divider />

        {/* Only Worked + Net now */}
        <StatRow
          label="Worked"
          hint="Before factors."
          value={formatTime(item.totalRawEffectiveHours)}
        />
        <StatRow
          label="Net"
          hint="After factors."
          value={formatTime(net)}
        />

        {/* Mini compliance bar with Min/Max markers */}
        {(min != null || max != null) && (
          <MiniComplianceBar
            net={net}
            selectedUserContract={selectedUserContract}
          />
        )}
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
  selectedUserContract,
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
            {[...data]
              .sort((a, b) => a.month - b.month)
              .map((item) => (
                <Grid key={item.month} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <MonthTile
                    item={item}
                    onClick={onMonthClick}
                    selectedUserContract={selectedUserContract}
                  />
                </Grid>
              ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardMonthlyOverview;
