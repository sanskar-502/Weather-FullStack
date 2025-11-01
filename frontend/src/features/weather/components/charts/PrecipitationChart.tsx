import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';

interface PrecipitationData {
  dt: number;
  rain?: {
    '1h': number;
  };
  snow?: {
    '1h': number;
  };
  pop: number; // Probability of precipitation
}

interface PrecipitationChartProps {
  data: PrecipitationData[];
  timeRange?: number; // Time range in hours
}

export const PrecipitationChart: React.FC<PrecipitationChartProps> = ({ data, timeRange = 24 }) => {
  const now = Date.now() / 1000;
  const timeRangeSeconds = timeRange * 60 * 60;
  const targetTime = now + timeRangeSeconds;
  
  const filteredData = data.filter(item => item.dt >= now && item.dt <= targetTime);
  
  const formattedData = filteredData.map(item => ({
    time: format(new Date(item.dt * 1000), 'h:mm a'),
    rain: Math.round((item.rain?.['1h'] || 0) * 100) / 100,
    snow: Math.round((item.snow?.['1h'] || 0) * 100) / 100,
    pop: Math.round(item.pop * 100)
  }));

  const getTitle = () => {
    if (timeRange === 6) return 'Precipitation - Last 6 Hours';
    if (timeRange === 12) return 'Precipitation - Last 12 Hours';
    if (timeRange === 24) return 'Precipitation - Next 24 Hours';
    if (timeRange === 48) return 'Precipitation - Next 48 Hours';
    return `Precipitation - Next ${timeRange} Hours`;
  };

  return (
    <div className="chart-container">
      <h3>{getTitle()}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" minTickGap={20} />
          <YAxis yAxisId="left" tickFormatter={(value) => `${value}mm`} />
          <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
          <Tooltip labelFormatter={(label) => `Time: ${label}`} formatter={(value: number, name: string) => [name === 'pop' ? `${value}%` : `${value.toFixed(2)}mm`, name === 'pop' ? 'Probability' : name]} />
          <Legend />
          <Bar dataKey="rain" fill="#4299e1" yAxisId="left" name="Rain" />
          <Bar dataKey="snow" fill="#a0aec0" yAxisId="left" name="Snow" />
          <Bar dataKey="pop" fill="#805ad5" yAxisId="right" name="Probability" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};