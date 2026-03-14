// components/forensic/ForensicCaseCard.jsx
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "../../assets/icons/Icons";

export default function ForensicCaseCard({ caseData, delay }) {
  const navigate = useNavigate();

  const statusColors = {
    "In Progress": "#ffb74d",
    "Pending": "#f0d060",
    "Completed": "#4ade80",
  };

  return (
    <div
      className={`case-card card-delay-${delay}`}
      onClick={() => navigate(`/dashboard/forensic/case/${encodeURIComponent(caseData.id)}`)}
    >
      <div className="case-card-ripple" />

      <div className="case-card-header">
        <div>
          <p className="case-card-id">{caseData.id}</p>
          <h3 className="case-card-title">{caseData.title}</h3>
        </div>
        <div
          className="case-card-status"
          style={{ backgroundColor: `${statusColors[caseData.status] || "#f0d060"}20`, color: statusColors[caseData.status] || "#f0d060" }}
        >
          {caseData.status}
        </div>
      </div>

      <div className="case-card-meta">
        <span className="meta-item">
          <span className="meta-label">Related Case:</span>
          <span className="meta-value">{caseData.relatedCaseId}</span>
        </span>
        <span className="meta-item">
          <span className="meta-label">Evidence Type:</span>
          <span className="meta-value">{caseData.evidenceType.split(",")[0].trim()}</span>
        </span>
      </div>

      <p className="case-card-desc">{caseData.description}</p>

      <div className="case-card-footer">
        <button
          className="btn-gold case-card-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/forensic/case/${encodeURIComponent(caseData.id)}`);
          }}
        >
          <span className="btn-icon"><EyeIcon /></span>
          View Details
        </button>
      </div>
    </div>
  );
}
