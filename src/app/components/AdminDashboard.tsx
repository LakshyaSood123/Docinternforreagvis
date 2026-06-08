import { useState } from "react";
import {
  Home, Folder, Clock, CheckCircle2, XCircle, Settings,
  Search, Download, MoreVertical, ArrowRight, ArrowUpRight, ArrowDownRight,
  User as UserIcon, FileText, X, File, Bell, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InternSubmission {
  id: string;
  name: string;
  email: string;
  internId: string;
  submittedAt: string;
  docs: { govId: boolean; tenth: boolean; twelfth: boolean; sem: boolean };
  status: "pending" | "verified" | "rejected";
}

const mockSubmissions: InternSubmission[] = [
  { id: "1", name: "Arjun Mehta", email: "arjun.m@example.com", internId: "RGL-2026-0042", submittedAt: "2 hours ago", docs: { govId: true, tenth: true, twelfth: true, sem: true }, status: "pending" },
  { id: "2", name: "Priya Sharma", email: "priya.s@example.com", internId: "RGL-2026-0043", submittedAt: "5 hours ago", docs: { govId: true, tenth: true, twelfth: true, sem: true }, status: "verified" },
  { id: "3", name: "Rahul Desai", email: "rahul.d@example.com", internId: "RGL-2026-0044", submittedAt: "1 day ago", docs: { govId: true, tenth: false, twelfth: true, sem: true }, status: "rejected" },
  { id: "4", name: "Aisha Khan", email: "aisha.k@example.com", internId: "RGL-2026-0045", submittedAt: "1 day ago", docs: { govId: true, tenth: true, twelfth: true, sem: true }, status: "pending" },
  { id: "5", name: "Vikram Nair", email: "vikram.n@example.com", internId: "RGL-2026-0046", submittedAt: "2 days ago", docs: { govId: true, tenth: true, twelfth: false, sem: false }, status: "pending" },
];

export function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("All Submissions");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedIntern, setSelectedIntern] = useState<InternSubmission | null>(null);
  const [search, setSearch] = useState("");
  const [internStatuses, setInternStatuses] = useState<Record<string, InternSubmission["status"]>>({});

  const getStatus = (sub: InternSubmission) => internStatuses[sub.id] || sub.status;

  const filteredSubmissions = mockSubmissions.filter(sub => {
    const status = getStatus(sub);
    const matchesFilter = activeFilter === "All" || status === activeFilter.toLowerCase();
    const matchesSearch = !search || sub.name.toLowerCase().includes(search.toLowerCase()) || sub.internId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    total: mockSubmissions.length,
    pending: mockSubmissions.filter(s => getStatus(s) === "pending").length,
    verified: mockSubmissions.filter(s => getStatus(s) === "verified").length,
    rejected: mockSubmissions.filter(s => getStatus(s) === "rejected").length,
  };

  const navItems = [
    { name: "Dashboard", icon: Home },
    { name: "All Submissions", icon: Folder },
    { name: "Pending Review", icon: Clock, badge: String(counts.pending) },
    { name: "Verified", icon: CheckCircle2 },
    { name: "Rejected", icon: XCircle },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#FDF8F3] text-[#1C0A00]" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Sidebar */}
      <aside className="w-[240px] flex-shrink-0 flex flex-col" style={{ background: "linear-gradient(180deg, #18080A 0%, #2A1000 50%, #1C0A00 100%)" }}>
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-orange-900/40">
              RL
            </div>
            <div>
              <div className="text-white font-black text-[15px] leading-none tracking-tight">Reagvis</div>
              <div className="text-[10px] font-bold tracking-widest uppercase mt-0.5" style={{ color: "#F97316" }}>DocPanel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 py-4 flex-1 space-y-0.5">
          {navItems.map(item => {
            const isActive = activeNav === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveNav(item.name)}
                className={`w-full flex items-center justify-between px-3 h-[42px] rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? "text-[#F97316] border-l-[3px] border-[#F97316] pl-[9px]"
                    : "text-white/45 hover:text-white/80 hover:bg-white/5"
                }`}
                style={isActive ? { background: "rgba(249,115,22,0.12)" } : {}}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={16} />
                  <span>{item.name}</span>
                </div>
                {item.badge && parseInt(item.badge) > 0 && (
                  <span className="text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#D97706" }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 border-t border-white/5 pt-3">
          <button className="w-full flex items-center gap-3 px-3 h-[42px] rounded-lg text-[13px] font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all mb-3">
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/8">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs shadow-inner flex-shrink-0" style={{ background: "linear-gradient(135deg, #E8503A, #F97316)" }}>
              AD
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-white truncate">Admin User</span>
              <span className="text-[11px] text-white/40 truncate">Reagvis Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-7 max-w-6xl mx-auto">

            {/* Top bar */}
            <div className="flex items-center justify-between mb-7">
              <div>
                <div className="flex items-center gap-1.5 text-[12px] text-gray-400 font-medium mb-1">
                  <span>DocPanel</span>
                  <ChevronRight size={12} className="text-gray-300" />
                  <span className="text-gray-700 font-semibold">Submissions</span>
                </div>
                <h1 className="text-[22px] font-black text-[#1C0A00] tracking-tight">All Submissions</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or ID..."
                    className="w-[260px] h-9 pl-9 pr-4 rounded-full bg-white border border-gray-200 text-[13px] focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15 transition-all"
                  />
                </div>
                <button className="h-9 px-4 rounded-full border border-[#F97316] text-[#F97316] text-[12px] font-bold flex items-center gap-1.5 hover:bg-orange-50 transition-colors">
                  <Download size={14} />
                  Export CSV
                </button>
                <button className="relative w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all">
                  <Bell size={15} />
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E8503A] border-2 border-white" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-7">
              {[
                { label: "Total Submissions", value: counts.total, trend: "+12%", up: true, color: "#1C0A00" },
                { label: "Pending Review", value: counts.pending, trend: "-2", up: false, color: "#D97706" },
                { label: "Verified", value: counts.verified, trend: "+15%", up: true, color: "#16A34A" },
                { label: "Rejected", value: counts.rejected, trend: "+1", up: false, color: "#DC2626" },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-xl p-5 border border-orange-500/8 shadow-sm hover:shadow-md hover:border-orange-500/15 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{stat.label}</span>
                    <span className={`flex items-center gap-0.5 text-[11px] font-bold ${stat.up ? "text-emerald-600" : "text-red-500"}`}>
                      {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {stat.trend}
                    </span>
                  </div>
                  <div className="text-[30px] font-black leading-none" style={{ color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Filters + Table */}
            <div className="bg-white rounded-2xl border border-orange-500/8 shadow-sm overflow-hidden">
              {/* Filter row */}
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                {["All", "Pending", "Verified", "Rejected"].map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                      activeFilter === f
                        ? "text-white shadow-sm"
                        : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700"
                    }`}
                    style={activeFilter === f ? { background: "linear-gradient(135deg, #E8503A, #F97316)" } : {}}
                  >
                    {f}
                  </button>
                ))}
                <span className="ml-auto text-[12px] text-gray-400 font-medium">{filteredSubmissions.length} results</span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#FDFAF7]">
                      <th className="py-3 px-5 text-[10px] font-bold uppercase text-gray-400 tracking-[0.1em] w-10">#</th>
                      <th className="py-3 px-4 text-[10px] font-bold uppercase text-gray-400 tracking-[0.1em]">Intern</th>
                      <th className="py-3 px-4 text-[10px] font-bold uppercase text-gray-400 tracking-[0.1em]">Intern ID</th>
                      <th className="py-3 px-4 text-[10px] font-bold uppercase text-gray-400 tracking-[0.1em]">Submitted</th>
                      <th className="py-3 px-4 text-[10px] font-bold uppercase text-gray-400 tracking-[0.1em]">Documents</th>
                      <th className="py-3 px-4 text-[10px] font-bold uppercase text-gray-400 tracking-[0.1em]">Status</th>
                      <th className="py-3 px-5 text-[10px] font-bold uppercase text-gray-400 tracking-[0.1em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.length > 0 ? filteredSubmissions.map((sub, i) => {
                      const status = getStatus(sub);
                      const isSelected = selectedIntern?.id === sub.id;
                      return (
                        <tr
                          key={sub.id}
                          onClick={() => setSelectedIntern(isSelected ? null : sub)}
                          className={`border-b border-gray-50 last:border-0 cursor-pointer transition-colors relative ${
                            isSelected ? "bg-orange-50/60" : "hover:bg-orange-50/25"
                          }`}
                        >
                          <td className="py-4 px-5 relative">
                            {isSelected && <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r" style={{ background: "#F97316" }} />}
                            <span className="text-[12px] text-gray-400 font-medium">{i + 1}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-black flex-shrink-0" style={{ background: "linear-gradient(135deg, #F97316, #E8503A)" }}>
                                {sub.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="text-[13px] font-bold text-[#1C0A00]">{sub.name}</div>
                                <div className="text-[11px] text-gray-400">{sub.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-mono text-[11px] font-bold text-[#E8503A] bg-orange-50 px-2.5 py-1 rounded-md">
                              {sub.internId}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-[12px] text-gray-500">{sub.submittedAt}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1">
                              {[
                                { key: 'govId', label: 'GOV' },
                                { key: 'tenth', label: '10th' },
                                { key: 'twelfth', label: '12th' },
                                { key: 'sem', label: 'SEM' },
                              ].map(doc => {
                                const ok = sub.docs[doc.key as keyof typeof sub.docs];
                                return (
                                  <span
                                    key={doc.key}
                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                      ok ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"
                                    }`}
                                  >
                                    {doc.label}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {status === "pending" && (
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-[11px] font-bold border border-amber-200/60">
                                <Clock size={11} /> Pending
                              </span>
                            )}
                            {status === "verified" && (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-bold border border-emerald-200/60">
                                <CheckCircle2 size={11} /> Verified
                              </span>
                            )}
                            {status === "rejected" && (
                              <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-[11px] font-bold border border-red-200/60">
                                <XCircle size={11} /> Rejected
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="text-[12px] font-bold text-[#F97316] hover:text-[#E8503A] flex items-center gap-1 transition-colors">
                                Review <ArrowRight size={13} />
                              </button>
                              <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                                <MoreVertical size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={7} className="py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <File size={40} className="text-orange-200" />
                            <div>
                              <p className="text-[15px] font-bold text-gray-700">No submissions found</p>
                              <p className="text-[13px] text-gray-400 mt-0.5">Try adjusting your filters or search.</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Right detail panel */}
      <AnimatePresence>
        {selectedIntern && (
          <motion.aside
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 340, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="w-[300px] flex-shrink-0 bg-white border-l border-gray-100 shadow-[-12px_0_32px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden z-20"
          >
            {/* Panel header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0" style={{ background: "#FDFAF7" }}>
              <div>
                <h2 className="text-[14px] font-bold text-[#1C0A00]">Review Submission</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">{selectedIntern.internId}</p>
              </div>
              <button onClick={() => setSelectedIntern(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Profile */}
              <div className="flex flex-col items-center text-center px-5 pt-6 pb-5 border-b border-gray-100">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-black mb-3 shadow-lg shadow-orange-500/20" style={{ background: "linear-gradient(135deg, #E8503A, #F97316)" }}>
                  {selectedIntern.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-[16px] font-black text-[#1C0A00] mb-1 tracking-tight">{selectedIntern.name}</h3>
                <p className="text-[12px] text-gray-500 mb-3">{selectedIntern.email}</p>
                {(() => {
                  const s = internStatuses[selectedIntern.id] || selectedIntern.status;
                  return s === "pending"
                    ? <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-[11px] font-bold">Needs Review</span>
                    : s === "verified"
                    ? <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[11px] font-bold">Verified</span>
                    : <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-[11px] font-bold">Rejected</span>;
                })()}
                <p className="text-[11px] text-gray-400 mt-2">Submitted {selectedIntern.submittedAt}</p>
              </div>

              {/* Docs */}
              <div className="px-5 py-5 border-b border-gray-100">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Documents</h4>
                <div className="space-y-2">
                  {[
                    { key: 'govId', label: 'Government ID', icon: UserIcon },
                    { key: 'tenth', label: '10th Marksheet', icon: FileText },
                    { key: 'twelfth', label: '12th Marksheet', icon: FileText },
                    { key: 'sem', label: 'Latest Semester', icon: FileText },
                  ].map(doc => {
                    const ok = selectedIntern.docs[doc.key as keyof typeof selectedIntern.docs];
                    const Icon = doc.icon;
                    return (
                      <div
                        key={doc.key}
                        className={`flex items-center justify-between p-3 rounded-xl ${
                          ok ? "bg-white border border-gray-100" : "bg-gray-50 border border-dashed border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ok ? "bg-orange-50 text-[#F97316]" : "bg-gray-100 text-gray-400"}`}>
                            <Icon size={14} />
                          </div>
                          <div>
                            <p className={`text-[12px] font-semibold ${ok ? "text-gray-800" : "text-gray-400"}`}>{doc.label}</p>
                            {!ok && <p className="text-[10px] text-gray-400">Not uploaded</p>}
                          </div>
                        </div>
                        {ok && (
                          <div className="flex items-center gap-1.5">
                            <button className="text-[11px] font-bold text-[#F97316] hover:text-[#E8503A] transition-colors">View</button>
                            <span className="text-gray-200">|</span>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors"><Download size={12} /></button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 py-5 space-y-2 border-b border-gray-100">
                <button
                  onClick={() => setInternStatuses(p => ({ ...p, [selectedIntern.id]: "verified" }))}
                  className="w-full h-10 rounded-xl text-white text-[13px] font-bold transition-all hover:brightness-110 shadow-[0_4px_12px_rgba(249,115,22,0.25)]"
                  style={{ background: "linear-gradient(135deg, #E8503A, #F97316)" }}
                >
                  ✓ Verify All Documents
                </button>
                <button
                  onClick={() => setInternStatuses(p => ({ ...p, [selectedIntern.id]: "pending" }))}
                  className="w-full h-10 rounded-xl border border-[#F97316]/60 text-[#F97316] text-[13px] font-bold hover:bg-orange-50 transition-colors"
                >
                  Request Resubmission
                </button>
                <button
                  onClick={() => setInternStatuses(p => ({ ...p, [selectedIntern.id]: "rejected" }))}
                  className="w-full h-10 rounded-xl border border-red-200 text-red-600 text-[13px] font-bold hover:bg-red-50 transition-colors"
                >
                  Reject Submission
                </button>
              </div>

              {/* Notes */}
              <div className="px-5 py-5">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Internal Notes</h4>
                <textarea
                  className="w-full h-20 rounded-xl border border-gray-200 p-3 text-[12px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15 resize-none mb-2 transition-all"
                  placeholder="Add a note about this submission..."
                />
                <button className="text-[11px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors">
                  Save Note
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Nav pill */}
      <a
        href="/"
        className="fixed bottom-4 right-4 bg-black/75 text-white text-[11px] px-3.5 py-2 rounded-full hover:bg-black transition-colors z-50 font-semibold tracking-wide shadow-xl"
      >
        ← View Intern Portal
      </a>
    </div>
  );
}
