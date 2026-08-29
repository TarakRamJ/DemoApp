import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { CustomLoader } from '../components/CustomLoader';
import { StatusBadge } from '../components/StatusBadge';

export const VulnerabilitiesPage = () => {
  const [vulns, setVulns] = useState([]);
  const [patchInputs, setPatchInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // New Vulnerability Form
  const [formData, setFormData] = useState({
    cveId: '',
    title: '',
    description: '',
    severity: 'HIGH',
    cvssScore: 7.5,
    patchStatus: 'PENDING',
    affectedServersCount: 10,
    patchedServersCount: 0,
    scannerSource: 'Trivy Scanner'
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchVulns = async () => {
    try {
      const res = await API.get('/api/v1/vulnerabilities');
      setVulns(res.data);
    } catch (err) {
      console.error("Vulnerabilities fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVulns();
  }, []);

  const validateNewVuln = () => {
    const errs = {};
    if (!formData.cveId.trim()) errs.cveId = 'CVE ID required (e.g. CVE-2026-1234)';
    if (!formData.title.trim()) errs.title = 'Title required';
    if (formData.cvssScore < 0 || formData.cvssScore > 10) errs.cvssScore = 'CVSS Score must be 0 - 10';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateVuln = async (e) => {
    e.preventDefault();
    if (!validateNewVuln()) return;

    try {
      const res = await API.post('/api/v1/vulnerabilities', formData);
      setVulns([...vulns, res.data]);
      setFormData({
        cveId: '',
        title: '',
        description: '',
        severity: 'HIGH',
        cvssScore: 7.5,
        patchStatus: 'PENDING',
        affectedServersCount: 10,
        patchedServersCount: 0,
        scannerSource: 'Trivy Scanner'
      });
      setFormErrors({});
    } catch (err) {
      alert('Failed to register CVE. Requires ADMIN privileges.');
    }
  };

  const handleApplyPatch = async (id) => {
    const qty = parseInt(patchInputs[id]);
    if (!qty || qty <= 0) {
      setErrors({ ...errors, [id]: 'Enter valid count > 0' });
      return;
    }

    try {
      const res = await API.put(`/api/v1/vulnerabilities/${id}/patch`, { serversToPatch: qty });
      setVulns(vulns.map(v => v.id === id ? res.data : v));
      setErrors({ ...errors, [id]: null });
    } catch (err) {
      alert('Patch operation failed');
    }
  };

  const handleScan = async (id) => {
    try {
      const res = await API.post(`/api/v1/vulnerabilities/${id}/scan`);
      setVulns(vulns.map(v => v.id === id ? res.data : v));
      alert('Scan completed successfully!');
    } catch (err) {
      alert('Scan trigger failed');
    }
  };

  if (loading) return <CustomLoader message="Loading Vulnerability Scanner & Patch Tracker..." />;

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: '20px', color: '#fff' }}>Vulnerability Assessment & Patch Engine</h2>

      {/* Create CVE Form */}
      <div className="form-panel">
        <h4 style={{ color: 'var(--sentinelcore-text-muted)', marginBottom: '15px' }}>Register CVE Record</h4>
        <form onSubmit={handleCreateVuln}>
          <div className="form-grid">
            <div className="form-field">
              <label>CVE ID</label>
              <input 
                className={`form-input ${formErrors.cveId ? 'is-invalid' : ''}`}
                value={formData.cveId}
                onChange={(e) => setFormData({ ...formData, cveId: e.target.value })}
                placeholder="CVE-2026-1234"
              />
              {formErrors.cveId && <span className="field-error-msg">{formErrors.cveId}</span>}
            </div>

            <div className="form-field">
              <label>Vulnerability Title</label>
              <input 
                className={`form-input ${formErrors.title ? 'is-invalid' : ''}`}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Remote Code Execution in Webserver"
              />
              {formErrors.title && <span className="field-error-msg">{formErrors.title}</span>}
            </div>

            <div className="form-field">
              <label>CVSS Score (0.0 - 10.0)</label>
              <input 
                type="number"
                step="0.1"
                className={`form-input ${formErrors.cvssScore ? 'is-invalid' : ''}`}
                value={formData.cvssScore}
                onChange={(e) => setFormData({ ...formData, cvssScore: parseFloat(e.target.value) })}
              />
              {formErrors.cvssScore && <span className="field-error-msg">{formErrors.cvssScore}</span>}
            </div>

            <div className="form-field">
              <label>Severity</label>
              <select 
                className="form-input"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>
            Register Vulnerability
          </button>
        </form>
      </div>

      {/* Vulnerabilities Table */}
      <div className="table-panel">
        <h4 style={{ padding: '16px', color: 'var(--sentinelcore-text-muted)', margin: 0 }}>Tracked Vulnerabilities & Patch Action</h4>
        <table className="custom-table">
          <thead>
            <tr>
              <th>CVE ID</th>
              <th>Title</th>
              <th>Severity</th>
              <th>CVSS</th>
              <th>Patch Status</th>
              <th>Affected</th>
              <th>Patched</th>
              <th>Patch Servers Action</th>
              <th>Scan</th>
            </tr>
          </thead>
          <tbody>
            {vulns.map((v) => (
              <tr key={v.id}>
                <td style={{ fontWeight: 600 }}>{v.cveId}</td>
                <td>{v.title}</td>
                <td><StatusBadge status={v.severity} /></td>
                <td>{v.cvssScore}</td>
                <td><StatusBadge status={v.patchStatus} /></td>
                <td>{v.affectedServersCount}</td>
                <td>{v.patchedServersCount}</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <input 
                      type="number" 
                      className={`form-input ${errors[v.id] ? 'is-invalid' : ''}`}
                      style={{ width: '60px', padding: '4px' }}
                      placeholder="Qty"
                      onChange={(e) => setPatchInputs({ ...patchInputs, [v.id]: e.target.value })}
                    />
                    <button className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleApplyPatch(v.id)}>
                      Apply Patch
                    </button>
                  </div>
                  {errors[v.id] && <span className="field-error-msg">{errors[v.id]}</span>}
                </td>
                <td>
                  <button className="btn-action" onClick={() => handleScan(v.id)}>
                    Rescan
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};