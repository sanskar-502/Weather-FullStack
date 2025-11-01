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

interface WindData {
  dt: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
}

interface WindChartProps {
  data: WindData[];
  timeRange?: number; // Time range in hours
}

const degreesToDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                     'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees % 360) / 22.5));
  return directions[index % 16];
};

export const WindChart: React.FC<WindChartProps> = ({ data, timeRange = 24 }) => {
  const now = Date.now() / 1000;
  const timeRangeSeconds = timeRange * 60 * 60;
  const targetTime = now + timeRangeSeconds;
  
  const filteredData = data.filter(item => item.dt >= now && item.dt <= targetTime);
  
  const formattedData = filteredData.map(item => ({
    time: format(new Date(item.dt * 1000), 'HH:mm'),
    speed: item.wind_speed,
    gust: item.wind_gust,
    direction: degreesToDirection(item.wind_deg),
    degree: item.wind_deg,
    x: Math.sin(item.wind_deg * Math.PI / 180) * item.wind_speed,
    y: Math.cos(item.wind_deg * Math.PI / 180) * item.wind_speed
  }));

  const getSpeedTitle = () => {
    if (timeRange === 6) return 'Wind Speed and Gusts - Last 6 Hours';
    if (timeRange === 12) return 'Wind Speed and Gusts - Last 12 Hours';
    if (timeRange === 24) return 'Wind Speed and Gusts - Next 24 Hours';
    if (timeRange === 48) return 'Wind Speed and Gusts - Next 48 Hours';
    return `Wind Speed and Gusts - Next ${timeRange} Hours`;
  };

  const getDirectionTitle = () => {
    if (timeRange === 6) return 'Wind Direction - Last 6 Hours';
    if (timeRange === 12) return 'Wind Direction - Last 12 Hours';
    if (timeRange === 24) return 'Wind Direction - Next 24 Hours';
    if (timeRange === 48) return 'Wind Direction - Next 48 Hours';
    return `Wind Direction - Next ${timeRange} Hours`;
  };

  return (
    <div className="charts-container">
      <div className="wind-speed-chart">
        <h3>{getSpeedTitle()}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" minTickGap={20} />
            <YAxis tickFormatter={(value) => `${value} m/s`} />
            <Tooltip labelFormatter={(label) => `Time: ${label}`} formatter={(value: number, name: string) => [`${value} m/s`, name]} />
            <Legend />
            <Line type="monotone" dataKey="speed" stroke="#4299e1" name="Wind Speed" />
            <Line type="monotone" dataKey="gust" stroke="#805ad5" name="Wind Gust" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="wind-direction-chart">
        <h3>{getDirectionTitle()}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              minTickGap={20}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 360]}
              ticks={[0, 45, 90, 135, 180, 225, 270, 315, 360]}
              tickFormatter={(value) => {
                const dirs: {[key: number]: string} = {
                  0: 'N', 45: 'NE', 90: 'E', 135: 'SE',
                  180: 'S', 225: 'SW', 270: 'W', 315: 'NW', 360: 'N'
                };
                return dirs[value] || `${value}°`;
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              labelFormatter={(label) => `Time: ${label}`}
              formatter={(value: number, name: string, props: any) => {
                const payload = (props as any)?.payload;
                return [
                  `${payload?.direction} (${payload?.degree}°)`,
                  'Direction'
                ];
              }}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '10px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="degree" 
              stroke="#10b981" 
              strokeWidth={2.5}
              name="Wind Direction"
              dot={{ r: 3, fill: '#10b981' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};