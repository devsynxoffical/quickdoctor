import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Pill,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type PanelTab = "dashboard" | "patients" | "consultations" | "bookings" | "prescriptions" | "doctor" | "settings";

type Patient = {
  id: string;
  name: string;
  age: number;
  treatment: string;
  risk: "low" | "medium" | "high";
  status: "Active" | "Follow-up" | "Pending";
  lastVisit: string;
  nextAction: string;
};

const monthlyActivity = [
  { month: "Jan", consultations: 112, prescriptions: 91 },
  { month: "Feb", consultations: 132, prescriptions: 105 },
  { month: "Mar", consultations: 144, prescriptions: 116 },
  { month: "Apr", consultations: 163, prescriptions: 130 },
  { month: "May", consultations: 171, prescriptions: 139 },
  { month: "Jun", consultations: 188, prescriptions: 146 },
];

const consultationStatus = [
  { name: "Completed", value: 421 },
  { name: "In Review", value: 67 },
  { name: "Urgent", value: 21 },
];

const patients: Patient[] = [
  { id: "PT-1031", name: "Sarah Murphy", age: 34, treatment: "Migraine", risk: "medium", status: "Active", lastVisit: "2026-04-27", nextAction: "Review symptom diary and refill triptan" },
  { id: "PT-1048", name: "Conor Walsh", age: 39, treatment: "Hair Loss", risk: "low", status: "Follow-up", lastVisit: "2026-04-26", nextAction: "Side-effect check in 2 weeks" },
  { id: "PT-1095", name: "Ava Byrne", age: 28, treatment: "Contraceptive", risk: "medium", status: "Active", lastVisit: "2026-04-25", nextAction: "Verify BP update before renewal" },
  { id: "PT-1120", name: "Noah Kelly", age: 44, treatment: "Stop Smoking", risk: "high", status: "Pending", lastVisit: "2026-04-24", nextAction: "Assess neuropsych risk flag" },
];

const consultations = [
  { id: "CS-3211", patient: "Noah Kelly", queue: "Urgent", priority: "high", reason: "Neuropsychiatric side effects review", sla: "Due in 12m" },
  { id: "CS-3212", patient: "Ava Byrne", queue: "In Review", priority: "medium", reason: "Contraceptive BP discrepancy", sla: "Due in 1h 18m" },
  { id: "CS-3213", patient: "Sarah Murphy", queue: "Routine", priority: "low", reason: "Migraine refill protocol", sla: "Due in 4h 06m" },
];

const bookings = [
  { date: "2026-04-30", time: "10:00", patient: "Sarah Murphy", type: "Video Consult", reason: "Migraine Review", doctor: "Dr. O'Sullivan" },
  { date: "2026-04-30", time: "10:30", patient: "Ava Byrne", type: "Prescription Follow-up", reason: "Contraceptive refill", doctor: "Dr. O'Sullivan" },
  { date: "2026-04-30", time: "11:15", patient: "Conor Walsh", type: "Video Consult", reason: "Hair loss side effects", doctor: "Dr. O'Sullivan" },
];

const prescriptions = [
  { rx: "RX-90013", patient: "Noah Kelly", medication: "Varenicline", dose: "1mg starter pack", issued: "2026-04-29", status: "Awaiting pickup", safetyCheck: "Completed" },
  { rx: "RX-90012", patient: "Ava Byrne", medication: "Yasminelle", dose: "3-month supply", issued: "2026-04-29", status: "Issued", safetyCheck: "BP verified" },
  { rx: "RX-90011", patient: "Conor Walsh", medication: "Finasteride", dose: "1mg OD", issued: "2026-04-28", status: "Renewal due", safetyCheck: "Review needed" },
];

function StatusChip({ label }: { label: string }) {
  const key = label.toLowerCase();
  const cls =
    key.includes("urgent") || key.includes("high")
      ? "chip chip-red"
      : key.includes("review") || key.includes("pending") || key.includes("medium")
      ? "chip chip-amber"
      : "chip chip-green";
  return <span className={cls}>{label}</span>;
}

