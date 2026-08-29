import React from 'react';

export const StatusBadge = ({ status }) => {
  const getBadgeClass = (str) => {
    if (!str) return 'badge-healthy';
    const s = str.toUpperCase();
    if (['HEALTHY', 'LOW', 'RESOLVED', 'PATCHED'].includes(s)) return 'badge-healthy';
    if (['WARNING', 'MEDIUM', 'ASSIGNED', 'TESTING', 'PENDING'].includes(s)) return 'badge-warning';
    if (['CRITICAL', 'HIGH', 'OPEN', 'FAILED'].includes(s)) return 'badge-critical';
    return 'badge-healthy';
  };

  return <span className={`badge ${getBadgeClass(status)}`}>{status}</span>;
};