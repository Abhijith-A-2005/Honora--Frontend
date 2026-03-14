// components/judge/JudgeCaseCard.jsx

import { getStatusBadgeClass } from "../../utils/helpers";

export default function JudgeCaseCard({ c, onView, delay }) {
  return (
    <div
      className={`judge-case-card card-delay-${delay}`}
      onClick={() => onView(c.id)}
    >
      <div>
        <div className="judge-case-id">{c.id}</div>
        <div className="judge-case-title">{c.title}</div>
        <div className="judge-case-court">🏛 {c.court}</div>
      </div>
      <span className={`judge-badge ${getStatusBadgeClass(c.status)}`}>{c.status}</span>
      <div className="judge-date-col">
        <div className="judge-date-label">Next Hearing</div>
        <div className="judge-date-val">{c.nextHearing}</div>
      </div>
      <button
        className="judge-view-btn"
        onClick={(e) => { e.stopPropagation(); onView(c.id); }}
      >
        View →
      </button>
    </div>
  );
}
