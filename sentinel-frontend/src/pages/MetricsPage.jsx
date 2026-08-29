import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { CustomLoader } from '../components/CustomLoader';

export const MetricsPage = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch function handling both initial load and background polling
  const fetchMetrics = async (isPolling = false) => {
    // Only show the full-page loader on the very first load
    if (!isPolling) {
      setLoading(true);
    }

    try {
      // Add a timestamp to the URL so the browser NEVER caches the response
      const cacheBuster = `_t=${new Date().getTime()}`;
      const res = await API.get(`/api/metrics?${cacheBuster}`);
      setMetrics(res.data);
    } catch (err) {
      console.error("Metrics fetch error", err);
    } finally {
      if (!isPolling) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // 1. Initial fetch on component mount (shows loader)
    fetchMetrics(false);

    // 2. Set up the polling interval for every 1 second (1000ms)
    const intervalId = setInterval(() => {
      fetchMetrics(true); // true means it won't trigger the loading spinner
    }, 1000);

    // 3. Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <CustomLoader message="Fetching Performance Telemetry..." />;

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: '20px', color: '#fff' }}>Infrastructure Telemetry & Performance Metrics</h2>

      <div className="table-panel">
        <h4 style={{ padding: '16px', color: 'var(--sentinelcore-text-muted)', margin: 0 }}>Metrics Telemetry Stream</h4>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Metric ID</th>
              <th>Asset ID</th>
              <th>CPU Usage</th>
              <th>Memory Usage</th>
              <th>Disk Usage</th>
              <th>Network Telemetry</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.metricId}>
                <td style={{ fontFamily: 'monospace' }}>{m.metricId}</td>
                <td style={{ fontFamily: 'monospace' }}>{m.assetId}</td>
                <td>
                  <span style={{ color: m.cpuUsage > 85 ? 'var(--sentinelcore-red)' : 'var(--sentinelcore-green)' }}>
                    {m.cpuUsage}%
                  </span>
                </td>
                <td>{m.memoryUsage}%</td>
                <td>{m.diskUsage}%</td>
                <td>{m.networkUsage} MB/s</td>
                <td>{new Date(m.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};