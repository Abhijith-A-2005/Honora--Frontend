// components/forensic/ForensicReportUploadModal.jsx
import { useState } from "react";
import { CloseIcon, PlusIcon } from "../../assets/icons/Icons";

const REPORT_TYPES = ["DNA Analysis", "Fingerprint Analysis", "Digital Forensics", "Chemical Analysis", "Toxicology", "Other"];

export default function ForensicReportUploadModal({ caseId, onClose, onUpload }) {
  const [form, setForm] = useState({ title: "", reportType: "DNA Analysis", description: "", findings: "", conclusion: "", file: null, fileName: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOverlay = (e) => { if (e.target === e.currentTarget) onClose(); };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, file, fileName: file.name }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Report title is required."); return; }
    if (!form.description.trim()) { setError("Description is required."); return; }
    if (!form.findings.trim()) { setError("Findings are required."); return; }
    if (!form.conclusion.trim()) { setError("Conclusion is required."); return; }
    setError("");
    setLoading(true);

    setTimeout(() => {
      const fileUrl = form.file ? URL.createObjectURL(form.file) : null;
      const newReport = {
        id: `FR-NEW-${Date.now()}`,
        title: form.title.trim(),
        description: form.description.trim(),
        format: "Text Document",
        uploadedBy: "Current Analyst",
        uploadDate: new Date().toISOString().split("T")[0],
        fileUrl,
        textContent: `FORENSIC ANALYSIS REPORT
Case ID: ${caseId}
Report Type: ${form.reportType}
Title: ${form.title}

DESCRIPTION:
${form.description}

FINDINGS:
${form.findings}

CONCLUSION:
${form.conclusion}

Report generated on: ${new Date().toLocaleDateString()}
Analyst: Current Analyst`,
        isNew: true,
      };
      onUpload(newReport);
      setLoading(false);
      onClose();
    }, 900);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlay}>
      <div className="modal-glass upload-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>

        <div className="modal-icon welcome-gold"><PlusIcon /></div>
        <h2 className="modal-title">Upload Forensic Report</h2>
        <p className="modal-subtitle">Case: {caseId}</p>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Report Title</label>
            <input type="text" placeholder="e.g. DNA Analysis Report" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>

          <div className="input-group">
            <label>Report Type</label>
            <select value={form.reportType} onChange={(e) => setForm((f) => ({ ...f, reportType: e.target.value }))}>
              {REPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea placeholder="Describe the analysis methodology and scope..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
          </div>

          <div className="input-group">
            <label>Findings</label>
            <textarea placeholder="Detail your forensic findings..." value={form.findings} onChange={(e) => setForm((f) => ({ ...f, findings: e.target.value }))} rows={4} />
          </div>

          <div className="input-group">
            <label>Conclusion</label>
            <textarea placeholder="Provide your expert conclusion and recommendations..." value={form.conclusion} onChange={(e) => setForm((f) => ({ ...f, conclusion: e.target.value }))} rows={3} />
          </div>

          <div className="input-group">
            <label>File Upload (optional)</label>
            <div className="file-input-wrapper">
              <input type="file" onChange={handleFile} accept=".pdf,.txt,.doc,.docx" />
              <div className="file-input-display">
                <div className="file-input-icon">📄</div>
                <div className="file-input-text">Click or drag to upload supporting document</div>
                {form.fileName && <div className="file-input-name">{form.fileName}</div>}
              </div>
            </div>
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-btn-row">
            <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className={`btn-gold${loading ? " loading" : ""}`}>
              {loading ? <span className="loader" /> : "Submit Report"}
            </button>
          </div>
        </form>

        <p className="modal-notice">🔒 Report is timestamped, digitally signed, and logged for chain of custody</p>
      </div>
    </div>
  );
}
