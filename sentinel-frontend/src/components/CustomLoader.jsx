import React from 'react';

export const CustomLoader = ({ message = "Loading SOC Analytics..." }) => (
  <div className="loader-wrapper">
    <div className="soc-spinner"></div>
    <span style={{ marginTop: '12px', fontSize: '0.85rem', color: '#8c9ba5' }}>{message}</span>
  </div>
);