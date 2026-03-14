import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../common/useAuth";
import { MOCK_CASES } from "../../data/mockCases";
import { GoldenDivider } from "../common/Shared";
import CaseCard from "./CaseCard";
import NewCaseModal from "./NewCaseModal";
import { PlusIcon } from "../../assets/icons/Icons";


export default function PoliceDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNewCase, setShowNewCase] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) navigate("/role");
  }, [user, navigate]);

  if (!user) return null;

  const openCount        = MOCK_CASES.filter((c) => c.status === "Open").length;
  const investigateCount = MOCK_CASES.filter((c) => c.status === "Under Investigation").length;
  const closedCount      = MOCK_CASES.filter((c) => c.status === "Closed").length;

  const filteredCases = MOCK_CASES.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.officer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="dashboard-page">
      <div className="dashboard-header" style={{ position: "relative" }}>
        <p className="dashboard-dept">⊙ Police Department · Evidence Management Unit</p>
        <h1 className="dashboard-title">Case Repository</h1>
        <p className="dashboard-meta">
          Welcome back, <span style={{ color: "var(--gold)" }}>{user.username}</span>
          &nbsp;·&nbsp; {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        <button
          className="btn-gold add-case-btn"
          onClick={() => setShowNewCase(true)}
          style={{ position: "absolute", top: 16, right: 16 }}
        >
          <span className="btn-icon"><PlusIcon /></span> New Case
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-chip">
          <span className="stat-value">{MOCK_CASES.length}</span>
          <span className="stat-label">Total Cases</span>
        </div>
        <div className="stat-chip">
          <span className="stat-value" style={{ color: "#f0d060" }}>{openCount}</span>
          <span className="stat-label">Open</span>
        </div>
        <div className="stat-chip">
          <span className="stat-value" style={{ color: "#ffb74d" }}>{investigateCount}</span>
          <span className="stat-label">Under Investigation</span>
        </div>
        <div className="stat-chip">
          <span className="stat-value" style={{ color: "var(--success)" }}>{closedCount}</span>
          <span className="stat-label">Closed</span>
        </div>
      </div>

      <GoldenDivider />
      <div style={{ marginBottom: 28 }} />

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
            {searchQuery ? 'No cases match your search.' : 'No cases available.'}
          </p>
        ) : (
          filteredCases.map((c, i) => (
            <CaseCard key={c.id} caseData={c} delay={i * 0.07} />
          ))
        )}
      </div>
      {showNewCase && (
        <NewCaseModal
          onClose={() => setShowNewCase(false)}
          onCreate={(nc) => {
            MOCK_CASES.unshift(nc);
            setShowNewCase(false);
          }}
        />
      )}
    </main>
  );
}