function App() {
  const [tab, setTab] = useState<PanelTab>("dashboard");
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient>(patients[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const filteredPatients = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return patients;
    return patients.filter((p) => `${p.name} ${p.id} ${p.treatment}`.toLowerCase().includes(query));
  }, [search]);

  const menu: Array<{ key: PanelTab; label: string; icon: React.ReactNode }> = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "patients", label: "Patients", icon: <Users size={18} /> },
    { key: "consultations", label: "Consultations", icon: <Stethoscope size={18} /> },
    { key: "bookings", label: "Bookings & History", icon: <CalendarClock size={18} /> },
    { key: "prescriptions", label: "Prescriptions", icon: <Pill size={18} /> },
    { key: "doctor", label: "Doctor Profile", icon: <UserRound size={18} /> },
    { key: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword.trim();
    if (email === "doctor@quickdoctor.ie" && password === "Doctor@123") {
      setIsAuthenticated(true);
      setLoginError("");
      return;
    }
    setLoginError("Invalid login details. Use doctor@quickdoctor.ie / Doctor@123");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginPassword("");
  };

  if (!isAuthenticated) {
    return (
      <main className="login-shell">
        <section className="login-card">
          <div className="brand">
            <div className="brand-badge">WD</div>
            <div>
              <h1>Doctor Admin Login</h1>
              <p>QuickDoctor Clinical Panel</p>
            </div>
          </div>
          <h2>Welcome back</h2>
          <p className="login-subtitle">Sign in to manage consultations, patients, prescriptions, and booking history.</p>
          <form onSubmit={handleLogin} className="login-form">
            <label>
              Work email
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="doctor@quickdoctor.ie"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </label>
            {loginError && <p className="login-error">{loginError}</p>}
            <button type="submit" className="login-btn">Sign in</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-badge">WD</div>
          <div>
            <h1>Doctor Admin</h1>
            <p>Clinical Operations Workspace</p>
          </div>
        </div>
        <div className="doctor-mini">
          <p className="small">Signed in as</p>
          <h3>Dr. Maeve O&apos;Sullivan</h3>
          <p className="small">IMC 017235 • Family Medicine</p>
        </div>
        <nav className="menu">
          {menu.map((item) => (
            <button key={item.key} className={`menu-item ${tab === item.key ? "active" : ""}`} onClick={() => setTab(item.key)}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <h2>Clinical Command Center</h2>
            <p>Manage consultations, patient records, safety checks, booking history, and prescriptions from one dashboard.</p>
          </div>
          <div className="topbar-actions">
            <label className="searchbox">
              <Search size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patients, IDs, treatment..." />
            </label>
            <button type="button" onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </header>

        {tab === "dashboard" && (
          <>
            <section className="kpis">
              <article className="card kpi">
                <p>Today&apos;s Consultations</p>
                <h3>24</h3>
                <span>7 waiting doctor action</span>
              </article>
              <article className="card kpi">
                <p>Active Patients</p>
                <h3>1,842</h3>
                <span>112 new this month</span>
              </article>
              <article className="card kpi">
                <p>Pending Prescriptions</p>
                <h3>61</h3>
                <span>9 high priority safety checks</span>
              </article>
              <article className="card kpi">
                <p>Avg. Response Time</p>
                <h3>19m</h3>
                <span>SLA: under 25m</span>
              </article>
            </section>

            <section className="grid-main">
              <article className="card chart-card">
                <h4>Consultation & Prescription Throughput</h4>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={monthlyActivity}>
                    <defs>
                      <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00A7C4" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#00A7C4" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="c2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="consultations" stroke="#00A7C4" fill="url(#c1)" />
                    <Area type="monotone" dataKey="prescriptions" stroke="#4F46E5" fill="url(#c2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </article>
              <article className="card chart-card">
                <h4>Consultation Status</h4>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={consultationStatus} dataKey="value" nameKey="name" outerRadius={95} fill="#00A7C4" />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </article>
            </section>

            <section className="grid-main">
              <article className="card list-card">
                <h4>Urgent Clinical Alerts</h4>
                <ul>
                  <li><AlertTriangle size={16} /> Patient PT-1120 flagged for mood-related side effects after varenicline.</li>
                  <li><AlertTriangle size={16} /> Two ED requests missing blood pressure evidence for last 6 months.</li>
                  <li><AlertTriangle size={16} /> One contraceptive renewal blocked by migraine-with-aura safety protocol.</li>
                </ul>
              </article>
              <article className="card list-card">
                <h4>Operational Checklist</h4>
                <ul>
                  <li><ClipboardCheck size={16} /> 14 consultation notes pending electronic signature.</li>
                  <li><ShieldCheck size={16} /> 8 prescriptions awaiting contraindication re-check.</li>
                  <li><Activity size={16} /> Daily audit export scheduled for 18:30.</li>
                </ul>
              </article>
            </section>
          </>
        )}

        {tab === "patients" && (
          <section className="split-layout">
            <article className="card table-card">
              <h4>Patient Registry</h4>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Treatment</th>
                    <th>Risk</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((p) => (
                    <tr key={p.id} onClick={() => setSelectedPatient(p)} className={selectedPatient.id === p.id ? "selected-row" : ""}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.age}</td>
                      <td>{p.treatment}</td>
                      <td><StatusChip label={p.risk} /></td>
                      <td><StatusChip label={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
            <article className="card detail-card">
              <h4>Patient Clinical Snapshot</h4>
              <p><strong>Patient:</strong> {selectedPatient.name}</p>
              <p><strong>ID:</strong> {selectedPatient.id}</p>
              <p><strong>Current Treatment:</strong> {selectedPatient.treatment}</p>
              <p><strong>Last Consultation:</strong> {selectedPatient.lastVisit}</p>
              <p><strong>Risk Tier:</strong> {selectedPatient.risk}</p>
              <p><strong>Next Action:</strong> {selectedPatient.nextAction}</p>
              <div className="divider" />
              <h5>Recent Timeline</h5>
              <ul className="timeline">
                <li>2026-04-27: Questionnaire reviewed by clinician.</li>
                <li>2026-04-25: Safety contraindication check completed.</li>
                <li>2026-04-20: Patient uploaded supporting history.</li>
              </ul>
            </article>
          </section>
        )}

        {tab === "consultations" && (
          <section className="split-layout">
            <article className="card table-card">
              <h4>Consultation Queue</h4>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Queue</th>
                    <th>Reason</th>
                    <th>SLA</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.patient}</td>
                      <td><StatusChip label={c.queue} /></td>
                      <td>{c.reason}</td>
                      <td>{c.sla}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
            <article className="card detail-card">
              <h4>Consultation Actions</h4>
              <ul className="timeline">
                <li>Run contraindication check against medication history.</li>
                <li>Request extra details from patient if forms incomplete.</li>
                <li>Approve/decline and attach doctor rationale note.</li>
                <li>Escalate high-risk cases to same-day review queue.</li>
              </ul>
            </article>
          </section>
        )}

        {tab === "bookings" && (
          <section className="card table-card">
            <h4>Bookings & Visit History</h4>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Doctor</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={`${b.patient}-${i}`}>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td>{b.patient}</td>
                    <td>{b.type}</td>
                    <td>{b.reason}</td>
                    <td>{b.doctor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {tab === "prescriptions" && (
          <section className="split-layout">
            <article className="card table-card">
              <h4>Prescription Center</h4>
              <table>
                <thead>
                  <tr>
                    <th>Rx ID</th>
                    <th>Patient</th>
                    <th>Medication</th>
                    <th>Dose</th>
                    <th>Issued</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((rx) => (
                    <tr key={rx.rx}>
                      <td>{rx.rx}</td>
                      <td>{rx.patient}</td>
                      <td>{rx.medication}</td>
                      <td>{rx.dose}</td>
                      <td>{rx.issued}</td>
                      <td><StatusChip label={rx.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
            <article className="card detail-card">
              <h4>Prescription Safety Summary</h4>
              {prescriptions.map((rx) => (
                <p key={rx.rx}><strong>{rx.rx}</strong>: {rx.safetyCheck}</p>
              ))}
            </article>
          </section>
        )}

        {tab === "doctor" && (
          <section className="split-layout">
            <article className="card profile-card">
              <h4>Doctor Details</h4>
              <p><strong>Name:</strong> Dr. Maeve O&apos;Sullivan</p>
              <p><strong>Specialties:</strong> Women&apos;s Health, Family Medicine, Preventive Care</p>
              <p><strong>Registration:</strong> IMC 017235</p>
              <p><strong>Clinic Hours:</strong> Mon-Fri (09:00 - 18:00), Sat (10:00 - 14:00)</p>
              <p><strong>Avg. Patient Rating:</strong> 4.9 / 5.0</p>
            </article>
            <article className="card detail-card">
              <h4>Performance Metrics</h4>
              <ul className="timeline">
                <li>Consultations this month: 188</li>
                <li>Prescriptions approved: 146</li>
                <li>Average approval turnaround: 19 minutes</li>
                <li>Clinical note completion: 98.3%</li>
              </ul>
            </article>
          </section>
        )}

        {tab === "settings" && (
          <section className="split-layout">
            <article className="card list-card">
              <h4>Panel Settings</h4>
              <ul>
                <li><FileText size={16} /> Notification preferences for urgent consultations</li>
                <li><Activity size={16} /> Clinical audit logs and access tracking</li>
                <li><Settings size={16} /> Profile signature, templates, prescription defaults</li>
              </ul>
            </article>
            <article className="card list-card">
              <h4>Compliance & Security</h4>
              <ul>
                <li><ShieldCheck size={16} /> Two-factor authentication enabled</li>
                <li><CheckCircle2 size={16} /> Last policy acknowledgement: 2026-04-17</li>
                <li><ClipboardList size={16} /> Data retention policy: 7 years</li>
              </ul>
            </article>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
