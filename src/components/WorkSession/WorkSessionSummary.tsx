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
  Chip,
} from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { MonthlySummary } from '../../interfaces/Summaries/MonthlySummary';
import { UserContractResponse } from '../../interfaces/UserContracts/UserContractResponse';

type Props = {
  monthlySummary?: MonthlySummary;
  userContract?: UserContractResponse | null;
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

const WorkSessionSummary: React.FC<Props> = ({ monthlySummary, userContract }) => {
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

  const { totalRawEffectiveHours, totalNetEffectiveHours } = monthlySummary;

  // Contract bounds
  const minPerMonth: number | null =
    (userContract as any)?.minimumHoursPerMonth ??
    (userContract as any)?.MinimumHoursPerMonth ??
    null;

  const maxPerMonth: number | null =
    (userContract as any)?.maximumHoursPerMonth ??
    (userContract as any)?.MaximumHoursPerMonth ??
    null;

  const net = totalNetEffectiveHours ?? 0;

  const minMet = typeof minPerMonth === 'number' ? net >= minPerMonth : undefined;
  const overMax = typeof maxPerMonth === 'number' ? net > maxPerMonth : undefined;

  // Scale the progress bar so it can show "over max":
  // Pick the largest among net / min / max; if none, hide the bar.
  const scaleLimit = (() => {
    const pool = [
      net,
      typeof minPerMonth === 'number' ? minPerMonth : 0,
      typeof maxPerMonth === 'number' ? maxPerMonth : 0,
    ];
    const max = Math.max(...pool);
    return max > 0 ? max : null;
  })();

  const pct = (value: number | null) =>
    scaleLimit && typeof value === 'number' && value >= 0
      ? Math.min(100, (value / scaleLimit) * 100)
      : null;

  const netPct = pct(net);
  const minPct = pct(minPerMonth);
  const maxPct = pct(maxPerMonth);

  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        {/* KPI cards */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
          <Stat
            label="Total Worked Hours"
            value={formatTime(totalRawEffectiveHours)}
            hint="Before factors and TVT usage are applied."
          />
          <Stat
            label="Total Net Hours"
            value={formatTime(net)}
            hint="Hours counted toward targets (after factors/TVT)."
          />

          <Paper variant="outlined" sx={{ p: 2, flex: 1, minWidth: 220, borderRadius: 2 }}>
            <Stack spacing={0.5}>
              <Box display="flex" alignItems="center" gap={0.75}>
                <Typography variant="subtitle2" color="text.secondary">
                  Minimum per month
                </Typography>
                <Tooltip title="Contractual minimum hours for this month.">
                  <InfoOutlined fontSize="small" sx={{ opacity: 0.7 }} />
                </Tooltip>
              </Box>
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                <Typography variant="h5">
                  {typeof minPerMonth === 'number' ? `${formatTime(minPerMonth)}` : '—'}
                </Typography>
                {typeof minMet === 'boolean' && (
                  <Chip
                    size="small"
                    color={minMet ? 'success' : 'warning'}
                    label={minMet ? 'Min reached' : 'Below min'}
                    variant={minMet ? 'filled' : 'outlined'}
                  />
                )}
              </Box>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, flex: 1, minWidth: 220, borderRadius: 2 }}>
            <Stack spacing={0.5}>
              <Box display="flex" alignItems="center" gap={0.75}>
                <Typography variant="subtitle2" color="text.secondary">
                  Maximum per month
                </Typography>
                <Tooltip title="Contractual maximum hours for this month.">
                  <InfoOutlined fontSize="small" sx={{ opacity: 0.7 }} />
                </Tooltip>
              </Box>
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                <Typography variant="h5">
                  {typeof maxPerMonth === 'number' ? `${formatTime(maxPerMonth)}` : '—'}
                </Typography>
                {typeof overMax === 'boolean' && (
                  <Chip
                    size="small"
                    color={overMax ? 'error' : 'success'}
                    label={overMax ? 'Over max' : 'Within max'}
                    variant={overMax ? 'filled' : 'outlined'}
                  />
                )}
              </Box>
            </Stack>
          </Paper>
        </Stack>

        {/* ======= Progress section (moved BELOW all boxes) ======= */}
        {scaleLimit !== null && (
          <Box sx={{ mt: 3 }}>
            <Box
              sx={{
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Monthly progress
              </Typography>
              <Tooltip title="Net hours vs. contractual min/max. The bar rescales to show values above the max.">
                <InfoOutlined fontSize="small" sx={{ opacity: 0.7 }} />
              </Tooltip>
            </Box>

            {/* Track */}
            <Box
              sx={{
                position: 'relative',
                height: 14,
                borderRadius: 1,
                bgcolor: 'action.hover',
                overflow: 'hidden',
              }}
            >
              {/* Net fill */}
              {netPct !== null && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: `${netPct}%`,
                    bgcolor: overMax ? 'error.main' : 'success.main',
                    borderRadius: 1,
                    transition: 'width 200ms ease',
                  }}
                />
              )}

              {/* Min marker */}
              {minPct !== null && (
                <Tooltip title={`Min ${formatTime(minPerMonth!)}`}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -4,
                      bottom: -4,
                      left: `${minPct}%`,
                      width: 8,
                      bgcolor: 'warning.main',
                      boxShadow: (theme) => `0 0 0 1px ${theme.palette.background.paper}`,
                    }}
                  />
                </Tooltip>
              )}

              {/* Max marker */}
              {maxPct !== null && (
                <Tooltip title={`Max ${formatTime(maxPerMonth!)}`}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -4,
                      bottom: -4,
                      left: `${maxPct}%`,
                      width: 8,
                      bgcolor: 'primary.main',
                      boxShadow: (theme) => `0 0 0 1px ${theme.palette.background.paper}`,
                    }}
                  />
                </Tooltip>
              )}
            </Box>

            {/* Scale labels */}
            <Box display="flex" justifyContent="space-between" mt={0.5}>
              <Typography variant="caption" color="text.secondary">
                0h
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatTime(net)} / {formatTime(maxPerMonth ?? scaleLimit)}
              </Typography>
            </Box>

            {/* Legend */}
            <Stack direction="row" spacing={2} mt={1} alignItems="center" flexWrap="wrap">
              <Box display="flex" alignItems="center" gap={0.75}>
                <Box sx={{ width: 12, height: 12, bgcolor: 'success.main', borderRadius: 0.5 }} />
                <Typography variant="caption">Net hours</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.75}>
                <Box sx={{ width: 12, height: 12, bgcolor: 'warning.main', borderRadius: 0.5 }} />
                <Typography variant="caption">Minimum</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.75}>
                <Box sx={{ width: 12, height: 12, bgcolor: 'primary.main', borderRadius: 0.5 }} />
                <Typography variant="caption">Maximum</Typography>
              </Box>
              {overMax && (
                <Box display="flex" alignItems="center" gap={0.75}>
                  <Box sx={{ width: 12, height: 12, bgcolor: 'error.main', borderRadius: 0.5 }} />
                  <Typography variant="caption">Over max</Typography>
                </Box>
              )}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkSessionSummary;
