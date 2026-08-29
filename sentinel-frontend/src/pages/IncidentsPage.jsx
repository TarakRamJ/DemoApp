import React, { useState, useEffect, useContext, useCallback } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CustomLoader } from '../components/CustomLoader';
import { StatusBadge } from '../components/StatusBadge';
import { ShieldAlert, History, Clock, UserCheck, CheckCircle2, Lock, RefreshCw } from 'lucide-react';

export const IncidentsPage = () => {
  const { user } = useContext(AuthContext);
  const [criticalIncidents, setCriticalIncidents] = useState([]);
  const [historyIncidents, setHistoryIncidents] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Wrap fetchIncidents in useCallback to safely use it in useEffect and polling intervals
  const fetchIncidents = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      // Fetch Active Critical Incidents (Excludes RESOLVED)
      const critRes = await API.get('/api/incidents/cirital');
      setCriticalIncidents(critRes.data);

      // Fetch Full Incident History
      const allRes = await API.get('/api/incidents');
      setHistoryIncidents(allRes.data);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching real-time incidents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up automatic 5-second polling interval
  useEffect(() => {
    // Initial fetch
    fetchIncidents(false);

    // Auto-refresh from Spring Boot backend every 5 seconds
    const interval = setInterval(() => {
      fetchIncidents(true); // true = silent background refresh
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [fetchIncidents]);

  const handleStatusChange = async (id, newStatus) => {
    if (user?.role !== 'ADMIN') {
      alert('Access Denied: Only ADMIN users can alter incident state transitions.');
      return;
    }
    try {
      await API.put(`/api/incidents/${id}/status?status=${newStatus}`);
      // Immediately pull fresh state from backend
      fetchIncidents(true);
    } catch (err) {
      alert('Status update failed');
    }
  };

  if (loading) return <CustomLoader message="Connecting to Real-Time Incident Stream..." />;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={24} color="#f5222d" />
            <h2 style={{ color: '#fff', margin: 0 }}>Active Critical Incidents</h2>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#8c9ba5', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <RefreshCw size={12} className="soc-spinner" style={{ animationDuration: '3s', width: '12px', height: '12px' }} />
            Live sync active • Last updated: {lastRefreshed.toLocaleTimeString()}
          </span>
        </div>

        <button 
          className="btn-primary" 
          style={{ background: 'var(--sentinelcore-purple)', display: 'flex', alignItems: 'center', gap: '8px' }} 
          onClick={() => setShowHistory(!showHistory)}
        >
          <History size={16} /> {showHistory ? 'Hide Incident History' : 'View Incident History'}
        </button>
      </div>

      {/* Active Critical Incidents List */}
      {criticalIncidents.length === 0 ? (
        <div className="form-panel" style={{ textAlign: 'center', color: '#8c9ba5', padding: '30px' }}>
          No active unresolved critical incidents at this time.
        </div>
      ) : (
        criticalIncidents.map((inc) => (
          <div key={inc.id} className="form-panel" style={{ marginBottom: '20px', borderLeft: '4px solid var(--sentinelcore-red)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginRight: '10px' }}>
                  #{inc.incidentTicket || 'INC-2026-6258'}
                </span>
                <StatusBadge status={inc.severity} /> <StatusBadge status={inc.status} />
              </div>
              {user?.role !== 'ADMIN' && (
                <span style={{ fontSize: '0.8rem', color: '#8c9ba5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={12} /> Read-only mode
                </span>
              )}
            </div>

            <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#8c9ba5' }}>Incident Type</div>
                <div style={{ fontWeight: 600 }}>{inc.type}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#8c9ba5' }}>Source IP</div>
                <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{inc.sourceIp}</div>
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#8c9ba5' }}>Impact Summary</div>
              <div>{inc.impactSummary}</div>
            </div>

            {/* Team SLA Cards */}
            <div className="dashboard-grid" style={{ marginTop: '15px', marginBottom: '15px' }}>
              <div className="stat-card" style={{ padding: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: '#8c9ba5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <UserCheck size={12} /> Assigned Team
                </div>
                <div style={{ fontWeight: 600 }}>{inc.assignedTeam || 'Security Ops'}</div>
              </div>
              <div className="stat-card" style={{ padding: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: '#8c9ba5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> SLA Target
                </div>
                <div style={{ fontWeight: 600 }}>{inc.slaHours} Hours</div>
              </div>
              <div className="stat-card" style={{ padding: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: '#8c9ba5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> Resolution ETA
                </div>
                <div style={{ fontWeight: 600 }}>{inc.etaMinutes} mins</div>
              </div>
            </div>

            {/* Admin Manual State Buttons */}
            {user?.role === 'ADMIN' && (
  <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
    <button 
      className="btn-glass btn-assign" 
      onClick={() => handleStatusChange(inc.id, 'ASSIGNED')}
    >
      Assign
    </button>

    <button 
      className="btn-glass btn-investigate" 
      onClick={() => handleStatusChange(inc.id, 'INVESTIGATION')}
    >
      Investigate
    </button>

    <button 
      className="btn-glass btn-resolve" 
      onClick={() => handleStatusChange(inc.id, 'RESOLVED')}
    >
      <CheckCircle2 size={16} style={{ marginRight: '6px' }} /> Resolve
    </button>
  </div>
)}
          </div>
        ))
      )}

      {/* Incident History Drawer / Modal Box */}
      {showHistory && (
        <div className="table-panel" style={{ marginTop: '30px' }}>
          <h4 style={{ padding: '16px', color: 'var(--sentinelcore-text-muted)', margin: 0 }}>All Incident History (Including Resolved)</h4>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Impact Summary</th>
                <th>Assigned Team</th>
              </tr>
            </thead>
            <tbody>
              {historyIncidents.map((h) => (
                <tr key={h.id}>
                  <td style={{ fontWeight: 600 }}>{h.incidentTicket}</td>
                  <td>{h.type}</td>
                  <td><StatusBadge status={h.severity} /></td>
                  <td><StatusBadge status={h.status} /></td>
                  <td>{h.impactSummary}</td>
                  <td>{h.assignedTeam}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};