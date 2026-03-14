import { useState } from "react";
import { CloseIcon, PlusIcon } from "../../assets/icons/Icons";

export default function NewCaseModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    officer: "",
    department: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOverlay = (e) => { if (e.target === e.currentTarget) onClose(); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.officer.trim()) { setError("Officer name is required."); return; }
    if (!form.department.trim()) { setError("Department is required."); return; }
    setError("");
    setLoading(true);

    setTimeout(() => {
      const newCase = {
        id: `EC-NEW-${Date.now()}`,
        title: form.title.trim(),
        status: "Open",
        date: form.date,
        officer: form.officer.trim(),
        description: form.description.trim(),
        badge: "", // optional
        department: form.department.trim(),
      };
      onCreate(newCase);
      setLoading(false);
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlay}>
      <div className="modal-glass upload-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>
        <div className="modal-icon welcome-gold"><PlusIcon /></div>
        <h2 className="modal-title">Register New Case</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Case Title</label>
            <input
              type="text"
              placeholder="Brief description of case"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="input-group">
            <label>Officer</label>
            <input
              type="text"
              placeholder="Name of reporting officer"
              value={form.officer}
              onChange={(e) => setForm((f) => ({ ...f, officer: e.target.value }))}
            />
          </div>
          <div className="input-group">
            <label>Department</label>
            <input
              type="text"
              placeholder="Unit or division"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
            />
          </div>
          <div className="input-group">
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea
              placeholder="Detailed description or notes"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          {error && <p className="modal-error">{error}</p>}
          <div className="modal-btn-row">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`btn-gold${loading ? " loading" : ""}`}>
              {loading ? <span className="loader" /> : "Create Case"}
            </button>
          </div>
        </form>
        <p className="modal-notice">🔒 Case is registered to the evidence chain</p>
      </div>
    </div>
  );
}
