const navItems = [
  { id: "dashboard", label: "Dashboard", subtitle: "Monitor operations, teams, and platform health." },
  { id: "doctors", label: "Doctors", subtitle: "Manage doctor onboarding, status, and workloads." },
  { id: "patients", label: "Patients", subtitle: "Review patient profiles and clinical risk summaries." },
  { id: "prescriptions", label: "Prescriptions", subtitle: "Track approvals, pending reviews, and rejections." },
  { id: "appointments", label: "Appointments", subtitle: "Monitor virtual consultations and outcomes." },
  { id: "billing", label: "Billing", subtitle: "Review invoices, revenue, and payout records." },
  { id: "support", label: "Support", subtitle: "Manage customer tickets and issue resolution." },
  { id: "settings", label: "Settings", subtitle: "Configure platform controls and role policies." },
  { id: "content", label: "Content Manager", subtitle: "Manage website pages, hero content, and metadata." },
];

const AUTH_KEY = "qd_super_admin_auth";

const data = {
  stats: [
    { label: "Total Revenue", value: "EUR 486,120", trend: "+12.6%" },
    { label: "Active Doctors", value: "124", trend: "+4.2%" },
    { label: "Registered Patients", value: "42,893", trend: "+8.9%" },
    { label: "Pending Prescriptions", value: "219", trend: "-3.1%" },
  ],
  revenueByMonth: [
    { month: "Jan", value: 48 },
    { month: "Feb", value: 56 },
    { month: "Mar", value: 62 },
    { month: "Apr", value: 58 },
    { month: "May", value: 73 },
    { month: "Jun", value: 81 },
  ],
  services: [
    { name: "General Prescriptions", percent: 36 },
    { name: "Dermatology", percent: 21 },
    { name: "Women's Health", percent: 18 },
    { name: "Respiratory", percent: 15 },
    { name: "Other Services", percent: 10 },
  ],
  alerts: [
    { title: "High queue in respiratory prescriptions", details: "47 cases waiting > 6 hours", severity: "warning" },
    { title: "Doctor license expiry risk", details: "3 doctor licenses expiring in 10 days", severity: "danger" },
    { title: "Payment gateway latency", details: "Temporary delay in invoice confirmation", severity: "warning" },
  ],
  activity: [
    "Dr. Sarah O'Connell approved 6 prescriptions.",
    "New doctor onboarding submitted: Dr. Aditya Rao.",
    "Patient account flagged for duplicate records.",
    "Support ticket #SUP-1042 escalated to Clinical Admin.",
  ],
  doctors: [
    {
      id: "DOC-201",
      name: "Dr. Sarah O'Connell",
      specialty: "General Practice",
      status: "Active",
      patients: 983,
      rating: "4.9",
      email: "s.oconnell@quickdoctor.ie",
      phone: "+353 85 100 2001",
      experience: "11 years",
      licenseExpiry: "2027-01-15",
      avgReviewTime: "18 min",
      completionRate: "98%",
      notes: "Top performer in same-day prescription approvals.",
    },
    {
      id: "DOC-202",
      name: "Dr. Faisal Khan",
      specialty: "Respiratory Medicine",
      status: "Active",
      patients: 742,
      rating: "4.8",
      email: "f.khan@quickdoctor.ie",
      phone: "+353 85 100 2002",
      experience: "9 years",
      licenseExpiry: "2026-11-09",
      avgReviewTime: "24 min",
      completionRate: "95%",
      notes: "Handles most asthma and COPD escalation cases.",
    },
    {
      id: "DOC-203",
      name: "Dr. Aoife Brennan",
      specialty: "Dermatology",
      status: "Pending",
      patients: 0,
      rating: "-",
      email: "a.brennan@quickdoctor.ie",
      phone: "+353 85 100 2003",
      experience: "7 years",
      licenseExpiry: "2026-12-01",
      avgReviewTime: "-",
      completionRate: "-",
      notes: "Pending final document verification.",
    },
    {
      id: "DOC-204",
      name: "Dr. Niamh Doyle",
      specialty: "Women's Health",
      status: "Inactive",
      patients: 519,
      rating: "4.7",
      email: "n.doyle@quickdoctor.ie",
      phone: "+353 85 100 2004",
      experience: "10 years",
      licenseExpiry: "2026-09-21",
      avgReviewTime: "26 min",
      completionRate: "94%",
      notes: "Inactive due to temporary leave.",
    },
  ],
  patients: [
    {
      id: "PT-971",
      name: "Emma Murphy",
      age: 34,
      risk: "Low",
      conditions: "Asthma",
      lastVisit: "2026-04-25",
      email: "emma.murphy@mail.com",
      phone: "+353 87 210 4511",
      gender: "Female",
      bloodGroup: "O+",
      allergies: "Penicillin",
      address: "12 Park Lane, Dublin",
      emergencyContact: "John Murphy (+353 87 300 1212)",
    },
    {
      id: "PT-972",
      name: "Sean Gallagher",
      age: 49,
      risk: "Medium",
      conditions: "Hypertension",
      lastVisit: "2026-04-27",
      email: "sean.gallagher@mail.com",
      phone: "+353 87 210 4512",
      gender: "Male",
      bloodGroup: "A+",
      allergies: "None",
      address: "4 Elm Street, Cork",
      emergencyContact: "Maeve Gallagher (+353 87 300 1313)",
    },
    {
      id: "PT-973",
      name: "Liam Byrne",
      age: 67,
      risk: "High",
      conditions: "COPD, Diabetes",
      lastVisit: "2026-04-21",
      email: "liam.byrne@mail.com",
      phone: "+353 87 210 4513",
      gender: "Male",
      bloodGroup: "B+",
      allergies: "Sulfa drugs",
      address: "18 Harbour Road, Galway",
      emergencyContact: "Clare Byrne (+353 87 300 1414)",
    },
    {
      id: "PT-974",
      name: "Orla Walsh",
      age: 28,
      risk: "Low",
      conditions: "Eczema",
      lastVisit: "2026-04-26",
      email: "orla.walsh@mail.com",
      phone: "+353 87 210 4514",
      gender: "Female",
      bloodGroup: "AB+",
      allergies: "Dust mites",
      address: "22 Green Avenue, Limerick",
      emergencyContact: "Aidan Walsh (+353 87 300 1515)",
    },
  ],
  prescriptions: [
    { id: "RX-5501", patient: "Emma Murphy", doctor: "Dr. Khan", medication: "Symbicort", status: "Approved", date: "2026-04-28" },
    { id: "RX-5502", patient: "Sean Gallagher", doctor: "Dr. O'Connell", medication: "Amlodipine", status: "Pending", date: "2026-04-28" },
    { id: "RX-5503", patient: "Liam Byrne", doctor: "Dr. Khan", medication: "Salbutamol", status: "Rejected", date: "2026-04-27" },
    { id: "RX-5504", patient: "Orla Walsh", doctor: "Dr. Brennan", medication: "Hydrocortisone", status: "Approved", date: "2026-04-26" },
  ],
  appointments: [
    { id: "APPT-892", patient: "Emma Murphy", doctor: "Dr. Khan", time: "2026-04-29 09:30", status: "Scheduled" },
    { id: "APPT-893", patient: "Sean Gallagher", doctor: "Dr. O'Connell", time: "2026-04-28 12:00", status: "Completed" },
    { id: "APPT-894", patient: "Liam Byrne", doctor: "Dr. Khan", time: "2026-04-28 14:15", status: "Cancelled" },
    { id: "APPT-895", patient: "Orla Walsh", doctor: "Dr. Brennan", time: "2026-04-30 16:10", status: "Scheduled" },
  ],
  invoices: [
    { id: "INV-4201", account: "Corporate Plan", amount: "EUR 14,500", status: "Paid", dueDate: "2026-04-20" },
    { id: "INV-4202", account: "Public Prescriptions", amount: "EUR 8,760", status: "Pending", dueDate: "2026-05-05" },
    { id: "INV-4203", account: "Video Consultations", amount: "EUR 12,980", status: "Paid", dueDate: "2026-04-18" },
  ],
  payouts: [
    { doctor: "Dr. O'Connell", amount: "EUR 7,820", period: "Apr 2026", state: "Processed" },
    { doctor: "Dr. Khan", amount: "EUR 8,140", period: "Apr 2026", state: "Processing" },
    { doctor: "Dr. Doyle", amount: "EUR 6,430", period: "Apr 2026", state: "Processed" },
  ],
  tickets: [
    { id: "SUP-1042", requester: "Emma Murphy", topic: "Prescription update delay", priority: "High", status: "Open" },
    { id: "SUP-1043", requester: "Dr. Brennan", topic: "Document verification upload", priority: "Medium", status: "In Progress" },
    { id: "SUP-1044", requester: "Sean Gallagher", topic: "Payment confirmation", priority: "Low", status: "Resolved" },
  ],
  contentPages: [
    "/",
    "/about",
    "/admin",
    "/admin/blog",
    "/blog",
    "/consultation",
    "/consultation/female-doctor",
    "/consultation/male-doctor",
    "/consultation/portuguese",
    "/consultation/spanish",
    "/contact",
    "/cookies",
    "/dashboard",
    "/dashboard/appointments",
    "/doctor",
    "/doctor/prescriptions",
    "/faqs",
    "/login",
    "/medical-certificates",
    "/patient-guide",
    "/prescriptions",
    "/prescriptions/acne-treatment",
    "/prescriptions/anaphylaxis",
    "/prescriptions/asthma-treatment",
    "/prescriptions/bacterial-vaginosis-treatment",
    "/prescriptions/calculate-bmi",
    "/prescriptions/cold-sore-treatments",
    "/prescriptions/contraceptive-pill-patch-ring",
    "/prescriptions/cystitis-uti-treatment",
    "/prescriptions/eczema-treatment",
    "/prescriptions/erectile-dysfunction-treatment",
    "/prescriptions/excess-female-facial-hair",
    "/prescriptions/genital-herpes",
    "/prescriptions/genital-thrush-treatment",
    "/prescriptions/hay-fever",
    "/prescriptions/hpv-vaccine",
    "/prescriptions/hypothyroidism-treatment",
    "/prescriptions/jet-lag-prescription",
    "/prescriptions/male-hair-loss",
    "/prescriptions/menopausal-vaginal-dryness-treatment",
    "/prescriptions/migraine-treatment",
    "/prescriptions/period-delay-treatment",
    "/prescriptions/plaque-psoriasis-treatment",
    "/prescriptions/premature-ejaculation-treatment",
    "/prescriptions/rosacea-treatment",
    "/prescriptions/self-injectable",
    "/prescriptions/stop-smoking-treatment",
    "/prescriptions/travel-vaccines-anti-malaria",
    "/prescriptions/weight-management-consultation",
    "/privacy",
    "/refund-policy",
    "/register",
    "/self-injectable",
    "/terms",
  ].map((slug, index) => {
    const title =
      slug === "/"
        ? "Homepage"
        : slug
            .split("/")
            .filter(Boolean)
            .map((part) =>
              part
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")
            )
            .join(" / ");

    return {
      slug,
      title,
      hero: `${title} Hero Section`,
      meta: `Manage SEO metadata and hero content for ${title}.`,
      status: index % 4 === 0 ? "Draft" : "Published",
      updatedAt: "2026-04-28",
    };
  }),
};

