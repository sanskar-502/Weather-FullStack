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
  ScatterChart,
  Scatter,
  ZAxis,
  Brush
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
}

const degreesToDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                     'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees % 360) / 22.5));
  return directions[index % 16];
};

export const WindChart: React.FC<WindChartProps> = ({ data }) => {
  const formattedData = data.map(item => ({
    time: format(new Date(item.dt * 1000), 'HH:mm'),
    speed: item.wind_speed,
    gust: item.wind_gust,
    direction: degreesToDirection(item.wind_deg),
    degree: item.wind_deg,
    // Calculate x and y coordinates for wind direction visualization
    x: Math.sin(item.wind_deg * Math.PI / 180) * item.wind_speed,
    y: Math.cos(item.wind_deg * Math.PI / 180) * item.wind_speed
  }));

  return (
    <div className="charts-container">
      <div className="wind-speed-chart">
        <h3>Wind Speed and Gusts</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" minTickGap={20} />
            <YAxis tickFormatter={(value) => `${value} m/s`} />
            <Tooltip labelFormatter={(label) => `Time: ${label}`} formatter={(value: number, name: string) => [`${value} m/s`, name]} />
            <Legend />
            <Line type="monotone" dataKey="speed" stroke="#4299e1" name="Wind Speed" />
            <Line type="monotone" dataKey="gust" stroke="#805ad5" name="Wind Gust" strokeDasharray="5 5" />
            <Brush dataKey="time" height={20} stroke="#4299e1" travellerWidth={10} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="wind-direction-chart">
        <h3>Wind Direction</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="x"
              domain={[-20, 20]}
              tickFormatter={(value) => `${Math.abs(value)}`}
              label={{ value: 'W ←→ E', position: 'bottom' }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[-20, 20]}
              tickFormatter={(value) => `${Math.abs(value)}`}
              label={{ value: 'S ←→ N', angle: -90, position: 'left' }}
            />
            <ZAxis range={[100]} />
            <Tooltip
              formatter={(value: number, name: string, props: any) => [
                `${props.payload.speed} m/s`,
                `Direction: ${props.payload.direction} (${props.payload.degree}°)`
              ]}
            />
            <Scatter
              name="Wind"
              data={formattedData}
              fill="#4299e1"
              shape="triangle"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};