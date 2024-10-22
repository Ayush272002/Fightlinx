import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';

// Hardcoded mock data for performance chart
const mockPerformanceData = [
  { month: 'January', wins: 8, losses: 4 },
  { month: 'February', wins: 10, losses: 3 },
  { month: 'March', wins: 9, losses: 5 },
  { month: 'April', wins: 7, losses: 6 },
  { month: 'May', wins: 12, losses: 2 },
  { month: 'June', wins: 11, losses: 4 },
];

export const Performance = () => {
  return (
    <Card className="bg-gray-900 border-red-600 rounded">
      <CardHeader>
        <CardTitle className="text-red-400">Performance Insights</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chart container */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={mockPerformanceData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorWins" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff4136" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff4136" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorLosses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0074d9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0074d9" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#fff', fontSize: 14 }}
              label={{
                value: 'Months',
                position: 'insideBottom',
                offset: -5,
                fill: '#fff',
                fontSize: 16,
              }}
            />
            <YAxis
              tick={{ fill: '#fff', fontSize: 14 }}
              label={{
                value: 'Count',
                angle: -90,
                position: 'insideLeft',
                fill: '#fff',
                fontSize: 16,
              }}
            />
            <Tooltip
              wrapperStyle={{
                backgroundColor: '#333',
                border: '1px solid #777',
                borderRadius: '8px',
                padding: '10px',
              }}
              labelStyle={{ color: '#fff', fontSize: '14px' }}
              itemStyle={{ color: '#ff4136', fontSize: '12px' }}
              cursor={{ fill: 'rgba(255, 65, 54, 0.2)' }}
            />
            <Bar
              dataKey="wins"
              fill="url(#colorWins)"
              radius={[10, 10, 0, 0]}
              barSize={15}
              animationDuration={1500}
            />
            <Bar
              dataKey="losses"
              fill="url(#colorLosses)"
              radius={[10, 10, 0, 0]}
              barSize={15}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