const mainNav = document.getElementById("main-nav");
const pageTitle = document.getElementById("page-title");
const pageSubtitle = document.getElementById("page-subtitle");
const globalSearch = document.getElementById("global-search");
const exportBtn = document.getElementById("export-btn");
const createBtn = document.getElementById("create-btn");
const logoutBtn = document.getElementById("logout-btn");
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const toastEl = document.getElementById("toast");
let activeViewId = "dashboard";
let selectedContentSlug = data.contentPages[0].slug;
let contentPageIndex = 1;
const CONTENT_PAGE_SIZE = 8;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toastEl.classList.remove("show");
  }, 1800);
}

function ensureAuthenticated() {
  const authFlag = localStorage.getItem(AUTH_KEY);
  if (authFlag !== "1") {
    window.location.href = "./login.html";
    return false;
  }
  return true;
}

function createBadge(value) {
  const safeValue = value.replace(/\s/g, ".");
  return `<span class="badge ${safeValue}">${value}</span>`;
}

function table(columns, rows) {
  const headers = columns.map((col) => `<th>${col.label}</th>`).join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${columns
          .map((col) => `<td>${typeof col.render === "function" ? col.render(row[col.key], row) : row[col.key]}</td>`)
          .join("")}</tr>`
    )
    .join("");
  return `<div class="table-wrap"><table><thead><tr>${headers}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function renderDashboard() {
  document.getElementById("stats-grid").innerHTML = data.stats
    .map(
      (stat) =>
        `<article class="stat-card">
          <p>${stat.label}</p>
          <h3>${stat.value}</h3>
          <span class="trend ${stat.trend.startsWith("-") ? "down" : "up"}">${stat.trend} vs last month</span>
        </article>`
    )
    .join("");

  const maxValue = Math.max(...data.revenueByMonth.map((r) => r.value));
  document.getElementById("revenue-chart").innerHTML = data.revenueByMonth
    .map((row) => `<div class="bar" style="height:${(row.value / maxValue) * 150}px"><span>${row.month}</span></div>`)
    .join("");

  document.getElementById("service-distribution").innerHTML = data.services
    .map(
      (item) =>
        `<div class="progress-row">
          <p><span>${item.name}</span><strong>${item.percent}%</strong></p>
          <div class="progress-track"><div class="progress-fill" style="width:${item.percent}%"></div></div>
        </div>`
    )
    .join("");

  document.getElementById("alerts-list").innerHTML = data.alerts
    .map(
      (alert) =>
        `<div>
          <h4>${alert.title}</h4>
          <small>${alert.details}</small>
        </div>`
    )
    .join("");

  document.getElementById("activity-list").innerHTML = data.activity.map((a) => `<div><p>${a}</p></div>`).join("");
}

function renderDoctors(filter = "all", search = "") {
  const rows = data.doctors.filter(
    (d) =>
      (filter === "all" || d.status === filter) &&
      `${d.name} ${d.specialty} ${d.id}`.toLowerCase().includes(search.toLowerCase())
  );
  document.getElementById("doctors-table").innerHTML = table(
    [
      { key: "id", label: "Doctor ID" },
      { key: "name", label: "Name" },
      { key: "specialty", label: "Specialty" },
      { key: "patients", label: "Patients Managed" },
      { key: "rating", label: "Rating" },
      { key: "status", label: "Status", render: (v) => createBadge(v) },
      { key: "id", label: "Action", render: (v) => `<button class="btn js-view-doctor" data-id="${v}">View</button>` },
    ],
    rows
  );
}

function renderPatients(filter = "all", search = "") {
  const rows = data.patients.filter(
    (p) => (filter === "all" || p.risk === filter) && `${p.name} ${p.conditions} ${p.id}`.toLowerCase().includes(search.toLowerCase())
  );
  document.getElementById("patients-table").innerHTML = table(
    [
      { key: "id", label: "Patient ID" },
      { key: "name", label: "Name" },
      { key: "age", label: "Age" },
      { key: "risk", label: "Risk Level" },
      { key: "conditions", label: "Conditions" },
      { key: "lastVisit", label: "Last Visit" },
      { key: "id", label: "Action", render: (v) => `<button class="btn js-view-patient" data-id="${v}">View</button>` },
    ],
    rows
  );
}

function renderPrescriptions(filter = "all", search = "") {
  const rows = data.prescriptions.filter(
    (r) =>
      (filter === "all" || r.status === filter) &&
      `${r.id} ${r.patient} ${r.doctor} ${r.medication}`.toLowerCase().includes(search.toLowerCase())
  );
  document.getElementById("prescriptions-table").innerHTML = table(
    [
      { key: "id", label: "Prescription ID" },
      { key: "patient", label: "Patient" },
      { key: "doctor", label: "Doctor" },
      { key: "medication", label: "Medication" },
      { key: "date", label: "Date" },
      { key: "status", label: "Status", render: (v) => createBadge(v) },
    ],
    rows
  );
}

function renderAppointments(filter = "all", search = "") {
  const rows = data.appointments.filter(
    (a) => (filter === "all" || a.status === filter) && `${a.id} ${a.patient} ${a.doctor}`.toLowerCase().includes(search.toLowerCase())
  );
  document.getElementById("appointments-table").innerHTML = table(
    [
      { key: "id", label: "Appointment ID" },
      { key: "patient", label: "Patient" },
      { key: "doctor", label: "Doctor" },
      { key: "time", label: "Time" },
      { key: "status", label: "Status", render: (v) => createBadge(v) },
    ],
    rows
  );
}

function renderBilling() {
  document.getElementById("invoices-table").innerHTML = table(
    [
      { key: "id", label: "Invoice ID" },
      { key: "account", label: "Account" },
      { key: "amount", label: "Amount" },
      { key: "dueDate", label: "Due Date" },
      { key: "status", label: "Status", render: (v) => createBadge(v === "Paid" ? "Approved" : "Pending") },
    ],
    data.invoices
  );

  document.getElementById("payout-list").innerHTML = data.payouts
    .map(
      (item) =>
        `<div>
          <h4>${item.doctor}</h4>
          <p>${item.amount} - ${item.period}</p>
          <small>${item.state}</small>
        </div>`
    )
    .join("");
}

function renderSupport(filter = "all", search = "") {
  const rows = data.tickets.filter(
    (t) =>
      (filter === "all" || t.status === filter) &&
      `${t.id} ${t.requester} ${t.topic} ${t.priority}`.toLowerCase().includes(search.toLowerCase())
  );
  document.getElementById("tickets-table").innerHTML = table(
    [
      { key: "id", label: "Ticket ID" },
      { key: "requester", label: "Requester" },
      { key: "topic", label: "Topic" },
      { key: "priority", label: "Priority" },
      { key: "status", label: "Status", render: (v) => createBadge(v) },
    ],
    rows
  );
}

function renderDoctorDetail(doctorId) {
  const doctor = data.doctors.find((item) => item.id === doctorId);
  if (!doctor) return;
  document.getElementById("doctor-detail").innerHTML = `
    <div class="detail-card">
      <h4>${doctor.name}</h4>
      <p><strong>ID:</strong> ${doctor.id}</p>
      <p><strong>Specialty:</strong> ${doctor.specialty}</p>
      <p><strong>Status:</strong> ${createBadge(doctor.status)}</p>
      <p><strong>Email:</strong> ${doctor.email}</p>
      <p><strong>Phone:</strong> ${doctor.phone}</p>
      <p><strong>Experience:</strong> ${doctor.experience}</p>
      <p><strong>Patients Managed:</strong> ${doctor.patients}</p>
      <p><strong>Average Review Time:</strong> ${doctor.avgReviewTime}</p>
      <p><strong>Completion Rate:</strong> ${doctor.completionRate}</p>
      <p><strong>License Expiry:</strong> ${doctor.licenseExpiry}</p>
      <p><strong>Admin Notes:</strong> ${doctor.notes}</p>
    </div>
  `;
}

function renderPatientDetail(patientId) {
  const patient = data.patients.find((item) => item.id === patientId);
  if (!patient) return;
  document.getElementById("patient-detail").innerHTML = `
    <div class="detail-card">
      <h4>${patient.name}</h4>
      <p><strong>ID:</strong> ${patient.id}</p>
      <p><strong>Age:</strong> ${patient.age}</p>
      <p><strong>Gender:</strong> ${patient.gender}</p>
      <p><strong>Risk:</strong> ${createBadge(patient.risk === "High" ? "Rejected" : patient.risk === "Medium" ? "Pending" : "Approved")}</p>
      <p><strong>Conditions:</strong> ${patient.conditions}</p>
      <p><strong>Blood Group:</strong> ${patient.bloodGroup}</p>
      <p><strong>Allergies:</strong> ${patient.allergies}</p>
      <p><strong>Email:</strong> ${patient.email}</p>
      <p><strong>Phone:</strong> ${patient.phone}</p>
      <p><strong>Address:</strong> ${patient.address}</p>
      <p><strong>Emergency Contact:</strong> ${patient.emergencyContact}</p>
      <p><strong>Last Visit:</strong> ${patient.lastVisit}</p>
    </div>
  `;
}

function renderContentPages() {
  const search = document.getElementById("content-search")?.value?.toLowerCase() || "";
  const sectionFilter = document.getElementById("content-section-filter")?.value || "all";
  const statusFilter = document.getElementById("content-status-filter")?.value || "all";

  const sectionOf = (slug) => {
    if (slug.startsWith("/prescriptions")) return "prescriptions";
    if (slug.startsWith("/consultation")) return "consultation";
    if (slug.startsWith("/admin") || slug.startsWith("/dashboard") || slug.startsWith("/doctor")) return "admin";
    return "core";
  };

  const filtered = data.contentPages.filter((page) => {
    const searchMatch = `${page.title} ${page.slug}`.toLowerCase().includes(search);
    const sectionMatch = sectionFilter === "all" || sectionOf(page.slug) === sectionFilter;
    const statusMatch = statusFilter === "all" || page.status === statusFilter;
    return searchMatch && sectionMatch && statusMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / CONTENT_PAGE_SIZE));
  if (contentPageIndex > totalPages) contentPageIndex = totalPages;
  if (contentPageIndex < 1) contentPageIndex = 1;
  const start = (contentPageIndex - 1) * CONTENT_PAGE_SIZE;
  const pageRows = filtered.slice(start, start + CONTENT_PAGE_SIZE);

  document.getElementById("content-pages-list").innerHTML =
    pageRows.length === 0
      ? `<div class="detail-empty">No pages found for current filters.</div>`
      : `<div class="table-wrap"><table>
      <thead>
        <tr>
          <th>Page</th>
          <th>Route</th>
          <th>Section</th>
          <th>Status</th>
          <th>Updated</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${pageRows
          .map(
            (page) => `
            <tr>
              <td>${page.title}</td>
              <td><code>${page.slug}</code></td>
              <td>${sectionOf(page.slug)}</td>
              <td>${createBadge(page.status)}</td>
              <td>${page.updatedAt}</td>
              <td><button class="btn js-edit-page" data-slug="${page.slug}">Edit</button></td>
            </tr>
          `
          )
          .join("")}
      </tbody>
    </table></div>`;

  document.getElementById("content-page-label").textContent = `Page ${contentPageIndex} of ${totalPages}`;
  document.getElementById("content-prev").disabled = contentPageIndex <= 1;
  document.getElementById("content-next").disabled = contentPageIndex >= totalPages;
}

function loadContentEditor(slug) {
  const page = data.contentPages.find((item) => item.slug === slug);
  if (!page) return;
  selectedContentSlug = slug;
  document.getElementById("content-title").value = page.title;
  document.getElementById("content-hero").value = page.hero;
  document.getElementById("content-meta").value = page.meta;
  document.getElementById("content-status").value = page.status;
}

function activateView(viewId) {
  navItems.forEach((item) => {
    const navBtn = document.getElementById(`nav-${item.id}`);
    navBtn.classList.toggle("active", item.id === viewId);
  });

  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === `view-${viewId}`);
  });

  const current = navItems.find((item) => item.id === viewId);
  pageTitle.textContent = current.label;
  pageSubtitle.textContent = current.subtitle;
  activeViewId = viewId;
  globalSearch.value = "";
}

