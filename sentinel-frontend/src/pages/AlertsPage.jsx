import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { CustomLoader } from '../components/CustomLoader';
import { StatusBadge } from '../components/StatusBadge';
import { Bell, ShieldAlert } from 'lucide-react';

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/dashboard/recent-alerts')
      .then((res) => setAlerts(res.data))
      .catch((err) => console.error('Alerts fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CustomLoader message="Loading Real-Time SOC Alerts..." />;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Bell size={24} color="#fa8c16" />
        <h2 style={{ color: '#fff', margin: 0 }}>Active Infrastructure Alerts</h2>
      </div>

      <div className="table-panel">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Alert ID</th>
              <th>Server / Asset Name</th>
              <th>Metric Violation</th>
              <th>Violation Value</th>
              <th>Severity</th>
              <th>Recommended Remediation</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length > 0 ? (
              alerts.map((alt, idx) => (
                <tr key={alt.alertId || idx}>
                  <td style={{ fontFamily: 'monospace' }}>{alt.alertId ? alt.alertId.substring(0, 8) + '...' : `ALT-${idx + 100}`}</td>
                  <td style={{ fontWeight: 600 }}>{alt.assetName || alt.serverName || 'DB-SRV-12'}</td>
                  <td>{alt.metricName}</td>
                  <td style={{ color: 'var(--sentinelcore-orange)', fontWeight: 600 }}>{alt.metricValue}%</td>
                  <td><StatusBadge status={alt.severity} /></td>
                  <td>{alt.solution || 'Auto-scaling policy executed'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#8c9ba5', padding: '20px' }}>
                  No active infrastructure alerts recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};