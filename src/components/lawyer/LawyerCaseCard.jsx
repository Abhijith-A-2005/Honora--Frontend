// components/lawyer/LawyerCaseCard.jsx

import { getStatusBadgeClass, getTypeBadgeClass } from "../../utils/helpers";

export default function LawyerCaseCard({ c, onView, delay }) {
  return (
    <div
      className={`lawyer-case-card card-delay-${delay}`}
      onClick={() => onView(c.id)}
    >
      <div className="case-card-main">
        <div className="case-id-tag">{c.id}</div>
        <div className="case-card-title">{c.title}</div>
        <div className="case-card-court">🏛 {c.assignedCourt}</div>
      </div>
      <span className={`badge ${getTypeBadgeClass(c.clientType)}`}>{c.clientType}</span>
      <span className={`badge ${getStatusBadgeClass(c.status)}`}>{c.status}</span>
      <div>
        <div className="case-date">📅 {c.courtDate}</div>
        <button
          className="btn-gold ev-view-btn mt-2"
          onClick={(e) => { e.stopPropagation(); onView(c.id); }}
        >
          View →
        </button>
      </div>
    </div>
  );
}
