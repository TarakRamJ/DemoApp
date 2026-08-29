import React, { useState, useEffect, useContext, useRef } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { CustomLoader } from "../components/CustomLoader";
import { StatusBadge } from "../components/StatusBadge";
import { Lock, Eye, Edit, Trash2, X, Check, AlertTriangle } from "lucide-react";

export const AssetsPage = () => {
  const { user } = useContext(AuthContext);
  const [assets, setAssets] = useState([]);
  const [searchPrefix, setSearchPrefix] = useState("");
  const searchPrefixRef = useRef(""); // Keeps track of search without breaking interval

  const [formData, setFormData] = useState({
    name: "",
    ip: "",
    type: "SERVER",
    status: "HEALTHY",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Modal States for View, Edit, & Custom Delete
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editFormData, setEditFormData] = useState({
    name: "",
    ip: "",
    type: "SERVER",
    status: "HEALTHY",
  });
  const [editErrors, setEditErrors] = useState({});

  // Fetch function handling both initial load and background polling
  const fetchAssets = async (isPolling = false) => {
    if (!isPolling) setLoading(true);

    try {
      const currentPrefix = searchPrefixRef.current;
      // Add a timestamp to the URL so the browser NEVER caches the response
      const cacheBuster = `_t=${new Date().getTime()}`;

      const endpoint = currentPrefix.trim()
        ? `/api/v1/assets/find?prefix=${currentPrefix}&${cacheBuster}`
        : `/api/v1/assets?${cacheBuster}`;

      const res = await API.get(endpoint);
      setAssets(res.data);
    } catch (err) {
      console.error("Assets fetch error:", err);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  // Setup the 1-second interval
  useEffect(() => {
    fetchAssets(false); // Initial load with spinner

    const intervalId = setInterval(() => {
      fetchAssets(true); // Background poll without spinner
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const validateForm = (data) => {
    const errs = {};
    if (!data.name.trim()) errs.name = "Asset Name required";
    if (!data.ip.trim()) {
      errs.ip = "IP Address required";
    } else if (!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(data.ip)) {
      errs.ip = "Invalid IPv4 address";
    }
    return errs;
  };

  // CREATE Asset
  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = validateForm(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const payload = {
      ...formData,
      name: formData.name.trim().toLowerCase(),
      ip: formData.ip.trim().toLowerCase(),
    };

    try {
      const res = await API.post("/api/v1/assets", payload);
      setAssets([...assets, res.data]);
      setFormData({ name: "", ip: "", type: "SERVER", status: "HEALTHY" });
      setErrors({});
    } catch (err) {
      alert("Asset registration failed.");
    }
  };

  // READ Single Asset Details
  const handleViewAsset = (asset) => {
    setSelectedAsset(asset);
    setIsViewModalOpen(true);
  };

  // OPEN Edit Modal
  const handleOpenEditModal = (asset) => {
    if (user?.role !== "ADMIN") {
      alert("Access Denied: Only ADMIN users can edit assets.");
      return;
    }
    setSelectedAsset(asset);
    setEditFormData({
      name: asset.name,
      ip: asset.ip,
      type: asset.type,
      status: asset.status,
    });
    setEditErrors({});
    setIsEditModalOpen(true);
  };

  // UPDATE Asset
  const handleUpdateAsset = async (e) => {
    e.preventDefault();
    const errs = validateForm(editFormData);
    if (Object.keys(errs).length > 0) {
      setEditErrors(errs);
      return;
    }

    try {
      const res = await API.put(
        `/api/v1/assets/${selectedAsset.assetId}`,
        editFormData
      );
      setAssets(
        assets.map((a) => (a.assetId === selectedAsset.assetId ? res.data : a))
      );
      setIsEditModalOpen(false);
      setSelectedAsset(null);
    } catch (err) {
      alert("Failed to update asset.");
    }
  };

  // PROMPT Custom Glass Modal for Deleting Asset
  const handlePromptDelete = (asset) => {
    if (user?.role !== "ADMIN") {
      alert("Access Denied: Only ADMIN users can delete assets.");
      return;
    }
    setSelectedAsset(asset);
    setIsDeleteModalOpen(true);
  };

  // CONFIRM Delete Operation
  const handleConfirmDelete = async () => {
    if (!selectedAsset) return;

    try {
      await API.delete(`/api/v1/assets/${selectedAsset.assetId}`);
      setAssets(assets.filter((a) => a.assetId !== selectedAsset.assetId));
      setIsDeleteModalOpen(false);
      setSelectedAsset(null);
    } catch (err) {
      alert("Failed to delete asset.");
    }
  };

  // Modified Search handler to sync state and ref
  const handleSearch = (e) => {
    const prefix = e.target.value;
    setSearchPrefix(prefix);
    searchPrefixRef.current = prefix; // Sync the ref so the interval sees it

    // Immediately fetch when they type, bypassing the 1-second wait
    fetchAssets(true);
  };

  if (loading)
    return <CustomLoader message="Loading Infrastructure Asset Catalog..." />;

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: "20px", color: "#fff" }}>
        Infrastructure Assets
      </h2>

      {/* ADMIN-ONLY REGISTRATION FORM */}
      {user?.role === "ADMIN" ? (
        <div className="form-panel">
          <h4
            style={{
              color: "var(--sentinelcore-text-muted)",
              marginBottom: "15px",
            }}
          >
            Register Asset (Admin Authorization)
          </h4>
          <form onSubmit={handleRegister}>
            <div className="form-grid">
              <div className="form-field">
                <label>Asset Name</label>
                <input
                  className={`form-input ${errors.name ? "is-invalid" : ""}`}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. DB-SRV-12"
                />
                {errors.name && (
                  <span className="field-error-msg">{errors.name}</span>
                )}
              </div>

              <div className="form-field">
                <label>IP Address</label>
                <input
                  className={`form-input ${errors.ip ? "is-invalid" : ""}`}
                  value={formData.ip}
                  onChange={(e) =>
                    setFormData({ ...formData, ip: e.target.value })
                  }
                  placeholder="10.0.0.14"
                />
                {errors.ip && (
                  <span className="field-error-msg">{errors.ip}</span>
                )}
              </div>

              <div className="form-field">
                <label>Asset Type</label>
                <select
                  className="form-input"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="SERVER">SERVER</option>
                  <option value="CLOUD_AWS">CLOUD_AWS</option>
                  <option value="CLOUD_AZURE">CLOUD_AZURE</option>
                  <option value="K8S_POD">K8S_POD</option>
                </select>
              </div>

              <div className="form-field">
                <label>Status</label>
                <select
                  className="form-input"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="HEALTHY">HEALTHY</option>
                  <option value="WARNING">WARNING</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-glass btn-green"
              style={{ marginTop: "16px" }}
            >
              Register Asset
            </button>
          </form>
        </div>
      ) : (
        <div
          className="form-panel"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#8c9ba5",
          }}
        >
          <Lock size={16} /> Asset registration restricted to ADMIN users only.
        </div>
      )}

      {/* Asset Table */}
      <div className="table-panel">
        <div
          style={{
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4 style={{ color: "var(--sentinelcore-text-muted)", margin: 0 }}>
            Monitored Assets ({assets.length})
          </h4>
          <input
            className="form-input"
            style={{ width: "220px" }}
            placeholder="Filter by IP prefix..."
            value={searchPrefix}
            onChange={handleSearch}
          />
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Name</th>
              <th>IP Address</th>
              <th>Type</th>
              <th>Health Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.assetId}>
                <td style={{ fontFamily: "monospace" }}>{asset.assetId}</td>
                <td>{asset.name}</td>
                <td>{asset.ip}</td>
                <td>{asset.type}</td>
                <td>
                  <StatusBadge status={asset.status} />
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {/* READ ACTION */}
                    <button
                      className="btn-glass btn-blue"
                      style={{
                        padding: "4px 10px",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                      onClick={() => handleViewAsset(asset)}
                      title="View Details"
                    >
                      <Eye size={14} /> View
                    </button>

                    {/* UPDATE ACTION (ADMIN) */}
                    {user?.role === "ADMIN" && (
                      <button
                        className="btn-glass btn-orange"
                        style={{
                          padding: "4px 10px",
                          fontSize: "0.8rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                        onClick={() => handleOpenEditModal(asset)}
                        title="Edit Asset"
                      >
                        <Edit size={14} /> Edit
                      </button>
                    )}

                    {/* DELETE ACTION (ADMIN) */}
                    {user?.role === "ADMIN" && (
                      <button
                        className="btn-glass btn-red"
                        style={{
                          padding: "4px 10px",
                          fontSize: "0.8rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                        onClick={() => handlePromptDelete(asset)}
                        title="Delete Asset"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW SINGLE ASSET MODAL */}
      {isViewModalOpen && selectedAsset && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="form-panel"
            style={{ width: "480px", marginBottom: 0 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: 0, color: "#fff" }}>Asset Overview</h3>
              <X
                size={20}
                color="#a0aec0"
                style={{ cursor: "pointer" }}
                onClick={() => setIsViewModalOpen(false)}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                fontSize: "0.95rem",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "#8c9ba5",
                    display: "block",
                  }}
                >
                  ASSET ID
                </span>
                <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                  {selectedAsset.assetId}
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "#8c9ba5",
                    display: "block",
                  }}
                >
                  ASSET NAME
                </span>
                <span style={{ fontWeight: 600, color: "#fff" }}>
                  {selectedAsset.name}
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "#8c9ba5",
                    display: "block",
                  }}
                >
                  IP ADDRESS
                </span>
                <span style={{ fontFamily: "monospace" }}>
                  {selectedAsset.ip}
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "#8c9ba5",
                    display: "block",
                  }}
                >
                  INFRASTRUCTURE TYPE
                </span>
                <span>{selectedAsset.type}</span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "#8c9ba5",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  HEALTH STATUS
                </span>
                <StatusBadge status={selectedAsset.status} />
              </div>
            </div>

            <button
              className="btn-glass btn-blue"
              style={{ marginTop: "24px", width: "100%" }}
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* EDIT ASSET MODAL */}
      {isEditModalOpen && selectedAsset && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="form-panel"
            style={{ width: "480px", marginBottom: 0 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: 0, color: "#fff" }}>Edit Asset Details</h3>
              <X
                size={20}
                color="#a0aec0"
                style={{ cursor: "pointer" }}
                onClick={() => setIsEditModalOpen(false)}
              />
            </div>

            <form onSubmit={handleUpdateAsset}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div className="form-field">
                  <label>Asset Name</label>
                  <input
                    className={`form-input ${editErrors.name ? "is-invalid" : ""}`}
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                  />
                  {editErrors.name && (
                    <span className="field-error-msg">{editErrors.name}</span>
                  )}
                </div>

                <div className="form-field">
                  <label>IP Address</label>
                  <input
                    className={`form-input ${editErrors.ip ? "is-invalid" : ""}`}
                    value={editFormData.ip}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, ip: e.target.value })
                    }
                  />
                  {editErrors.ip && (
                    <span className="field-error-msg">{editErrors.ip}</span>
                  )}
                </div>

                <div className="form-field">
                  <label>Asset Type</label>
                  <select
                    className="form-input"
                    value={editFormData.type}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, type: e.target.value })
                    }
                  >
                    <option value="SERVER">SERVER</option>
                    <option value="CLOUD_AWS">CLOUD_AWS</option>
                    <option value="CLOUD_AZURE">CLOUD_AZURE</option>
                    <option value="K8S_POD">K8S_POD</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Status</label>
                  <select
                    className="form-input"
                    value={editFormData.status}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="HEALTHY">HEALTHY</option>
                    <option value="WARNING">WARNING</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button
                  type="submit"
                  className="btn-glass btn-green"
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Check size={16} /> Save Changes
                </button>
                <button
                  type="button"
                  className="btn-glass"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sentinelcore-border)",
                  }}
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM ASSET DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedAsset && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            className="form-panel"
            style={{
              width: "440px",
              textAlign: "center",
              padding: "30px",
              marginBottom: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  background: "rgba(245, 34, 45, 0.15)",
                  padding: "14px",
                  borderRadius: "50%",
                  border: "1px solid rgba(245, 34, 45, 0.3)",
                }}
              >
                <AlertTriangle size={32} color="#f5222d" />
              </div>
            </div>

            <h3 style={{ color: "#fff", marginBottom: "10px" }}>
              Delete Infrastructure Asset?
            </h3>
            <p
              style={{
                color: "#a0aec0",
                fontSize: "0.9rem",
                marginBottom: "20px",
                lineHeight: 1.5,
              }}
            >
              Are you sure you want to permanently delete asset{" "}
              <strong style={{ color: "#fff" }}>"{selectedAsset.name}"</strong> (
              {selectedAsset.ip})? This operation cannot be undone.
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                className="btn-glass btn-red"
                style={{ flex: 1 }}
                onClick={handleConfirmDelete}
              >
                Delete Asset
              </button>
              <button
                className="btn-glass"
                style={{
                  flex: 1,
                  background: "transparent",
                  borderColor: "var(--sentinelcore-border)",
                }}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};