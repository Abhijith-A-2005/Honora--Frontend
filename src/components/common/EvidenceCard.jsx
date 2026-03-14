import { VideoIcon, PhotoIcon, DocumentIcon, MicIcon, FolderIcon, EyeIcon } from "../../assets/icons/Icons";

const FORMAT_ICONS = {
  "Video":         VideoIcon,
  "Photo":         PhotoIcon,
  "Text Document": DocumentIcon,
  "Voice Note":    MicIcon,
};

export default function EvidenceCard({ evidence, onView, delay = 0 }) {
  const Icon = FORMAT_ICONS[evidence.format] || FolderIcon;

  const addRipple = (e) => {
    const btn = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
    onView(evidence);
  };

  return (
    <div
      className={`evidence-card${evidence.isNew ? " new-item" : ""} card-delay-${delay}`}
    >
      <div className="ev-card-glow" />
      <div className="ev-format-badge">
        <span className="icon-16"><Icon /></span>
        {evidence.format}
      </div>
      <div className="ev-title">{evidence.title}</div>
      <div className="ev-desc">{evidence.description}</div>
      <div className="ev-footer">
        <span className="ev-date">{evidence.uploadDate}</span>
        <button className="btn-gold sm" onClick={addRipple}>
          <span className="icon-14"><EyeIcon /></span>
          View
        </button>
      </div>
    </div>
  );
}
