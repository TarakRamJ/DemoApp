import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Server,
  Activity,
  AlertTriangle,
  Bug,
  Database,
  FileCheck,
  CheckCircle,
  BarChart3,
  ChevronRight,
  Layers,
  Radio,
  Terminal,
  Cpu,
  Globe
} from 'lucide-react';

export const LandingPage = ({ onOpenAuth }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [hoveredNav, setHoveredNav] = useState(null);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <Activity size={18} /> },
    { id: 'capabilities', label: 'Capabilities', icon: <Shield size={18} /> },
    { id: 'workflow', label: 'Workflow', icon: <Layers size={18} /> },
    { id: 'events', label: 'Live Events', icon: <Terminal size={18} /> },
    { id: 'stack', label: 'Architecture', icon: <Cpu size={18} /> },
    { id: 'why-sentinel', label: 'Why Sentinel', icon: <CheckCircle size={18} /> },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: '#080a0f', minHeight: '100vh', color: '#e6edf3', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', width: '100%' }}>
      
      {/* Fixed Top Header Bar */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        zIndex: 100,
        background: 'rgba(8, 10, 15, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1f2430',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4rem', fontWeight: 800, color: '#52c41a' }}>
          <Shield size={28} />
          <span style={{ color: '#fff', letterSpacing: '-0.3px' }}>Sentinel<span style={{ color: '#52c41a' }}>Core</span></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#a3b3c2', background: '#10141d', padding: '6px 14px', borderRadius: '20px', border: '1px solid #1f2430', marginLeft: '12px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#52c41a', boxShadow: '0 0 8px #52c41a' }}></span>
            <span style={{ fontWeight: 500 }}>All Systems Operational</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button 
            style={{ 
              background: '#52c41a', 
              color: '#080a0f', 
              border: 'none', 
              padding: '9px 22px', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'transform 0.15s ease'
            }} 
            onClick={() => onOpenAuth && onOpenAuth(true)}
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div style={{ display: 'flex', paddingTop: '70px', minHeight: 'calc(100vh - 70px)' }}>
        
        {/* Left Side Navigation (Sticky Side Bar) */}
        <aside style={{
          width: '250px',
          position: 'sticky',
          top: '70px',
          height: 'calc(100vh - 70px)',
          background: '#0a0d14',
          borderRight: '1px solid #1a1f2c',
          padding: '24px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#525e6e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px', paddingLeft: '12px' }}>
              Navigation
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                const isHovered = hoveredNav === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    onMouseEnter={() => setHoveredNav(item.id)}
                    onMouseLeave={() => setHoveredNav(null)}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      background: isActive 
                        ? 'rgba(82, 196, 26, 0.08)' 
                        : isHovered 
                        ? 'rgba(255, 255, 255, 0.03)' 
                        : 'transparent',
                      color: isActive ? '#52c41a' : isHovered ? '#ffffff' : '#8b949e',
                      border: 'none',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Subtle active highlight bar */}
                    {isActive && (
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: '20%',
                        bottom: '20%',
                        width: '3px',
                        backgroundColor: '#52c41a',
                        borderRadius: '0 2px 2px 0'
                      }} />
                    )}
                    <span style={{ color: isActive ? '#52c41a' : '#6e7681', display: 'flex', alignItems: 'center' }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div style={{ background: '#10141d', border: '1px solid #1a1f2c', padding: '14px 16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#6e7681', marginBottom: '4px' }}>Active Workspace</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#e6edf3' }}>us-east-1 (Prod)</div>
            <div style={{ fontSize: '0.8rem', color: '#52c41a', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={12} /> Streaming Telemetry
            </div>
          </div>
        </aside>

        {/* Right Content Column */}
        <main style={{ flex: 1, padding: '40px 50px', maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* OVERVIEW */}
          <section id="overview" style={{ scrollMarginTop: '90px', marginBottom: '90px' }}>
            <div style={{ marginBottom: '44px' }}>
              <span style={{ background: 'rgba(82, 196, 26, 0.1)', color: '#52c41a', border: '1px solid rgba(82, 196, 26, 0.25)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600 }}>
                Enterprise SecOps Command Center
              </span>
              <h1 style={{ fontSize: '3.2rem', fontWeight: 800, marginTop: '20px', marginBottom: '20px', lineHeight: 1.15, letterSpacing: '-0.5px' }}>
                Unified Infrastructure Telemetry &amp; Threat Detection
              </h1>
              <p style={{ fontSize: '1.25rem', color: '#9daab6', maxWidth: '800px', lineHeight: 1.6 }}>
                Real-time incident response, automated vulnerability assessment, and zero-trust asset monitoring engineered for security operations teams.
              </p>
            </div>

            {/* Metric Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {[
                { icon: <Server size={24} color="#52c41a" />, val: "2,847", label: "Assets Monitored", sub: "AWS, Azure, K8s & On-Prem" },
                { icon: <Activity size={24} color="#fa8c16" />, val: "23", label: "Active Incidents", sub: "Auto-isolated in sandbox" },
                { icon: <AlertTriangle size={24} color="#f5222d" />, val: "12", label: "Critical CVE Alerts", sub: "Zero-day heuristics active" },
                { icon: <Lock size={24} color="#1890ff" />, val: "100%", label: "PCI DSS Compliance", sub: "Continuous audit checks" },
                { icon: <Database size={24} color="#722ed1" />, val: "24.7M", label: "Audit Logs", sub: "Cryptographically verified" },
                { icon: <BarChart3 size={24} color="#13c2c2" />, val: "47 min", label: "Average MTTR", sub: "35% faster resolution" },
              ].map((card, i) => (
                <div key={i} style={{ background: '#0c0f17', border: '1px solid #1f2430', padding: '24px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontSize: '0.95rem', color: '#9daab6', fontWeight: 500 }}>{card.label}</span>
                    {card.icon}
                  </div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{card.val}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6e7681', marginTop: '8px' }}>{card.sub}</div>
                </div>
              ))}
            </div>
          </section>

          {/* CAPABILITIES */}
          <section id="capabilities" style={{ scrollMarginTop: '90px', marginBottom: '90px' }}>
            <SectionTitle title="Platform Capabilities" subtitle="Unified modules for end-to-end cloud and on-premise security monitoring." />
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
              {[
                { icon: <Server color="#52c41a" size={28} />, title: "Infrastructure Monitoring", desc: "Deep telemetry into physical servers, cloud instances, microservices, and Kubernetes clusters." },
                { icon: <Shield color="#1890ff" size={28} />, title: "Incident Response", desc: "Automated alert triage, immediate threat quarantine, and customized response playbooks." },
                { icon: <Bug color="#f5222d" size={28} />, title: "Vulnerability Scanning", desc: "Continuous CVE scanning with zero-day vulnerability heuristics and risk scoring." },
                { icon: <FileCheck color="#722ed1" size={28} />, title: "Immutable Audit Trails", desc: "Tamper-evident event logs designed for strict regulatory compliance standards." },
                { icon: <CheckCircle color="#13c2c2" size={28} />, title: "Compliance Automation", desc: "Real-time compliance validation for PCI DSS 4.0, SOC 2 Type II, and ISO 27001." },
                { icon: <Globe color="#fa8c16" size={28} />, title: "DevSecOps Workflows", desc: "Shift-left pipeline integrations with policy gates for CI/CD environments." }
              ].map((cap, idx) => (
                <div key={idx} style={{ background: '#0c0f17', border: '1px solid #1f2430', padding: '28px', borderRadius: '10px' }}>
                  <div style={{ marginBottom: '18px' }}>{cap.icon}</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>{cap.title}</h3>
                  <p style={{ fontSize: '0.98rem', color: '#9daab6', lineHeight: 1.6 }}>{cap.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* WORKFLOW (FIXED LAYOUT) */}
          <section id="workflow" style={{ scrollMarginTop: '90px', marginBottom: '90px' }}>
            <SectionTitle title="Security Operations Workflow" subtitle="Structured data flow from infrastructure telemetry down to executive reporting." />
            
            <div style={{ background: '#0c0f17', border: '1px solid #1f2430', padding: '32px', borderRadius: '10px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                gap: '16px' 
              }}>
                {[
                  { step: "01", title: "Infrastructure", desc: "Collect data from cloud & on-prem" },
                  { step: "02", title: "Telemetry Ingestion", desc: "Stream logs via Kafka pipelines" },
                  { step: "03", title: "Threat Detection", desc: "AI heuristics and rule engines" },
                  { step: "04", title: "Vulnerability Assessment", desc: "Continuous CVE scanning" },
                  { step: "05", title: "Audit Logging", desc: "Immutable cryptographically signed" },
                  { step: "06", title: "Compliance Output", desc: "Automated executive reports" }
                ].map((item, idx, arr) => (
                  <div 
                    key={idx} 
                    style={{ 
                      background: '#10141d', 
                      border: '1px solid #1f2430', 
                      padding: '20px', 
                      borderRadius: '8px', 
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#52c41a', fontWeight: 700, marginBottom: '8px' }}>
                        STEP {item.step}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff', marginBottom: '6px' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#8b949e', lineHeight: 1.4 }}>
                        {item.desc}
                      </div>
                    </div>
                    {idx < arr.length - 1 && (
                      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                        <ChevronRight color="#52c41a" size={18} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* LIVE EVENTS */}
          <section id="events" style={{ scrollMarginTop: '90px', marginBottom: '90px' }}>
            <SectionTitle title="Live Telemetry Stream" subtitle="Sample real-time event logs processed by SentinelCore's Kafka pipeline." />
            
            <div style={{ background: '#0c0f17', border: '1px solid #1f2430', borderRadius: '10px', overflow: 'hidden' }}>
              {[
                { time: "09:45:12", title: "Critical CPU spike detected on primary database node", tag: "DB-SRV-12", status: "Critical" },
                { time: "09:32:04", title: "Suspicious SSH login attempt blocked", tag: "Unauthorized Access", status: "Blocked" },
                { time: "09:18:55", title: "Automated scan finished — CVE-2024-1234 identified", tag: "Vulnerability Scan", status: "Scanned" },
                { time: "08:57:10", title: "PCI DSS automated compliance report generated", tag: "Compliance Engine", status: "Passed" },
                { time: "08:42:33", title: "Auto-scaling event triggered in Kubernetes cluster", tag: "AWS EKS", status: "Scaled" }
              ].map((evt, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: idx === 4 ? 'none' : '1px solid #1f2430' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ fontSize: '0.9rem', color: '#6e7681', fontFamily: 'monospace' }}>{evt.time}</span>
                    <span style={{ fontWeight: 500, fontSize: '1rem' }}>{evt.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#9daab6', background: '#10141d', padding: '6px 12px', borderRadius: '6px', border: '1px solid #1f2430' }}>{evt.tag}</span>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 700, 
                      color: evt.status === 'Critical' ? '#f5222d' : evt.status === 'Blocked' ? '#fa8c16' : '#52c41a' 
                    }}>
                      {evt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* STACK */}
          <section id="stack" style={{ scrollMarginTop: '90px', marginBottom: '90px' }}>
            <SectionTitle title="Architecture &amp; Supported Environments" subtitle="Built with high-throughput enterprise technologies." />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
              <div style={{ background: '#0c0f17', border: '1px solid #1f2430', padding: '28px', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>Event-Driven Technology Stack</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {["React 20 Frontend", "Spring Boot Microservices", "Apache Kafka Message Bus", "PostgreSQL Storage", "Redis In-Memory Cache", "AWS & Azure Deployment"].map((item, i) => (
                    <div key={i} style={{ background: '#10141d', border: '1px solid #1f2430', padding: '12px 18px', borderRadius: '8px', fontSize: '0.95rem', color: '#e6edf3', fontWeight: 500 }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#0c0f17', border: '1px solid #1f2430', padding: '28px', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>Supported Infrastructure</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
                  {["AWS EC2", "AWS EKS", "Azure AKS", "Docker", "Kubernetes", "PostgreSQL", "Redis", "Kafka"].map((tech, i) => (
                    <span key={i} style={{ background: '#10141d', border: '1px solid #1f2430', padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', color: '#9daab6' }}>
                      {tech}
                    </span>
                  ))}
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '18px' }}>Compliance Standards</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {["PCI DSS", "SOC 2 Type II", "ISO 27001", "RBAC Enforcement", "Immutable Logs", "TLS Encryption"].map((badge, i) => (
                    <div key={i} style={{ fontSize: '0.95rem', color: '#52c41a', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                      <CheckCircle size={16} /> {badge}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* WHY SENTINEL */}
          <section id="why-sentinel" style={{ scrollMarginTop: '90px', marginBottom: '90px' }}>
            <SectionTitle title="Why SentinelCore?" subtitle="Designed to consolidate fragmented security tools into one pane of glass." />
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {[
                "Real-Time Event Processing",
                "Enterprise Grade Security",
                "Cloud Native Architecture",
                "Kafka Event-Driven",
                "Zero Trust Enforcement",
                "Automated Auditing & Reporting"
              ].map((reason, idx) => (
                <div key={idx} style={{ background: '#0c0f17', border: '1px solid #1f2430', padding: '24px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <CheckCircle size={22} color="#52c41a" />
                  <span style={{ fontWeight: 600, fontSize: '1rem' }}>{reason}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Banner */}
          <div style={{ background: 'linear-gradient(180deg, #0c0f17 0%, #10141d 100%)', border: '1px solid #1f2430', borderRadius: '14px', padding: '56px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px' }}>Ready to Protect Your Infrastructure?</h2>
            <p style={{ color: '#9daab6', fontSize: '1.1rem', marginBottom: '28px', maxWidth: '580px', margin: '0 auto 28px' }}>
              Unify server health, security incident response, and compliance checks under a single operational command center.
            </p>
            <button 
              style={{ 
                background: '#52c41a', 
                color: '#080a0f', 
                border: 'none', 
                padding: '14px 38px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: 700,
                fontSize: '1.05rem'
              }}
              onClick={() => onOpenAuth && onOpenAuth(true)}
            >
              Launch Dashboard
            </button>
          </div>

          <footer style={{ borderTop: '1px solid #1f2430', marginTop: '70px', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', color: '#6e7681', fontSize: '0.9rem' }}>
            <div>SentinelCore SecureOps Platform</div>
            <div>© 2026 SentinelCore. All rights reserved.</div>
          </footer>

        </main>
      </div>

    </div>
  );
};

const SectionTitle = ({ title, subtitle }) => (
  <div style={{ marginBottom: '28px' }}>
    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.3px' }}>{title}</h2>
    <p style={{ color: '#9daab6', fontSize: '1.05rem' }}>{subtitle}</p>
  </div>
);