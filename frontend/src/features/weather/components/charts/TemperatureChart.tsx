import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';

interface TemperatureData {
  dt: number;
  temp: number;
  feels_like: number;
}

interface TemperatureChartProps {
  data: TemperatureData[];
  timeRange?: number; // Time range in hours
  units?: 'metric' | 'imperial';
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ data, timeRange = 24, units = 'metric' }) => {
  const now = Date.now() / 1000;
  const timeRangeSeconds = timeRange * 60 * 60;
  const targetTime = now + timeRangeSeconds;
  
  const filteredData = data.filter(item => item.dt >= now && item.dt <= targetTime);
  const tempUnit = units === 'metric' ? '°C' : '°F';
  
  const formattedData = filteredData.map(item => ({
    ...item,
    time: format(new Date(item.dt * 1000), 'HH:mm'),
    date: format(new Date(item.dt * 1000), 'MMM dd')
  }));

  const getTitle = () => {
    if (timeRange === 6) return 'Temperature - Last 6 Hours';
    if (timeRange === 12) return 'Temperature - Last 12 Hours';
    if (timeRange === 24) return 'Temperature - Next 24 Hours';
    if (timeRange === 48) return 'Temperature - Next 48 Hours';
    return `Temperature - Next ${timeRange} Hours`;
  };

  return (
    <div className="chart-container">
      <h3>{getTitle()}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tickFormatter={(time) => time} minTickGap={20} />
          <YAxis domain={['auto', 'auto']} tickFormatter={(value) => `${value}${tempUnit}`} />
          <Tooltip labelFormatter={(label) => `Time: ${label}`} formatter={(value: number) => [`${value}${tempUnit}`]} />
          <Legend />
          <Line type="monotone" dataKey="temp" stroke="#8884d8" name="Temperature" dot={false} />
          <Line type="monotone" dataKey="feels_like" stroke="#82ca9d" name="Feels Like" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};