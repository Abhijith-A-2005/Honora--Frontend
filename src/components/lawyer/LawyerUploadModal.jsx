import { useState } from "react";
import { CloseIcon, PlusIcon } from "../../assets/icons/Icons";

const FORMATS = ["Legal Brief", "Affidavit", "Motion", "Petition", "Evidence Document", "Other"];

export default function LawyerUploadModal({ caseId, onClose, onUpload, lawyerName }) {
  const [form, setForm] = useState({ title: "", description: "", format: "Legal Brief", file: null, fileName: "" });
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
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.description.trim()) { setError("Description is required."); return; }
    setError("");
    setLoading(true);

    setTimeout(() => {
      const fileUrl = form.file ? URL.createObjectURL(form.file) : null;
      const newDocument = {
        id: `SD-${caseId.split('-')[2]}-${Date.now()}`,
        title: form.title.trim(),
        description: form.description.trim(),
        format: form.format.toLowerCase().replace(' ', '_'),
        uploadedBy: lawyerName,
        lawyerName: lawyerName,
        uploadDate: new Date().toISOString().split("T")[0],
        fileUrl,
        textContent: form.format === "Legal Brief" || form.format === "Affidavit" || form.format === "Motion" || form.format === "Petition" ? form.description : null,
        isNew: true,
      };
      onUpload(newDocument);
      setLoading(false);
      onClose();
    }, 900);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlay}>
      <div className="modal-glass upload-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>

        <div className="modal-icon" style={{ color: "var(--gold)" }}><PlusIcon /></div>
        <h2 className="modal-title">Upload Supporting Document</h2>
        <p className="modal-subtitle">Case: {caseId}</p>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Document Title</label>
            <input type="text" placeholder="e.g. Defense Brief — Alibi Evidence" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea placeholder="Describe this supporting document..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>

          <div className="input-group">
            <label>Document Type</label>
            <select value={form.format} onChange={(e) => setForm((f) => ({ ...f, format: e.target.value }))}>
              {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>File Upload (optional)</label>
            <div className="file-input-wrapper">
              <input type="file" onChange={handleFile} accept=".pdf,.doc,.docx,.txt,.rtf" />
              <div className="file-input-display">
                <div className="file-input-icon">📄</div>
                <div className="file-input-text">Click or drag to upload document</div>
                {form.fileName && <div className="file-input-name">{form.fileName}</div>}
              </div>
            </div>
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className={`btn-gold${loading ? " loading" : ""}`} style={{ flex: 1 }}>
              {loading ? <span className="loader" /> : "Submit Document"}
            </button>
          </div>
        </form>

        <p className="modal-notice">⚖️ Documents are digitally signed and timestamped for court admissibility</p>
      </div>
    </div>
  );
}