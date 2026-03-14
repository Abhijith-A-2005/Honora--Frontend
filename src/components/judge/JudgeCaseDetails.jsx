// pages/judge/JudgeCaseDetails.jsx

import { useAuth } from "../common/useAuth";
import { JUDGE_CASES, FORENSIC_CASES }    from "../../data/mockCases";
import { JUDGE_EVIDENCE, FORENSIC_REPORTS, LAWYER_SUPPORTING_DOCUMENTS } from "../../data/mockEvidence";
import { JUDGE_PROFILES } from "../../data/mockUsers";
import { isJudgeAuthorized } from "../../utils/filters";
import { getStatusBadgeClass } from "../../utils/helpers";
import EvidenceSection from "../common/EvidenceSection";

export default function JudgeCaseDetails({ caseId, onBack }) {
  const { user } = useAuth();
  const profile  = JUDGE_PROFILES[user?.username];
  const caseData = JUDGE_CASES.find(c => c.id === caseId);
  const evidence = JUDGE_EVIDENCE[caseId] || [];

  // Find related forensic case and reports by matching case title
  const getRelatedForensicReports = () => {
    if (!caseData) return [];
    
    // Get forensic reports for the related police case
    if (caseData.relatedPoliceCaseId) {
      return FORENSIC_REPORTS[caseData.relatedPoliceCaseId] || [];
    }
    return [];
  };

  // Get lawyer supporting documents for this case
  const getLawyerSupportingDocuments = () => {
    if (!caseData) return [];
    
    // Convert judge case ID to lawyer case ID (CRT-2026-001 -> LGL-2026-001)
    const lawyerCaseId = caseData.id.replace('CRT', 'LGL');
    
    return LAWYER_SUPPORTING_DOCUMENTS[lawyerCaseId] || [];
  };

  const forensicReports = getRelatedForensicReports();
  const lawyerDocuments = getLawyerSupportingDocuments();

  if (!caseData) return (
    <div className="judge-dashboard">
      <button className="judge-back-btn" onClick={onBack}>← Back</button>
      <p style={{ color:"rgba(240,234,216,0.4)", marginTop:"2rem", fontFamily:"'Josefin Sans',sans-serif", fontSize:"13px" }}>
        Case record not found.
      </p>
    </div>
  );

  if (!isJudgeAuthorized(caseData, profile)) return (
    <div className="judge-dashboard">
      <button className="judge-back-btn" onClick={onBack}>← Back</button>
      <div style={{ marginTop:"3rem", textAlign:"center" }}>
        <p style={{ fontSize:"2rem", marginBottom:"1rem" }}>⚠️</p>
        <p style={{ color:"#fb923c", fontFamily:"'Cormorant Garamond',serif", fontSize:"1.5rem", fontWeight:700, marginBottom:"0.5rem" }}>
          Unauthorized Access
        </p>
        <p style={{ color:"rgba(240,234,216,0.35)", fontSize:"12px", fontFamily:"'Josefin Sans',sans-serif", letterSpacing:"0.1em" }}>
          This case is outside your court jurisdiction or not assigned to you.
        </p>
      </div>
    </div>
  );

  return (
    <div className="judge-dashboard">
      <button className="judge-back-btn" onClick={onBack}>← Back to Docket</button>

      <div style={{ animation:"jFadeUp 0.45s ease both" }}>
        <p className="judge-eyebrow">Case Record — {caseData.id}</p>
        <h1 className="judge-title">{caseData.title}</h1>

        <div className="judge-meta-grid">
          {[
            ["Case ID",         caseData.id],
            ["Court",           caseData.court],
            ["Presiding Judge", profile.name],
            ["Next Hearing",    caseData.nextHearing],
          ].map(([l, v]) => (
            <div className="judge-meta-item" key={l}>
              <span className="judge-meta-label">{l}</span>
              <span className="judge-meta-value">{v}</span>
            </div>
          ))}
          <div className="judge-meta-item">
            <span className="judge-meta-label">Status</span>
            <span className={`judge-badge ${getStatusBadgeClass(caseData.status)}`} style={{ marginTop:"0.2rem", display:"inline-block" }}>
              {caseData.status}
            </span>
          </div>
        </div>
      </div>

      <div className="judge-divider" />

      {evidence.length === 0 ? (
        <p style={{ color:"rgba(240,234,216,0.3)", fontStyle:"italic", fontSize:"13px", marginTop:"1rem", fontFamily:"'Josefin Sans',sans-serif" }}>
          No evidence has been submitted for this case.
        </p>
      ) : (
        <EvidenceSection evidence={evidence} caseId={caseId} />
      )}

      {forensicReports.length > 0 && (
        <>
          <div className="judge-divider" />
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.3em", color: "#D4AF37", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif" }}>
              FORENSIC ANALYSIS
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.3rem,3vw,2rem)", color: "#f0ead8", fontWeight: 700 }}>
              Forensic Report
            </h2>
          </div>
          <EvidenceSection evidence={forensicReports} caseId={caseId} />
        </>
      )}

      {lawyerDocuments.length > 0 && (
        <>
          <div className="judge-divider" />
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.3em", color: "#D4AF37", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif" }}>
              LAWYER SUBMISSIONS
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.3rem,3vw,2rem)", color: "#f0ead8", fontWeight: 700 }}>
              Supporting Documents
            </h2>
          </div>
          <EvidenceSection evidence={lawyerDocuments} caseId={caseId} />
        </>
      )}
    </div>
  );
}