function downloadJSON(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function handleExport() {
  const map = {
    dashboard: {
      stats: data.stats,
      revenueByMonth: data.revenueByMonth,
      services: data.services,
      alerts: data.alerts,
      activity: data.activity,
    },
    doctors: data.doctors,
    patients: data.patients,
    prescriptions: data.prescriptions,
    appointments: data.appointments,
    billing: { invoices: data.invoices, payouts: data.payouts },
    support: data.tickets,
    settings: {
      prescriptionEscalation: document.querySelector("#settings-form select:nth-of-type(1)")?.value ?? "Enabled",
      verificationStrictness: document.querySelector("#settings-form select:nth-of-type(2)")?.value ?? "High",
      reviewSlaHours: document.querySelector("#settings-form input")?.value ?? "6",
    },
    content: data.contentPages,
  };

  downloadJSON(`quickdoctor-${activeViewId}-export.json`, map[activeViewId] ?? data);
  showToast(`Exported ${activeViewId} data`);
}

function handleCreateNew() {
  if (activeViewId === "doctors") {
    const id = `DOC-${200 + data.doctors.length + 1}`;
    data.doctors.unshift({
      id,
      name: "Dr. New Doctor",
      specialty: "General Practice",
      status: "Pending",
      patients: 0,
      rating: "-",
      email: "new.doctor@quickdoctor.ie",
      phone: "+353 85 100 2099",
      experience: "0 years",
      licenseExpiry: "2027-12-31",
      avgReviewTime: "-",
      completionRate: "-",
      notes: "Newly created from admin panel.",
    });
    renderDoctors(document.getElementById("doctor-status-filter").value, globalSearch.value);
    renderDoctorDetail(id);
    showToast("New doctor created");
    return;
  }

  if (activeViewId === "patients") {
    const id = `PT-${970 + data.patients.length + 1}`;
    data.patients.unshift({
      id,
      name: "New Patient",
      age: 30,
      risk: "Low",
      conditions: "None",
      lastVisit: new Date().toISOString().slice(0, 10),
      email: "new.patient@mail.com",
      phone: "+353 87 210 4599",
      gender: "Other",
      bloodGroup: "O+",
      allergies: "None",
      address: "Address pending update",
      emergencyContact: "Not provided",
    });
    renderPatients(document.getElementById("patient-risk-filter").value, globalSearch.value);
    renderPatientDetail(id);
    showToast("New patient created");
    return;
  }

  if (activeViewId === "content") {
    const newSlug = `/new-page-${data.contentPages.length + 1}`;
    data.contentPages.unshift({
      slug: newSlug,
      title: "New Page",
      hero: "New Page Hero",
      meta: "Add metadata for this new page.",
      status: "Draft",
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    contentPageIndex = 1;
    renderContentPages();
    loadContentEditor(newSlug);
    showToast("New content page created");
    return;
  }

  showToast(`Create action ready for ${activeViewId}`);
}

function bootstrapNav() {
  mainNav.innerHTML = navItems
    .map((item) => `<button id="nav-${item.id}" data-view="${item.id}">${item.label}</button>`)
    .join("");

  mainNav.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      activateView(btn.dataset.view);
      document.body.classList.remove("mobile-menu-open");
    });
  });
}

