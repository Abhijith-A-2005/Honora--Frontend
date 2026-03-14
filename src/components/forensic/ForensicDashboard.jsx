// components/forensic/ForensicDashboard.jsx
import "../../styles/forensic.css";
import { useAuth } from "../common/useAuth";
import { FORENSIC_CASES } from "../../data/mockCases";
import { FORENSIC_PROFILES } from "../../data/mockUsers";
import ForensicCaseCard from "./ForensicCaseCard";
import { useState } from "react";

export default function ForensicDashboard({ onViewCase, onLogout }) {
  const { user } = useAuth();
  const profile = FORENSIC_PROFILES[user?.username];
  const [searchQuery, setSearchQuery] = useState('');

  // Filter cases assigned to this forensic analyst
  const myCases = FORENSIC_CASES.filter((c) => c.assignedForensicId === profile?.id);
  const filteredCases = myCases.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inProgressCount = myCases.filter((c) => c.status === "In Progress").length;
  const pendingCount = myCases.filter((c) => c.status === "Pending").length;
  const completedCount = FORENSIC_CASES.filter((c) => c.status === "Completed").length;

  return (
    <main className="dashboard-page">
      <div className="dashboard-header" style={{ position: "relative" }}>
        <p className="dashboard-dept">🔬 Forensic Department · Evidence Analysis Unit</p>
        <h1 className="dashboard-title">Case Analysis Workbench</h1>
        <p className="dashboard-meta">
          Welcome back, <span style={{ color: "var(--gold)" }}>{user.username}</span>
          &nbsp;·&nbsp; {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        <button
          className="btn-logout"
          onClick={onLogout}
          style={{ position: "absolute", top: 16, right: 16 }}
        >
          ← Logout
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-chip">
          <span className="stat-value">{myCases.length}</span>
          <span className="stat-label">Assigned Cases</span>
        </div>
        <div className="stat-chip">
          <span className="stat-value" style={{ color: "#ffb74d" }}>{inProgressCount}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-chip">
          <span className="stat-value" style={{ color: "#f0d060" }}>{pendingCount}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-chip">
          <span className="stat-value" style={{ color: "var(--success)" }}>{completedCount}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      <div style={{ marginBottom: 28 }} />

      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.3em", color: "var(--gold)", fontWeight: 600, marginBottom: 10, textTransform: "uppercase" }}>
          FORENSIC CASE ASSIGNMENTS
        </p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem,3vw,2rem)", color: "var(--text)", fontWeight: 700 }}>
          Analysis Workbench
        </h2>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search cases..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            color: 'var(--text)',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-body)',
            outline: 'none',
            transition: 'all 0.3s var(--ease)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--gold-dim)';
            e.target.style.backgroundColor = 'rgba(212,175,55,0.04)';
            e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border)';
            e.target.style.backgroundColor = 'rgba(255,255,255,0.03)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      <div className="cases-grid">
        {filteredCases.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "13px" }}>
            {searchQuery ? 'No cases match your search.' : 'No cases currently assigned to you.'}
          </p>
        ) : (
          filteredCases.map((c, i) => (
            <ForensicCaseCard key={c.id} caseData={c} delay={i * 0.07} />
          ))
        )}
      </div>
    </main>
  );
}
