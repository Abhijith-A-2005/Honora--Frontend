import { useNavigate } from "react-router-dom";

const STATUS_CLASS = {
  "Open": "status-open",
  "Closed": "status-closed",
  "Under Investigation": "status-investigating",
};

export default function CaseCard({ caseData, delay = 0 }) {
  const navigate = useNavigate();

  const handleView = () => navigate(`/dashboard/police/case/${caseData.id}`);

  const addRipple = (e) => {
    const btn = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
    handleView();
  };

  return (
    <div className={`case-card card-delay-${delay}`}>
      <div className="cc-glow" />
      <div className="cc-id">{caseData.id}</div>
      <div className="cc-main">
        <div className="cc-title">{caseData.title}</div>
        <div className="cc-date">Filed: {caseData.date} &nbsp;·&nbsp; {caseData.officer}</div>
      </div>
      <span className={`cc-status ${STATUS_CLASS[caseData.status] || "status-open"}`}>
        {caseData.status}
      </span>
      <button className="btn-gold sm" onClick={addRipple}>
        View →
      </button>
    </div>
  );
}
