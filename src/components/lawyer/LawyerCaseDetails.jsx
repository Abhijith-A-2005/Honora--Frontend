// pages/lawyer/LawyerCaseDetails.jsx

import { useAuth } from "../common/useAuth";
import { LAWYER_CASES, FORENSIC_CASES }    from "../../data/mockCases";
import { LAWYER_EVIDENCE, FORENSIC_REPORTS, LAWYER_SUPPORTING_DOCUMENTS } from "../../data/mockEvidence";
import { LAWYER_PROFILES } from "../../data/mockUsers";
import { isLawyerAuthorized } from "../../utils/filters";
import { getStatusBadgeClass, getTypeBadgeClass } from "../../utils/helpers";
import EvidenceSection from "../common/EvidenceSection";
import LawyerUploadModal from "./LawyerUploadModal";
import { useState } from "react";

export default function LawyerCaseDetails({ caseId, onBack }) {
  const { user } = useAuth();
  const profile  = LAWYER_PROFILES[user?.username];
  const caseData = LAWYER_CASES.find(c => c.id === caseId);
  const evidence = LAWYER_EVIDENCE[caseId] || [];
  const [supportingDocuments, setSupportingDocuments] = useState(LAWYER_SUPPORTING_DOCUMENTS[caseId] || []);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Find related forensic case and reports by matching case title
  const getRelatedForensicReports = () => {
    if (!caseData) return [];
    
    // Get forensic reports for the related police case
    if (caseData.relatedPoliceCaseId) {
      return FORENSIC_REPORTS[caseData.relatedPoliceCaseId] || [];
    }
    return [];
  };

  const forensicReports = getRelatedForensicReports();

  if (!caseData) return (
    <div className="dashboard view">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <p style={{ color:"var(--text-muted)", marginTop:"2rem" }}>Case not found.</p>
    </div>
  );

  if (!isLawyerAuthorized(caseData, profile)) return (
    <div className="dashboard view">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div style={{ marginTop:"3rem", textAlign:"center" }}>
        <p style={{ fontSize:"2rem", marginBottom:"1rem" }}>⚠️</p>
        <p style={{ color:"#fb923c", fontFamily:"var(--font-display)", fontSize:"1.5rem", fontWeight:700, marginBottom:"0.5rem" }}>
          Unauthorized Access
        </p>
        <p style={{ color:"var(--text-muted)", fontSize:"12px", letterSpacing:"0.1em" }}>
          This case is not assigned to you.
        </p>
      </div>
    </div>
  );

  return (
    <div className="dashboard view">
      <button className="back-btn" onClick={onBack}>← Back to Cases</button>

      <div style={{ animation:"fadeUp 0.45s ease both" }}>
        <p className="dash-eyebrow">Case Record</p>
        <h1 className="dash-title">{caseData.title}</h1>
        <div className="meta-grid">
          {[
            ["Case ID",    caseData.id],
            ["Client",     caseData.clientName],
            ["Court",      caseData.assignedCourt],
            ["Court Date", caseData.courtDate],
            ["Counsel",    profile?.name],
          ].map(([l, v]) => (
            <div className="meta-item" key={l}>
              <span className="meta-label">{l}</span>
              <span className="meta-value">{v}</span>
            </div>
          ))}
          <div className="meta-item">
            <span className="meta-label">Representation</span>
            <span className={`badge ${getTypeBadgeClass(caseData.clientType)}`} style={{ marginTop:"0.2rem", display:"inline-block" }}>
              {caseData.clientType}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Status</span>
            <span className={`badge ${getStatusBadgeClass(caseData.status)}`} style={{ marginTop:"0.2rem", display:"inline-block" }}>
              {caseData.status}
            </span>
          </div>
        </div>
      </div>

      <div className="gold-divider" />

      {evidence.length === 0 ? (
        <p style={{ color:"var(--text-muted)", fontStyle:"italic", fontSize:"13px", marginTop:"1rem" }}>
          No evidence has been filed for this case yet.
        </p>
      ) : (
        <EvidenceSection evidence={evidence} caseId={caseId} />
      )}

      <div className="gold-divider" />

      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.3em", color: "var(--gold)", fontWeight: 600, marginBottom: 10, textTransform: "uppercase" }}>
              SUPPORTING DOCUMENTS
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem,3vw,2rem)", color: "var(--text)", fontWeight: 700 }}>
              Trial Preparation Materials
            </h2>
          </div>
          <button
            className="btn-gold"
            onClick={() => setShowUploadModal(true)}
            style={{ padding: "8px 16px", fontSize: "14px" }}
          >
            + Upload Document
          </button>
        </div>

        {supportingDocuments.length === 0 ? (
          <p style={{ color:"var(--text-muted)", fontStyle:"italic", fontSize:"13px" }}>
            No supporting documents uploaded yet.
          </p>
        ) : (
          <EvidenceSection evidence={supportingDocuments} caseId={caseId} />
        )}
      </div>

      {forensicReports.length > 0 && (
        <>
          <div className="gold-divider" />
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.3em", color: "var(--gold)", fontWeight: 600, marginBottom: 10, textTransform: "uppercase" }}>
              FORENSIC ANALYSIS
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem,3vw,2rem)", color: "var(--text)", fontWeight: 700 }}>
              Forensic Report
            </h2>
          </div>
          <EvidenceSection evidence={forensicReports} caseId={caseId} />
        </>
      )}

      {showUploadModal && (
        <LawyerUploadModal
          caseId={caseId}
          onClose={() => setShowUploadModal(false)}
          onUpload={(newDoc) => {
            setSupportingDocuments(prev => [...prev, newDoc]);
            // In a real app, this would be sent to the backend
            LAWYER_SUPPORTING_DOCUMENTS[caseId] = [...supportingDocuments, newDoc];
          }}
          lawyerName={profile?.name || "Unknown Lawyer"}
        />
      )}
    </div>
  );
}
