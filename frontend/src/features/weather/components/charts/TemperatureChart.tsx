import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush
} from 'recharts';
import { format } from 'date-fns';

interface TemperatureData {
  dt: number;
  temp: number;
  feels_like: number;
}

interface TemperatureChartProps {
  data: TemperatureData[];
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ data }) => {
  const formattedData = data.map(item => ({
    ...item,
    time: format(new Date(item.dt * 1000), 'HH:mm'),
    date: format(new Date(item.dt * 1000), 'MMM dd')
  }));

  return (
    <div className="chart-container">
      <h3>Temperature Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tickFormatter={(time) => time} minTickGap={20} />
          <YAxis domain={['auto', 'auto']} tickFormatter={(value) => `${value}°C`} />
          <Tooltip labelFormatter={(label) => `Time: ${label}`} formatter={(value: number) => [`${value}°C`]} />
          <Legend />
          <Line type="monotone" dataKey="temp" stroke="#8884d8" name="Temperature" dot={false} />
          <Line type="monotone" dataKey="feels_like" stroke="#82ca9d" name="Feels Like" dot={false} />
          <Brush dataKey="time" height={20} stroke="#8884d8" travellerWidth={10} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};