function bindFilters() {
  const doctorFilter = document.getElementById("doctor-status-filter");
  const patientFilter = document.getElementById("patient-risk-filter");
  const rxFilter = document.getElementById("rx-status-filter");
  const apptFilter = document.getElementById("appt-status-filter");
  const ticketFilter = document.getElementById("ticket-status-filter");

  doctorFilter.addEventListener("change", () => renderDoctors(doctorFilter.value, globalSearch.value));
  patientFilter.addEventListener("change", () => renderPatients(patientFilter.value, globalSearch.value));
  rxFilter.addEventListener("change", () => renderPrescriptions(rxFilter.value, globalSearch.value));
  apptFilter.addEventListener("change", () => renderAppointments(apptFilter.value, globalSearch.value));
  ticketFilter.addEventListener("change", () => renderSupport(ticketFilter.value, globalSearch.value));

  globalSearch.addEventListener("input", () => {
    renderDoctors(doctorFilter.value, globalSearch.value);
    renderPatients(patientFilter.value, globalSearch.value);
    renderPrescriptions(rxFilter.value, globalSearch.value);
    renderAppointments(apptFilter.value, globalSearch.value);
    renderSupport(ticketFilter.value, globalSearch.value);
  });

  const contentSearch = document.getElementById("content-search");
  const contentSectionFilter = document.getElementById("content-section-filter");
  const contentStatusFilter = document.getElementById("content-status-filter");
  const contentPrevBtn = document.getElementById("content-prev");
  const contentNextBtn = document.getElementById("content-next");

  const resetAndRenderContent = () => {
    contentPageIndex = 1;
    renderContentPages();
  };

  contentSearch.addEventListener("input", resetAndRenderContent);
  contentSectionFilter.addEventListener("change", resetAndRenderContent);
  contentStatusFilter.addEventListener("change", resetAndRenderContent);

  contentPrevBtn.addEventListener("click", () => {
    contentPageIndex -= 1;
    renderContentPages();
  });

  contentNextBtn.addEventListener("click", () => {
    contentPageIndex += 1;
    renderContentPages();
  });

  document.addEventListener("click", (event) => {
    const doctorBtn = event.target.closest(".js-view-doctor");
    if (doctorBtn) renderDoctorDetail(doctorBtn.dataset.id);

    const patientBtn = event.target.closest(".js-view-patient");
    if (patientBtn) renderPatientDetail(patientBtn.dataset.id);

    const editPageBtn = event.target.closest(".js-edit-page");
    if (editPageBtn) loadContentEditor(editPageBtn.dataset.slug);
  });

  document.getElementById("save-content-btn").addEventListener("click", () => {
    const page = data.contentPages.find((item) => item.slug === selectedContentSlug);
    if (!page) return;
    page.title = document.getElementById("content-title").value;
    page.hero = document.getElementById("content-hero").value;
    page.meta = document.getElementById("content-meta").value;
    page.status = document.getElementById("content-status").value;
    page.updatedAt = new Date().toISOString().slice(0, 10);
    renderContentPages();
    showToast("Content saved");
  });

  document.getElementById("save-settings-btn").addEventListener("click", () => {
    showToast("Settings saved");
  });

  exportBtn.addEventListener("click", handleExport);
  createBtn.addEventListener("click", handleCreateNew);
  mobileMenuToggle.addEventListener("click", () => {
    document.body.classList.toggle("mobile-menu-open");
  });
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = "./login.html";
  });
}

function init() {
  if (!ensureAuthenticated()) return;
  bootstrapNav();
  renderDashboard();
  renderDoctors();
  renderPatients();
  renderPrescriptions();
  renderAppointments();
  renderBilling();
  renderSupport();
  renderContentPages();
  renderDoctorDetail(data.doctors[0].id);
  renderPatientDetail(data.patients[0].id);
  loadContentEditor(data.contentPages[0].slug);
  bindFilters();
  activateView("dashboard");
}

init();
