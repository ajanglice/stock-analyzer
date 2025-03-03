import React, { useState } from 'react';

const PortfolioInsights = ({ aiInsights }) => {
  const [showInsights, setShowInsights] = useState(true);

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 
        style={{ 
          color: '#0078d4', 
          fontSize: '1.1em', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none', // Prevent text selection when clicking
          padding: '8px',
          borderRadius: '4px',
          transition: 'background-color 0.2s ease',
          backgroundColor: showInsights ? '#f0f7ff' : 'transparent'
        }}
        onClick={() => setShowInsights(!showInsights)}
      >
        <span style={{ 
          marginRight: '8px',
          display: 'inline-block',
          width: '16px',
          textAlign: 'center',
          transition: 'transform 0.3s ease'
        }}>
          {showInsights ? '▼' : '►'}
        </span>
        Portfolio Insights
      </h3>
      
      {showInsights && (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '12px',
          maxHeight: '300px',
          overflowY: 'auto',
          padding: '8px 4px',
          marginTop: '8px'
        }}>
          {aiInsights.map((insight, index) => (
            <div key={index} style={{ 
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '0.9em',
              border: '1px solid #e0e0e0',
              lineHeight: '1.5',
              textAlign: 'left'
            }}>
              {insight}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioInsights;
