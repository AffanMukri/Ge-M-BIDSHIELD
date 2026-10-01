import React, { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Command,
  Copy,
  Eye,
  EyeOff,
  FileBarChart,
  FileSearch,
  FileText,
  GitBranch,
  GitCompareArrows,
  HelpCircle,
  History,
  KeyRound,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  UserRoundCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { AnimatedGroup, InView, TextEffect } from "./motionPrimitives";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { apex, bidders, complianceRules, organizationDocuments, providers, suspiciousSecurityResult, tenders } from "./data";
import { Check } from "./types";
import { appendAuditEvent, useAuditEvents } from "./services/audit.store";
import { ComplianceCoverage, DecisionReplayTimeline, EvidenceNexus, MissingItemsPanel } from "./evidenceFeatures";
import { ruleImpact, ruleTests } from "./evidence.data";
import { AuditorWorkspace } from "./AuditorWorkspace";
import {
  EvidenceDrawer,
  Metric,
  Progress,
  SourceMode,
  StatusPill,
  SecurityPill,
  tone,
} from "./components";
type Page =
  | "dashboard"
  | "tenders"
  | "tender"
  | "bidder"
  | "nexus"
  | "verification"
  | "rules"
  | "comparison"
  | "decision"
  | "audit"
  | "auditor"
  | "integrations";
function downloadFile(name: string, content: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
const navGroups = [
  { label: "Workspace", items: [
    ["dashboard", "Command Center", LayoutDashboard],
    ["tenders", "Tenders", FileText],
    ["bidder", "Attention & Bidders", Users],
    ["verification", "Verification Center", ShieldCheck],
  ] },
  { label: "Intelligence", items: [
    ["nexus", "Evidence Nexus", GitBranch],
    ["rules", "Rule Studio", BookOpen],
    ["comparison", "Compliance Matrix", GitCompareArrows],
  ] },
  { label: "Governance", items: [
    ["decision", "Decision & Replay", UserRoundCheck],
    ["audit", "Audit & Evidence", History],
  ] },
  { label: "System", items: [
    ["integrations", "Integration Health", Activity],
  ] },
] as const;
const pageLabels: Record<Page, string> = {
  dashboard: "Command Center", tenders: "Tenders", tender: "Case File CPCL/PROC/2026/041",
  bidder: "Apex Industrial Systems", nexus: "Evidence Nexus", verification: "Verification",
  rules: "Compliance Rules", comparison: "Comparison", decision: "Decision & Replay",
  audit: "Audit Ledger", auditor: "Auditor Workspace", integrations: "Integrations",
};
export default function App() {
  const [entered, setEntered] = useState(false);
  const [role, setRole] = useState<"officer" | "bidder" | null>(null);
  const [page, setPage] = useState<Page>("dashboard");
  const [evidence, setEvidence] = useState<Check | null>(null);
  const [toast, setToast] = useState("");
  const [query, setQuery] = useState("");
  const [palette, setPalette] = useState(false);
  const [assistant, setAssistant] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [clarificationResponded, setClarificationResponded] = useState(false);
  const go = (p: Page) => {
    setPage(p);
    setMobile(false);
    scrollTo(0, 0);
  };
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (role === "officer" && (e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    addEventListener("keydown", f);
    return () => removeEventListener("keydown", f);
  }, [role]);
  const flash = (s: string) => {
    setToast(s);
    setTimeout(() => setToast(""), 2600);
  };
  if (!entered) return <Hero onEnter={() => setEntered(true)} />;
  if (!role)
    return <Login onLogin={setRole} onBack={() => setEntered(false)} />;
  if (role === "bidder")
    return (
      <BidderPortal
        logout={() => setRole(null)}
        responded={clarificationResponded}
        onRespond={() => setClarificationResponded(true)}
      />
    );
  return (
    <div className={"app " + (sidebarCollapsed ? "sidebar-is-collapsed" : "")}>
      <a className="skip" href="#main-content">
        Skip to main content
      </a>
      <div className="govbar">
        <span>à¤­à¤¾à¤°à¤¤ à¤¸à¤°à¤•à¤¾à¤° Â· Government of India</span>
        <span>
          Ministry of Petroleum & Natural Gas <i /> Chennai Petroleum
          Corporation Limited
        </span>
        <span>Aâˆ’ A A+ã€€EnglishâŒ„ã€€Help</span>
      </div>
      <div className="work">
        <aside className={"sidebar " + (mobile ? "open " : "") + (sidebarCollapsed ? "collapsed" : "")}>
          <div className="brand">
            <div className="brandmark">B</div>
            <div>
              <b>BidShield</b>
              <span>Compliance Intelligence</span>
            </div>
            <button className="mobile-close" onClick={() => setMobile(false)} aria-label="Dismiss navigation">
              <XCircle />
            </button>
            <button className="sidebar-toggle" onClick={() => setSidebarCollapsed((value) => !value)} aria-label={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"} title={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}>
              {sidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </button>
          </div>
          <nav>
            {navGroups.map((group) => (
              <div className="nav-group" key={group.label}>
                <span className="nav-group-label">{group.label}</span>
                {group.items.map(([id, label, Icon]) => (
                  <button className={page === id ? "active" : ""} onClick={() => go(id)} key={id} title={sidebarCollapsed ? label : undefined} aria-label={id === "nexus" ? "Open Evidence Nexus workspace" : undefined} aria-current={page === id ? "page" : undefined}>
                    <Icon /><span>{label}</span>
                    {id === "verification" && <em>5</em>}
                    {id === "dashboard" && clarificationResponded && <em>1</em>}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="side-bottom">
            <button className="health" onClick={() => go("integrations")}>
              <i />
              <div>
                <b>12/13 sources available</b>
                <span>1 source degraded</span>
              </div>
              <ArrowRight />
            </button>
            <div className="user">
              <div className="avatar">AK</div>
              <div>
                <b>A. Krishnan</b>
                <span>Procurement Officer</span>
              </div>
              <button
                className="logout-mini"
                onClick={() => setRole(null)}
                title="Sign out"
              >
                <LogOut />
              </button>
            </div>
          </div>
        </aside>
        <main id="main-content">
          <header className="topbar">
            <button className="menubtn" onClick={() => setMobile(true)}>
              <Menu />
            </button>
            <div className="breadcrumb-bar">
              <span>Procurement archive</span>
              <b>{pageLabels[page]}</b>
            </div>
            <button className="globalsearch" onClick={() => setPalette(true)}>
              <Search />
              <span>Search tender, bidder, GSTIN, evidence or ruleâ€¦</span>
              <kbd>Ctrl K</kbd>
            </button>
            <button className="source-health-chip" title="Open integration health" onClick={() => go("integrations")}>
              <i /> 12/13 sources
            </button>
            <div className="role-chip">
              <UserRoundCheck /> A. Krishnan
            </div>
            <div className="topactions">
              <button title="Activity" onClick={() => go("audit")}>
                <Activity />
              </button>
              <button
                title="Notifications"
                className="hasdot"
                onClick={() =>
                  flash(
                    clarificationResponded
                      ? "1 bidder response is ready for review"
                      : "3 verification events Â· 2 deadlines approaching",
                  )
                }
              >
                <Bell />
              </button>
              <button title="Help" onClick={() => setAssistant(true)}>
                <HelpCircle />
              </button>
            </div>
          </header>
          <div className="content" key={page}>
            {page === "dashboard" && (
              <Dashboard
                go={go}
                open={setEvidence}
                responded={clarificationResponded}
              />
            )}{" "}
            {page === "tenders" && (
              <Tenders go={go} query={query} setQuery={setQuery} />
            )}{" "}
            {page === "tender" && (
              <TenderRoom go={go} open={setEvidence} flash={flash} />
            )}{" "}
            {page === "bidder" && (
              <Bidder open={setEvidence} go={go} flash={flash} />
            )}{" "}
            {page === "nexus" && <><PageHead eyebrow="BidShield EVIDENCE NEXUS" title="Evidence lineage" sub="Trace every finding to its rule, documents, sources, comparisons and accountable human action."/><EvidenceNexus/></>}{" "}
            {page === "verification" && (
              <Verification open={setEvidence} flash={flash} />
            )}{" "}
            {page === "rules" && <RuleStudio flash={flash} />}{" "}
            {page === "comparison" && <Comparison open={setEvidence} />}{" "}
            {page === "decision" && (
              <DecisionReplay
                go={go}
                flash={flash}
                responded={clarificationResponded}
              />
            )}{" "}
            {page === "audit" && <Audit go={go} />}{" "}
            {page === "auditor" && <AuditorWorkspace />}{" "}
            {page === "integrations" && <Integrations flash={flash} />}
          </div>
        </main>
      </div>
      <button
        className="assistant-fab"
        onClick={() => setAssistant(!assistant)}
      >
        <Sparkles /> Compliance Assistant
      </button>
      {assistant && (
        <Assistant
          close={() => setAssistant(false)}
          open={() => setEvidence(apex.checks[3])}
        />
      )}
      <EvidenceDrawer
        check={evidence}
        onClose={() => setEvidence(null)}
        onOpenGraph={() => {setEvidence(null);go('nexus')}}
        onAction={(a) => {
          flash(a + " Â· Audit event recorded");
          setEvidence(null);
        }}
      />
      {palette && <Palette go={go} close={() => setPalette(false)} />}{" "}
      {toast && (
        <div className="toast">
          <CheckCircle2 />
          {toast}
        </div>
      )}
    </div>
  );
}
function Hero({ onEnter }: { onEnter: () => void }) {
  const [demo, setDemo] = useState(false);
  const [active, setActive] = useState(0);
  const stages = [
    [
      "01",
      "Tender-aware rules",
      "Convert tender clauses into officer-approved, structured compliance conditions.",
      BookOpen,
    ],
    [
      "02",
      "Evidence verification",
      "Connect documents, extracted values and clearly labelled provider responses.",
      ShieldCheck,
    ],
    [
      "03",
      "Explainable findings",
      "Show exactly what differs, why it matters and what action is permitted.",
      GitCompareArrows,
    ],
    [
      "04",
      "Human decision",
      "Keep the authorized procurement officer accountable for every final outcome.",
      UserRoundCheck,
    ],
  ] as const;
  const scroll = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <div className="hero-page">
      <a className="skip" href="#hero-main">
        Skip to main content
      </a>
      <div className="hero-gov">
        <span>à¤­à¤¾à¤°à¤¤ à¤¸à¤°à¤•à¤¾à¤° Â· Government of India</span>
        <span>Ministry of Petroleum & Natural Gas Â· CPCL</span>
        <div>
          <button
            onClick={() =>
              alert(
                "Accessibility controls: high contrast and scalable text are supported.",
              )
            }
          >
            Accessibility
          </button>
          <button
            onClick={() =>
              alert(
                "Language selector is available in the authenticated prototype.",
              )
            }
          >
            EnglishâŒ„
          </button>
        </div>
      </div>
      <header className="hero-nav">
        <button className="hero-logo" onClick={() => scroll("hero-main")}>
          <span>B</span>
          <div>
            <b>BidShield</b>
            <small>Integrated Bid Compliance Intelligence</small>
          </div>
        </button>
        <nav>
          <button onClick={() => scroll("platform")}>Platform</button>
          <button onClick={() => scroll("workflow")}>How it works</button>
          <button onClick={() => scroll("trust")}>Trust & security</button>
        </nav>
        <button className="hero-signin" onClick={onEnter}>
          Open secure workspace <ArrowRight />
        </button>
      </header>
      <main id="hero-main">
        <section className="hero-main">
          <div className="hero-copy">
            <span className="hero-kicker">
              <i /> Problem Statement 26100 Â· Smart Automation
            </span>
            <h1>
              Every bid decision,
              <br />
              <em>traceable to evidence.</em>
            </h1>
            <p>
              BidShield connects tender rules, bidder documents, verification
              sources and accountable human reviewâ€”so government procurement
              teams can act with clarity, consistency and confidence.
            </p>
            <div className="hero-actions">
              <button onClick={onEnter}>
                <LockKeyhole /> Enter secure demo <ArrowRight />
              </button>
              <button onClick={() => setDemo(true)}>
                <Play /> See the workflow
              </button>
            </div>
            <div className="hero-proof">
              <div>
                <ShieldCheck />
                <span>
                  <b>Evidence-first</b>Every finding has provenance
                </span>
              </div>
              <div>
                <UserRoundCheck />
                <span>
                  <b>Human-controlled</b>No automated qualification
                </span>
              </div>
              <div>
                <History />
                <span>
                  <b>Audit-ready</b>Replay every decision
                </span>
              </div>
            </div>
          </div>
          <div className="hero-product">
            <div className="product-top">
              <span>
                <i /> BIDDER EVALUATION Â· LIVE DEMO
              </span>
              <span>12/13 sources available</span>
            </div>
            <div className="product-body">
              <div className="product-side">
                <b>B</b>
                {[
                  LayoutDashboard,
                  FileText,
                  ShieldCheck,
                  GitCompareArrows,
                  History,
                ].map((I, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i % 4)}
                    className={i === active ? "active" : ""}
                  >
                    <I />
                  </button>
                ))}
              </div>
              <div className="product-view">
                <span className="eyebrow">OFFICER ATTENTION QUEUE</span>
                <h2>What needs attention now</h2>
                <div className="product-metrics">
                  <span>
                    <b>5</b>Needs review
                  </span>
                  <span>
                    <b>2</b>Clarifications
                  </span>
                  <span>
                    <b>7</b>Decision ready
                  </span>
                </div>
                <button className="product-alert" onClick={() => setDemo(true)}>
                  <AlertTriangle />
                  <span>
                    <b>OEM authorization validity</b>Apex Industrial Systems Â·
                    Technical Clause 7.4
                  </span>
                  <em>Review evidence</em>
                  <ArrowRight />
                </button>
                <div className="product-trace">
                  <span>Tender clause</span>
                  <i />
                  <span>Evidence</span>
                  <i />
                  <span>Finding</span>
                  <i />
                  <span>Officer decision</span>
                </div>
                <div className="product-evidence">
                  <div>
                    <small>SUBMITTED</small>
                    <b>Valid until 14 Dec 2026</b>
                  </div>
                  <div>
                    <small>CONTRACT PERIOD</small>
                    <b>Through 31 Mar 2027</b>
                  </div>
                  <span className="pill warn">
                    <AlertTriangle /> Review
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="hero-platform" id="platform">
          <div className="section-intro">
            <span className="eyebrow">ONE TRUSTED EVIDENCE CHAIN</span>
            <h2>Built for both sides of public procurement</h2>
            <p>
              Different workspaces, shared facts and a single auditable record.
            </p>
          </div>
          <div className="portal-pair">
            <button onClick={onEnter}>
              <div className="portal-icon officer">
                <ShieldCheck />
              </div>
              <span>GOVERNMENT WORKSPACE</span>
              <h3>See what requires attentionâ€”and why.</h3>
              <p>
                Prioritize exceptions, inspect rule-level evidence, manage
                clarifications and record defensible human decisions.
              </p>
              <ul>
                <li>Officer attention queue</li>
                <li>Tender Rule Studio</li>
                <li>Evidence and decision replay</li>
              </ul>
              <b>
                Explore officer workspace <ArrowRight />
              </b>
            </button>
            <button onClick={onEnter}>
              <div className="portal-icon seller">
                <BriefcaseBusiness />
              </div>
              <span>BIDDER / SELLER WORKSPACE</span>
              <h3>Know exactly what to do next.</h3>
              <p>
                Understand requirements, run ReadyCheck, manage documents and
                respond through controlled clarification cases.
              </p>
              <ul>
                <li>Submission ReadyCheck</li>
                <li>Plain-language requirements</li>
                <li>Immutable response receipts</li>
              </ul>
              <b>
                Explore bidder workspace <ArrowRight />
              </b>
            </button>
          </div>
        </section>
        <section className="hero-workflow" id="workflow">
          <div className="section-intro">
            <span className="eyebrow">FROM CLAUSE TO ACCOUNTABILITY</span>
            <h2>A transparent verification journey</h2>
          </div>
          <div className="workflow-tabs">
            {stages.map(([n, t, d, I], i) => (
              <button
                className={active === i ? "active" : ""}
                onClick={() => setActive(i)}
                key={n}
              >
                <span>{n}</span>
                <I />
                <div>
                  <b>{t}</b>
                  <small>{d}</small>
                </div>
                <ArrowRight />
              </button>
            ))}
          </div>
          <div className="workflow-detail">
            <div>
              <span className="eyebrow">INTERACTIVE TRACE</span>
              <h3>{stages[active][1]}</h3>
              <p>{stages[active][2]}</p>
              <button onClick={onEnter}>
                Open this workflow <ArrowRight />
              </button>
            </div>
            <div className="trace-chain">
              {[
                "Tender",
                "Clause",
                "Rule",
                "Evidence",
                "Source",
                "Finding",
                "Decision",
              ].map((x, i) => (
                <React.Fragment key={x}>
                  <button onClick={() => setDemo(true)}>
                    {x}
                    <small>{i < 5 ? "Verified" : "Human"}</small>
                  </button>
                  {i < 6 && <i />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>
        <section className="hero-trust" id="trust">
          <div>
            <span className="eyebrow">
              DESIGNED FOR RESPONSIBLE GOVERNMENT AI
            </span>
            <h2>Automation with visible boundaries.</h2>
            <p>
              Mock sources stay labelled. Outages remain pendingâ€”not
              non-compliant. AI suggestions never replace the authorized
              officer.
            </p>
          </div>
          <div className="trust-grid">
            <span>
              <LockKeyhole />
              <b>Role-based access</b>Officer and seller data remain separated.
            </span>
            <span>
              <Archive />
              <b>Evidence snapshots</b>Source, timestamp, confidence and hash
              retained.
            </span>
            <span>
              <Activity />
              <b>Source awareness</b>MOCK, CACHED, MANUAL and UNAVAILABLE are
              explicit.
            </span>
            <span>
              <History />
              <b>Decision replay</b>Reconstruct what was known at the time.
            </span>
          </div>
        </section>
        <section className="hero-cta">
          <span className="eyebrow">
            INTERACTIVE PROTOTYPE Â· SYNTHETIC DATA
          </span>
          <h2>See transparent bid evaluation in action.</h2>
          <p>
            Choose the Procurement Officer or Bidder workspace. Demo credentials
            are provided on the next screen.
          </p>
          <button onClick={onEnter}>
            Enter BidShield <ArrowRight />
          </button>
        </section>
      </main>
      <footer className="hero-footer">
        <div className="hero-logo">
          <span>B</span>
          <div>
            <b>BidShield</b>
            <small>Integrated Bid Compliance Intelligence</small>
          </div>
        </div>
        <span>Prototype for SIH Â· No live government integrations</span>
        <button onClick={() => scroll("hero-main")}>Back to top â†‘</button>
      </footer>
      {demo && (
        <div className="demo-modal" role="dialog" aria-modal="true">
          <div>
            <header>
              <div>
                <span className="eyebrow">90-SECOND PRODUCT STORY</span>
                <h2>From tender rule to human decision</h2>
              </div>
              <button onClick={() => setDemo(false)} aria-label="Close">
                <X />
              </button>
            </header>
            <div className="demo-path">
              {[
                "Tender uploaded",
                "31 rules extracted",
                "Evidence verified",
                "2 exceptions found",
                "Clarification issued",
                "Officer decides",
              ].map((x, i) => (
                <div key={x}>
                  <i>{i < 3 ? "âœ“" : i + 1}</i>
                  <span>{x}</span>
                </div>
              ))}
            </div>
            <div className="demo-focus">
              <ShieldCheck />
              <div>
                <b>Evidenceâ€”not an opaque score</b>
                <p>
                  Open Technical Clause 7.4, compare the submitted OEM expiry
                  with the expected contract period, then issue a controlled
                  clarification.
                </p>
              </div>
            </div>
            <footer>
              <button onClick={() => setDemo(false)}>Continue exploring</button>
              <button onClick={onEnter}>
                Enter interactive demo <ArrowRight />
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
function Login({
  onLogin,
  onBack,
}: {
  onLogin: (r: "officer" | "bidder") => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<"officer" | "bidder">("officer");
  const [show, setShow] = useState(false);
  const creds = {
    officer: {
      id: "officer@cpcl.demo",
      pass: "Officer@2026",
      title: "Procurement Officer",
      sub: "Evaluate bids, verify evidence and record decisions.",
      Icon: ShieldCheck,
    },
    bidder: {
      id: "apex@bidder.demo",
      pass: "Bidder@2026",
      title: "Bidder / Seller",
      sub: "Manage submissions, documents and clarifications.",
      Icon: BriefcaseBusiness,
    },
  };
  const c = creds[selected];
  const C = c.Icon;
  return (
    <div className="loginpage">
      <div className="login-gov">
        <span>à¤­à¤¾à¤°à¤¤ à¤¸à¤°à¤•à¤¾à¤°</span>
        <b>Government of India</b>
        <i /> Ministry of Petroleum & Natural Gas <i /> Chennai Petroleum
        Corporation Limited
      </div>
      <section className="login-story">
        <div className="loginbrand">
          <div className="brandmark">B</div>
          <div>
            <b>BidShield</b>
            <span>Integrated Bid Compliance Intelligence</span>
          </div>
        </div>
        <div className="storycopy">
          <span className="eyebrow">GOVERNMENT PROCUREMENT INTELLIGENCE</span>
          <TextEffect>Evidence before judgment.</TextEffect>
          <p>
            Integrated bid compliance verification built for traceability,
            review and accountable decision-making.
          </p>
          <div className="trace-visual">
            <div>
              <FileText />
              <span>Tender rule</span>
            </div>
            <i />
            <div>
              <Archive />
              <span>Evidence</span>
            </div>
            <i />
            <div>
              <ShieldCheck />
              <span>Verification</span>
            </div>
            <i />
            <div>
              <UserRoundCheck />
              <span>Decision</span>
            </div>
          </div>
        </div>
        <div className="logintrust">
          <ShieldCheck />
          <span>
            <b>Protected government system</b> Â· Role-based access Â· All
            activity is audited
          </span>
        </div>
      </section>
      <section className="loginbox">
        <div className="loginpanel">
          <button className="back-home" onClick={onBack}>
            â† Back to overview
          </button>
          <span className="securetag">
            <LockKeyhole /> Authorised access only
          </span>
          <h2>Welcome to BidShield</h2>
          <p>Select a demo role to enter its dedicated workspace.</p>
          <div className="rolecards">
            {(["officer", "bidder"] as const).map((r) => {
              const x = creds[r],
                I = x.Icon;
              return (
                <button
                  className={selected === r ? "selected" : ""}
                  onClick={() => setSelected(r)}
                  key={r}
                >
                  <I />
                  <div>
                    <b>{x.title}</b>
                    <span>{x.sub}</span>
                  </div>
                  <i>{selected === r ? "âœ“" : ""}</i>
                </button>
              );
            })}
          </div>
          <div className="demo-creds">
            <div className="demohead">
              <span>DEMO CREDENTIALS</span>
              <span>Auto-filled for prototype access</span>
            </div>
            <label>
              Employee ID / Email
              <div>
                <UserRoundCheck />
                <input readOnly value={c.id} />
                <Copy />
              </div>
            </label>
            <label>
              Password
              <div>
                <KeyRound />
                <input
                  readOnly
                  type={show ? "text" : "password"}
                  value={c.pass}
                />
                <button onClick={() => setShow(!show)}>
                  {show ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </label>
          </div>
          <button className="loginbtn" onClick={() => onLogin(selected)}>
            Continue as {c.title}
            <ArrowRight />
          </button>
          <div className="loginor">
            <span>or continue using</span>
          </div>
          <div className="sso">
            <button onClick={() => onLogin("officer")}>
              NIC / Gov Identity
            </button>
            <button onClick={() => onLogin("bidder")}>GeM SSO</button>
          </div>
          <p className="securitynote">
            This is a demonstration environment using synthetic data. Never
            enter real credentials or procurement information.
          </p>
        </div>
        <div className="loginhelp">
          <span>Need help accessing your account?</span>
          <button
            onClick={() =>
              alert("Demo support: support@BidShield.demo Â· Reference AUTH-HELP")
            }
          >
            Contact system administrator
          </button>
        </div>
      </section>
    </div>
  );
}
function BidderPortal({
  logout,
  responded,
  onRespond,
}: {
  logout: () => void;
  responded: boolean;
  onRespond: () => void;
}) {
  const [tab, setTab] = useState<
    | "home"
    | "ready"
    | "requirements"
    | "submission"
    | "clarification"
    | "profile"
  >("home");
  const [toast, setToast] = useState("");
  const [fixed, setFixed] = useState(false);
  const [missingOpen, setMissingOpen] = useState(false);
  const notify = (s: string) => {
    setToast(s);
    setTimeout(() => setToast(""), 2500);
  };
  const docs = [
    ["GST Registration Certificate", "GST-01.pdf", "Verified"],
    ["PAN Card", "PAN-01.pdf", "Verified"],
    [
      "OEM Authorization",
      fixed ? "OEM-Renewed.pdf" : "OEM-04.pdf",
      fixed ? "Updated" : "Action required",
    ],
    ["Local Content Certificate", "LC-03.pdf", "Review"],
    ["EPFO Registration", "EPFO-01.pdf", "Source pending"],
  ];
  const portalNav = [
    ["home", "Overview", LayoutDashboard],
    ["ready", "ReadyCheck", CheckCircle2],
    ["requirements", "Requirements", BookOpen],
    ["submission", "Documents", FileText],
    ["clarification", "Clarifications", MessageSquareText],
    ["profile", "Organisation profile", BriefcaseBusiness],
  ] as const;
  return (
    <div className="bidportal">
      <div className="govbar">
        <span>à¤­à¤¾à¤°à¤¤ à¤¸à¤°à¤•à¤¾à¤° Â· Government of India</span>
        <span>BidShield Seller Workspace Â· Secure submission portal</span>
        <span>Supportã€€EnglishâŒ„</span>
      </div>
      <header className="bidtop">
        <div className="loginbrand">
          <div className="brandmark">B</div>
          <div>
            <b>BidShield</b>
            <span>Bidder Workspace</span>
          </div>
        </div>
        <div className="biduser">
          <Bell />
          <div className="avatar">AI</div>
          <div>
            <b>Apex Industrial Systems</b>
            <span>GEM/SYN/260041</span>
          </div>
          <button onClick={logout}>
            <LogOut />
          </button>
        </div>
      </header>
      <aside className="bidnav" aria-label="Bidder workspace navigation">
        <div className="bidnav-title"><span className="eyebrow">SELLER WORKSPACE</span><b>Features</b></div>
        <nav>
          {portalNav.map(([id, label, Icon]) => (
            <button
              className={tab === id ? "active" : ""}
              aria-current={tab === id ? "page" : undefined}
              onClick={() => { setTab(id); scrollTo(0, 0); }}
              key={id}
            >
              <Icon />
              <span>{label}</span>
              {id === "clarification" && !responded && <i>1</i>}
            </button>
          ))}
        </nav>
        <div className="bidnav-help"><ShieldCheck /><span><b>Secure workspace</b>All actions are audit-tracked</span></div>
      </aside>
      <main className="bidcontent">
        {tab === "home" && (
          <>
            <div className="bidwelcome">
              <div>
                <span className="eyebrow">
                  SELLER WORKSPACE Â· SYNTHETIC DEMO
                </span>
                <h1>Good morning, Apex Industrial Systems</h1>
                <p>
                  {responded
                    ? "Your clarification response has been received and is awaiting officer review."
                    : "Your submission requires two actions before the next deadline."}
                </p>
              </div>
              <button onClick={() => setTab("submission")}>
                Review submission <ArrowRight />
              </button>
              <button className="secondary" onClick={() => setMissingOpen(true)}>
                What do I need to fix?
              </button>
            </div>
            <div className={responded ? "bidalert resolved" : "bidalert"}>
              {responded ? <CheckCircle2 /> : <AlertTriangle />}
              <div>
                <b>
                  {responded
                    ? "Response received Â· Receipt RCP-041-2026-118"
                    : "Action required before 02 Oct 2026, 17:00 IST"}
                </b>
                <span>
                  {responded
                    ? "The officer has been notified. Your response and renewed evidence are now immutable."
                    : "Respond to the OEM authorization clarification to keep your submission review on schedule."}
                </span>
              </div>
              <button onClick={() => setTab("clarification")}>
                {responded ? "View receipt" : "Respond now"}
              </button>
            </div>
            <div className="bidmetrics">
              <Metric
                label="Submission readiness"
                value={fixed ? "94%" : "87%"}
                detail={
                  fixed ? "1 item needs attention" : "2 items need attention"
                }
              />
              <Metric
                label="Documents submitted"
                value="18/19"
                detail="1 renewal requested"
              />
              <Metric
                label="Verification checks"
                value="19/24"
                detail="Government-source checks"
              />
              <Metric
                label="Open clarifications"
                value={responded ? "0" : "1"}
                detail={responded ? "Response received" : "Due in 2 days"}
              />
            </div>
            <div className="bidgrid">
              <section className="panel bidtender">
                <div className="panelhead">
                  <div>
                    <span className="eyebrow">ACTIVE PARTICIPATION</span>
                    <h2>Industrial Safety Valves Procurement</h2>
                  </div>
                  <span className="tag">Under evaluation</span>
                </div>
                <div className="tenderfacts">
                  <div>
                    <span>Tender ID</span>
                    <b>CPCL/PROC/2026/041</b>
                  </div>
                  <div>
                    <span>Submission reference</span>
                    <b>BID/SYN/041-06</b>
                  </div>
                  <div>
                    <span>Evaluation stage</span>
                    <b>Technical compliance</b>
                  </div>
                  <div>
                    <span>Last updated</span>
                    <b>29 Sep Â· 10:42</b>
                  </div>
                </div>
                <div className="readiness">
                  <div>
                    <b>Decision readiness</b>
                    <span>
                      Information completenessâ€”not a qualification result
                    </span>
                  </div>
                  <strong>87%</strong>
                  <Progress value={87} />
                </div>
                <div className="bidsteps">
                  {[
                    "Bid submitted",
                    "Documents received",
                    "Verification in progress",
                    "Clarification",
                    "Officer decision",
                  ].map((s, i) => (
                    <div
                      className={i < 2 ? "done" : i === 2 ? "current" : ""}
                      key={s}
                    >
                      <i>{i < 2 ? "âœ“" : i + 1}</i>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </section>
              <section className="panel nextactions">
                <div className="panelhead">
                  <h2>Your next actions</h2>
                  <span>2 items</span>
                </div>
                <button onClick={() => setTab("clarification")}>
                  <div className="actionicon urgent">
                    <MessageSquareText />
                  </div>
                  <div>
                    <b>Renew OEM authorization</b>
                    <span>Current certificate ends before contract period</span>
                    <small>Due 02 Oct 2026</small>
                  </div>
                  <ArrowRight />
                </button>
                <button onClick={() => setTab("submission")}>
                  <div className="actionicon">
                    <FileText />
                  </div>
                  <div>
                    <b>Confirm local content value</b>
                    <span>Declared 57% Â· certificate extracted 54%</span>
                    <small>No threshold failure indicated</small>
                  </div>
                  <ArrowRight />
                </button>
              </section>
            </div>
          </>
        )}
        {tab === "ready" && (
          <ReadyCheck
            fixed={fixed}
            onFix={() => {
              setFixed(true);
              notify("Renewed OEM document attached Â· ReadyCheck recalculated");
            }}
            onSubmit={() =>
              notify("Submission frozen Â· Manifest MAN-26041-V3 generated")
            }
          />
        )}
        {tab === "requirements" && <RequirementExplainer />}
        {tab === "submission" && (
          <>
            <PageHead
              eyebrow="BID/SYN/041-06"
              title="My submission"
              sub="Industrial Safety Valves Procurement Â· Submitted 24 Sep 2026"
            >
              <button onClick={() => notify("Submission receipt downloaded")}>
                <Archive /> Download receipt
              </button>
            </PageHead>
            <div className="submission-layout">
              <section className="panel documents">
                <div className="panelhead">
                  <div>
                    <h2>Required documents</h2>
                    <span className="muted">
                      18 of 19 received Â· changes remain audit-tracked
                    </span>
                  </div>
                  <button onClick={() => {appendAuditEvent({user:'Apex bidder',type:'DOCUMENT_UPLOADED',description:'Bidder opened secure document upload',tenderId:'CPCL/PROC/2026/041',bidderId:'apex',referenceId:'UPLOAD-041'});notify("Upload accepted Â· security analysis queued")}}>
                    <UploadCloud /> Upload document
                  </button>
                </div>
                <div className="vault-intro"><div><span className="eyebrow">ORGANIZATION DOCUMENT VAULT</span><b>Suggested existing evidence</b><small>Reuse only after your confirmation. BidShield never attaches documents automatically.</small></div><span>{organizationDocuments.length} reusable documents</span></div>
                {organizationDocuments.slice(0,3).map(doc=><div className="docrow vaultrow" key={doc.documentId}><div className="docicon"><FileText/></div><div><b>{doc.type}</b><span>{doc.fileName} Â· {doc.issuer} Â· last used {doc.lastUsed}</span></div><SecurityPill status={doc.securityStatus}/><button onClick={()=>{appendAuditEvent({user:'Apex bidder',type:'DOCUMENT_REUSED',description:`Existing ${doc.type} selected for tender`,documentId:doc.documentId,tenderId:'CPCL/PROC/2026/041',bidderId:'apex',referenceId:doc.documentId});notify(`${doc.fileName} selected Â· confirmation recorded`)}}>Use Existing Document</button></div>)}
                <div className="requirement-match"><b>Smart requirement matching</b><span><CheckCircle2/> GST Registration â€” satisfied by GST-01.pdf Â· Verified 28 Sep 2026 <button onClick={()=>notify('GST-01.pdf opened')}>View</button></span><span><AlertTriangle/> OEM Authorization â€” no suitable current document found <button onClick={()=>notify('Secure upload opened')}>Upload Required Evidence</button></span><span><AlertTriangle/> Local Content â€” LC-03.pdf found; potential mismatch <button onClick={()=>notify('LC-03.pdf opened for review')}>Review Before Reuse</button></span></div>
                <div className="bidder-security-note"><ShieldAlert/><div><b>Document requires technical review.</b><span>The machine-readable content does not fully match the rendered document.</span></div><button onClick={()=>notify('Clean replacement upload opened')}>Upload clean replacement</button></div>
                {docs.map((d, i) => (
                  <div className="docrow" key={d[0]}>
                    <div className="docicon">
                      <FileText />
                    </div>
                    <div>
                      <b>{d[0]}</b>
                      <span>{d[1]} Â· PDF Â· Secure document</span>
                    </div>
                    <span className={"docstate s" + i}>{d[2]}</span>
                    <button onClick={() => notify(`${d[0]} opened securely`)}>
                      View
                    </button>
                  </div>
                ))}
              </section>
              <aside className="panel coverage">
                <span className="eyebrow">EVIDENCE COVERAGE</span>
                <h2>Submission health</h2>
                <div className="coverage-ring">
                  <strong>87%</strong>
                  <span>ready</span>
                </div>
                {[
                  ["Identity & statutory", 100],
                  ["Technical", 82],
                  ["Financial", 100],
                  ["Local content", 91],
                  ["Labour compliance", 72],
                ].map((x) => (
                  <div className="coverline" key={x[0]}>
                    <span>{x[0]}</span>
                    <b>{x[1]}%</b>
                    <Progress value={Number(x[1])} />
                  </div>
                ))}
                <p>
                  Readiness indicates information coverage only. Final
                  evaluation remains with the Procurement Officer.
                </p>
              </aside>
            </div>
          </>
        )}
        {tab === "clarification" && (
          <>
            <PageHead
              eyebrow="SECURE COMMUNICATION"
              title="Clarifications"
              sub="Respond with evidence while preserving the complete communication history."
            />
            <div className="clarify-layout">
              <section className="panel clarify-list">
                <button
                  className="active"
                  onClick={() => notify("Clarification CLR-26041-03 opened")}
                >
                  <span className="rank high">High</span>
                  <div>
                    <b>OEM authorization validity</b>
                    <span>CPCL/PROC/2026/041</span>
                    <small>Due 02 Oct Â· 17:00 IST</small>
                  </div>
                </button>
                <button
                  onClick={() =>
                    notify("Resolved clarification history opened")
                  }
                >
                  <span className="rank medium">Closed</span>
                  <div>
                    <b>Legal entity name variation</b>
                    <span>Resolved 28 Sep 2026</span>
                  </div>
                </button>
              </section>
              <section className="panel clarify-thread">
                <div className="threadhead">
                  <div>
                    <span className="eyebrow">CLARIFICATION CLR-26041-03</span>
                    <h2>OEM authorization validity</h2>
                  </div>
                  <span className={responded ? "pill good" : "pill warn"}>
                    {responded ? <CheckCircle2 /> : <Clock3 />}{" "}
                    {responded ? "Response received" : "Response due"}
                  </span>
                </div>
                <div className="officermsg">
                  <div className="avatar">AK</div>
                  <div>
                    <b>Procurement Evaluation Cell</b>
                    <span>28 Sep 2026 Â· 14:18 IST</span>
                    <p>
                      The submitted OEM authorization expires on 14 Dec 2026,
                      before the expected contract execution period ending 31
                      Mar 2027. Please provide renewed authorization or a
                      supporting OEM confirmation referencing this tender.
                    </p>
                    <small>
                      References: Technical Clause 7.4 Â· Evidence
                      EV-26041-OEM-0088
                    </small>
                  </div>
                </div>
                {responded ? (
                  <div className="receipt-card">
                    <CheckCircle2 />
                    <div>
                      <span className="eyebrow">
                        IMMUTABLE RESPONSE RECEIPT
                      </span>
                      <h3>Response received successfully</h3>
                      <p>Renewed OEM Authorization Â· OEM-Renewed.pdf</p>
                      <b>RCP-041-2026-118 Â· 29 Sep 2026, 11:24 IST</b>
                    </div>
                    <button
                      onClick={() => notify("Clarification receipt downloaded")}
                    >
                      Download receipt
                    </button>
                  </div>
                ) : (
                  <div className="replybox">
                    <div className="guardrail">
                      <ShieldCheck />
                      <span>
                        <b>Clarification guardrail</b> Your response must
                        address the stated issue and must not alter the
                        substance of the submitted bid.
                      </span>
                    </div>
                    <label>
                      Your response
                      <textarea
                        placeholder="Provide a concise factual response for the evaluation officerâ€¦"
                        defaultValue="Please find attached the renewed OEM authorization valid through 31 March 2027."
                      />
                    </label>
                    <button
                      className="attach"
                      onClick={() => notify("Attachment selector opened")}
                    >
                      <UploadCloud /> Attach supporting evidence{" "}
                      <span>PDF, signed Â· max 20 MB</span>
                    </button>
                    <div>
                      <span>
                        Response and attachments become part of the tender audit
                        record.
                      </span>
                      <button
                        onClick={() => {
                          onRespond();
                          setFixed(true);
                          appendAuditEvent({user:'Apex bidder',type:'CLARIFICATION_RESPONSE',description:'Renewed OEM authorization submitted in response to clarification',documentId:'OEM-Renewed.pdf',tenderId:'CPCL/PROC/2026/041',bidderId:'apex',referenceId:'RCP-041-2026-118'});
                          notify(
                            "Response submitted Â· immutable receipt created",
                          );
                        }}
                      >
                        <Send /> Submit response
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
        {tab === "profile" && (
          <>
            <PageHead
              eyebrow="VERIFIED ORGANISATION"
              title="Organisation profile"
              sub="Keep reusable seller information current across tender submissions."
            >
              <button
                onClick={() => notify("Profile update saved to audit log")}
              >
                Save changes
              </button>
            </PageHead>
            <div className="profilegrid">
              <section className="panel profilecard">
                <div className="companymark">AI</div>
                <h2>Apex Industrial Systems Pvt Ltd</h2>
                <span>Private Limited Company Â· Chennai</span>
                <div className="verifiedline">
                  <CheckCircle2 /> Identity resolved across PAN, GST and
                  registration records
                </div>
              </section>
              <section className="panel profilefields">
                {[
                  ["GeM Seller ID", "GEM/SYN/260041"],
                  ["GSTIN", "33SYNTH0000A1Z5"],
                  ["PAN", "AAECA0000A"],
                  ["Udyam Registration", "UDYAM-TN-SYN-0041"],
                  ["Startup India / DPIIT", "Not applicable Â· no exemption claimed"],
                  ["NSIC Registration", "NSIC/SYN/2026/027 Â· valid"],
                  ["EPFO", "Registered Â· source verification pending"],
                  ["ESIC", "33-00-SYN-0041 Â· verified"],
                  ["Registered email", "apex@bidder.demo"],
                  ["Authorised signatory", "Meera Raman (Synthetic)"],
                ].map((x, index) => (
                  <label key={x[0]}>
                    {x[0]} {index < 8 && <small>Verified / source-derived</small>}
                    <input defaultValue={x[1]} readOnly={index < 8} />
                  </label>
                ))}
              </section>
            </div>
          </>
        )}
      </main>
      {missingOpen&&<MissingItemsPanel audience="bidder" onClose={()=>setMissingOpen(false)}/>} 
      {toast && (
        <div className="toast">
          <CheckCircle2 />
          {toast}
        </div>
      )}
    </div>
  );
}
function ReadyCheck({
  fixed,
  onFix,
  onSubmit,
}: {
  fixed: boolean;
  onFix: () => void;
  onSubmit: () => void;
}) {
  const checks = [
    [
      "Required documents",
      fixed ? "31 / 31 available" : "30 / 31 available",
      fixed ? "Ready" : "Attention",
    ],
    [
      "Document validity",
      fixed
        ? "All valid through contract period"
        : "OEM authorization expires early",
      fixed ? "Ready" : "Blocking",
    ],
    ["Signatures & declarations", "8 / 8 digitally signed", "Ready"],
    ["PAN / GST identity", "Normalized legal name match", "Ready"],
    ["Local-content evidence", "57% declared Â· 54% certificate", "Review"],
    ["File readability", "19 / 19 machine-readable", "Ready"],
  ];
  return (
    <>
      <PageHead
        eyebrow="PRE-SUBMISSION COMPLETENESS"
        title="ReadyCheck"
        sub="Check submission completeness before freezing your bid. This does not predict qualification."
      >
        <button
          className="secondary"
          onClick={() =>
            alert("ReadyCheck completed against rule set CPCL-041 v2.1")
          }
        >
          <RefreshCw /> Run again
        </button>
        <button disabled={!fixed} onClick={onSubmit}>
          <LockKeyhole /> Freeze & submit
        </button>
      </PageHead>
      <div className="readyhero">
        <div className={fixed ? "ready-score complete" : "ready-score"}>
          <strong>
            {fixed ? "30" : "28"}
            <small>/31</small>
          </strong>
          <span>{fixed ? "READY TO FREEZE" : "NEEDS ATTENTION"}</span>
        </div>
        <div>
          <h2>
            {fixed
              ? "One non-blocking review remains"
              : "Three requirements need your attention"}
          </h2>
          <p>
            ReadyCheck validates presence, readability and consistency. The
            Procurement Officer remains responsible for evaluation.
          </p>
          <Progress value={fixed ? 96 : 90} />
        </div>
      </div>
      <section className="panel readylist">
        <div className="panelhead">
          <h2>Requirement scan</h2>
          <span className="sample">Rule set CPCL-041 Â· v2.1</span>
        </div>
        {checks.map((c, i) => (
          <div className="readyrow" key={c[0]}>
            <div
              className={
                "checkicon " +
                (c[2] === "Ready"
                  ? "good"
                  : c[2] === "Blocking"
                    ? "bad"
                    : "warn")
              }
            >
              {c[2] === "Ready" ? <CheckCircle2 /> : <AlertTriangle />}
            </div>
            <div>
              <b>{c[0]}</b>
              <span>{c[1]}</span>
            </div>
            <span
              className={
                "pill " +
                (c[2] === "Ready"
                  ? "good"
                  : c[2] === "Blocking"
                    ? "bad"
                    : "warn")
              }
            >
              {c[2]}
            </span>
            {i === 1 && !fixed ? (
              <button onClick={onFix}>
                Replace document <ArrowRight />
              </button>
            ) : (
              <button onClick={() => alert(`${c[0]}: ${c[1]}`)}>
                View details
              </button>
            )}
          </div>
        ))}
      </section>
      <div className="manifest">
        <ShieldCheck />
        <div>
          <b>Submission Freeze Manifest</b>
          <span>
            When submitted, BidShield seals the file list, SHA-256 hashes,
            declarations, organization profile and applicable rule version into
            a downloadable receipt.
          </span>
        </div>
      </div>
    </>
  );
}
function RequirementExplainer() {
  const reqs = [
    [
      "Technical Clause 7.4",
      "OEM Authorization",
      "You are offering products manufactured by another organization.",
      "OEM authorization referencing this tender and valid through contract execution.",
      "Action required",
    ],
    [
      "ATC 8.1",
      "Local Content â‰¥ 50%",
      "The offered goods are declared as Class-I local supplier goods.",
      "Signed local-content certificate from the authorized signatory.",
      "Review",
    ],
    [
      "GCC 2.6",
      "Debarment declaration",
      "Applies to every participating seller.",
      "Signed self-declaration; registry check is performed separately.",
      "Complete",
    ],
  ];
  return (
    <>
      <PageHead
        eyebrow="PLAIN-LANGUAGE GUIDANCE"
        title="Tender requirements"
        sub="Understand what applies to your organization and exactly what evidence is required."
      />
      <div className="requirement-list">
        {reqs.map((r, i) => (
          <article className="panel requirement" key={r[0]}>
            <header>
              <div>
                <span>{r[0]}</span>
                <h2>{r[1]}</h2>
              </div>
              <span
                className={"pill " + (r[4] === "Complete" ? "good" : "warn")}
              >
                {r[4]}
              </span>
            </header>
            <div className="requirement-grid">
              <div>
                <b>What this means</b>
                <p>{r[2]}</p>
              </div>
              <div>
                <b>Why it applies to you</b>
                <p>
                  {i === 0
                    ? "Bidder category: Authorized reseller Â· OEM exemption not claimed."
                    : i === 1
                      ? "Your declared local-content classification triggers this rule."
                      : "Mandatory for all bidder categories."}
                </p>
              </div>
              <div>
                <b>Required evidence</b>
                <p>{r[3]}</p>
              </div>
            </div>
            <footer>
              <span>
                <Clock3 /> Due with clarification: 02 Oct 2026, 17:00 IST
              </span>
              <button
                onClick={() =>
                  alert(`${r[0]}\n\n${r[1]}\n\nRequired evidence: ${r[3]}`)
                }
              >
                View official clause <ArrowRight />
              </button>
            </footer>
          </article>
        ))}
      </div>
    </>
  );
}
function RuleStudio({ flash }: { flash: (s: string) => void }) {
  const [approved, setApproved] = useState(complianceRules.map(r=>r.status==='APPROVED'));
  const [testsOpen, setTestsOpen] = useState(false);
  const [impactOpen, setImpactOpen] = useState(false);
  const rules = complianceRules;
  return (
    <>
      <PageHead
        eyebrow="TENDER RULE STUDIO Â· RULE SET V2.1"
        title="Extracted compliance rules"
        sub="AI-assisted interpretations remain drafts until an authorized officer approves them."
      >
        <button
          className="secondary"
          onClick={() =>
            flash("Tender PDF selected Â· 68 pages ready for extraction")
          }
        >
          <UploadCloud /> Select tender PDF
        </button>
        <button
          onClick={() =>
            flash("Clause extraction complete Â· 31 candidate rules identified")
          }
        >
          <Sparkles /> Extract clauses
        </button>
      </PageHead>
      <div className="studio-summary">
        <Metric
          label="Clauses detected"
          value="31"
          detail="Across 68 tender pages"
        />
        <Metric
          label="Approved"
          value={`${approved.filter(Boolean).length}/31`}
          detail="Officer-controlled activation"
        />
        <Metric
          label="Machine-verifiable"
          value="24"
          detail="7 require judgment"
        />
        <Metric
          label="Low confidence"
          value="2"
          detail="Manual review required"
        />
      </div>
      <div className="rule-tools"><button onClick={()=>setTestsOpen(!testsOpen)}><Play/> Test Rule</button><button className="secondary" onClick={()=>setImpactOpen(!impactOpen)}><GitCompareArrows/> Preview Rule Impact</button></div>
      {testsOpen&&<section className="panel rule-test"><div className="panelhead"><div><span className="eyebrow">DETERMINISTIC TEST BENCH</span><h2>Annual turnover â‰¥ â‚¹50 Cr</h2></div><span className="pill good">{ruleTests.length}/{ruleTests.length} passed</span></div><table><thead><tr><th>Test input</th><th>Expected</th><th>Actual</th><th>Result</th></tr></thead><tbody>{ruleTests.map(t=><tr key={t.id}><td>{t.input}</td><td>{t.expected}</td><td>{t.actual}</td><td><CheckCircle2/> PASS</td></tr>)}</tbody></table></section>}
      {impactOpen&&<section className="panel rule-impact"><AlertTriangle/><div><span className="eyebrow">IMPACT PREVIEW Â· CONFIRMATION REQUIRED</span><h2>Changing {ruleImpact.changedField}: {ruleImpact.from} â†’ {ruleImpact.to}</h2><p>Would affect <b>{ruleImpact.affectedEvaluations} bidder evaluations</b>, <b>{ruleImpact.compliantResults} currently compliant results</b>, and <b>{ruleImpact.clarificationCases} clarification cases</b>.</p><small>Historical decisions will not be silently recalculated.</small></div><button onClick={()=>flash('Rule change opened as a new draft version')}>Create draft version</button></section>}
      <div className="studio-layout">
        <section className="panel pdfpane">
          <div className="panelhead">
            <h2>Tender source</h2>
            <span className="source cached">PDF Â· PAGE 38</span>
          </div>
          <div className="pdfpage">
            <span>7.4 OEM AUTHORIZATION</span>
            <p>
              The bidder, where not the original equipment manufacturer, shall
              submit a valid authorization from the OEM specifically covering
              the offered product category and tender reference.
            </p>
            <mark>
              Authorization shall remain valid through the expected contract
              execution period.
            </mark>
            <small>
              Industrial Safety Valves Procurement Â· CPCL/PROC/2026/041
            </small>
          </div>
        </section>
        <section className="panel rulepane">
          <div className="panelhead">
            <div>
              <span className="eyebrow">STRUCTURED INTERPRETATION</span>
              <h2>Officer review queue</h2>
            </div>
            <span className="pill warn">1 draft</span>
          </div>
          {rules.map((r, i) => (
            <div
              className={"rulecard " + (approved[i] ? "approved" : "draft")}
              key={r.ruleId}
            >
              <header>
                <div>
                  <code>{r.ruleId}</code>
                  <span>{r.clause} Â· Page {r.page}</span>
                </div>
                <span>{r.confidence}% AI confidence Â· {r.status}</span>
              </header>
              <h3>{r.title}</h3>
              <div className="rulefields">
                <span>
                  <b>Type</b>
                  {r.requirementType}
                </span>
                <span>
                  <b>Evidence</b>{r.requiredEvidence.join(', ')}
                </span>
                <span>
                  <b>Pass logic</b>{r.operator} {r.threshold ?? r.exemptionLogic}
                </span>
                <span>
                  <b>Severity</b>{r.severity}
                </span>
                <span>
                  <b>Provider</b>{r.verificationProvider}
                </span>
                <span>
                  <b>Applicability</b>{r.applicability}
                </span>
              </div>
              <footer>
                <span className={"pill " + (approved[i] ? "good" : "warn")}>
                  {approved[i] ? "Active" : "Draft Â· approval required"}
                </span>
                <div>
                  <button
                    onClick={() =>
                      flash(`${r.ruleId} opened in structured rule editor`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      flash(`${r.ruleId} split preview created Â· approval required`)
                    }
                  >
                    Split rule
                  </button>
                  <button
                    className="approve"
                    onClick={() => {
                      setApproved((a) => a.map((v, x) => (x === i ? true : v)));
                      appendAuditEvent({user:'A. Krishnan',type:'RULE_APPROVED',description:`${r.ruleId} approved and activated`,tenderId:r.tenderId,referenceId:r.ruleId});
                      flash(`${r.ruleId} approved Â· audit event recorded`);
                    }}
                    disabled={approved[i]}
                  >
                    {approved[i] ? "Approved" : "Approve rule"}
                  </button>
                </div>
              </footer>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
function DecisionReplay({
  go,
  flash,
  responded,
}: {
  go: (p: Page) => void;
  flash: (s: string) => void;
  responded: boolean;
}) {
  const [openEvent, setOpenEvent] = useState<number | null>(null);
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [finalDecision, setFinalDecision] = useState("");
  const [finalReason, setFinalReason] = useState("");
  const [recorded, setRecorded] = useState(false);
  const events = [
    [
      "24 Sep Â· 16:42",
      "Submission frozen",
      "19 documents sealed in manifest MAN-26041-V2",
    ],
    [
      "27 Sep Â· 10:12",
      "Verification completed",
      "GST and PAN verified; OEM expiry warning created",
    ],
    [
      "28 Sep Â· 14:18",
      "Clarification issued",
      "Technical Rule 7.4 linked to EV-26041-OEM-0088",
    ],
    [
      responded ? "29 Sep Â· 11:24" : "Awaiting",
      "Bidder response",
      responded
        ? "Renewed authorization received Â· RCP-041-2026-118"
        : "Response due 02 Oct, 17:00 IST",
    ],
    [
      responded ? "29 Sep Â· 11:28" : "Blocked",
      "Reverification",
      responded
        ? "OEM finding Critical â†’ Compliant; risk 46 â†’ 34"
        : "Cannot run until response is received",
    ],
  ];
  return (
    <>
      <PageHead
        eyebrow="DEFENSIBLE DECISION RECORD"
        title="Decision replay"
        sub="Reconstruct exactly what was known, verified and visible at decision time."
      >
        <button className="secondary" onClick={() => go("audit")}>
          <History /> Full audit trail
        </button>
        <button
          onClick={() => {
            downloadFile(
              "CPCL-041-evidence-pack.json",
              JSON.stringify({
                tender: tenders[0],
                bidder: apex,
                ruleSet: "v2.1",
                timeline: events.map(([time, title, detail]) => ({ time, title, detail })),
                generatedAt: new Date().toISOString(),
              }, null, 2),
            );
            flash("Evidence Pack downloaded Â· JSON manifest audit-tracked");
          }}
        >
          <Archive /> Generate Evidence Pack
        </button>
      </PageHead>
      <DecisionReplayTimeline/>
      {responded && (
        <div className="changed">
          <Sparkles />
          <div>
            <span className="eyebrow">WHAT CHANGED AFTER REVERIFICATION</span>
            <h2>OEM authorization resolved</h2>
          </div>
          <div>
            <span>Finding</span>
            <b>
              Critical <ArrowRight /> Compliant
            </b>
          </div>
          <div>
            <span>Risk</span>
            <b>
              46 <ArrowRight /> 34
            </b>
          </div>
          <div>
            <span>Readiness</span>
            <b>
              87% <ArrowRight /> 96%
            </b>
          </div>
        </div>
      )}
      <div className="replay-layout">
        <section className="panel replay">
          <div className="panelhead">
            <h2>Rule â†’ Evidence â†’ Decision timeline</h2>
            <span className="sample">Rule set v2.1</span>
          </div>
          {events.map((e, i) => (
            <React.Fragment key={e[1]}>
            <div
              className={i === events.length - 1 ? "current" : ""}
            >
              <i>{i + 1}</i>
              <time>{e[0]}</time>
              <section>
                <b>{e[1]}</b>
                <span>{e[2]}</span>
              </section>
              <button
                aria-label={`Open ${e[1]} record`}
                aria-expanded={openEvent === i}
                onClick={() => setOpenEvent(openEvent === i ? null : i)}
              >
                <ArrowRight />
              </button>
            </div>
            {openEvent === i && <div className="replay-detail"><b>Historical snapshot</b><span>{e[2]}</span><code>{i === 0 ? "MAN-26041-V2" : i === 1 ? "EV-26041-GST-0182" : i === 2 ? "EV-26041-OEM-0088" : i === 3 ? "CLR-26041-03" : "RSK-26041-10"}</code><small>Integrity verified Â· SHA-256 snapshot retained</small></div>}
            </React.Fragment>
          ))}
        </section>
        <aside className="panel decision-summary">
          <span className="eyebrow">DECISION READINESS</span>
          <strong>{responded ? "96%" : "87%"}</strong>
          <Progress value={responded ? 96 : 87} />
          <h3>
            {responded
              ? "Ready for authorized review"
              : "Decision remains blocked"}
          </h3>
          <ul>
            {responded ? (
              <>
                <li>12/12 mandatory criteria satisfied</li>
                <li>All clarifications responded</li>
                <li>1 source-pending check has no adverse inference</li>
              </>
            ) : (
              <>
                <li>1 mandatory clarification pending</li>
                <li>EPFO source unavailable</li>
                <li>Officer decision not yet recorded</li>
              </>
            )}
          </ul>
          <div className="decision-note">
            <ShieldCheck />
            <span>
              BidShield is decision support. Final procurement decision remains
              with the authorized officer.
            </span>
          </div>
          <button
            disabled={!responded}
            onClick={() => setDecisionOpen(true)}
          >
            Record final human decision
          </button>
          {!responded && <small className="blocked-help">Available after the bidder response is received and reverification completes.</small>}
          {recorded && <div className="decision-recorded"><CheckCircle2 /><span><b>{finalDecision}</b> recorded by A. Krishnan.</span></div>}
        </aside>
      </div>
      {decisionOpen && (
        <div className="demo-modal" role="dialog" aria-modal="true" aria-label="Record final human decision">
          <div className="decision-dialog">
            <header><div><span className="eyebrow">AUTHORIZED OFFICER ACTION</span><h2>Record final human decision</h2></div><button onClick={() => setDecisionOpen(false)} aria-label="Close"><X /></button></header>
            <div className="decision-dialog-body">
              <label>Decision<select value={finalDecision} onChange={(e) => setFinalDecision(e.target.value)}><option value="">Select a decisionâ€¦</option><option>Qualify</option><option>Seek clarification</option><option>Escalate</option><option>Disqualify</option></select></label>
              <label>Reason and evidence references<textarea value={finalReason} onChange={(e) => setFinalReason(e.target.value)} placeholder="State the reason and cite the relevant rule/evidence IDsâ€¦" /></label>
              <div className="decision-note"><ShieldCheck /><span>This record will include officer identity, timestamp, rule set and evidence snapshot.</span></div>
            </div>
            <footer><button onClick={() => setDecisionOpen(false)}>Cancel</button><button disabled={!finalDecision || finalReason.trim().length < 10} onClick={() => { setRecorded(true); setDecisionOpen(false); appendAuditEvent({user:'A. Krishnan',type:'DECISION_RECORDED',description:`${finalDecision}: ${finalReason}`,tenderId:'CPCL/PROC/2026/041',bidderId:'apex',referenceId:'DEC-041'}); flash(`${finalDecision} recorded in the append-only audit trail`); }}>Record signed decision</button></footer>
          </div>
        </div>
      )}
    </>
  );
}
function PageHead({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow?: string;
  title: string;
  sub: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="pagehead">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>
      <div className="pageactions">{children}</div>
    </div>
  );
}
function Dashboard({
  go,
  open,
  responded,
}: {
  go: (p: Page) => void;
  open: (c: Check) => void;
  responded: boolean;
}) {
  const risk = [
    { name: "Low", value: 14, color: "#25825f" },
    { name: "Medium", value: 8, color: "#d98b20" },
    { name: "High", value: 3, color: "#d34e4e" },
  ];
  const attention: [string, string, string, number][] = [
    ...(responded
      ? [
          [
            "Ready",
            "Apex Industrial Systems",
            "Bidder responded with renewed OEM authorization",
            3,
          ] as [string, string, string, number],
        ]
      : []),
    [
      "Critical",
      "Apex Industrial Systems",
      "OEM authorization expires before contract period",
      3,
    ],
    [
      "High",
      "Bharat Flow Controls",
      "GST filing status needs source confirmation",
      0,
    ],
    ["Medium", "TechNova Systems India", "Udyam legal name partial match", 2],
  ];
  return (
    <>
      <PageHead
        eyebrow="COMMAND CENTER Â· SAMPLE DATA"
        title="Good afternoon, A. Krishnan."
        sub="Three evaluations require your attention before todayâ€™s review window closes."
      >
        <button className="secondary" onClick={() => go("verification")}>
          <Play /> Run verification
        </button>
        <button onClick={() => go("tenders")}>
          View tenders <ArrowRight />
        </button>
      </PageHead>
      <AnimatedGroup className="metrics" preset="blur-slide">
        <Metric label="Active tenders" value="12" detail="3 close this week" />
        <Metric
          label="Bidders under review"
          value="147"
          detail="38 require officer action"
        />
        <Metric
          label="Pending verifications"
          value="28"
          detail="5 source-dependent"
          toneName="amber"
        />
        <Metric
          label="Critical findings"
          value="7"
          detail="Across 4 tenders"
          toneName="red"
        />
        <Metric
          label="Decision readiness"
          value="81%"
          detail="Portfolio average"
        />
      </AnimatedGroup>
      <InView className="dashgrid">
        <section className="panel attention">
          <div className="panelhead">
            <div>
              <span className="eyebrow">EXCEPTION-FIRST WORKFLOW</span>
              <h2>Officer attention queue</h2>
            </div>
            <button className="link" onClick={() => go("bidder")}>
              View all 18
            </button>
          </div>
          {attention.map((a, i) => (
            <button
              className="attentionrow"
              key={i}
              onClick={() => (i === 0 ? open(apex.checks[3]) : go("bidder"))}
            >
              <span className={"rank " + a[0].toLowerCase()}>{a[0]}</span>
              <div>
                <b>{a[1]}</b>
                <span>{a[2]}</span>
                <small>CPCL/PROC/2026/041 Â· Review evidence</small>
              </div>
              <ArrowRight />
            </button>
          ))}
        </section>
        <section className="panel pipeline">
          <div className="panelhead">
            <h2>Evaluation pipeline</h2>
            <span className="sample">Sample metrics</span>
          </div>
          <div className="chart">
            <ResponsiveContainer>
              <BarChart
                data={[
                  { n: "Received", v: 147 },
                  { n: "Auto-verified", v: 109 },
                  { n: "Review", v: 38 },
                  { n: "Clarification", v: 16 },
                  { n: "Ready", v: 71 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="n" tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="v" fill="#2846a1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel deadlines">
          <div className="panelhead">
            <h2>Upcoming deadlines</h2>
            <Clock3 />
          </div>
          {tenders.map((t) => (
            <button onClick={() => go("tender")} key={t.id}>
              <div className="datebox">
                <b>{t.deadline.split(" ")[0]}</b>
                <span>{t.deadline.split(" ")[1]}</span>
              </div>
              <div>
                <b>{t.title}</b>
                <span>
                  {t.id} Â· {t.progress}% evaluated
                </span>
              </div>
              <ArrowRight />
            </button>
          ))}
        </section>
        <section className="panel riskchart">
          <div className="panelhead">
            <h2>Portfolio risk</h2>
            <button className="link" onClick={() => go("comparison")}>
              Compare
            </button>
          </div>
          <div className="riskbody">
            <div className="donut">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={risk}
                    dataKey="value"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={3}
                  >
                    {risk.map((r) => (
                      <Cell fill={r.color} key={r.name} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <b>
                25<span>active</span>
              </b>
            </div>
            <div className="legend">
              {risk.map((r) => (
                <div key={r.name}>
                  <i style={{ background: r.color }} />
                  <span>{r.name}</span>
                  <b>{r.value}</b>
                </div>
              ))}
            </div>
          </div>
        </section>
      </InView>
    </>
  );
}
function Tenders({
  go,
  query,
  setQuery,
}: {
  go: (p: Page) => void;
  query: string;
  setQuery: (s: string) => void;
}) {
  return (
    <>
      <PageHead
        eyebrow="PROCUREMENT WORKSPACE"
        title="Tenders"
        sub="Monitor evaluations, verification coverage and decision readiness."
      >
        <button className="secondary" onClick={() => go("tender")}>
          <Archive /> Import GeM tender
        </button>
        <button onClick={() => go("rules")}>+ Create demo tender</button>
      </PageHead>
      <div className="toolbar">
        <div className="input">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by tender ID or title"
          />
        </div>
        <button
          className="secondary"
          onClick={() => setQuery(query ? "" : "CPCL")}
        >
          <SlidersHorizontal /> Filters
        </button>
        <span>
          Showing{" "}
          {
            tenders.filter((t) =>
              (t.title + t.id).toLowerCase().includes(query.toLowerCase()),
            ).length
          }{" "}
          tenders
        </span>
      </div>
      <section className="panel tablewrap">
        <table>
          <thead>
            <tr>
              <th>Tender</th>
              <th>Category</th>
              <th>Value</th>
              <th>Bidders</th>
              <th>Evaluation</th>
              <th>Deadline</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tenders
              .filter((t) =>
                (t.title + t.id).toLowerCase().includes(query.toLowerCase()),
              )
              .map((t) => (
                <tr key={t.id} tabIndex={0} aria-label={`Open tender ${t.title}`} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go('tender')}}} onClick={() => go("tender")}>
                  <td>
                    <b>{t.title}</b>
                    <span>{t.id}</span>
                  </td>
                  <td>{t.category}</td>
                  <td>{t.value}</td>
                  <td>{t.bidders}</td>
                  <td>
                    <div className="progresscell">
                      <Progress value={t.progress} />
                      <span>{t.progress}%</span>
                    </div>
                  </td>
                  <td>{t.deadline}</td>
                  <td>
                    <span className="tag">{t.status}</span>
                  </td>
                  <td>
                    <ArrowRight />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
function TenderRoom({
  go,
  open,
  flash,
}: {
  go: (p: Page) => void;
  open: (c: Check) => void;
  flash: (s: string) => void;
}) {
  return (
    <>
      <div className="breadcrumbs">Tendersã€€â€ºã€€CPCL/PROC/2026/041</div>
      <PageHead
        title="Industrial Safety Valves Procurement"
        sub="CPCL/PROC/2026/041 Â· Technical evaluation Â· Deadline 03 Oct 2026"
      >
        <button
          className="secondary"
          onClick={() => flash("Evaluation report prepared")}
        >
          Generate report
        </button>
        <button onClick={() => go("comparison")}>Compare bidders</button>
      </PageHead>
      <div className="tender-summary">
        <div>
          <span>DECISION READINESS</span>
          <b>87% ready</b>
          <Progress value={87} />
          <small>3 blocking items across 6 bidders</small>
        </div>
        <div>
          <span>RULE COVERAGE</span>
          <b>31 rules</b>
          <small>27 automated Â· 2 judgment Â· 2 pending</small>
        </div>
        <div>
          <span>SOURCE COVERAGE</span>
          <b>12 / 13</b>
          <small>EPFO currently unavailable</small>
        </div>
        <div>
          <span>ASSIGNED OFFICER</span>
          <b>A. Krishnan</b>
          <small>Procurement Officer Â· CPCL</small>
        </div>
      </div>
      <div className="tabs">
        <button
          className="active"
          onClick={() => flash("Tender overview is active")}
        >
          Overview
        </button>
        <button onClick={() => go("bidder")}>
          Bidders <i>6</i>
        </button>
        <button onClick={() => go("comparison")}>Compliance matrix</button>
        <button onClick={() => go("rules")}>
          Rules <i>31</i>
        </button>
        <button
          onClick={() => flash("3 controlled clarification cases opened")}
        >
          Clarifications <i>3</i>
        </button>
        <button onClick={() => go("audit")}>Activity</button>
      </div>
      <div className="roomgrid">
        <section className="panel">
          <div className="panelhead">
            <div>
              <span className="eyebrow">BIDDER EVALUATION</span>
              <h2>Exception overview</h2>
            </div>
            <span className="sample">Updated 4 min ago</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Bidder</th>
                <th>Compliance</th>
                <th>Mandatory</th>
                <th>Risk</th>
                <th>Readiness</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bidders.map((b) => (
                <tr key={b.id} tabIndex={0} aria-label={`Open bidder ${b.name}`} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go('bidder')}}} onClick={() => go("bidder")}>
                  <td>
                    <b>{b.name}</b>
                    <span>{b.sellerId}</span>
                  </td>
                  <td>
                    <b>{b.score}/100</b>
                  </td>
                  <td>{b.mandatory}</td>
                  <td>
                    <span
                      className={
                        "risk " +
                        (b.risk > 50 ? "high" : b.risk > 35 ? "medium" : "low")
                      }
                    >
                      {b.risk > 50 ? "High" : b.risk > 35 ? "Medium" : "Low"} Â·{" "}
                      {b.risk}
                    </span>
                  </td>
                  <td>
                    <div className="progresscell">
                      <Progress value={b.readiness} />
                      <span>{b.readiness}%</span>
                    </div>
                  </td>
                  <td>
                    <ArrowRight />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="panel blockers">
          <div className="panelhead">
            <h2>Blocking items</h2>
            <b>3</b>
          </div>
          <button onClick={() => open(apex.checks[3])}>
            <ShieldCheck />
            <div>
              <b>OEM authorization validity</b>
              <span>Apex Industrial Systems Â· Critical</span>
            </div>
            <ArrowRight />
          </button>
          <button onClick={() => open(apex.checks[6])}>
            <Activity />
            <div>
              <b>EPFO source unavailable</b>
              <span>2 bidder checks remain pending</span>
            </div>
            <ArrowRight />
          </button>
          <button
            onClick={() =>
              flash("Clarification case room opened for TechNova Systems")
            }
          >
            <MessageSquareText />
            <div>
              <b>Clarification awaiting response</b>
              <span>TechNova Systems Â· Due tomorrow</span>
            </div>
            <ArrowRight />
          </button>
        </section>
      </div>
    </>
  );
}
function Bidder({
  open,
  go,
  flash,
}: {
  open: (c: Check) => void;
  go: (p: Page) => void;
  flash: (s: string) => void;
}) {
  const [decision, setDecision] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "compliance" | "documents" | "risk" | "clarifications"
  >("overview");
  const [exceptionsOnly, setExceptionsOnly] = useState(false);
  const [scoreExpanded, setScoreExpanded] = useState(false);
  const [riskExpanded, setRiskExpanded] = useState(false);
  const [missingOpen, setMissingOpen] = useState(false);
  const [decisionFresh, setDecisionFresh] = useState(false);
  const [decisionStep, setDecisionStep] = useState<
    "select" | "reason" | "recorded"
  >("select");
  const [decisionReason, setDecisionReason] = useState("");
  const visibleChecks =
    exceptionsOnly || activeTab === "compliance"
      ? apex.checks.filter((check) => check.status !== "Compliant")
      : apex.checks;
  const selectTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab === "compliance") setExceptionsOnly(true);
  };
  const downloadEvidencePack = () => {
    const payload = JSON.stringify(
      {
        bidder: apex.name,
        sellerId: apex.sellerId,
        generatedAt: new Date().toISOString(),
        checks: apex.checks,
      },
      null,
      2,
    );
    const url = URL.createObjectURL(
      new Blob([payload], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "apex-evidence-pack.json";
    link.click();
    URL.revokeObjectURL(url);
    flash("Evidence pack downloaded Â· Audit event recorded");
  };
  return (
    <>
      <div className="breadcrumbs">
        Tendersã€€â€ºã€€Industrial Safety Valvesã€€â€ºã€€Bidder profile
      </div>
      <div className="bidderhero">
        <div className="companymark">AI</div>
        <div>
          <span className="eyebrow">BIDDER 360Â°</span>
          <h1>{apex.name}</h1>
          <p>
            {apex.sellerId} Â· GSTIN {apex.gstin} Â· Chennai, Tamil Nadu
          </p>
          <div className="badges">
            <span>
              <CheckCircle2 /> Identity resolved
            </span>
            <span>
              <ShieldCheck /> Secure documents
            </span>
            <span className="warn">
              <AlertTriangle /> 2 require review
            </span>
          </div>
        </div>
        <button className="secondary" onClick={() => go("verification")}>
          <RefreshCw /> Re-verify
        </button>
        <button onClick={downloadEvidencePack}>
          <Archive /> Evidence pack
        </button>
      </div>
      <div className="tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => selectTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "compliance" ? "active" : ""}
          onClick={() => selectTab("compliance")}
        >
          Compliance
        </button>
        <button
          className={activeTab === "documents" ? "active" : ""}
          onClick={() => selectTab("documents")}
        >
          Documents
        </button>
        <button onClick={() => go("verification")}>Source verification</button>
        <button onClick={() => go("nexus")}>Evidence Nexus</button>
        <button
          className={activeTab === "risk" ? "active" : ""}
          onClick={() => {
            selectTab("risk");
            setRiskExpanded(true);
          }}
        >
          Risk
        </button>
        <button
          className={activeTab === "clarifications" ? "active" : ""}
          onClick={() => selectTab("clarifications")}
        >
          Clarifications <i>1</i>
        </button>
        <button onClick={() => go("audit")}>Audit</button>
      </div>
      {(activeTab === "overview" ||
        activeTab === "compliance" ||
        activeTab === "risk") && <div className="scoregrid">
        <div className="scorecard">
          <span>OVERALL COMPLIANCE</span>
          <div>
            <strong>84</strong>
            <em>/100</em>
          </div>
          <button
            className="link"
            aria-expanded={scoreExpanded}
            onClick={() => setScoreExpanded((value) => !value)}
          >
            {scoreExpanded ? "Hide score breakdown" : "How was this calculated?"}
          </button>
          {scoreExpanded && (
            <div className="score-breakdown">
              <span>Mandatory <b>55</b></span>
              <span>Conditional <b>21</b></span>
              <span>Evidence confidence <b>8</b></span>
            </div>
          )}
        </div>
        <Metric
          label="Mandatory criteria"
          value="11/12"
          detail="1 requires clarification"
        />
        <Metric
          label="Risk level"
          value="Medium Â· 46"
          detail="2 primary contributors"
          toneName="amber"
        />
        <Metric
          label="Verification confidence"
          value="94%"
          detail="Across completed checks"
        />
        <Metric
          label="Decision readiness"
          value="87%"
          detail="2 blocking items"
        />
      </div>}
      {activeTab === "overview"&&<><div className="insight-actions"><button onClick={()=>go('nexus')}><GitBranch/> Open Evidence Nexus</button><button onClick={()=>setMissingOpen(true)}><FileSearch/> What is missing?</button></div><ComplianceCoverage/></>}
      {missingOpen&&<MissingItemsPanel onClose={()=>setMissingOpen(false)}/>} 
      {activeTab === "documents" && (
        <section className="panel bidder-documents">
          <div className="panelhead">
            <div><span className="eyebrow">SECURE EVIDENCE LIBRARY</span><h2>Bidder documents</h2></div>
            <span className="sample">7 evidence records</span>
          </div>
          {apex.checks.map((check) => (
            <button className="bidder-document-row" key={check.id} onClick={() => open(check)}>
              <FileText /><div><b>{check.evidence}</b><span>{check.label} Â· {check.id}</span></div><SourceMode mode={check.mode} /><ArrowRight />
            </button>
          ))}
        </section>
      )}
      {activeTab === "clarifications" && (
        <section className="panel bidder-clarification">
          <div className="panelhead"><div><span className="eyebrow">CLR-26041-03</span><h2>OEM authorization validity</h2></div><StatusPill status="Pending" /></div>
          <div className="clarification-detail"><MessageSquareText /><div><b>Response requested from bidder</b><p>The submitted authorization expires before the expected contract period. Renewed authorization or OEM confirmation is required by 02 Oct 2026, 17:00 IST.</p><button onClick={() => open(apex.checks[3])}>Open linked evidence <ArrowRight /></button></div></div>
        </section>
      )}
      {(activeTab === "overview" || activeTab === "compliance" || activeTab === "risk") && <div className="biddergrid">
        <section className="panel checks">
          <div className="panelhead">
            <div>
              <span className="eyebrow">TRACEABLE FINDINGS</span>
              <h2>Verification results</h2>
            </div>
            <button
              className="link"
              aria-pressed={exceptionsOnly}
              onClick={() => setExceptionsOnly((value) => !value)}
            >
              {exceptionsOnly ? "Show all results" : "Show exceptions only"}
            </button>
          </div>
          {visibleChecks.map((c) => (
            <button key={c.id} onClick={() => open(c)}>
              <div className={"checkicon " + tone(c.status)}>
                {c.status === "Compliant" ? (
                  <CheckCircle2 />
                ) : (
                  <AlertTriangle />
                )}
              </div>
              <div>
                <b>{c.label}</b>
                <span>{c.clause}</span>
              </div>
              <div className="checksource">
                <SourceMode mode={c.mode} />
                <span>{c.source}</span>
              </div>
              <StatusPill status={c.status} />
              <ArrowRight />
            </button>
          ))}
        </section>
        <aside className="rightcol">
          <section className="panel riskwhy">
            <div className="panelhead">
              <h2>Why medium risk?</h2>
              <span className="risk medium">46 / 100</span>
            </div>
            {[
              ["OEM expiry concern", "+12"],
              ["Name variation", "+8"],
              ["Source unavailable", "+7"],
              ["Clean procurement history", "âˆ’5"],
              ["No active debarment", "âˆ’4"],
            ].map((x) => (
              <div key={x[0]}>
                <span>{x[0]}</span>
                <b className={x[1][0] === "+" ? "plus" : "minus"}>{x[1]}</b>
              </div>
            ))}
            <button
              className="link"
              aria-expanded={riskExpanded}
              onClick={() => setRiskExpanded((value) => !value)}
            >
              {riskExpanded ? "Hide detailed explanation â†‘" : "View full risk explanation â†’"}
            </button>
            {riskExpanded && (
              <div className="risk-explanation">
                <p><b>Calculation:</b> baseline 28 + OEM expiry 12 + name variation 8 + unavailable source 7 âˆ’ clean history 5 âˆ’ no debarment 4 = 46.</p>
                <p>The score prioritizes review; it does not determine qualification.</p>
              </div>
            )}
          </section>
          <section className="panel decision">
            <span className="eyebrow">HUMAN DECISION REQUIRED</span>
            <h2>Officer decision</h2>
            <div className="recommend">
              <Sparkles />
              <div>
                <span>System recommendation</span>
                <b>Seek clarification</b>
              </div>
            </div>
            <p>The system does not make the final procurement decision.</p>
            {!decisionFresh?<div className="reverify-required"><Clock3/><div><b>Decision reverification required</b><span>GST was verified 8 days ago and debarment was verified 12 days ago. Refresh these checks before continuing.</span></div><div className="reverify-actions"><button onClick={()=>{setDecisionFresh(true);appendAuditEvent({user:'A. Krishnan',type:'DECISION_REVERIFICATION',description:'Critical evidence reverified before decision',tenderId:'CPCL/PROC/2026/041',bidderId:'apex',referenceId:'REVERIFY-041'});flash('Fresh snapshots stored Â· historical snapshots preserved')}}><RefreshCw/> Reverify now</button><button className="secondary" onClick={()=>flash('Routed to manual review')}><UserRoundCheck/> Manual review</button></div></div>:<div className="decision-recorded"><CheckCircle2/><span><b>Freshness check complete</b> New source snapshots stored. Prior snapshots remain accessible.</span></div>}
            <label>
              Record decision
              <select
                value={decision}
                onChange={(e) => {
                  setDecision(e.target.value);
                  setDecisionStep("select");
                }}
                disabled={decisionStep === "recorded"}
                aria-describedby={!decisionFresh?'decision-freshness-help':undefined}
              >
                <option value="">Select an actionâ€¦</option>
                <option>Qualify</option>
                <option>Seek clarification</option>
                <option>Escalate</option>
                <option>Disqualify</option>
                <option>Request re-verification</option>
              </select>
              {!decisionFresh&&<small id="decision-freshness-help" className="field-help">You may prepare a decision now. Reverification is required before you can continue.</small>}
            </label>
            {decisionStep === "reason" && (
              <label>
                Reason and evidence reference
                <textarea autoFocus value={decisionReason} onChange={(e) => setDecisionReason(e.target.value)} placeholder="Explain the decision and cite supporting evidenceâ€¦" />
              </label>
            )}
            {decisionStep === "recorded" ? (
              <div className="decision-recorded"><CheckCircle2 /><span><b>{decision}</b> recorded and added to the audit trail.</span></div>
            ) : (
              <button
                disabled={!decisionFresh || !decision || (decisionStep === "reason" && decisionReason.trim().length < 10)}
                onClick={() => {
                  if (decisionStep === "select") setDecisionStep("reason");
                  else {
                    setDecisionStep("recorded");
                    appendAuditEvent({user:'A. Krishnan',type:'DECISION_RECORDED',description:`${decision}: ${decisionReason}`,tenderId:'CPCL/PROC/2026/041',bidderId:'apex',referenceId:'DEC-041'});
                    flash(`${decision} recorded with officer identity and timestamp`);
                  }
                }}
              >
                {decisionStep === "select" ? "Continue to record reason" : "Record signed decision"}
              </button>
            )}
          </section>
        </aside>
      </div>}
    </>
  );
}
function Verification({
  open,
  flash,
}: {
  open: (c: Check) => void;
  flash: (s: string) => void;
}) {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const [exceptionsOnly, setExceptionsOnly] = useState(false);
  const [exceptionType, setExceptionType] = useState('Needs Attention');
  const [securityOpen, setSecurityOpen] = useState(false);
  const run = () => {
    appendAuditEvent({user:'A. Krishnan',type:'VERIFICATION_STARTED',description:'Verification workflow started for Apex Industrial Systems',tenderId:'CPCL/PROC/2026/041',bidderId:'apex',referenceId:'VERIFY-041'});
    setRunning(true);
    setDone(0);
    let n = 0;
    const id = setInterval(() => {
      n++;
      setDone(n);
      if (n >= 6) {
        clearInterval(id);
        setRunning(false);
        appendAuditEvent({user:'BidShield verification service',type:'VERIFICATION_COMPLETED',description:'Verification completed; exception findings refreshed',tenderId:'CPCL/PROC/2026/041',bidderId:'apex',referenceId:'VERIFY-041'});
        flash("Verification complete Â· 2 exceptions require review");
      }
    }, 520);
  };
  return (
    <>
      <PageHead
        eyebrow="LIVE WORKFLOW Â· MOCK PROVIDERS"
        title="Verification Center"
        sub="Cross-check submissions against configured sources and tender-specific rules."
      >
        <button onClick={run} disabled={running}>
          {running ? <RefreshCw className="spin" /> : <Play />}
          {running ? "Verification runningâ€¦" : "Run verification"}
        </button>
      </PageHead>
      <div className="stepper">
        {[
          "Documents received",
          "File safety validation",
          "Render / OCR",
          "Embedded-text integrity check",
          "Secure field extraction",
          "Identity resolution",
          "Government-source verification",
          "Cross-source consistency",
          "Tender-rule evaluation",
          "Exception generation",
          "Explainable risk assessment",
          "Officer review",
        ].map((s, i) => (
          <div className={i < 8 ? "done" : i === 8 ? "current" : ""} key={s}>
            <i>{i < 8 ? "âœ“" : i + 1}</i>
            <span>{s}</span>
          </div>
        ))}
      </div>
      {running && (
        <div className="runbanner">
          <Activity className="spin" />
          <div>
            <b>
              {done < 1
                ? "Connecting to GSTNâ€¦"
                : done < 2
                  ? "Validating GST registrationâ€¦"
                  : done < 3
                    ? "Resolving PAN identityâ€¦"
                    : done < 4
                      ? "Checking OEM authorizationâ€¦"
                      : done < 5
                        ? "Cross-validating local contentâ€¦"
                        : "Finalising evidence recordsâ€¦"}
            </b>
            <span>
              Mock adapters are being used. No live government API is
              represented.
            </span>
          </div>
          <b>{Math.min(done * 17, 100)}%</b>
        </div>
      )}
      <div className="exception-filters" aria-label="Exception filters">{['Needs Attention','Critical','Mismatch','Missing','Expired','Low Confidence','Security Flag','Clarification Required','Source Unavailable','Manual Review'].map(label=><button className={exceptionType===label?'active':''} key={label} onClick={()=>{setExceptionType(label);setExceptionsOnly(true);if(label==='Security Flag')setSecurityOpen(true)}}>{label}</button>)}</div>
      {securityOpen&&<section className="panel security-review"><div className="panelhead"><div><span className="eyebrow">UNTRUSTED DOCUMENT SECURITY GATEWAY</span><h2>Security review</h2></div><SecurityPill status={suspiciousSecurityResult.status}/></div><div className="security-review-grid"><div><b>SEC-DEMO-02.pdf</b><span>Apex Industrial Systems Â· CPCL/PROC/2026/041</span><small>Uploaded 29 Sep 2026 Â· synthetic demonstration document</small></div><dl><div><dt>Embedded text</dt><dd>{suspiciousSecurityResult.embeddedTextCount} characters</dd></div><div><dt>Visible OCR</dt><dd>{suspiciousSecurityResult.ocrTextCount} characters</dd></div><div><dt>Difference</dt><dd>{suspiciousSecurityResult.differencePercent}%</dd></div><div><dt>Affected page</dt><dd>Page 1</dd></div></dl></div><div className="security-detection"><ShieldAlert/><div><b>SUSPICIOUS HIDDEN TEXT Â· SECURITY FLAG</b><span>Instruction-like content appears only in the embedded text layer. It was isolated as untrusted data and did not change any score, verification status, rule, or decision.</span><small>Category: {suspiciousSecurityResult.flags[0]?.category} Â· confidence {suspiciousSecurityResult.flags[0]?.confidence}%</small></div></div><div className="security-actions"><button onClick={()=>{appendAuditEvent({user:'A. Krishnan',type:'DOCUMENT_SECURITY_REVIEWED',description:'Document marked safe after manual review',documentId:'SEC-DEMO-02',securityResult:'SAFE',reviewer:'A. Krishnan',reason:'Manual rendered-page comparison',referenceId:'SEC-DEMO-02'});setSecurityOpen(false);flash('Security review recorded')}}>Mark Safe After Review</button><button onClick={()=>flash('Security flag retained for review')}>Keep Flagged</button><button onClick={()=>flash('Clean-copy request issued to bidder')}>Request Clean Copy</button><button onClick={()=>flash('Security review escalated')}>Escalate</button></div></section>}
      <section className="panel tablewrap">
        <div className="panelhead">
          <div>
            <h2>Verification results</h2>
            <span className="muted">
              24 checks Â· 19 verified Â· 2 review Â· 1 critical Â· 2 pending
            </span>
          </div>
          <button
            className={exceptionsOnly ? "secondary activebtn" : "secondary"}
            aria-pressed={exceptionsOnly}
            onClick={() => setExceptionsOnly((value) => !value)}
          >
            <SlidersHorizontal /> {exceptionsOnly ? "Show all" : "Exceptions"}
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Check</th>
              <th>Source</th>
              <th>Status</th>
              <th>Submitted value</th>
              <th>Verified value</th>
              <th>Confidence</th>
              <th>Freshness</th>
              <th>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {apex.checks.filter((c) => !exceptionsOnly || c.status !== "Compliant").filter(c=>exceptionType!=='Source Unavailable'||c.mode==='UNAVAILABLE').filter(c=>exceptionType!=='Expired'||c.discrepancies.some(d=>d.type==='EXPIRED')).filter(c=>exceptionType!=='Mismatch'||c.discrepancies.some(d=>d.type.includes('MISMATCH')||d.type.includes('CONFLICT'))).map((c) => (
              <tr key={c.id} tabIndex={0} aria-label={`Open evidence for ${c.label}`} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(c)}}} onClick={() => open(c)}>
                <td>
                  <b>{c.label}</b>
                  <span>{c.clause}</span>
                </td>
                <td>
                  <SourceMode mode={c.mode} />
                  <span>{c.source}</span>
                </td>
                <td>
                  <StatusPill status={c.status} />
                </td>
                <td>{c.submitted}</td>
                <td>{c.verified}</td>
                <td>{c.confidence ? c.confidence + "%" : "â€”"}</td>
                <td>{c.freshness&&<span className={'freshness '+c.freshness.freshnessStatus.toLowerCase()}><Clock3/>{c.freshness.freshnessStatus.replace('_',' ')}</span>}</td>
                <td>
                  <button
                    className="link"
                    onClick={(e) => {
                      e.stopPropagation();
                      open(c);
                    }}
                  >
                    Open <ArrowRight />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
function Comparison({ open }: { open: (c: Check) => void }) {
  const [diff, setDiff] = useState(false);
  return (
    <>
      <PageHead
        eyebrow="NO AUTOMATED RANKING"
        title="Bidder comparison"
        sub="Compare compliance evidence across bidders without declaring a winner."
      >
        <button
          className={diff ? "activebtn secondary" : "secondary"}
          onClick={() => setDiff(!diff)}
        >
          <GitCompareArrows />
          {diff ? "Showing differences" : "Show differences only"}
        </button>
        <button
          onClick={() => {
            const rows = [
              ["Bidder", "Compliance", "Mandatory", "Risk", "Readiness"],
              ...bidders.map((b) => [b.name, b.score, b.mandatory, b.risk, `${b.readiness}%`]),
            ];
            downloadFile("bidder-comparison.csv", rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n"), "text/csv");
          }}
        >
          <FileBarChart /> Export matrix
        </button>
      </PageHead>
      <section className="panel comparison">
        <table>
          <thead>
            <tr>
              <th>Requirement</th>
              {bidders.map((b) => (
                <th key={b.id}>
                  <b>{b.name.split(" ").slice(0, 2).join(" ")}</b>
                  <span>
                    {b.score}/100 Â· Risk {b.risk}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              "Mandatory criteria",
              "GST registration",
              "PAN identity",
              "Udyam registration",
              "OEM authorization",
              "Local content â‰¥ 50%",
              "Debarment screening",
              "EPFO status",
              "Recommendation",
            ]
              .filter((_, i) => !diff || [0, 4, 5, 6, 7, 8].includes(i))
              .map((r, i) => (
                <tr key={r}>
                  <th>
                    {r}
                    <span>
                      {i === 0
                        ? "Tender-aware result"
                        : "Open evidence for details"}
                    </span>
                  </th>
                  {bidders.map((b, j) => {
                    const states =
                      j === 0
                        ? [
                            b.mandatory,
                            "Compliant",
                            "Compliant",
                            "Compliant",
                            "Critical",
                            "Review",
                            "Compliant",
                            "Unavailable",
                            "Seek clarification",
                          ]
                        : [
                            b.mandatory,
                            "Compliant",
                            "Compliant",
                            j === 2 ? "Review" : "Compliant",
                            j === 2 ? "Review" : "Compliant",
                            "Compliant",
                            "Compliant",
                            j === 1 ? "Pending" : "Compliant",
                            j === 2 ? "Manual review" : "Qualify",
                          ];
                    const v = String(
                      states[
                        [
                          "Mandatory criteria",
                          "GST registration",
                          "PAN identity",
                          "Udyam registration",
                          "OEM authorization",
                          "Local content â‰¥ 50%",
                          "Debarment screening",
                          "EPFO status",
                          "Recommendation",
                        ].indexOf(r)
                      ],
                    );
                    return (
                      <td
                        key={b.id}
                        onClick={() =>
                          j === 0 &&
                          open(
                            apex.checks[
                              Math.max(
                                0,
                                [
                                  "Mandatory criteria",
                                  "GST registration",
                                  "PAN identity",
                                  "Udyam registration",
                                  "OEM authorization",
                                  "Local content â‰¥ 50%",
                                  "Debarment screening",
                                  "EPFO status",
                                ].indexOf(r) - 1,
                              )
                            ],
                          )
                        }
                      >
                        <span
                          className={
                            "matrix " + v.toLowerCase().replace(" ", "")
                          }
                        >
                          {v}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
function Audit({go}:{go:(p:Page)=>void}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [eventFilter, setEventFilter] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const auditEvents = useAuditEvents();
  const events = auditEvents.map(event => [new Date(event.timestamp).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'medium'}),event.user,event.description,event.type,event.referenceId]);
  return (
    <>
      <PageHead
        eyebrow="APPEND-ONLY RECORD"
        title="Audit trail"
        sub="Trace every system action, evidence access and human decision."
      >
        <button className="secondary" onClick={()=>go('auditor')}><Eye/> Auditor view</button>
        <button
          className={filtersOpen ? "secondary activebtn" : "secondary"}
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((value) => !value)}
        >
          <SlidersHorizontal /> Filters
        </button>
        <button
          onClick={() => {
            const rows = [["Time", "Actor", "Event", "Type", "Reference"], ...events];
            downloadFile("audit-report.csv", rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n"), "text/csv");
          }}
        >
          <Archive /> Export audit report
        </button>
      </PageHead>
      <div className="audit-integrity"><ShieldCheck/><div><span className="eyebrow">EVIDENCE CHAIN Â· TAMPER-EVIDENT AUDIT LEDGER</span><h2>Chain Valid</h2><p>{auditEvents.length} events linked by payload digest, previous hash and current hash. This is not a blockchain.</p></div><button onClick={()=>alert(`Audit chain verified across ${auditEvents.length} linked events`)}>Verify chain</button></div>
      {filtersOpen && <div className="auditfilters functional-filters">
        <label>Event type<select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}><option>All</option>{[...new Set(events.map((event) => event[3]))].map((type) => <option key={type}>{type}</option>)}</select></label>
        <span>Actor: All users</span><span>Tender: CPCL/PROC/2026/041</span><span>29 Aug â€” 29 Sep 2026</span>
      </div>}
      <section className="panel timeline">
        {events.filter((event) => eventFilter === "All" || event[3] === eventFilter).map((e, i) => (
          <React.Fragment key={e[4]}>
          <button
            aria-expanded={selectedEvent === e[4]}
            onClick={() => setSelectedEvent(selectedEvent === e[4] ? null : e[4])}
          >
            <i className={i < 2 ? "system" : "human"}>
              {i < 2 ? <Activity /> : <Users />}
            </i>
            <time>{e[0]}</time>
            <div>
              <b>{e[2]}</b>
              <span>
                {e[1]} Â· {e[3]}
              </span>
            </div>
            <code>{e[4]}</code>
            <ArrowRight />
          </button>
          {selectedEvent === e[4] && <div className="audit-event-detail"><b>{e[2]}</b><span>Actor: {e[1]}</span><span>Event type: {e[3]}</span><code>{e[4]}</code><small>Integrity verified Â· append-only event</small></div>}
          </React.Fragment>
        ))}
      </section>
    </>
  );
}
function Integrations({ flash }: { flash: (s: string) => void }) {
  const sources = providers;
  const [selectedSource, setSelectedSource] = useState<(typeof providers)[number] | null>(null);
  const sourceProfiles: Record<string, { authority: string; scope: string; classification: string }> = {
    GSTN: { authority: "Goods and Services Tax Network", scope: "GST registration status and legal-name verification", classification: "Tax registration registry" },
    "Udyam / MSME": { authority: "Ministry of Micro, Small & Medium Enterprises", scope: "Udyam registration and enterprise classification", classification: "MSME registration registry" },
    PAN: { authority: "Income Tax Department", scope: "Tax identity and legal-name matching", classification: "Direct-tax identity registry" },
    "Income Tax": { authority: "Income Tax Department", scope: "Filing evidence and statutory compliance review", classification: "Tax filing evidence source" },
    MCA21: { authority: "Ministry of Corporate Affairs", scope: "Company status, directors and incorporation details", classification: "Corporate affairs registry" },
    "Startup India / DPIIT": { authority: "Department for Promotion of Industry and Internal Trade", scope: "Startup recognition and certificate status", classification: "DPIIT recognition registry" },
    NSIC: { authority: "National Small Industries Corporation", scope: "Single Point Registration and MSME certification", classification: "Enterprise certification registry" },
    EPFO: { authority: "Employees' Provident Fund Organisation", scope: "Establishment registration and contribution status", classification: "Provident-fund registry" },
    ESIC: { authority: "Employees' State Insurance Corporation", scope: "Employer registration and coverage status", classification: "Social-insurance registry" },
    DigiLocker: { authority: "Ministry of Electronics & Information Technology", scope: "Issuer-backed document retrieval and validation", classification: "Government document exchange" },
    "BIS / DPIIT": { authority: "Bureau of Indian Standards / DPIIT", scope: "Product certification and industrial licensing evidence", classification: "Standards and industry registry" },
    "Debarment Sources": { authority: "Configured procurement authorities", scope: "Debarment, suspension and exclusion screening", classification: "Procurement exclusion registry" },
  };
  useEffect(() => {
    if (!selectedSource) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setSelectedSource(null);
    addEventListener("keydown", close);
    return () => removeEventListener("keydown", close);
  }, [selectedSource]);
  return (
    <>
      <PageHead
        eyebrow="PROVIDER ADAPTERS"
        title="Source health"
        sub="Connectivity state is kept separate from bidder compliance outcomes."
      >
        <button
          onClick={() =>
            flash("Source health refreshed Â· EPFO remains unavailable")
          }
        >
          <RefreshCw /> Refresh health
        </button>
      </PageHead>
      <div className="notice">
        <AlertTriangle />
        <div>
          <b>Prototype environment</b>
          <span>
            All government-source responses shown in this prototype are
            synthetic mock or cached records. No live government API connection
            is claimed.
          </span>
        </div>
      </div>
      <section className="panel sourcegrid">
        {sources.map((s) => (
          <article className="source-card" key={s.id}>
            <button className="source-card-trigger" onClick={() => setSelectedSource(s)} aria-label={`Open ${s.name} source record`}>
              <div className="sourceicon">
                <Activity />
              </div>
              <div>
                <b>{s.name}</b>
                <span>{sourceProfiles[s.name].classification}</span>
              </div>
              <span className={"healthpill " + s.status.toLowerCase()}>{s.status}</span>
            </button>
            <dl>
              <div>
                <dt>Mode</dt>
                <dd>
                  <span className={"source " + s.mode.toLowerCase()}>{s.mode}</span>
                </dd>
              </div>
              <div>
                <dt>Latency</dt>
                <dd>{s.latency}</dd>
              </div>
              <div>
                <dt>Affected verifications</dt>
                <dd>{s.affectedVerifications}</dd>
              </div>
              <div>
                <dt>Last check</dt>
                <dd>{s.lastCheck}</dd>
              </div>
            </dl>
            <button
              className="secondary source-record-button"
              onClick={() => setSelectedSource(s)}
            >
              <FileSearch /> View source record <ArrowRight />
            </button>
          </article>
        ))}
      </section>
      {selectedSource && (
        <div className="scrim source-scrim" onMouseDown={(event) => event.target === event.currentTarget && setSelectedSource(null)}>
          <aside className="source-dossier" role="dialog" aria-modal="true" aria-label={`${selectedSource.name} source record`}>
            <header>
              <div><span className="eyebrow">AUTHORITATIVE SOURCE RECORD</span><h2>{selectedSource.name}</h2><p>{sourceProfiles[selectedSource.name].classification}</p></div>
              <button className="iconbtn" onClick={() => setSelectedSource(null)} aria-label="Close source record"><X /></button>
            </header>
            <div className="source-dossier-status"><span className={"healthpill " + selectedSource.status.toLowerCase()}>{selectedSource.status}</span><span className={"source " + selectedSource.mode.toLowerCase()}>{selectedSource.mode}</span></div>
            <section>
              <span className="eyebrow">SOURCE AUTHORITY</span>
              <h3>{sourceProfiles[selectedSource.name].authority}</h3>
              <p>{sourceProfiles[selectedSource.name].scope}</p>
            </section>
            <dl>
              <div><dt>Source reference</dt><dd className="mono">{selectedSource.id.toUpperCase()}</dd></div>
              <div><dt>Access mode</dt><dd>{selectedSource.mode}</dd></div>
              <div><dt>Current state</dt><dd>{selectedSource.status}</dd></div>
              <div><dt>Observed latency</dt><dd>{selectedSource.latency}</dd></div>
              <div><dt>Last health check</dt><dd>{selectedSource.lastCheck}</dd></div>
              <div><dt>Affected checks</dt><dd>{selectedSource.affectedVerifications}</dd></div>
            </dl>
            <div className="source-provenance-note"><ShieldCheck /><div><b>Provenance policy</b><span>This prototype displays retained synthetic or cached records. The source authority is identified for traceability; no live API response is implied.</span></div></div>
            <footer>
              <button className="secondary" onClick={() => setSelectedSource(null)}>Close record</button>
              <button onClick={() => {appendAuditEvent({user:'A. Krishnan',type:'EVIDENCE_VIEWED',description:`${selectedSource.name} source record reviewed`,referenceId:selectedSource.id});flash(`${selectedSource.name} source record added to recent activity`);setSelectedSource(null)}}>Acknowledge review</button>
            </footer>
          </aside>
        </div>
      )}
    </>
  );
}
function Palette({ go, close }: { go: (p: Page) => void; close: () => void }) {
  const [search, setSearch] = useState("");
  const items: [string, string, Page][] = [
    ["Tenders", "Open active tenders", "tenders"],
    ["Verification", "Run bidder verification", "verification"],
    ["Comparison", "Compare participating bidders", "comparison"],
    ["Audit", "Inspect immutable events", "audit"],
    ["Sources", "View integration health", "integrations"],
  ];
  const filteredItems = items.filter(([title, description]) =>
    `${title} ${description}`.toLowerCase().includes(search.toLowerCase()),
  );
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "Enter" && filteredItems.length === 1) {
        go(filteredItems[0][2]);
        close();
      }
    };
    addEventListener("keydown", handleKey);
    return () => removeEventListener("keydown", handleKey);
  }, [close, filteredItems, go]);
  return (
    <div
      className="palette-scrim"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="palette">
        <div>
          <Search />
          <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search or type a commandâ€¦" />
          <kbd>Esc</kbd>
        </div>
        <span className="eyebrow">QUICK ACTIONS</span>
        {filteredItems.map(([a, b, p]) => (
          <button
            key={a}
            onClick={() => {
              go(p);
              close();
            }}
          >
            <Command />
            <div>
              <b>{a}</b>
              <span>{b}</span>
            </div>
            <ArrowRight />
          </button>
        ))}
        {filteredItems.length === 0 && <div className="palette-empty">No matching command</div>}
      </div>
    </div>
  );
}
function Assistant({ close, open }: { close: () => void; open: () => void }) {
  const [asked, setAsked] = useState(false);
  const [question, setQuestion] = useState("");
  const ask = (value?: string) => {
    if (value) setQuestion(value);
    if ((value || question).trim()) setAsked(true);
  };
  return (
    <aside className="assistant">
      <header>
        <div>
          <Sparkles />
          <span>
            Compliance Assistant<small>Evidence-grounded Â· Read only</small>
          </span>
        </div>
        <button onClick={close}>
          <X />
        </button>
      </header>
      <div className="chat">
        {asked ? (
          <>
            <div className="userbubble">{question || "Why does this bidder need clarification?"}</div>
            <div className="answer">
              <b>Two findings need officer review.</b>
              <p>
                OEM authorization ends before expected contract execution, a
                mandatory condition under Technical 7.4. The local-content
                certificate reads 54%, versus 57% declared; both remain above
                the 50% threshold.
              </p>
              <button onClick={open}>Open evidence EV-26041-OEM-0088 â†’</button>
              <small>
                I can explain evidence, but cannot make the procurement
                decision.
              </small>
            </div>
          </>
        ) : (
          <>
            <div className="assistintro">
              <Sparkles />
              <b>Ask about this evaluation</b>
              <span>
                Answers reference tender clauses and evidence records.
              </span>
            </div>
            {[
              "Why did this bidder need clarification?",
              "Which mandatory checks are pending?",
              "Explain Rule 7.4",
            ].map((q) => (
              <button onClick={() => ask(q)} key={q}>
                {q}
                <ArrowRight />
              </button>
            ))}
          </>
        )}
      </div>
      <div className="ask">
        <input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="Ask about compliance evidenceâ€¦" />
        <button disabled={!question.trim()} onClick={() => ask()}>
          <ArrowRight />
        </button>
      </div>
    </aside>
  );
}

