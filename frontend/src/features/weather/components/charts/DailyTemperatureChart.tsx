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

interface DailyTemperatureData {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night?: number;
    eve?: number;
    morn?: number;
  };
  feels_like?: {
    day: number;
    night?: number;
    eve?: number;
    morn?: number;
  };
}

interface DailyTemperatureChartProps {
  data: DailyTemperatureData[];
  units?: 'metric' | 'imperial';
}

export const DailyTemperatureChart: React.FC<DailyTemperatureChartProps> = ({ data, units = 'metric' }) => {
  if (!data?.length) {
    return null;
  }

  const tempUnit = units === 'metric' ? '°C' : '°F';
  const limitedData = data.slice(0, 7);

  const formattedData = limitedData.map(item => {
    const max = Math.round(item.temp.max);
    const min = Math.round(item.temp.min);
    const avg = Math.round((item.temp.max + item.temp.min) / 2);
    
    return {
      date: format(new Date(item.dt * 1000), 'EEE, MMM d'),
      shortDate: format(new Date(item.dt * 1000), 'EEE'),
      max,
      min,
      avg,
    };
  });

  return (
    <div className="chart-container">
      <h3>7-Day Temperature Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="shortDate" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            tickFormatter={(value) => `${value}°`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            labelFormatter={(label, payload) => payload?.[0]?.payload?.date || label}
            formatter={(value: number) => [`${value}${tempUnit}`]}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '10px'
            }}
          />
          <Legend />
          
          {/* Max temperature line */}
          <Line 
            type="monotone" 
            dataKey="max" 
            stroke="#e03e3e" 
            strokeWidth={2.5}
            name="Max Temp"
            dot={{ r: 4, fill: '#e03e3e' }}
            activeDot={{ r: 6 }}
          />
          
          {/* Min temperature line */}
          <Line 
            type="monotone" 
            dataKey="min" 
            stroke="#5c7cfa" 
            strokeWidth={2.5}
            name="Min Temp"
            dot={{ r: 4, fill: '#5c7cfa' }}
            activeDot={{ r: 6 }}
          />
          
          {/* Average temperature line */}
          <Line 
            type="monotone" 
            dataKey="avg" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Avg Temp"
            dot={{ r: 3, fill: '#10b981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
