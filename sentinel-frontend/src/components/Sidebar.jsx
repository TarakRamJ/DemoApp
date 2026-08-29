import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Server, ShieldAlert, Bug, Activity, Bell } from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/alerts" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bell size={18} /> Active Alerts
          </NavLink>
        </li>
        <li>
          <NavLink to="/assets" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Server size={18} /> Asset Inventory
          </NavLink>
        </li>
        {/* <li>
          <NavLink to="/incidents" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <ShieldAlert size={18} /> Incidents
          </NavLink>
        </li> 
        <li>
          <NavLink to="/vulnerabilities" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bug size={18} /> Vulnerabilities
          </NavLink>
        </li>*/}
        <li>
          <NavLink to="/metrics" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Activity size={18} /> System Metrics
          </NavLink>
        </li>
      </ul>
    </div>
  );
};