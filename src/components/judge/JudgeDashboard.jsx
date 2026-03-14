// pages/judge/JudgeDashboard.jsx
import "../../styles/judge.css";
import { useAuth } from "../common/useAuth";
import { JUDGE_CASES }    from "../../data/mockCases";
import { JUDGE_PROFILES } from "../../data/mockUsers";
import { filterJudgeCases } from "../../utils/filters";
import JudgeCaseCard from "./JudgeCaseCard";
import { useState } from "react";

export default function JudgeDashboard({ onViewCase, onLogout }) {
  const { user } = useAuth();
  const profile  = JUDGE_PROFILES[user?.username];
  const [searchQuery, setSearchQuery] = useState('');
  const myCases  = filterJudgeCases(JUDGE_CASES, profile);
  const filteredCases = myCases.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.court.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="judge-dashboard">
      <div className="judge-topbar">
        <div>
          <p className="judge-eyebrow">Judiciary Portal — EviChain</p>
          <h1 className="judge-title">Court Case Management</h1>
          <p className="judge-subtitle">
            {profile ? `${profile.court} · ${profile.name}` : "Active docket"}
          </p>
        </div>
        <button className="judge-logout-btn" onClick={onLogout}>← Logout</button>
      </div>

      <div className="judge-divider" />

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

      <div className="judge-cases-list">
        {filteredCases.length === 0 ? (
          <p style={{ color:"rgba(240,234,216,0.3)", fontStyle:"italic", fontSize:"13px", fontFamily:"'Josefin Sans', sans-serif" }}>
            {searchQuery ? 'No cases match your search.' : 'No active cases assigned to you.'}
          </p>
        ) : (
          filteredCases.map((c, i) => (
            <JudgeCaseCard key={c.id} c={c} onView={onViewCase} delay={i * 0.08} />
          ))
        )}
      </div>
    </div>
  );
}
