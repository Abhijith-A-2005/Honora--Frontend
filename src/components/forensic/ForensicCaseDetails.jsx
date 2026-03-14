// components/forensic/ForensicCaseDetails.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../common/useAuth";
import { FORENSIC_CASES, MOCK_CASES } from "../../data/mockCases";
import { MOCK_EVIDENCE } from "../../data/mockEvidence";
import { FORENSIC_CASE_EVIDENCE, FORENSIC_REPORTS } from "../../data/mockEvidence";
import { FORENSIC_PROFILES } from "../../data/mockUsers";
import { GoldenDivider } from "../common/Shared";
import EvidenceSection from "../common/EvidenceSection";
import EvidenceModal from "../common/EvidenceModal";
import ForensicReportUploadModal from "./ForensicReportUploadModal";
import { ArrowLeftIcon, PlusIcon } from "../../assets/icons/Icons";

export default function ForensicCaseDetails({ caseId, onBack }) {
  const { user } = useAuth();
  const profile = FORENSIC_PROFILES[user?.username];
  const caseData = FORENSIC_CASES.find((c) => c.id === caseId);
  const relatedCase = MOCK_CASES.find((c) => c.id === caseData?.relatedCaseId);

  const [caseEvidence, setCaseEvidence] = useState(() => FORENSIC_CASE_EVIDENCE[caseId] || []);
  const [forensicReports, setForensicReports] = useState(() => FORENSIC_REPORTS[relatedCase?.id] || []);
  const [viewingEvidence, setViewingEvidence] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  const statusColors = {
    "In Progress": "#ffb74d",
    "Pending": "#f0d060",
    "Completed": "#4ade80",
  };

  if (!caseData) return (
    <div className="dashboard view">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <p className="case-not-found">Case not found.</p>
    </div>
  );

  const handleReportUpload = (newReport) => {
    setForensicReports((prev) => [newReport, ...prev]);
    // Also add to FORENSIC_REPORTS for persistence
    if (relatedCase?.id) {
      if (!FORENSIC_REPORTS[relatedCase.id]) {
        FORENSIC_REPORTS[relatedCase.id] = [];
      }
      FORENSIC_REPORTS[relatedCase.id].unshift(newReport);
    }
    // Remove "new" flag after animation
    setTimeout(() => {
      setForensicReports((prev) =>
        prev.map((r) => r.id === newReport.id ? { ...r, isNew: false } : r)
      );
    }, 2000);
  };

  return (
    <div className="dashboard view">
      <button className="back-btn" onClick={onBack}>← Back to Cases</button>

      <div className="fade-up">
        <p className="dash-eyebrow">Forensic Case Record</p>
        <h1 className="dash-title">{caseData.title}</h1>
        <div className="meta-grid">
          {[
            ["Case ID", caseData.id],
            ["Related Police Case", caseData.relatedCaseId],
            ["Evidence Type", caseData.evidenceType],
            ["Assignment Date", caseData.assignedDate],
            ["Analyst", profile?.name],
          ].map(([l, v]) => (
            <div className="meta-item" key={l}>
              <span className="meta-label">{l}</span>
              <span className="meta-value">{v}</span>
            </div>
          ))}
          <div className="meta-item">
            <span className="meta-label">Status</span>
            <span
              className="badge"
              style={{
                marginTop: "0.2rem",
                display: "inline-block",
                backgroundColor: `${statusColors[caseData.status] || "#f0d060"}20`,
                color: statusColors[caseData.status] || "#f0d060",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              {caseData.status}
            </span>
          </div>
        </div>
      </div>

      <div className="gold-divider" />

      {/* Original Evidence Section */}
      <div className="mb-36">
        <p className="section-eyebrow">
          SUBMITTED EVIDENCE
        </p>
        <h2 className="section-title-lg">
          Case Evidence Inventory
        </h2>
      </div>

      {caseEvidence.length === 0 ? (
        <p className="no-evidence-text">
          No evidence inventory documentation available for this case.
        </p>
      ) : (
        <EvidenceSection evidence={caseEvidence} caseId={caseId} />
      )}

      <GoldenDivider />

      {/* Forensic Reports Section */}
      <div className="mb-36">
        <p className="section-eyebrow">
          FORENSIC ANALYSIS
        </p>
        <h2 className="section-title-lg">
          Forensic Reports
        </h2>
      </div>

      {forensicReports.length === 0 ? (
        <p className="no-evidence-text">
          No forensic reports uploaded for this case yet.
        </p>
      ) : (
        <EvidenceSection evidence={forensicReports} caseId={caseId} />
      )}

      {/* Floating upload button */}
      <button className="fab-upload" onClick={() => setShowUpload(true)} title="Upload Forensic Report">
        <span className="fab-tooltip">Upload Forensic Report</span>
        <PlusIcon />
      </button>

      {/* Evidence view modal */}
      {viewingEvidence && (
        <EvidenceModal ev={viewingEvidence} onClose={() => setViewingEvidence(null)} />
      )}

      {/* Upload modal */}
      {showUpload && (
        <ForensicReportUploadModal
          caseId={caseId}
          onClose={() => setShowUpload(false)}
          onUpload={handleReportUpload}
        />
      )}
    </div>
  );
}
