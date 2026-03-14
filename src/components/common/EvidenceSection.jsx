// components/common/EvidenceSection.jsx
// All case evidence in one flat list, grouped by format.

import { useState } from "react";
import EvidenceModal from "./EvidenceModal";

const FORMAT_ORDER  = ["video", "photo", "text", "voice", "legal_brief", "affidavit", "motion", "petition", "evidence_document"];
const FORMAT_LABELS = { 
  video:"Video Evidence", 
  photo:"Photo Evidence", 
  text:"Text Documents", 
  voice:"Voice Notes",
  legal_brief: "Legal Briefs",
  affidavit: "Affidavits", 
  motion: "Motions",
  petition: "Petitions",
  evidence_document: "Evidence Documents"
};
const FORMAT_ICONS  = { 
  video:"▶", 
  photo:"◉", 
  text:"≡", 
  voice:"♪",
  legal_brief: "⚖️",
  affidavit: "📝",
  motion: "📄",
  petition: "📋",
  evidence_document: "📑"
};

function EvidenceCard({ ev, onView, delay }) {
  return (
    <div className="evidence-card" style={{ animationDelay:`${delay}s` }}>
      <div className="ev-card-top">
        <div className="ev-format-icon">{FORMAT_ICONS[ev.format]}</div>
        <div className="ev-body">
          <div className="ev-title">{ev.title}</div>
          <div className="ev-desc">{ev.description}</div>
          <div className="ev-meta">
            <span>By: {ev.lawyerName || ev.uploadedBy}</span>
            <span>{ev.uploadDate}</span>
          </div>
        </div>
      </div>
      <div className="ev-card-footer">
        <button className="btn-gold ev-view-btn" onClick={() => onView(ev)}>View</button>
      </div>
    </div>
  );
}

export default function EvidenceSection({ evidence, caseId }) {
  const [selectedEv, setSelectedEv] = useState(null);
  let idx = 0;

  return (
    <>
      <div className="evidence-container">
        {FORMAT_ORDER.map((fmt) => {
          const items = evidence.filter(e => e.format === fmt);
          const base  = idx;
          idx += items.length;
          if (items.length === 0) return null;
          return (
            <div className="format-group" key={fmt}>
              <div className="format-heading">
                <span className="format-heading-icon">{FORMAT_ICONS[fmt]}</span>
                {FORMAT_LABELS[fmt]}
              </div>
              <div className="evidence-list">
                {items.map((ev, i) => (
                  <EvidenceCard key={ev.id} ev={ev} onView={setSelectedEv} delay={(base + i) * 0.07} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedEv && (
        <EvidenceModal ev={selectedEv} caseId={caseId} onClose={() => setSelectedEv(null)} />
      )}
    </>
  );
}
