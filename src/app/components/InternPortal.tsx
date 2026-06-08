import { useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  FileUp,
  Lock,
  ShieldCheck,
  User,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type Phase = "name" | "opening" | "open";

interface DocRequired {
  id: string;
  name: string;
  hint: string;
  icon: LucideIcon;
  formats: string;
  maxSizeMB: number;
}

interface FormData {
  name: string;
  email: string;
  team: string;
}

// ── Validation ────────────────────────────────────────────────────────────────

const ALLOWED_MIME = new Set(["application/pdf", "image/jpeg", "image/png"]);

// Accepts Latin + Devanagari + common Unicode letters; spaces, hyphens, apostrophes, dots
const NAME_RE = /^[\p{L}][\p{L}\s'.,-]{0,58}[\p{L}]$|^[\p{L}]{1,2}$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TEAM_RE = /^[\p{L}0-9][\p{L}0-9 _-]{0,48}[\p{L}0-9]$|^[\p{L}0-9]{1,2}$/u;

function validateName(v: string): string {
  const t = v.trim();
  if (!t) return "Full name is required";
  if (t.length < 2) return "Must be at least 2 characters";
  if (t.length > 60) return "Must be 60 characters or fewer";
  if (!NAME_RE.test(t)) return "Only letters, spaces, hyphens and apostrophes allowed";
  return "";
}

function validateEmail(v: string): string {
  const t = v.trim();
  if (!t) return "Email address is required";
  if (t.length > 254) return "Email is too long";
  if (!EMAIL_RE.test(t)) return "Enter a valid email (e.g. name@company.com)";
  return "";
}

function validateTeam(v: string): string {
  const t = v.trim();
  if (!t) return "Team name is required";
  if (t.length < 2) return "Must be at least 2 characters";
  if (t.length > 50) return "Must be 50 characters or fewer";
  if (!TEAM_RE.test(t)) return "Only letters, numbers, spaces and hyphens allowed";
  return "";
}

function validateFile(file: File, maxMB: number): string {
  if (!ALLOWED_MIME.has(file.type)) return "Only PDF, JPG or PNG files are accepted";
  if (file.size < 1024) return "File appears to be empty or corrupted";
  if (file.size > maxMB * 1024 * 1024) return `File must be under ${maxMB} MB`;
  return "";
}

// ── End Validation ─────────────────────────────────────────────────────────────

const TAB_PATH =
  "M 0,44 L 0,14 Q 0,2 12,2 L 220,2 Q 232,2 236,8 C 248,20 244,38 258,44 Z";

const ACCENT = "#F97316";
const ACCENT_DARK = "#C2410C";
const INK = "#1C0A00";
const MUTED = "#8B2D05";
const SURFACE = "#FFFCF8";
const BORDER = "rgba(249,115,22,0.18)";

function BrandMark() {
  return (
    <img
      src="/reagvis-logo.png"
      alt="Reagvis Labs"
      className="h-11 w-11 rounded-xl object-cover shadow-lg shadow-orange-500/20 ring-1 ring-white/60"
    />
  );
}

function NameEntry({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState("");
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const nameError = touched ? validateName(name) : "";
  const canSubmit = !validateName(name);
  const labelIsLifted = focused || name.length > 0;

  const submit = () => {
    setTouched(true);
    if (canSubmit) {
      onSubmit(name.trim());
    }
  };

  return (
    <motion.section
      key="name-entry"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 w-full max-w-[480px]"
    >
      <div style={{ filter: "drop-shadow(0px 22px 44px rgba(23,32,42,0.13)) drop-shadow(0px 6px 14px rgba(23,32,42,0.09))", overflow: "visible" }}>
        {/* Folder tab */}
        <svg
          viewBox="0 0 680 44"
          preserveAspectRatio="none"
          width="100%"
          height="44"
          style={{ display: "block", marginBottom: -1 }}
        >
          <defs>
            <linearGradient id="nameEntryTab" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ACCENT} />
              <stop offset="100%" stopColor={ACCENT_DARK} />
            </linearGradient>
          </defs>
          <path d={TAB_PATH} fill="url(#nameEntryTab)" />
          <text
            x="118"
            y="30"
            textAnchor="middle"
            fill="rgba(255,255,255,0.95)"
            fontSize="12.5"
            fontWeight="800"
            letterSpacing="0.14em"
            fontFamily="'Plus Jakarta Sans', 'Manrope', sans-serif"
          >
            DOCUMENTS
          </text>
        </svg>

        {/* Folder body */}
        <div style={{ borderRadius: "0 18px 18px 18px", background: SURFACE, border: `1.5px solid ${BORDER}`, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ borderBottom: `1px solid rgba(249,115,22,0.10)`, padding: "20px 24px 18px" }}>
            <div className="mb-4 flex items-center gap-3">
              <BrandMark />
              <div>
                <p className="portal-display text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: `${MUTED}99` }}>
                  Reagvis Labs
                </p>
                <p className="portal-display text-[18px] font-black tracking-tight" style={{ color: INK }}>
                  Intern onboarding
                </p>
              </div>
            </div>
            <h2 className="portal-display text-[22px] font-black tracking-tight" style={{ color: INK }}>
              Welcome, Intern
            </h2>
            <p className="mt-1 text-[14px] font-medium" style={{ color: `${MUTED}B3` }}>
              Tell us your name and we'll open your document folder
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5 px-6 py-6">
          <div>
            <div
              className="relative rounded-2xl border bg-white/95 transition-colors"
              style={{
                borderColor: focused ? ACCENT : BORDER,
                boxShadow: focused
                  ? "0 0 0 4px rgba(249,115,22,0.16), 0 8px 28px rgba(249,115,22,0.12)"
                  : "0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <User size={18} color={focused ? ACCENT : "#D1A882"} />
                <div className="relative min-h-[44px] flex-1">
                  <motion.label
                    htmlFor="intern-name"
                    className="pointer-events-none absolute left-0 top-0 origin-left text-[14px] font-semibold"
                    animate={{
                      y: labelIsLifted ? -1 : 12,
                      scale: labelIsLifted ? 0.78 : 1,
                      color: focused ? ACCENT : "rgba(139,69,5,0.55)",
                    }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                  >
                    Full name
                  </motion.label>
                  <input
                    id="intern-name"
                    type="text"
                    value={name}
                    autoFocus
                    onFocus={() => setFocused(true)}
                    onBlur={() => { setFocused(false); setTouched(true); }}
                    onChange={(event) => { setName(event.target.value); if (touched) { /* error recomputes from state */ } }}
                    maxLength={60}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        submit();
                      }
                    }}
                    className="h-[44px] w-full bg-transparent pt-4 text-[15px] font-semibold text-[#1C0A00] outline-none"
                    style={{ caretColor: ACCENT }}
                  />
                </div>
                <AnimatePresence>
                  {canSubmit && (
                    <motion.div
                      key="name-valid"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.16 }}
                    >
                      <CheckCircle2 size={18} color="#148F5A" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <AnimatePresence>
              {nameError && (
                <motion.p
                  key="name-error"
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -4, height: 0 }}
                  transition={{ duration: 0.16 }}
                  className="mt-2 text-[11px] font-semibold text-red-500"
                >
                  {nameError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={submit}
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl text-[14px] font-bold text-white transition-all"
            style={{
              background: canSubmit || !touched
                ? "linear-gradient(135deg, #C2410C, #E8503A, #F97316)"
                : "rgba(249,115,22,0.35)",
              boxShadow: canSubmit ? "0 8px 24px -4px rgba(249,115,22,0.45)" : "none",
            }}
          >
            Open my folder
            <ArrowRight size={16} />
          </button>

          <p className="text-center text-[12px] text-[#8B2D05]/60">
            Press Enter to continue.
          </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function PaperSlip({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      className="absolute flex flex-col"
      style={{
        left: "50%",
        top: "42%",
        width: 44,
        height: 58,
        background: "white",
        borderRadius: 3,
        zIndex: 20,
        pointerEvents: "none",
        border: "1px solid rgba(23,32,42,0.10)",
        gap: 5,
        padding: "10px 8px",
        boxShadow: "0 8px 18px rgba(23,32,42,0.14)",
      }}
      initial={{ opacity: 1, y: 0, x: "-50%", scale: 1, rotate: 0 }}
      animate={{ opacity: 0, y: -190, x: "-58%", scale: 0.24, rotate: -8 }}
      transition={{ duration: 0.48, ease: [0.4, 0, 0.8, 1] }}
      onAnimationComplete={onDone}
    >
      {[0, 1, 2].map((line) => (
        <div
          key={line}
          style={{
            height: 2,
            width: line === 2 ? "64%" : "100%",
            background: "rgba(23,32,42,0.16)",
            borderRadius: 1,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: ACCENT,
        }}
      />
    </motion.div>
  );
}

function SealPulse({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="seal-pulse"
          className="pointer-events-none absolute flex h-14 w-14 items-center justify-center rounded-full border border-[#148F5A]/40"
          style={{ top: -5, left: 208, zIndex: 15 }}
          initial={{ opacity: 0, scale: 0.65 }}
          animate={{ opacity: [0, 1, 0], scale: [0.65, 1, 1.35] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div className="h-3 w-3 rounded-full bg-[#148F5A]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FolderContainer({
  phase,
  internName,
  isSealed,
  sealedLabel,
  showSealPulse,
  tabJiggle,
  paperSlip,
  children,
}: {
  phase: Phase;
  internName: string;
  isSealed: boolean;
  sealedLabel: boolean;
  showSealPulse: boolean;
  tabJiggle: boolean;
  paperSlip: ReactNode;
  children: ReactNode;
}) {
  const folderIsOpen = phase === "open" || phase === "opening";
  const coverIsClosed = !folderIsOpen;
  const coverAnimation = {
    rotateX: coverIsClosed ? 0 : -154,
    opacity: coverIsClosed ? 1 : 0,
  };
  const coverTransition = {
    rotateX: {
      type: "spring" as const,
      stiffness: isSealed ? 78 : 9,
      damping: isSealed ? 18 : 7,
    },
    opacity: {
      duration: isSealed ? 0.24 : 1.1,
      delay: isSealed ? 0.22 : 0.3,
    },
  };

  return (
    <motion.div
      key="folder-container"
      initial={{ opacity: 0, scale: 0.97, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -12 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      style={{
        width: "100%",
        maxWidth: "680px",
        margin: "0 auto",
        filter:
          "drop-shadow(0px 22px 44px rgba(23,32,42,0.13)) drop-shadow(0px 6px 14px rgba(23,32,42,0.09))",
        overflow: "visible",
      }}
    >
      <div style={{ perspective: "1100px", position: "relative", zIndex: 3 }}>
        <motion.div
          style={{
            transformOrigin: "center bottom",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          animate={coverAnimation}
          transition={coverTransition}
        >
          <svg
            viewBox="0 0 680 44"
            preserveAspectRatio="none"
            width="100%"
            height="44"
            style={{ display: "block", marginBottom: -1 }}
          >
            <defs>
              <linearGradient id="folderTab" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A83200" />
                <stop offset="45%" stopColor="#D04A28" />
                <stop offset="100%" stopColor="#F07010" />
              </linearGradient>
            </defs>
            <path d={TAB_PATH} fill="url(#folderTab)" />
            <text
              x="118"
              y="26"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.92)"
              fontSize="9"
              fontWeight="700"
              letterSpacing="1.8"
              fontFamily="Plus Jakarta Sans, Manrope, system-ui, sans-serif"
            >
              {sealedLabel ? "SUBMITTED" : "ONBOARDING FILE"}
            </text>
            {isSealed && (
              <g transform="translate(240, 22)">
                <circle r="10" fill="#148F5A" />
                <path
                  d="M -4.5 0.2 L -1 3.4 L 5 -3.2"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}
          </svg>
        </motion.div>

        <AnimatePresence>
          {tabJiggle && (
            <motion.div
              key="tab-flash"
              className="pointer-events-none absolute left-0 top-0 h-[44px] w-full"
              initial={{ opacity: 0.32 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              <svg viewBox="0 0 680 44" preserveAspectRatio="none" width="100%" height="44">
                <path d={TAB_PATH} fill="rgba(255,255,255,0.20)" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        <SealPulse show={showSealPulse} />
      </div>

      {/* Body — single visual box: container carries the white bg, cover flips over it */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          perspective: "1100px",
          width: "100%",
          boxSizing: "border-box",
          borderRadius: "0 18px 18px 18px",
          background: "rgba(255,252,248,1)",
          border: `1.5px solid ${BORDER}`,
          overflow: "hidden",
        }}
      >
        {/* Orange cover — flips backward when folder opens */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 4,
            width: "100%",
            maxWidth: "100%",
            borderRadius: "0 18px 18px 18px",
            transformOrigin: "center bottom",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            overflow: "hidden",
          }}
          animate={coverAnimation}
          transition={coverTransition}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(155deg, #C84010 0%, #D85020 25%, #E06828 50%, #E87830 75%, #F08838 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.11), rgba(23,32,42,0.10))",
            }}
          />
          <AnimatePresence>
            {phase === "opening" && (
              <motion.div
                key="opening-label"
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Lock size={30} strokeWidth={1.6} color="rgba(255,255,255,0.72)" />
                <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/75">
                  Opening file
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Orange backing — fills blank while cover is rotating away, fades out as form appears */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 1,
            borderRadius: "0 18px 18px 18px",
            background: "linear-gradient(155deg, #C84010 0%, #D85020 25%, #E06828 50%, #E87830 75%, #F08838 100%)",
          }}
          animate={{ opacity: phase === "open" ? 0 : 1 }}
          transition={{ duration: 0.55, delay: phase === "open" ? 0.05 : 0 }}
        />

        {/* Form content — fades in after cover lifts, no scale so it fills the container exactly */}
        <motion.div
          className="relative"
          style={{ zIndex: 3, width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
          animate={{ opacity: phase === "open" ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <div className="border-b border-orange-100/70 px-7 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="portal-display text-[12px] font-bold uppercase tracking-[0.12em] text-[#8B2D05]/60">
                  Onboarding file
                </p>
                <h2 className="portal-display mt-1 text-[18px] font-black text-[#1C0A00]">
                  {internName}
                </h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-orange-200/70 bg-orange-50/70 px-3 py-1.5 text-[12px] font-semibold text-[#C2410C]">
                <Lock size={13} />
                Secured
              </div>
            </div>
          </div>
          {children}
        </motion.div>

        {paperSlip}
      </div>
    </motion.div>
  );
}

export function InternPortal() {
  const [phase, setPhase] = useState<Phase>("name");
  const [internName, setInternName] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", team: "" });
  const [step1Errors, setStep1Errors] = useState({ name: "", email: "", team: "" });
  const [step1Touched, setStep1Touched] = useState({ name: false, email: false, team: false });

  const touchAndValidate = (field: "name" | "email" | "team", value: string) => {
    setStep1Touched((prev) => ({ ...prev, [field]: true }));
    const err =
      field === "name" ? validateName(value) :
      field === "email" ? validateEmail(value) :
      validateTeam(value);
    setStep1Errors((prev) => ({ ...prev, [field]: err }));
  };
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});
  const [flyingDocId, setFlyingDocId] = useState<string | null>(null);
  const [tabJiggle, setTabJiggle] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const [sealedLabel, setSealedLabel] = useState(false);
  const [showSealPulse, setShowSealPulse] = useState(false);
  const [submissionId] = useState(() => Math.floor(Math.random() * 9000 + 1000));

  const docsRequired: DocRequired[] = [
    { id: "gov_id", name: "Government ID", hint: "Aadhaar / Passport / Voter ID", icon: User, formats: "PDF, JPG, PNG", maxSizeMB: 5 },
    { id: "10th", name: "10th Marksheet", hint: "Board certificate or marksheet", icon: FileText, formats: "PDF, JPG, PNG", maxSizeMB: 5 },
    { id: "12th", name: "12th Marksheet", hint: "Board certificate or marksheet", icon: FileText, formats: "PDF, JPG, PNG", maxSizeMB: 5 },
    { id: "sem", name: "Latest Semester Marksheet", hint: "Most recent semester result", icon: FileUp, formats: "PDF, JPG, PNG", maxSizeMB: 5 },
  ];

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const doc = docsRequired.find((d) => d.id === id)!;
    const err = validateFile(file, doc.maxSizeMB);
    if (err) {
      alert(err);
      e.target.value = "";
      return;
    }
    // TODO: attach `file` to FormData / upload to backend here
    handleUpload(id);
  };

  const handleNameSubmit = (name: string) => {
    setInternName(name);
    setFormData((previous) => ({ ...previous, name }));
    setPhase("opening");
    setTimeout(() => setPhase("open"), 1500);
  };

  const handleUpload = (id: string) => {
    if (uploadedDocs[id] || flyingDocId) {
      return;
    }

    setFlyingDocId(id);
  };

  const handlePaperDone = (id: string) => {
    setUploadedDocs((previous) => ({ ...previous, [id]: true }));
    setFlyingDocId(null);
    setTabJiggle(true);
    setTimeout(() => setTabJiggle(false), 300);
  };

  const removeDoc = (id: string) => {
    setUploadedDocs((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
  };

  const handleFinalSubmit = () => {
    setStep(3);
    setTimeout(() => {
      setIsSealed(true);
      setTimeout(() => {
        setShowSealPulse(true);
        setSealedLabel(true);
        setTimeout(() => setShowSealPulse(false), 900);
      }, 400);
    }, 300);
  };

  const uploadCount = Object.keys(uploadedDocs).length;
  const allUploaded = uploadCount === docsRequired.length;

  return (
    <div
      className="portal-font-scope relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10"
      style={{
        background:
          "linear-gradient(145deg, #FFF7ED 0%, #FFE2BC 24%, #FFC47B 58%, #FF9F3F 100%)",
      }}
    >
      <PortalBackground />

      <AnimatePresence mode="wait">
        {phase === "name" ? (
          <NameEntry key="name" onSubmit={handleNameSubmit} />
        ) : (
          <motion.main
            key="portal-shell"
            className="relative z-10 flex w-full max-w-[680px] flex-col items-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <header className="mb-5 flex w-full items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BrandMark />
                <div>
                  <p className="portal-display text-[13px] font-bold uppercase tracking-[0.12em] text-[#8B2D05]/70">
                    Reagvis Labs
                  </p>
                  <h1 className="portal-display text-[24px] font-black tracking-tight text-[#1C0A00]">
                    Intern onboarding
                  </h1>
                </div>
              </div>
            </header>

            <FolderContainer
              phase={phase}
              internName={internName}
              isSealed={isSealed}
              sealedLabel={sealedLabel}
              showSealPulse={showSealPulse}
              tabJiggle={tabJiggle}
              paperSlip={
                flyingDocId ? (
                  <PaperSlip key={flyingDocId} onDone={() => handlePaperDone(flyingDocId)} />
                ) : null
              }
            >
              <div className="px-7 py-6" style={{ width: "100%", boxSizing: "border-box" }}>
                <div className="relative mb-8 flex items-start justify-between px-1">
                  {/* Track */}
                  <div className="absolute left-[22px] right-[22px] top-[20px] h-[2px] rounded-full bg-orange-100/80" />
                  {/* Animated fill */}
                  <motion.div
                    className="absolute left-[22px] top-[20px] h-[2px] rounded-full"
                    style={{ background: "linear-gradient(90deg, #C2410C, #F97316)" }}
                    animate={{ width: step === 1 ? "0%" : step === 2 ? "calc(50% + 0px)" : "calc(100% - 44px)" }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  />
                  {[
                    { num: 1, label: "Details" },
                    { num: 2, label: "Documents" },
                    { num: 3, label: "Submitted" },
                  ].map((stepItem) => {
                    const isActive = step === stepItem.num;
                    const isCompleted = step > stepItem.num;

                    return (
                      <div key={stepItem.num} className="relative flex flex-col items-center gap-2.5">
                        <div className="relative flex h-[42px] w-[42px] items-center justify-center">
                          {/* Pulse ring on active */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              style={{ border: "2px solid rgba(249,115,22,0.45)" }}
                              animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                            />
                          )}
                          <motion.div
                            className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-[13px] font-bold"
                            animate={{
                              background: isCompleted || isActive
                                ? ["linear-gradient(135deg,#C2410C,#F97316)"]
                                : [SURFACE],
                            }}
                            style={{
                              background: isCompleted || isActive
                                ? "linear-gradient(135deg, #C2410C, #F97316)"
                                : SURFACE,
                              border: isCompleted || isActive ? "none" : `2px solid rgba(249,115,22,0.20)`,
                              color: isCompleted || isActive ? "white" : "rgba(139,45,5,0.38)",
                              boxShadow: isActive
                                ? "0 0 0 5px rgba(249,115,22,0.14), 0 4px 14px rgba(194,65,12,0.28)"
                                : isCompleted
                                ? "0 2px 8px rgba(194,65,12,0.18)"
                                : "none",
                            }}
                          >
                            {isCompleted ? <CheckCircle2 size={16} strokeWidth={2.5} /> : stepItem.num}
                          </motion.div>
                        </div>
                        <span
                          className="text-[11px] font-bold tracking-wide"
                          style={{
                            color: isActive ? INK : isCompleted ? ACCENT_DARK : "rgba(139,45,5,0.35)",
                          }}
                        >
                          {stepItem.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="min-h-[320px]">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Full name" error={step1Touched.name ? step1Errors.name : ""}>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(event) => {
                                const v = event.target.value;
                                setFormData((p) => ({ ...p, name: v }));
                                if (step1Touched.name) setStep1Errors((p) => ({ ...p, name: validateName(v) }));
                              }}
                              onBlur={() => touchAndValidate("name", formData.name)}
                              className={`portal-input${step1Touched.name && step1Errors.name ? " error" : ""}`}
                              placeholder=""
                              maxLength={60}
                            />
                          </Field>
                          <Field label="Email address" error={step1Touched.email ? step1Errors.email : ""}>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(event) => {
                                const v = event.target.value;
                                setFormData((p) => ({ ...p, email: v }));
                                if (step1Touched.email) setStep1Errors((p) => ({ ...p, email: validateEmail(v) }));
                              }}
                              onBlur={() => touchAndValidate("email", formData.email)}
                              className={`portal-input${step1Touched.email && step1Errors.email ? " error" : ""}`}
                              placeholder=""
                              maxLength={254}
                            />
                          </Field>
                        </div>
                        <Field label="Team Name" error={step1Touched.team ? step1Errors.team : ""}>
                          <input
                            type="text"
                            value={formData.team}
                            onChange={(event) => {
                              const v = event.target.value;
                              setFormData((p) => ({ ...p, team: v }));
                              if (step1Touched.team) setStep1Errors((p) => ({ ...p, team: validateTeam(v) }));
                            }}
                            onBlur={() => touchAndValidate("team", formData.team)}
                            className={`portal-input${step1Touched.team && step1Errors.team ? " error" : ""}`}
                            placeholder=""
                            maxLength={50}
                          />
                        </Field>
                        <div className="pt-2">
                          <PrimaryButton
                            disabled={false}
                            onClick={() => {
                              const errors = {
                                name: validateName(formData.name),
                                email: validateEmail(formData.email),
                                team: validateTeam(formData.team),
                              };
                              setStep1Errors(errors);
                              setStep1Touched({ name: true, email: true, team: true });
                              if (errors.name || errors.email || errors.team) return;
                              setStep(2);
                            }}
                          >
                            Continue
                            <ArrowRight size={16} />
                          </PrimaryButton>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                      >
                        {docsRequired.map((doc, index) => {
                          const isUploaded = uploadedDocs[doc.id];
                          const isFlying = flyingDocId === doc.id;
                          const Icon = doc.icon;

                          return (
                            <motion.div
                              key={doc.id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.04 }}
                              className="flex w-full items-center justify-between rounded-xl border px-4 py-3 transition-colors"
                              style={{
                                borderColor: isUploaded ? "rgba(20,143,90,0.32)" : "rgba(249,115,22,0.22)",
                                background: isUploaded ? "rgba(20,143,90,0.055)" : "rgba(255,255,255,0.78)",
                              }}
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div
                                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md"
                                  style={{
                                    background: isUploaded ? "rgba(20,143,90,0.10)" : "rgba(249,115,22,0.10)",
                                    color: isUploaded ? "#148F5A" : ACCENT,
                                  }}
                                >
                                  {isUploaded ? <ShieldCheck size={20} /> : <Icon size={20} />}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="truncate text-[14px] font-semibold text-[#17202A]">
                                    {doc.name}
                                  </h4>
                                  <p
                                    className="mt-0.5 truncate text-[12px]"
                                    style={{ color: isUploaded ? "#148F5A" : MUTED }}
                                  >
                                    {isUploaded ? "Uploaded" : doc.hint}
                                  </p>
                                  {!isUploaded && (
                                    <p className="mt-0.5 text-[11px] text-[#8B2D05]/40">
                                      {doc.formats} · max {doc.maxSizeMB} MB
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="ml-4 flex flex-shrink-0 items-center gap-3">
                                {isUploaded ? (
                                  <>
                                    <span className="hidden max-w-[112px] truncate text-[12px] font-medium text-[#667085] sm:inline">
                                      {doc.id}_doc.pdf
                                    </span>
                                    <CheckCircle2 size={17} color="#148F5A" />
                                    <button
                                      type="button"
                                      onClick={() => removeDoc(doc.id)}
                                      className="text-[12px] font-medium text-[#8A1F11] transition-colors hover:text-[#65150B]"
                                    >
                                      Remove
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <input
                                      ref={(el) => { fileInputRefs.current[doc.id] = el; }}
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      className="hidden"
                                      onChange={(e) => handleFileChange(doc.id, e)}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => fileInputRefs.current[doc.id]?.click()}
                                      disabled={Boolean(flyingDocId)}
                                      className="rounded-full border border-orange-300/60 bg-orange-50 px-3 py-2 text-[12px] font-bold text-[#C2410C] transition-colors hover:bg-orange-100 disabled:cursor-wait disabled:opacity-50"
                                    >
                                      {isFlying ? "Filing" : "Choose file"}
                                    </button>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}

                        <div className="pb-1 pt-3">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-[12px] font-medium text-[#667085]">
                              {uploadCount} of {docsRequired.length} uploaded
                            </span>
                            <span className="text-[12px] font-semibold text-[#17202A]">
                              {Math.round((uploadCount / docsRequired.length) * 100)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-orange-100">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: "linear-gradient(90deg, #E8503A, #F97316, #FB923C)" }}
                              animate={{
                                width: `${(uploadCount / docsRequired.length) * 100}%`,
                              }}
                              transition={{ duration: 0.36, ease: "easeOut" }}
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <PrimaryButton disabled={!allUploaded} onClick={handleFinalSubmit}>
                            Submit documents
                            <ArrowRight size={16} />
                          </PrimaryButton>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.24 }}
                        className="flex flex-col items-center justify-center py-5 text-center"
                      >
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF7F1] text-[#148F5A]">
                          <CheckCircle2 size={34} />
                        </div>
                        <h2 className="portal-display text-[24px] font-black tracking-tight text-[#1C0A00]">
                          Submission received
                        </h2>
                        <p className="mt-2 max-w-md text-[14px] leading-6 text-[#8B2D05]/70">
                          {internName}, your documents have been filed. Verification is usually
                          completed within 24 hours.
                        </p>

                        <div className="mt-7 w-full max-w-sm rounded-xl border border-orange-100 bg-orange-50/40 p-4 text-left">
                          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8B2D05]/60">
                            Filed documents
                          </p>
                          <ul className="space-y-2.5">
                            {docsRequired.map((doc) => (
                              <li key={doc.id} className="flex items-center justify-between gap-4">
                                <span className="text-[13px] font-semibold text-[#1C0A00]">
                                  {doc.name}
                                </span>
                                <CheckCircle2 size={15} color="#148F5A" />
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-5 rounded-full border border-orange-200/60 bg-white/70 px-4 py-2 text-[12px] font-bold tracking-[0.06em] text-[#C2410C] shadow-sm backdrop-blur-sm">
                          #RGL-{submissionId}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <footer className="flex flex-col items-center justify-between gap-3 border-t border-orange-100/60 bg-orange-50/40 px-7 py-4 sm:flex-row">
                <p className="text-[12px] font-medium text-[#8B2D05]/60">
                  Need help?{" "}
                  <a
                    href="mailto:info@reagvis.com"
                    className="font-semibold text-[#C2410C] underline underline-offset-2"
                  >
                    info@reagvis.com
                  </a>
                </p>
              </footer>
            </FolderContainer>
          </motion.main>
        )}
      </AnimatePresence>

      <a
        href="/admin"
        className="fixed bottom-4 right-4 z-50 rounded-full bg-black/75 px-3.5 py-2 text-[11px] font-semibold tracking-wide text-white shadow-xl transition-colors hover:bg-black"
      >
        Admin dashboard
      </a>
    </div>
  );
}

function Field({ label, children, error }: { label: string; children: ReactNode; error?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.06em] text-[#8B2D05]/60">
        {label}
      </span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            key="field-error"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.16 }}
            className="mt-1.5 text-[11px] font-semibold text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </label>
  );
}

function PrimaryButton({
  disabled,
  onClick,
  children,
}: {
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl text-[14px] font-bold tracking-wide text-white transition-all hover:brightness-110 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
      style={{
        background: "linear-gradient(135deg, #E8503A, #F97316)",
        boxShadow: disabled ? "none" : "0 8px 24px -4px rgba(249,115,22,0.45)",
      }}
    >
      {children}
    </button>
  );
}

function PortalBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,45,5,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(139,45,5,0.035) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.78), rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.12))",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.24]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.48) 0px, rgba(255,255,255,0.48) 1px, transparent 1px, transparent 18px)",
        }}
      />
      <div
        className="pointer-events-none absolute -right-[12%] -top-[18%] h-[130%] w-[48%] rotate-[15deg] border-l border-white/30 bg-white/12 shadow-[inset_1px_0_rgba(255,255,255,0.22)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.26), rgba(249,115,22,0.10) 58%, rgba(194,65,12,0.14))",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-[28%] -left-[18%] h-[62%] w-[58%] -rotate-[12deg] border-t border-white/25 bg-white/10"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))",
        }}
      />
      <svg
        className="pointer-events-none absolute left-[4%] top-[10%] hidden h-[230px] w-[260px] text-[#8B2D05]/10 md:block"
        viewBox="0 0 260 230"
        fill="none"
      >
        <path
          d="M34 72 H86 C96 72 102 78 108 88 H223 C234 88 243 97 243 108 V187 C243 202 231 214 216 214 H42 C27 214 15 202 15 187 V91 C15 80 23 72 34 72 Z"
          fill="rgba(255,255,255,0.14)"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M42 112 H211"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.65"
        />
        <path
          d="M64 132 H177 M64 154 H198 M64 176 H151"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.48"
        />
        <path
          d="M54 48 H172 C182 48 190 56 190 66 V88"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.36"
        />
        <circle cx="209" cy="168" r="15" stroke="currentColor" strokeWidth="3" opacity="0.42" />
        <path
          d="M202 168 L207 173 L217 160"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.42"
        />
      </svg>
      <svg
        className="pointer-events-none absolute bottom-[8%] right-[7%] hidden h-[190px] w-[260px] text-[#8B2D05]/10 lg:block"
        viewBox="0 0 260 190"
        fill="none"
      >
        <path
          d="M16 60 H92 C100 60 104 66 109 74 H244 V158 C244 169 235 178 224 178 H28 C17 178 8 169 8 158 V76 C8 67 14 60 16 60 Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M28 92 H224 M28 118 H194 M28 144 H210" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <svg
        className="pointer-events-none absolute right-[18%] top-[12%] hidden h-[110px] w-[110px] text-white/22 md:block"
        viewBox="0 0 110 110"
        fill="none"
      >
        <path d="M18 24 H78 L92 38 V86 H18 V24 Z" stroke="currentColor" strokeWidth="2" />
        <path d="M78 24 V39 H92" stroke="currentColor" strokeWidth="2" />
        <path d="M34 55 H76 M34 70 H68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </>
  );
}
