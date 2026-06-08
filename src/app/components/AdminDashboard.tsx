import { useState } from "react";
import {
  Search, FileText, CheckCircle2, XCircle, Clock, Download, Maximize2, X,
  User as UserIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ───────────────────────────────────────────────────────────────────

type DocKey = "govId" | "tenth" | "twelfth" | "sem";

interface Submission {
  id: string;
  name: string;
  email: string;
  team: string;
  submittedAt: string;
  docs: { govId: boolean; tenth: boolean; twelfth: boolean; sem: boolean };
  // TODO: backend populates these as presigned URLs (e.g. S3 signed URLs)
  docUrls?: Partial<Record<DocKey, string>>;
  status: "pending" | "verified" | "rejected";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

// TODO: replace with real API data
const mockSubmissions: Submission[] = [
  { id: "1", name: "Arjun Mehta",  email: "arjun.m@example.com",  team: "Team Alpha",  submittedAt: "2 hours ago", docs: { govId: true,  tenth: true,  twelfth: true,  sem: true  }, status: "pending"  },
  { id: "2", name: "Priya Sharma", email: "priya.s@example.com",  team: "Squad Nexus", submittedAt: "5 hours ago", docs: { govId: true,  tenth: true,  twelfth: true,  sem: true  }, status: "verified" },
  { id: "3", name: "Rahul Desai",  email: "rahul.d@example.com",  team: "Team Beta",   submittedAt: "1 day ago",   docs: { govId: true,  tenth: false, twelfth: true,  sem: true  }, status: "rejected" },
  { id: "4", name: "Aisha Khan",   email: "aisha.k@example.com",  team: "Team Alpha",  submittedAt: "1 day ago",   docs: { govId: true,  tenth: true,  twelfth: true,  sem: true  }, status: "pending"  },
  { id: "5", name: "Vikram Nair",  email: "vikram.n@example.com", team: "Squad Nexus", submittedAt: "2 days ago",  docs: { govId: true,  tenth: true,  twelfth: false, sem: false }, status: "pending"  },
];

const DOC_DEFS: { key: DocKey; label: string; chipLabel: string; filename: string }[] = [
  { key: "govId",   label: "Government ID",              chipLabel: "Govt ID",  filename: "gov_id_doc.pdf"     },
  { key: "tenth",   label: "10th Marksheet",             chipLabel: "10th",     filename: "10th_marksheet.pdf" },
  { key: "twelfth", label: "12th Marksheet",             chipLabel: "12th",     filename: "12th_marksheet.pdf" },
  { key: "sem",     label: "Latest Semester Marksheet",  chipLabel: "Semester", filename: "sem_marksheet.pdf"  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last  = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

function getStatusDotColor(status: string) {
  if (status === "verified") return "#10B981";
  if (status === "rejected") return "#EF4444";
  return "#F59E0B";
}

const SL: React.CSSProperties = {
  fontSize: 11, fontWeight: 800, color: "#ABABAB",
  letterSpacing: "0.11em", textTransform: "uppercase",
  margin: "0 0 14px",
};

// ─── Shared components ────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 7,
    padding: "7px 14px", borderRadius: 9, fontSize: 13, fontWeight: 800,
    letterSpacing: "0.01em",
  };
  if (status === "verified")
    return <span style={{ ...base, background: "#ECFDF5", color: "#065F46" }}><CheckCircle2 size={14} /> Verified</span>;
  if (status === "rejected")
    return <span style={{ ...base, background: "#FEF2F2", color: "#991B1B" }}><XCircle size={14} /> Rejected</span>;
  return <span style={{ ...base, background: "#FFFBEB", color: "#92400E" }}><Clock size={14} /> Pending</span>;
}

function FolderIllustration() {
  return (
    <svg width="96" height="82" viewBox="0 0 96 82" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 34 L0 12 Q0 5 7 5 L31 5 Q36 5 40 10 L47 22 Q50 26 56 26 L93 26 Q96 26 96 29 L96 34 Z" fill="rgba(249,115,22,0.20)" />
      <rect x="0" y="29" width="96" height="53" rx="12" fill="rgba(249,115,22,0.09)" />
      <rect x="0" y="29" width="96" height="53" rx="12" fill="none" stroke="rgba(249,115,22,0.20)" strokeWidth="1.5" />
      <rect x="19" y="46" width="34" height="4" rx="2" fill="rgba(249,115,22,0.26)" />
      <rect x="19" y="57" width="24" height="4" rx="2" fill="rgba(249,115,22,0.18)" />
      <rect x="19" y="68" width="29" height="4" rx="2" fill="rgba(249,115,22,0.12)" />
    </svg>
  );
}

// ─── Documents Tab ────────────────────────────────────────────────────────────

interface DocTabHandlers {
  onView:     (docKey: DocKey, filename: string) => void;
  onDownload: (docKey: DocKey, filename: string) => void;
}

function DocumentsTab({ intern, onView, onDownload }: { intern: Submission } & DocTabHandlers) {
  return (
    <div>
      <p style={SL}>Submitted Documents</p>
      {DOC_DEFS.map((doc) => {
        const uploaded = intern.docs[doc.key];
        return (
          <div
            key={doc.key}
            style={{
              background: "white", borderRadius: 14,
              border: "1px solid #EFEFEF",
              padding: "18px 22px", marginBottom: 14,
              display: "flex", alignItems: "center", gap: 18,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              transition: "box-shadow 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
              el.style.borderColor = "rgba(249,115,22,0.18)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
              el.style.borderColor = "#EFEFEF";
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12, flexShrink: 0,
              background: uploaded ? "rgba(249,115,22,0.08)" : "#F5F5F5",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FileText size={22} color={uploaded ? "#F97316" : "#CACACA"} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#1C0A00", margin: "0 0 3px", letterSpacing: "-0.01em" }}>
                {doc.label}
              </p>
              {uploaded
                ? <p style={{ fontSize: 13, color: "#F97316", margin: 0, fontWeight: 600 }}>{doc.filename}</p>
                : <p style={{ fontSize: 13, color: "#B0B0B0", fontStyle: "italic", margin: 0 }}>Not uploaded</p>
              }
            </div>

            {uploaded && (
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                <button
                  onClick={() => onView(doc.key, doc.filename)}
                  style={{ fontSize: 13, fontWeight: 800, color: "#F97316", background: "none", border: "none", cursor: "pointer", padding: 0, letterSpacing: "0.01em" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.textDecoration = "underline"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.textDecoration = "none"; }}
                >View</button>
                <span style={{ color: "#E0E0E0", fontWeight: 300 }}>|</span>
                <button
                  onClick={() => onDownload(doc.key, doc.filename)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#ABABAB", display: "flex", alignItems: "center", padding: 0 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#F97316"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#ABABAB"; }}
                >
                  <Download size={16} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Details Tab ──────────────────────────────────────────────────────────────

function DetailsTab({ intern }: { intern: Submission }) {
  const uploadCount = Object.values(intern.docs).filter(Boolean).length;

  const infoRows: { label: string; value: string; valueColor: string }[] = [
    { label: "Full Name",  value: intern.name,                   valueColor: "#1C0A00" },
    { label: "Email",      value: intern.email,                  valueColor: "#1C0A00" },
    { label: "Team",       value: intern.team,                   valueColor: "#1C0A00" },
    { label: "Submitted",  value: intern.submittedAt,            valueColor: "#1C0A00" },
    { label: "Documents",  value: `${uploadCount} of 4 filed`,   valueColor: uploadCount === 4 ? "#F97316" : "#ABABAB" },
  ];

  return (
    <div>
      <p style={SL}>Intern Information</p>

      <div style={{ background: "white", borderRadius: 14, border: "1px solid #EFEFEF", overflow: "hidden", marginBottom: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        {infoRows.map((row, i) => (
          <div
            key={row.label}
            style={{
              padding: "16px 22px",
              borderBottom: i < infoRows.length - 1 ? "1px solid #F7F7F7" : "none",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: "#B8B8B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {row.label}
            </span>
            <span style={{ fontSize: 15, fontWeight: 700, color: row.valueColor }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <p style={SL}>Document Status</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {DOC_DEFS.map((doc) => {
          const uploaded = intern.docs[doc.key];
          return (
            <div
              key={doc.key}
              style={{
                background: "white", borderRadius: 12,
                border: `1px solid ${uploaded ? "rgba(16,185,129,0.15)" : "#EFEFEF"}`,
                padding: "14px 18px",
                display: "flex", alignItems: "center", gap: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              {uploaded
                ? <CheckCircle2 size={18} color="#10B981" />
                : <XCircle size={18} color="#DEDEDE" />
              }
              <span style={{ fontSize: 13, fontWeight: 700, color: uploaded ? "#1C0A00" : "#C8C8C8" }}>
                {doc.chipLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Fullscreen Overlay ───────────────────────────────────────────────────────

function FullscreenOverlay({ intern, onClose, onView, onDownload }: { intern: Submission; onClose: () => void } & DocTabHandlers) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0, zIndex: 50, background: "white", display: "flex", flexDirection: "column" }}
    >
      <div style={{ padding: "18px 36px", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #E8503A, #F97316)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 13, fontWeight: 900,
          }}>
            {getInitials(intern.name)}
          </div>
          <div>
            <p style={{ fontSize: 17, fontWeight: 900, color: "#1C0A00", margin: 0, letterSpacing: "-0.02em" }}>{intern.name}</p>
            <p style={{ fontSize: 12, color: "#ABABAB", margin: 0, marginTop: 1 }}>Team: {intern.team}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            marginLeft: "auto", display: "flex", alignItems: "center", gap: 8,
            padding: "9px 18px", border: "1.5px solid #E5E5E5", borderRadius: 9,
            background: "white", fontSize: 13, fontWeight: 700, color: "#6B7280",
            cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#F97316"; b.style.color = "#F97316"; }}
          onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#E5E5E5"; b.style.color = "#6B7280"; }}
        >
          <X size={15} /> Exit
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "40px 80px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <DocumentsTab intern={intern} onView={onView} onDownload={onDownload} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function AdminDashboard() {
  const [selectedIntern, setSelectedIntern] = useState<Submission | null>(null);
  const [activeTab, setActiveTab]           = useState<"documents" | "details">("documents");
  const [activeFilter, setActiveFilter]     = useState<"all" | "pending" | "verified" | "rejected">("all");
  const [search, setSearch]                 = useState("");
  const [isFullscreen, setIsFullscreen]     = useState(false);
  const [internStatuses, setInternStatuses] = useState<Record<string, string>>({});

  const getStatus = (sub: Submission) => internStatuses[sub.id] || sub.status;

  const filteredInterns = mockSubmissions.filter((sub) => {
    const status = getStatus(sub);
    const matchFilter = activeFilter === "all" || status === activeFilter;
    const matchSearch = !search
      || sub.name.toLowerCase().includes(search.toLowerCase())
      || sub.team.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const currentStatus = selectedIntern ? getStatus(selectedIntern) : "";

  function exportCSV() {
    const headers = ["Name", "Email", "Team", "Submitted", "Status", "GovID", "10th", "12th", "Semester"];
    const rows = filteredInterns.map((s) => [
      s.name, s.email, s.team, s.submittedAt, getStatus(s),
      s.docs.govId   ? "Uploaded" : "Missing",
      s.docs.tenth   ? "Uploaded" : "Missing",
      s.docs.twelfth ? "Uploaded" : "Missing",
      s.docs.sem     ? "Uploaded" : "Missing",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `reagvis-interns-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function selectIntern(intern: Submission) {
    setSelectedIntern(intern);
    setActiveTab("documents");
    setIsFullscreen(false);
  }

  async function handleStatusChange(newStatus: string) {
    if (!selectedIntern) return;
    // TODO: await fetch(`/api/interns/${selectedIntern.id}/status`, {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ status: newStatus }),
    // })
    setInternStatuses((p) => ({ ...p, [selectedIntern.id]: newStatus }));
  }

  function handleViewDoc(docKey: DocKey, _filename: string) {
    if (!selectedIntern) return;
    const url = selectedIntern.docUrls?.[docKey];
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    // TODO: fetch presigned view URL from backend then open:
    // const { url } = await fetch(`/api/interns/${selectedIntern.id}/docs/${docKey}/url`).then(r => r.json())
    // window.open(url, "_blank", "noopener,noreferrer")
  }

  function handleDownloadDoc(docKey: DocKey, filename: string) {
    if (!selectedIntern) return;
    const url = selectedIntern.docUrls?.[docKey];
    if (url) {
      const a = document.createElement("a");
      a.href = url; a.download = filename; a.click();
      return;
    }
    // TODO: fetch presigned download URL from backend then trigger download:
    // const { url } = await fetch(`/api/interns/${selectedIntern.id}/docs/${docKey}/url?download=true`).then(r => r.json())
    // const a = document.createElement("a"); a.href = url; a.download = filename; a.click()
  }

  const actionButtons: { label: string; color: string; newStatus: string }[] = [
    { label: "Verify",   color: "#10B981", newStatus: "verified" },
    { label: "Resubmit", color: "#F97316", newStatus: "pending"  },
    { label: "Reject",   color: "#EF4444", newStatus: "rejected" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F7F4F0", fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden" }}>

      {/* ── LEFT PANEL ── */}
      <div style={{ width: 320, flexShrink: 0, background: "white", borderRight: "1px solid #EFEFEF", display: "flex", flexDirection: "column", height: "100vh" }}>

        {/* Branding */}
        <div style={{ padding: "18px 20px", borderBottom: "1px solid #F3F3F3", display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg, #E8503A, #F97316)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 12, fontWeight: 900,
          }}>RL</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#1C0A00", lineHeight: 1.1, letterSpacing: "-0.01em" }}>Reagvis</div>
            <div style={{ fontSize: 9, fontWeight: 800, color: "#F97316", textTransform: "uppercase", letterSpacing: "0.14em", marginTop: 1 }}>DocPanel</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={exportCSV}
              style={{
                height: 32, padding: "0 12px", borderRadius: 8,
                fontSize: 11, fontWeight: 700, cursor: "pointer",
                border: "1.5px solid #F97316", color: "#F97316",
                background: "transparent", transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: 6,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(249,115,22,0.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <Download size={12} /> Export CSV
            </button>
            <a
              href="/"
              style={{ fontSize: 12, fontWeight: 700, color: "#B0B0B0", textDecoration: "none", transition: "color 0.15s", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#F97316"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#B0B0B0"; }}
            >
              ← Portal
            </a>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #F3F3F3" }}>
          <div style={{ position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#C0C0C0", pointerEvents: "none" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search interns..."
              style={{
                width: "100%", height: 40, boxSizing: "border-box",
                background: "#F8F8F8", border: "1.5px solid #EFEFEF", borderRadius: 11,
                paddingLeft: 36, paddingRight: 14, fontSize: 14, color: "#1C0A00",
                fontWeight: 500, outline: "none", transition: "all 0.15s",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)"; e.currentTarget.style.background = "white"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#EFEFEF"; e.currentTarget.style.background = "#F8F8F8"; }}
            />
          </div>
        </div>

        {/* Filter pills */}
        <div style={{ padding: "11px 16px", borderBottom: "1px solid #F3F3F3", display: "flex", gap: 7, flexWrap: "wrap" }}>
          {(["all", "pending", "verified", "rejected"] as const).map((f) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setSelectedIntern(null); }}
                style={{
                  padding: "5px 14px", borderRadius: 20, border: "none",
                  fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                  ...(isActive
                    ? { background: "linear-gradient(135deg, #E8503A, #F97316)", color: "white", boxShadow: "0 3px 10px rgba(249,115,22,0.30)" }
                    : { background: "#F0F0F0", color: "#888" }
                  ),
                }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "#E5E5E5"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "#F0F0F0"; }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Count */}
        <div style={{ padding: "10px 18px", fontSize: 12, color: "#B0B0B0", fontWeight: 700, letterSpacing: "0.02em" }}>
          {filteredInterns.length} interns
        </div>

        {/* Intern list */}
        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "rgba(249,115,22,0.2) transparent" }}>
          {filteredInterns.length === 0 ? (
            <div style={{ padding: "52px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#ABABAB", margin: 0 }}>No interns found</p>
              <p style={{ fontSize: 12, color: "#C8C8C8", margin: "5px 0 0" }}>Try adjusting your filters</p>
            </div>
          ) : (
            filteredInterns.map((intern) => {
              const isSelected = selectedIntern?.id === intern.id;
              const status = getStatus(intern);
              return (
                <button
                  key={intern.id}
                  onClick={() => selectIntern(intern)}
                  style={{
                    width: "100%", display: "block", textAlign: "left",
                    background: isSelected ? "rgba(249,115,22,0.07)" : "transparent",
                    border: "none", borderBottom: "1px solid #F7F7F7",
                    borderLeft: `3px solid ${isSelected ? "#F97316" : "transparent"}`,
                    paddingLeft: 14, paddingRight: 18, paddingTop: 14, paddingBottom: 14,
                    cursor: "pointer", transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "rgba(249,115,22,0.03)"; }}
                  onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, #E8503A, #F97316)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontSize: 13, fontWeight: 900,
                      boxShadow: "0 2px 8px rgba(249,115,22,0.25)",
                    }}>
                      {getInitials(intern.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 800, color: "#1C0A00", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
                        {intern.name}
                      </p>
                      <p style={{ fontSize: 12, color: "#ABABAB", fontWeight: 600, margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {intern.team}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                      <div style={{ width: 9, height: 9, borderRadius: "50%", background: getStatusDotColor(status) }} />
                      <p style={{ fontSize: 11, color: "#C8C8C8", fontWeight: 600, margin: 0 }}>{intern.submittedAt}</p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F7F4F0", overflow: "hidden" }}>

        {!selectedIntern ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <FolderIllustration />
            <h3 style={{ fontSize: 19, fontWeight: 900, color: "#1C0A00", marginTop: 20, marginBottom: 0, letterSpacing: "-0.02em" }}>
              Select an intern to review
            </h3>
            <p style={{ fontSize: 14, color: "#B0B0B0", marginTop: 6, marginBottom: 0, fontWeight: 500 }}>
              Click any name from the list on the left
            </p>
          </div>
        ) : (
          <>
            {/* Intern header */}
            <div style={{ background: "white", borderBottom: "1px solid #EFEFEF", padding: "22px 36px", flexShrink: 0, display: "flex", alignItems: "center", gap: 18, boxShadow: "0 1px 0 #EFEFEF" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                  background: "linear-gradient(135deg, #E8503A, #F97316)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontSize: 16, fontWeight: 900,
                  boxShadow: "0 4px 14px rgba(249,115,22,0.30)",
                }}>
                  {getInitials(selectedIntern.name)}
                </div>
                <div>
                  <p style={{ fontSize: 26, fontWeight: 900, color: "#1C0A00", margin: 0, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                    {selectedIntern.name}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, background: "rgba(249,115,22,0.10)", color: "#C2410C", padding: "3px 10px", borderRadius: 7 }}>
                      Team: {selectedIntern.team}
                    </span>
                    <span style={{ color: "#D8D8D8", fontSize: 14 }}>•</span>
                    <span style={{ fontSize: 12, color: "#B0B0B0", fontWeight: 600 }}>Submitted {selectedIntern.submittedAt}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
                <StatusBadge status={currentStatus} />
                <div style={{ width: 1, height: 28, background: "#E8E8E8", margin: "0 6px" }} />
                {actionButtons.map(({ label, color, newStatus }) => (
                  <button
                    key={label}
                    onClick={() => handleStatusChange(newStatus)}
                    style={{
                      height: 38, padding: "0 18px", borderRadius: 9,
                      fontSize: 13, fontWeight: 800, cursor: "pointer",
                      border: `1.5px solid ${color}`, color, background: "transparent",
                      transition: "all 0.15s", letterSpacing: "0.01em",
                    }}
                    onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = color; b.style.color = "white"; }}
                    onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.color = color; }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab bar */}
            <div style={{ background: "white", borderBottom: "2px solid #F0F0F0", padding: "0 36px", flexShrink: 0, display: "flex" }}>
              {([
                { id: "documents" as const, label: "Documents", Icon: FileText },
                { id: "details"   as const, label: "Details",   Icon: UserIcon  },
              ]).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{
                    padding: "15px 4px", marginRight: 36,
                    fontSize: 15, fontWeight: 700,
                    border: "none", borderBottom: `2px solid ${activeTab === id ? "#F97316" : "transparent"}`,
                    background: "transparent", cursor: "pointer",
                    color: activeTab === id ? "#F97316" : "#ABABAB",
                    marginBottom: -2,
                    display: "flex", alignItems: "center", gap: 9,
                    transition: "color 0.15s", letterSpacing: "-0.01em",
                  }}
                  onMouseEnter={(e) => { if (activeTab !== id) (e.currentTarget as HTMLButtonElement).style.color = "#6B7280"; }}
                  onMouseLeave={(e) => { if (activeTab !== id) (e.currentTarget as HTMLButtonElement).style.color = "#ABABAB"; }}
                >
                  <Icon size={16} />{label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
              <button
                onClick={() => setIsFullscreen(true)}
                title="Full screen"
                style={{
                  position: "absolute", top: 18, right: 36, zIndex: 10,
                  background: "white", border: "1.5px solid #E8E8E8", borderRadius: 8,
                  padding: 7, cursor: "pointer", color: "#C0C0C0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#F97316"; b.style.color = "#F97316"; }}
                onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#E8E8E8"; b.style.color = "#C0C0C0"; }}
              >
                <Maximize2 size={14} />
              </button>

              <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab + selectedIntern.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "documents"
                      ? <DocumentsTab intern={selectedIntern} onView={handleViewDoc} onDownload={handleDownloadDoc} />
                      : <DetailsTab intern={selectedIntern} />
                    }
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {isFullscreen && selectedIntern && (
          <FullscreenOverlay
            intern={selectedIntern}
            onClose={() => setIsFullscreen(false)}
            onView={handleViewDoc}
            onDownload={handleDownloadDoc}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
