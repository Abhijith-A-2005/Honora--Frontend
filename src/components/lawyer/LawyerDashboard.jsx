// pages/lawyer/LawyerDashboard.jsx
import "../../styles/lawyer.css";
import { useAuth } from "../common/useAuth";
import { LAWYER_CASES }    from "../../data/mockCases";
import { LAWYER_PROFILES } from "../../data/mockUsers";
import { filterLawyerCases } from "../../utils/filters";
import LawyerCaseCard from "./LawyerCaseCard";
import { useState } from "react";

export default function LawyerDashboard({ onViewCase, onLogout }) {
  const { user } = useAuth();
  const profile  = LAWYER_PROFILES[user?.username];
  const [searchQuery, setSearchQuery] = useState('');
  const myCases  = filterLawyerCases(LAWYER_CASES, profile);
  const filteredCases = myCases.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.assignedCourt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard view">
      <div className="dash-topbar">
        <div>
          <p className="dash-eyebrow">Lawyer Portal — EviChain</p>
          <h1 className="dash-title">Case Overview</h1>
          <p className="dash-subtitle">
            {profile ? `${profile.firm} · ${profile.name}` : "Your active legal portfolio"}
          </p>
        </div>
        <button className="btn-logout" onClick={onLogout}>← Logout</button>
      </div>

      <div className="gold-divider" />

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

      <div className="cases-list">
        {filteredCases.length === 0 ? (
          <p style={{ color:"var(--text-muted)", fontStyle:"italic", fontSize:"13px" }}>
            {searchQuery ? 'No cases match your search.' : 'No cases currently assigned to you.'}
          </p>
        ) : (
          filteredCases.map((c, i) => (
            <LawyerCaseCard key={c.id} c={c} onView={onViewCase} delay={i * 0.1} />
          ))
        )}
      </div>
    </div>
  );
}
