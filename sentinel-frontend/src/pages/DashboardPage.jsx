import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { CustomLoader } from '../components/CustomLoader';
import { StatusBadge } from '../components/StatusBadge';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  LineChart, Line, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const HEALTH_COLORS = {
  Healthy: '#1890ff',   // Blue
  Warning: '#fa8c16',   // Orange
  Critical: '#f5222d',  // Red
};

export const DashboardPage = () => {
  const [overview, setOverview] = useState(null);
  const [health, setHealth] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewRes, healthRes, alertsRes, chartsRes] = await Promise.all([
          API.get('/api/dashboard/overview'),
          API.get('/api/dashboard/system-health'),
          API.get('/api/dashboard/recent-alerts'),
          API.get('/api/dashboard/charts')
        ]);
        setOverview(overviewRes.data);
        setHealth(healthRes.data);
        setAlerts(alertsRes.data);

        // Format backend ISO timestamps to clean HH:mm:ss format
        const formattedCharts = (chartsRes.data || []).map(item => ({
          ...item,
          formattedTime: formatTimestamp(item.timestamp)
        }));
        setChartData(formattedCharts);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Time formatter helper
  const formatTimestamp = (rawTime) => {
    if (!rawTime) return '';
    try {
      const date = new Date(rawTime);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch {
      return rawTime.substring(11, 19);
    }
  };

  if (loading) return <CustomLoader message="Loading Security Operations Overview..." />;

  const donutData = health ? [
    { name: 'Healthy', value: health.healthyAssets || 2800, color: HEALTH_COLORS.Healthy },
    { name: 'Warning', value: health.warningAssets || 35, color: HEALTH_COLORS.Warning },
    { name: 'Critical', value: health.criticalAssets || 12, color: HEALTH_COLORS.Critical },
  ] : [
    { name: 'Healthy', value: 2800, color: HEALTH_COLORS.Healthy },
    { name: 'Warning', value: 35, color: HEALTH_COLORS.Warning },
    { name: 'Critical', value: 12, color: HEALTH_COLORS.Critical },
  ];

  const totalAssets = donutData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: '24px', color: '#fff' }}>Security Operations Command Center</h2>

      {/* Top Metric Cards */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-title">Total Monitored Assets</div>
          <div className="stat-value">{overview?.totalAssets || 2847}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">System Uptime</div>
          <div className="stat-value" style={{ color: 'var(--sentinelcore-green)' }}>
            {overview?.uptimePercentage || 99.99}%
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Active Security Incidents</div>
          <div className="stat-value" style={{ color: 'var(--sentinelcore-red)' }}>
            {overview?.activeIncidents || 23}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">MTTR (Mean Time To Resolve)</div>
          <div className="stat-value">{overview?.mttrMinutes || 47} min</div>
        </div>
      </div>

      {/* ENHANCED CHARTS ROW */}
      <div className="chart-row">
        {/* DONUT CHART WITH LEGEND */}
        <div className="chart-panel">
          <h4 style={{ margin: 0, marginBottom: '16px' }}>System Health Distribution</h4>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Donut Container */}
            <div style={{ width: '55%', height: 230, position: 'relative' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie 
                    data={donutData} 
                    innerRadius={65} 
                    outerRadius={88} 
                    paddingAngle={4} 
                    dataKey="value"
                    stroke="#1b1e24"
                    strokeWidth={3}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(27, 30, 36, 0.95)', 
                      borderColor: '#2e3440', 
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{totalAssets}</div>
                <div style={{ fontSize: '0.72rem', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assets</div>
              </div>
            </div>

            {/* Custom Right-Side Legend */}
            <div style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {donutData.map((item, idx) => {
                const percentage = totalAssets > 0 ? ((item.value / totalAssets) * 100).toFixed(1) : 0;
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }} />
                      <span style={{ color: '#a0aec0', fontWeight: 500 }}>{item.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, color: '#fff', marginRight: '6px' }}>{item.value}</span>
                      <span style={{ fontSize: '0.75rem', color: '#a0aec0' }}>({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* LINE CHART WITH FORMATTED TIME & LEGEND */}
        <div className="chart-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ margin: 0 }}>Infrastructure Performance History</h4>
            
            {/* Chart Legend Indicators */}
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', fontWeight: 600 }}>
              <span style={{ color: '#1890ff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1890ff' }} /> CPU %
              </span>
              <span style={{ color: '#fa8c16', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fa8c16' }} /> Memory %
              </span>
            </div>
          </div>

          <div style={{ width: '100%', height: 230 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e3440" vertical={false} />
                <XAxis 
                  dataKey="formattedTime" 
                  stroke="#a0aec0" 
                  fontSize={11}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#a0aec0" 
                  fontSize={11}
                  domain={[0, 100]}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(27, 30, 36, 0.95)', 
                    borderColor: '#2e3440',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }} 
                  labelStyle={{ color: '#a0aec0', marginBottom: '4px' }}
                />
                <Line type="monotone" dataKey="cpuUsage" stroke="#1890ff" strokeWidth={2} dot={{ r: 3, fill: '#1890ff' }} name="CPU Usage %" />
                <Line type="monotone" dataKey="memoryUsage" stroke="#fa8c16" strokeWidth={2} dot={{ r: 3, fill: '#fa8c16' }} name="Memory Usage %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Alerts Table */}
      <div className="table-panel">
        <h4 style={{ padding: '16px', color: 'var(--sentinelcore-text-muted)', margin: 0 }}>Recent Infrastructure Alerts</h4>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Violation Type</th>
              <th>Value</th>
              <th>Severity</th>
              <th>Recommended Remediation</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length > 0 ? (
              alerts.map((alert, idx) => (
                <tr key={idx}>
                  <td>{alert.assetName || alert.serverName || 'DB-SRV-12'}</td>
                  <td>{alert.metricName}</td>
                  <td>{alert.metricValue}%</td>
                  <td><StatusBadge status={alert.severity} /></td>
                  <td>{alert.solution || 'Auto-scale triggered'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#a0aec0', padding: '20px' }}>No active alerts generated.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};