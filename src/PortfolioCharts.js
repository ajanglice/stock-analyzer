import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PortfolioCharts = ({ sectorAllocation, riskBreakdown }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <div className="flex-1 min-w-[300px]">
        <h3 className="text-blue-600 text-lg mb-2">Sector Allocation</h3>
        <div className="h-96">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={sectorAllocation}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {sectorAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  bottom: 0,
                  fontSize: '12px',
                  width: '100%'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex-1 min-w-[300px]">
        <h3 className="text-blue-600 text-lg mb-2">Risk Distribution</h3>
        <div className="h-96">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={riskBreakdown}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {riskBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  bottom: 0,
                  fontSize: '12px',
                  width: '100%'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCharts;