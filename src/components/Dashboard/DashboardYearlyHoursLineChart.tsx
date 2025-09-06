import * as React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { MonthlySummary } from '../../interfaces/Summaries/MonthlySummary';

type Props = {
  year: number;
  data?: MonthlySummary[]; // expects 1..12 items (can be fewer/missing months)
  loading?: boolean;
  title?: string;
  onMonthClick?: (month: number) => void;
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const toHoursMinutes = (hoursFloat: number) => {
  const totalMinutes = Math.round((hoursFloat ?? 0) * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
};

// Ensure we have entries for all 12 months (fill gaps with zeros)
const normalizeMonthlySeries = (src?: MonthlySummary[]) => {
  const byMonth = new Map<number, MonthlySummary>();
  (src ?? []).forEach(m => byMonth.set(m.month, m));
  const result: MonthlySummary[] = [];
  for (let m = 1; m <= 12; m++) {
    const found = byMonth.get(m);
    result.push(
      found ?? {
        month: m,
        year: 0, // Default year value
        userContractId: '', // Default userContractId value
        totalRawEffectiveHours: 0,
        totalNetEffectiveHours: 0,
        totalTVTHoursAccrued: 0,
        totalTVTHoursUsed: 0,
      }
    );
  }
  return result;
};

const DashboardYearlyHoursLineChart: React.FC<Props> = ({
  year,
  data,
  loading,
  title = 'Monthly Hours (Raw vs. Net)',
  onMonthClick,
}) => {
  const series = React.useMemo(
    () =>
      normalizeMonthlySeries(data).map((x) => ({
        ...x,
        monthLabel: MONTHS[x.month - 1],
      })),
    [data]
  );

  const hasData = series.some(
    s => s.totalRawEffectiveHours > 0 || s.totalNetEffectiveHours > 0
  );

  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
      <CardHeader title={title} subheader={`Year ${year}`} />
      <Divider />
      <CardContent sx={{ height: 360 }}>
        {loading && (
          <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!loading && !hasData && (
          <Typography variant="body2" color="text.secondary">
            No monthly data available for this selection.
          </Typography>
        )}

        {!loading && hasData && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={series}
              margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
              onClick={(e: any) => {
                // Recharts passes the active payload; pick month if available
                const m = e?.activePayload?.[0]?.payload?.month as number | undefined;
                if (m && onMonthClick) onMonthClick(m);
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthLabel" tickMargin={6} />
              <YAxis
                tickMargin={6}
                width={65}
                tickFormatter={(v) => `${Math.round(v)}h`}
              />
              <Tooltip
                formatter={(value: any, name: string) => {
                  if (typeof value === 'number') return [toHoursMinutes(value), name];
                  return [value, name];
                }}
                labelFormatter={(_, payload) => {
                  const p = payload?.[0]?.payload;
                  return `${MONTHS[(p?.month ?? 1) - 1]} ${year}`;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalRawEffectiveHours"
                name="Raw hours"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="totalNetEffectiveHours"
                name="Net hours"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardYearlyHoursLineChart;
