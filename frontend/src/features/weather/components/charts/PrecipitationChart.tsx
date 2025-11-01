import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush
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
}

export const PrecipitationChart: React.FC<PrecipitationChartProps> = ({ data }) => {
  const formattedData = data.map(item => ({
    time: format(new Date(item.dt * 1000), 'HH:mm'),
    rain: item.rain?.['1h'] || 0,
    snow: item.snow?.['1h'] || 0,
    pop: item.pop * 100 // Convert to percentage
  }));

  return (
    <div className="chart-container">
      <h3>Precipitation Forecast</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" minTickGap={20} />
          <YAxis yAxisId="left" tickFormatter={(value) => `${value}mm`} />
          <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
          <Tooltip labelFormatter={(label) => `Time: ${label}`} formatter={(value: number, name: string) => [name === 'pop' ? `${value}%` : `${value}mm`, name === 'pop' ? 'Probability' : name]} />
          <Legend />
          <Bar dataKey="rain" fill="#4299e1" yAxisId="left" name="Rain" />
          <Bar dataKey="snow" fill="#a0aec0" yAxisId="left" name="Snow" />
          <Bar dataKey="pop" fill="#805ad5" yAxisId="right" name="Probability" />
          <Brush dataKey="time" height={20} stroke="#4299e1" travellerWidth={10} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};