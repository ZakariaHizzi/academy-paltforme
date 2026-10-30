"use client";

import { useMemo, useState } from "react";
import OnboardDrawer, {
  DEPARTMENT_COLLEGES,
  DEPARTMENT_LABELS,
  type StudentDraft,
  type TeacherDraft,
} from "../../components/onboard-drawer";

type Zone = "all" | "quad" | "science" | "humanities";

type FacultyMember = {
  initials: string;
  avatarClass: string;
  name: string;
  title: string;
  dept: string;
  deptLabel: string;
  deptCode: "eecs" | "bio" | "law" | "business";
  rank: "dean" | "full" | "assoc" | "assist" | "visiting";
  office: string;
  campus: string;
  credits: string;
  sections: string;
  courses: string;
  email: string;
  ext: string;
  tenure: string;
  tenureClass: string;
  dotClass: string;
  employeeId?: string;
  phone?: string;
  hireDate?: string;
  qualification?: string;
  specialization?: string;
  status?: string;
};

type StudentMember = {
  initials: string;
  avatarClass: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  program: string;
  deptLabel: string;
  level: string;
  status: string;
  statusClass: string;
  advisor: string;
  credits: string;
  gpa: string;
  campus: string;
  dob: string;
  guardianName: string;
  guardianPhone: string;
  enrollmentDate: string;
  address: string;
  scholarship: string;
  notes: string;
};


const ZONE_TABS: { id: Zone; label: string }[] = [
  { id: "all", label: "All Sectors" },
  { id: "quad", label: "North Academic Quad" },
  { id: "science", label: "Science & Eng. Complex" },
  { id: "humanities", label: "Humanities Hall" },
];

const FACULTY: FacultyMember[] = [
  {
    initials: "MT",
    avatarClass: "bg-primary-container text-on-primary",
    name: "Prof. Marcus Thorne, Ph.D.",
    title: "Chair of Artificial Intelligence",
    dept: "EECS",
    deptLabel: "College of Engineering",
    deptCode: "eecs",
    rank: "full",
    office: "Turing Center 402",
    campus: "Science Quadrangle",
    credits: "12 Credits",
    sections: "3 Sections",
    courses: "CS-101, CS-501, CS-699",
    email: "m.thorne@veritas.edu",
    ext: "Ext. 4108",
    tenure: "Tenured Chair",
    tenureClass: "bg-surface-container-highest text-on-surface border-0",
    dotClass: "bg-secondary",
  },
  {
    initials: "AC",
    avatarClass: "bg-secondary-container text-on-secondary-container",
    name: "Dr. Alistair Chen, M.D., Ph.D.",
    title: "Lead Investigator in Gene Expression",
    dept: "Biomedical Sciences",
    deptLabel: "School of Medicine",
    deptCode: "bio",
    rank: "assoc",
    office: "Pasteur Hall 215",
    campus: "Medical Annex",
    credits: "9 Credits",
    sections: "2 Sections",
    courses: "BIO-200, BIO-780",
    email: "a.chen@veritas.edu",
    ext: "Ext. 7234",
    tenure: "Tenure-Track",
    tenureClass: "bg-surface-container-high text-on-surface",
    dotClass: "bg-primary",
  },
  {
    initials: "RA",
    avatarClass: "bg-tertiary-container text-tertiary-fixed",
    name: "Dean Robert Albright, J.D.",
    title: "Dean of Veritas Law",
    dept: "Constitutional Jurisprudence",
    deptLabel: "Faculty of Law",
    deptCode: "law",
    rank: "dean",
    office: "Hamilton Chamber 100",
    campus: "South Quadrangle",
    credits: "6 Credits",
    sections: "1 Section",
    courses: "LAW-810 (Seminar)",
    email: "dean.albright@veritas.edu",
    ext: "Ext. 1001",
    tenure: "College Dean",
    tenureClass: "bg-secondary-container text-on-secondary-container",
    dotClass: "bg-secondary",
  },
  {
    initials: "KJ",
    avatarClass: "bg-surface-container-high text-primary",
    name: "Prof. Katherine Jenkins, Ph.D.",
    title: "Autonomous Systems Fellow",
    dept: "Computer Systems & Robotics",
    deptLabel: "College of Engineering",
    deptCode: "eecs",
    rank: "assist",
    office: "Robotics Lab Rm 112",
    campus: "Science Quadrangle",
    credits: "12 Credits",
    sections: "3 Sections",
    courses: "CS-480L, CS-220",
    email: "k.jenkins@veritas.edu",
    ext: "Ext. 5520",
    tenure: "Tenure-Track",
    tenureClass: "bg-surface-container-high text-on-surface",
    dotClass: "bg-primary",
  },
  {
    initials: "CS",
    avatarClass: "bg-surface-container-lowest text-secondary",
    name: "Prof. Clara Sterling, LL.M.",
    title: "Visiting Chair in Health Economics",
    dept: "Business & Health Systems",
    deptLabel: "School of Management",
    deptCode: "business",
    rank: "visiting",
    office: "Wharton Hall 308",
    campus: "Central Plaza",
    credits: "8 Credits",
    sections: "2 Sections",
    courses: "PHIL-312, ECON-604",
    email: "c.sterling@veritas.edu",
    ext: "Ext. 8901",
    tenure: "Visiting Scholar",
    tenureClass: "bg-surface-container text-on-surface-variant",
    dotClass: "bg-outline",
  },
];

const INITIAL_STUDENTS: StudentMember[] = [
  {
    initials: "AO",
    avatarClass: "bg-secondary-container text-on-secondary-container",
    name: "Amara N. Okafor",
    studentId: "VU-81920",
    email: "a.okafor@veritas.edu",
    phone: "+1 (555) 010-8192",
    program: "B.Sc. Computer Science & Artificial Intelligence",
    deptLabel: "College of Engineering",
    level: "Undergraduate Year 3",
    status: "Active",
    statusClass: "bg-secondary-container text-on-secondary-container",
    advisor: "Prof. Marcus Thorne",
    credits: "18 Credits",
    gpa: "3.82",
    campus: "Main Campus",
    dob: "2004-03-14",
    guardianName: "Ngozi Okafor",
    guardianPhone: "+1 (555) 010-7711",
    enrollmentDate: "2023-08-21",
    address: "14 Scholars Row, Apt 2B, Veritas City, United States",
    scholarship: "Merit Scholarship",
    notes: "Dean's List, Fall 2024.",
  },
  {
    initials: "LP",
    avatarClass: "bg-primary-container text-on-primary",
    name: "Liam J. Petrov",
    studentId: "VU-82417",
    email: "l.petrov@veritas.edu",
    phone: "+1 (555) 010-5521",
    program: "M.Sc. Data Science & Biomedical Informatics",
    deptLabel: "School of Medicine",
    level: "Master's",
    status: "Active",
    statusClass: "bg-secondary-container text-on-secondary-container",
    advisor: "Dr. Alistair Chen",
    credits: "12 Credits",
    gpa: "3.91",
    campus: "Medical Annex",
    dob: "2001-11-02",
    guardianName: "Elena Petrov",
    guardianPhone: "+1 (555) 010-4417",
    enrollmentDate: "2024-08-19",
    address: "8 Pasteur Court, Veritas City, United States",
    scholarship: "Research Assistantship",
    notes: "Graduate teaching assistant for BIO-200.",
  },
];


const METRICS = [
  {
    label: "Active Faculty",
    icon: "badge",
    value: "486",
    sub: "Tenured & Lecturers",
    noteIcon: "trending_up",
    note: "+12 appointments YTD",
    noteClass: "text-secondary",
  },
  {
    label: "Enrolled Scholars",
    icon: "groups",
    value: "14,250",
    sub: "Undergrad & Doctoral",
    noteIcon: "verified",
    note: "99.2% capacity fill",
    noteClass: "text-secondary",
  },
  {
    label: "Schools & Colleges",
    icon: "account_balance",
    value: "24",
    sub: "5 Regional Campuses",
    noteIcon: "domain",
    note: "100% active operational",
    noteClass: "text-on-surface",
  },
  {
    label: "Weekly Sections",
    icon: "calendar_view_week",
    value: "1,840",
    sub: "Across 112 Lecture Theatres",
    noteIcon: "pie_chart",
    note: "88% room optimization",
    noteClass: "text-secondary",
  },
  {
    label: "ABET / SACSCOC",
    icon: "verified_user",
    value: "100%",
    sub: "Institutional Accord",
    noteIcon: "grade",
    note: "Class I Distinction",
    noteClass: "text-secondary",
    iconClass: "text-secondary",
  },
];

type SlotTone = "primary" | "primaryContainer" | "tertiary" | "tertiaryContainer" | "neutral" | "empty";

type Slot = {
  tone: SlotTone;
  time?: string;
  code?: string;
  title?: string;
  icon?: string;
  instructor?: string;
  meta?: string;
  metaClass?: string;
};

const SLOT_STYLES: Record<SlotTone, string> = {
  primary: "p-3 rounded-lg bg-primary text-on-primary shadow-sm hover:scale-[1.01] transition-transform cursor-pointer",
  primaryContainer:
    "p-3 rounded-lg bg-primary-container text-on-primary shadow-sm hover:scale-[1.01] transition-transform cursor-pointer",
  tertiary: "p-3 rounded-lg bg-tertiary text-on-tertiary shadow-sm hover:scale-[1.01] transition-transform cursor-pointer",
  tertiaryContainer:
    "p-3 rounded-lg bg-tertiary-container text-on-tertiary shadow-sm hover:scale-[1.01] transition-transform cursor-pointer",
  neutral:
    "p-3 rounded-lg bg-surface-container-high text-on-surface shadow-sm hover:scale-[1.01] transition-transform cursor-pointer border-dashed",
  empty:
    "h-full min-h-[90px] rounded-lg bg-surface-container-low flex flex-col items-center justify-center text-outline p-2 text-center",
};

const CODE_STYLES: Record<SlotTone, string> = {
  primary: "bg-primary-container text-on-primary-fixed",
  primaryContainer: "bg-primary text-on-primary-fixed-variant",
  tertiary: "bg-tertiary-container text-tertiary-fixed",
  tertiaryContainer: "bg-tertiary text-tertiary-fixed",
  neutral: "bg-secondary-container text-on-secondary-container rounded font-bold",
  empty: "",
};

const TIME_STYLES: Record<SlotTone, string> = {
  primary: "text-primary-fixed-dim",
  primaryContainer: "text-primary-fixed",
  tertiary: "text-tertiary-fixed-dim",
  tertiaryContainer: "text-tertiary-fixed",
  neutral: "text-secondary font-bold",
  empty: "",
};

const DETAIL_STYLES: Record<SlotTone, string> = {
  primary: "text-primary-fixed-dim",
  primaryContainer: "text-primary-fixed",
  tertiary: "text-tertiary-fixed-dim",
  tertiaryContainer: "text-tertiary-fixed",
  neutral: "text-on-surface-variant",
  empty: "",
};

const META_STYLES: Record<SlotTone, string> = {
  primary: "text-surface-variant",
  primaryContainer: "text-surface-container",
  tertiary: "text-surface-variant",
  tertiaryContainer: "text-on-tertiary-container",
  neutral: "text-on-surface-variant",
  empty: "",
};

type FacilityRow = {
  name: string;
  cap: string;
  zone: string;
  tagIcon: string;
  tag: string;
  slots: Slot[];
};

const FACILITIES: FacilityRow[] = [
  {
    name: "Archimedes Hall A",
    cap: "Cap: 300 Seats",
    zone: "North Quad",
    tagIcon: "mic",
    tag: "Tiered AV Rig",
    slots: [
      {
        tone: "primary",
        time: "09:00 - 10:30",
        code: "CS-101",
        title: "Foundations of Computation",
        icon: "person",
        instructor: "Prof. Marcus Thorne",
        meta: "285 Enrolled / 300 Limit",
      },
      {
        tone: "primaryContainer",
        time: "11:00 - 12:30",
        code: "BIO-200",
        title: "Molecular Genomics II",
        icon: "person",
        instructor: "Dr. Alistair Chen",
        meta: "292 Enrolled / 300 Limit",
      },
      {
        tone: "neutral",
        time: "14:00 - 15:30",
        code: "RESERVED",
        title: "Provostial Honors Symposium",
        icon: "school",
        instructor: "Veritas Academic Senate",
        meta: "Open Seating Protocol",
      },
      { tone: "empty", icon: "hourglass_empty", instructor: "Available for Evening Booking" },
    ],
  },
  {
    name: "Turing Lab 204",
    cap: "Cap: 45 Workstations",
    zone: "Science Complex",
    tagIcon: "memory",
    tag: "Dual GPU Cluster",
    slots: [
      {
        tone: "tertiary",
        time: "08:30 - 10:00",
        code: "CS-480L",
        title: "AI Robotics Practicum",
        icon: "person",
        instructor: "Prof. Katherine Jenkins",
        meta: "44 Enrolled / 45 Stations",
      },
      {
        tone: "tertiaryContainer",
        time: "10:30 - 12:30",
        code: "SEC-340",
        title: "Network Defense & Cryptology",
        icon: "person",
        instructor: "Dr. Eleanor Vance",
        meta: "42 Enrolled / 45 Stations",
      },
      { tone: "empty", icon: "hardware", instructor: "Autonomous Agent Bench Clean" },
      {
        tone: "primaryContainer",
        time: "15:30 - 17:00",
        code: "CS-699",
        title: "Doctoral Colloquium",
        icon: "person",
        instructor: "Dr. E. Vance / Prof. Thorne",
        meta: "18 Enrolled / Cap: 45",
      },
    ],
  },
  {
    name: "Hamilton Rm 102",
    cap: "Cap: 30 Round Table",
    zone: "Humanities Hall",
    tagIcon: "gavel",
    tag: "Moot Court Setup",
    slots: [
      {
        tone: "neutral",
        time: "09:30 - 11:00",
        code: "LAW-810",
        title: "Adv. Constitutional Jurisprudence",
        icon: "person",
        instructor: "Dean Robert Albright",
        meta: "29 Enrolled / 30 Limit (Waitlisted)",
        metaClass: "text-secondary font-semibold",
      },
      { tone: "empty", icon: "lock_clock", instructor: "Law Faculty Council Deliberation" },
      {
        tone: "primaryContainer",
        time: "13:30 - 15:00",
        code: "PHIL-312",
        title: "Bioethics & Medical Law",
        icon: "person",
        instructor: "Prof. Clara Sterling",
        meta: "26 Enrolled / 30 Limit",
      },
      { tone: "empty", icon: "check", instructor: "Open Study / Office Hours" },
    ],
  },
];

const AUDIT_BARS = [
  {
    label: "Curricular Syllabi Verified",
    value: "1,840 / 1,840 (100%)",
    width: "100%",
    bar: "bg-secondary",
  },
  {
    label: "Faculty Credentials & Tenures Deposited",
    value: "478 / 486 (98.3%)",
    width: "98.3%",
    bar: "bg-primary",
  },
  {
    label: "Laboratory Safety Compliance Clearance",
    value: "112 / 112 Halls (100%)",
    width: "100%",
    bar: "bg-secondary",
  },
];

const BUDGETS = [
  {
    dot: "bg-secondary",
    title: "EECS AI Cluster Upgrade",
    meta: "$240,000 • Dean Endorsed",
    status: "Approved",
    statusClass: "bg-secondary-container text-on-secondary-container font-bold",
  },
  {
    dot: "bg-outline",
    title: "Biomedical Microfluidics Lab",
    meta: "$185,000 • Pending Review",
    status: "In Committee",
    statusClass: "bg-surface-container-high text-on-surface font-medium",
  },
  {
    dot: "bg-secondary",
    title: "Law Library Rare Codex Archive",
    meta: "$48,500 • Endowment Funded",
    status: "Approved",
    statusClass: "bg-secondary-container text-on-secondary-container font-bold",
  },
];

export default function DirectorSuitePage() {
  const [zone, setZone] = useState<Zone>("all");
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("all");
  const [rank, setRank] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [facultyRoster, setFacultyRoster] = useState<FacultyMember[]>(FACULTY);
  const [students, setStudents] = useState<StudentMember[]>(INITIAL_STUDENTS);
  const [onboardMode, setOnboardMode] = useState<"teacher" | "student" | null>(
    null,
  );

  const visibleFaculty = useMemo(() => {
    const query = search.toLowerCase();
    return facultyRoster.filter((member) => {
      const text = `${member.name} ${member.title} ${member.dept} ${member.deptLabel} ${member.office} ${member.campus} ${member.email} ${member.courses} ${member.ext} ${member.tenure}`.toLowerCase();
      const matchesSearch = text.includes(query);
      const matchesDept = dept === "all" || member.deptCode === dept;
      const matchesRank = rank === "all" || member.rank === rank;
      return matchesSearch && matchesDept && matchesRank;
    });
  }, [facultyRoster, search, dept, rank]);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  }

  function fullName(draft: {
    firstName: string;
    middleName: string;
    lastName: string;
  }) {
    return [draft.firstName, draft.middleName, draft.lastName]
      .filter(Boolean)
      .join(" ");
  }

  function initialsOf(firstName: string, lastName: string) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "NA";
  }

  function handleAddTeacher(draft: TeacherDraft) {
    const name = fullName(draft);
    const member: FacultyMember = {
      initials: initialsOf(draft.firstName, draft.lastName),
      avatarClass: "bg-primary-container text-on-primary",
      name,
      title: draft.title || "Faculty Member",
      dept: DEPARTMENT_LABELS[draft.department],
      deptLabel: DEPARTMENT_COLLEGES[draft.department],
      deptCode: draft.department,
      rank: draft.rank,
      office: draft.office || "Unassigned Office",
      campus: draft.campus || "Main Campus",
      credits: draft.credits ? `${draft.credits} Credits` : "0 Credits",
      sections: draft.sections ? `${draft.sections} Sections` : "0 Sections",
      courses: draft.courses || "No sections assigned",
      email: draft.email,
      ext: draft.ext || draft.phone || "—",
      tenure: draft.tenure,
      tenureClass:
        draft.tenure === "Tenured Chair" || draft.tenure === "Tenured"
          ? "bg-surface-container-highest text-on-surface border-0"
          : draft.tenure === "Visiting Scholar" ||
              draft.tenure === "Adjunct Faculty"
            ? "bg-surface-container text-on-surface-variant"
            : "bg-surface-container-high text-on-surface",
      dotClass: draft.status === "Active" ? "bg-secondary" : "bg-outline",
      employeeId: draft.employeeId,
      phone: draft.phone,
      hireDate: draft.hireDate,
      qualification: draft.qualification,
      specialization: draft.specialization,
      status: draft.status,
    };

    setFacultyRoster((current) => [member, ...current]);
    setOnboardMode(null);
    showToast(`Teacher added: ${name} is now in the faculty registry.`);
  }

  function handleAddStudent(draft: StudentDraft) {
    const name = fullName(draft);
    const student: StudentMember = {
      initials: initialsOf(draft.firstName, draft.lastName),
      avatarClass: "bg-secondary-container text-on-secondary-container",
      name,
      studentId: draft.studentId,
      email: draft.email,
      phone: draft.phone,
      program: draft.program,
      deptLabel: DEPARTMENT_COLLEGES[draft.department],
      level: draft.level,
      status: draft.status,
      statusClass:
        draft.status === "Active"
          ? "bg-secondary-container text-on-secondary-container"
          : draft.status === "Probationary"
            ? "bg-tertiary-container text-on-tertiary-container"
            : "bg-surface-container-high text-on-surface",
      advisor: draft.advisor || "Unassigned",
      credits: draft.credits ? `${draft.credits} Credits` : "0 Credits",
      gpa: draft.gpa || "—",
      campus: draft.campus || "Main Campus",
      dob: draft.dob,
      guardianName: draft.guardianName || "Not provided",
      guardianPhone: draft.guardianPhone || "—",
      enrollmentDate: draft.enrollmentDate,
      address:
        [draft.address, draft.city, draft.country].filter(Boolean).join(", ") ||
        "Not provided",
      scholarship: draft.scholarship || "None",
      notes: draft.notes,
    };

    setStudents((current) => [student, ...current]);
    setOnboardMode(null);
    showToast(`Student added: ${name} is now in the student registry.`);
  }

  function showTeacherDossier(member: FacultyMember) {
    alert(
      [
        member.name,
        member.title,
        `Employee ID: ${member.employeeId ?? "—"}`,
        `Department: ${member.dept} — ${member.deptLabel}`,
        `Office: ${member.office}, ${member.campus}`,
        `Email: ${member.email}`,
        `Phone: ${member.phone ?? "—"}`,
        `Extension: ${member.ext}`,
        `Teaching Load: ${member.credits}, ${member.sections}`,
        `Courses: ${member.courses}`,
        `Tenure: ${member.tenure}`,
        `Hire Date: ${member.hireDate ?? "—"}`,
        `Qualification: ${member.qualification ?? "—"}`,
        `Specialization: ${member.specialization ?? "—"}`,
        `Employment Status: ${member.status ?? "Active"}`,
      ].join("\n"),
    );
  }

  function showStudentDossier(student: StudentMember) {
    alert(
      [
        student.name,
        `Matriculation No.: ${student.studentId}`,
        `Programme: ${student.program}`,
        `College: ${student.deptLabel}`,
        `Level: ${student.level}`,
        `Status: ${student.status}`,
        `Date of Birth: ${student.dob}`,
        `Enrollment Date: ${student.enrollmentDate}`,
        `Advisor: ${student.advisor}`,
        `Credits: ${student.credits} • GPA: ${student.gpa}`,
        `Email: ${student.email}`,
        `Phone: ${student.phone}`,
        `Campus: ${student.campus}`,
        `Address: ${student.address}`,
        `Scholarship: ${student.scholarship}`,
        `Guardian: ${student.guardianName} (${student.guardianPhone})`,
        `Notes: ${student.notes || "—"}`,
      ].join("\n"),
    );
  }

  function selectZone(next: Zone, label: string) {
    setZone(next);
    showToast(`Showing Schedule Allocation for ${label}`);
  }

  return (
    <div className="min-h-screen">
        <main className="bg-surface min-h-screen">
          <div className="flex flex-col w-full">
            {/* Executive Institutional Banner & Provost Controls */}
            <section className="px-margin pt-space-lg pb-space-md">
              <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-lg bg-surface-container-low p-space-lg rounded-xl shadow-sm">
                <div className="flex flex-col max-w-3xl">
                  <div className="flex items-center gap-space-sm mb-space-xs">
                    <span className="font-label-mono text-label-mono uppercase tracking-widest text-secondary font-bold">
                      Office of the Provost &amp; Academic Operations
                    </span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                    <span className="font-label-mono text-label-mono text-on-surface-variant">
                      Archival Ledger Ref: #VR-2024-Q3
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                    Institutional Governance &amp; Master Operations Suite
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Real-time institutional oversight across Veritas University&apos;s 24 specialized
                    faculties, facilities orchestration matrix, and tenure registries for Fall Academic
                    Session 2024.
                  </p>
                </div>
                {/* Quick Executive Action Group */}
                <div className="flex flex-wrap items-center gap-space-sm">
                  <button
                    className="flex items-center gap-space-xs px-space-md py-2.5 bg-surface-container-lowest text-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:bg-surface-container hover:shadow transition-all"
                    onClick={() =>
                      showToast("Compiling Institutional SACSCOC / ABET Audit Archive...")
                    }
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                    <span>Generate SACSCOC Report</span>
                  </button>
                  <button
                    className="flex items-center gap-space-xs px-space-md py-2.5 bg-primary text-on-primary font-label-lg text-label-lg rounded-lg shadow-md hover:bg-primary-container transition-all"
                    onClick={() => setDrawerOpen(true)}
                  >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    <span>Schedule New Course Section</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Executive Overview Key Analytics */}
            <section className="px-margin pb-space-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-md">
                {METRICS.map((metric) => (
                  <div
                    className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                    key={metric.label}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                        {metric.label}
                      </span>
                      <span
                        className={`p-1.5 rounded-lg bg-surface-container ${
                          metric.iconClass ?? "text-primary"
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">{metric.icon}</span>
                      </span>
                    </div>
                    <div className="my-space-sm">
                      <div className="font-headline-lg text-headline-lg text-primary leading-none">
                        {metric.value}
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {metric.sub}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-space-xs bg-surface-container-low px-2 py-1 rounded">
                      <span className="material-symbols-outlined text-sm text-secondary">
                        {metric.noteIcon}
                      </span>
                      <span
                        className={`font-label-mono text-label-mono font-semibold ${metric.noteClass}`}
                      >
                        {metric.note}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 1B: Registry Intake Actions */}
            <section className="px-margin pb-space-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
                <button
                  className="group text-left bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex items-start gap-space-md"
                  onClick={() => setOnboardMode("teacher")}
                  type="button"
                >
                  <span className="p-3 rounded-lg bg-primary-fixed text-primary">
                    <span className="material-symbols-outlined text-2xl">
                      person_add
                    </span>
                  </span>
                  <span className="flex-1">
                    <span className="block font-label-mono text-label-mono uppercase tracking-wider text-secondary font-bold">
                      Faculty Registry Intake
                    </span>
                    <span className="block font-headline-sm text-headline-sm text-primary mt-0.5">
                      Add Teacher
                    </span>
                    <span className="block font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Record a new appointment with full identity, department,
                      rank, teaching load, office and contact information.
                    </span>
                  </span>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                    arrow_forward
                  </span>
                </button>
                <button
                  className="group text-left bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex items-start gap-space-md"
                  onClick={() => setOnboardMode("student")}
                  type="button"
                >
                  <span className="p-3 rounded-lg bg-secondary-container text-on-secondary-container">
                    <span className="material-symbols-outlined text-2xl">
                      group_add
                    </span>
                  </span>
                  <span className="flex-1">
                    <span className="block font-label-mono text-label-mono uppercase tracking-wider text-secondary font-bold">
                      Matriculation Intake
                    </span>
                    <span className="block font-headline-sm text-headline-sm text-primary mt-0.5">
                      Add Student
                    </span>
                    <span className="block font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Enroll a scholar with complete academic, personal, contact
                      and guardian records for the registry.
                    </span>
                  </span>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                    arrow_forward
                  </span>
                </button>
              </div>
            </section>

            {/* Section 2: Master Timetable & Facility Allocation Matrix */}
            <section className="px-margin pb-space-lg">
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-space-md gap-space-md">
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className="p-1 rounded bg-secondary-container text-on-secondary-container">
                        <span className="material-symbols-outlined text-base">meeting_room</span>
                      </span>
                      <h2 className="font-headline-sm text-headline-sm text-primary">
                        Master Facilities &amp; Timetable Matrix
                      </h2>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Cross-campus classroom allocation schema and synchronized section schedules for Week
                      8.
                    </p>
                  </div>
                  {/* Matrix Controls & Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-space-sm">
                    <div className="flex items-center bg-surface-container-low p-1 rounded-lg">
                      {ZONE_TABS.map((tab) => (
                        <button
                          className={
                            zone === tab.id
                              ? "px-3 py-1.5 rounded text-xs font-semibold bg-surface-container-lowest text-primary shadow-sm"
                              : "px-3 py-1.5 rounded text-xs font-medium text-on-surface-variant hover:text-on-surface"
                          }
                          key={tab.id}
                          onClick={() => selectZone(tab.id, tab.label)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-label-lg text-primary bg-surface-container hover:bg-surface-container-high rounded-lg transition-all"
                      onClick={() =>
                        showToast(
                          "Facilities Optimization Matrix checked: 0 room schedule conflicts found.",
                        )
                      }
                    >
                      <span className="material-symbols-outlined text-sm">sync_alt</span>
                      <span>Reallocate Hall</span>
                    </button>
                  </div>
                </div>

                {/* Real-time Status Metric Strip */}
                <div className="flex items-center justify-between bg-surface-container-low px-space-md py-2.5 rounded-lg mb-space-md">
                  <div className="flex items-center gap-space-md flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                      </span>
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        88% Classroom Capacity Optimized
                      </span>
                    </div>
                    <span className="text-outline-variant">•</span>
                    <div className="flex items-center gap-1.5 text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm text-secondary font-bold">
                        check_circle
                      </span>
                      <span className="font-label-mono text-label-mono">
                        0 Scheduling Conflicts Detected
                      </span>
                    </div>
                    <span className="text-outline-variant">•</span>
                    <span className="font-label-mono text-label-mono text-on-surface-variant">
                      Synchronized with Registrar Database (11:42 AM)
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-space-xs">
                    <span className="w-3 h-3 rounded bg-primary-container"></span>
                    <span className="font-label-md text-label-md text-on-surface-variant text-[11px] mr-2">
                      Core Lecture
                    </span>
                    <span className="w-3 h-3 rounded bg-tertiary-container"></span>
                    <span className="font-label-md text-label-md text-on-surface-variant text-[11px] mr-2">
                      Laboratory
                    </span>
                    <span className="w-3 h-3 rounded bg-surface-container-high"></span>
                    <span className="font-label-md text-label-md text-on-surface-variant text-[11px]">
                      Symposium / Open
                    </span>
                  </div>
                </div>

                {/* Timetable Matrix Grid */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                        <th className="py-3 px-space-md w-64 rounded-l-lg">
                          Facility &amp; Spatial Capacity
                        </th>
                        <th className="py-3 px-space-md w-1/4">08:00 - 10:00</th>
                        <th className="py-3 px-space-md w-1/4">10:00 - 12:00</th>
                        <th className="py-3 px-space-md w-1/4">13:00 - 15:00</th>
                        <th className="py-3 px-space-md w-1/4 rounded-r-lg">15:00 - 17:00</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container text-body-sm font-body-sm">
                      {FACILITIES.map((facility) => (
                        <tr
                          className="hover:bg-surface-container-low/50 transition-colors"
                          key={facility.name}
                        >
                          <td className="py-space-md px-space-md align-top">
                            <div className="font-title-md text-title-md text-primary font-bold">
                              {facility.name}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-label-mono text-label-mono text-secondary font-semibold">
                                {facility.cap}
                              </span>
                              <span className="text-outline-variant">•</span>
                              <span className="text-on-surface-variant font-label-mono text-label-mono">
                                {facility.zone}
                              </span>
                            </div>
                            <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-label-mono bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                              <span className="material-symbols-outlined text-xs">
                                {facility.tagIcon}
                              </span>{" "}
                              {facility.tag}
                            </div>
                          </td>
                          {facility.slots.map((slot, index) => (
                            <td className="py-space-md px-space-md align-top" key={`${facility.name}-${index}`}>
                              {slot.tone === "empty" ? (
                                <div className={SLOT_STYLES.empty}>
                                  <span className="material-symbols-outlined text-base">{slot.icon}</span>
                                  <span className="font-label-mono text-label-mono mt-1">
                                    {slot.instructor}
                                  </span>
                                </div>
                              ) : (
                                <div className={SLOT_STYLES[slot.tone]}>
                                  <div className="flex justify-between items-start">
                                    <span
                                      className={`font-label-mono text-label-mono uppercase tracking-wide ${TIME_STYLES[slot.tone]}`}
                                    >
                                      {slot.time}
                                    </span>
                                    <span
                                      className={`px-1.5 py-0.5 text-[10px] font-label-mono ${
                                        CODE_STYLES[slot.tone]
                                      } rounded`}
                                    >
                                      {slot.code}
                                    </span>
                                  </div>
                                  <div
                                    className={`font-bold font-title-md text-title-md mt-1 leading-snug ${
                                      slot.tone === "neutral" ? "text-primary" : ""
                                    }`}
                                  >
                                    {slot.title}
                                  </div>
                                  <div
                                    className={`text-xs mt-1 flex items-center gap-1 ${
                                      DETAIL_STYLES[slot.tone]
                                    }`}
                                  >
                                    <span className="material-symbols-outlined text-xs">
                                      {slot.icon}
                                    </span>{" "}
                                    {slot.instructor}
                                  </div>
                                  <div
                                    className={`text-[11px] mt-2 ${
                                      slot.metaClass ?? META_STYLES[slot.tone]
                                    }`}
                                  >
                                    {slot.meta}
                                  </div>
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 3: Comprehensive Faculty Directory & Institutional Registry */}
            <section className="px-margin pb-space-lg">
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-space-md gap-space-md">
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className="p-1 rounded bg-surface-container text-primary">
                        <span className="material-symbols-outlined text-base">school</span>
                      </span>
                      <h2 className="font-headline-sm text-headline-sm text-primary">
                        Academic Faculty Registry &amp; Teaching Loads
                      </h2>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Institutional directory containing ranks, active lecture assignments, and
                      departmental tenure files.
                    </p>
                  </div>
                  {/* Filter and Search Row */}
                  <div className="flex flex-wrap items-center gap-space-sm">
                    <button
                      className="flex items-center gap-1.5 h-9 px-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm"
                      onClick={() => setOnboardMode("teacher")}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">
                        person_add
                      </span>
                      <span>Add Teacher</span>
                    </button>
                    <div className="relative min-w-[220px]">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base">
                        search
                      </span>
                      <input
                        className="w-full h-9 pl-9 pr-3 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline"
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search professor, id, room..."
                        type="text"
                        value={search}
                      />
                    </div>
                    <select
                      className="h-9 px-3 bg-surface-container-low text-on-surface font-label-md text-label-md rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      onChange={(event) => setDept(event.target.value)}
                      value={dept}
                    >
                      <option value="all">All Departments</option>
                      <option value="eecs">Electrical Eng. &amp; Computer Science</option>
                      <option value="bio">Biomedical Sciences</option>
                      <option value="law">Veritas Law School</option>
                      <option value="business">School of Economics &amp; Management</option>
                    </select>
                    <select
                      className="h-9 px-3 bg-surface-container-low text-on-surface font-label-md text-label-md rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      onChange={(event) => setRank(event.target.value)}
                      value={rank}
                    >
                      <option value="all">All Academic Ranks</option>
                      <option value="dean">Dean / Department Chair</option>
                      <option value="full">Full Professor</option>
                      <option value="assoc">Associate Professor</option>
                      <option value="assist">Assistant Professor</option>
                      <option value="visiting">Visiting Scholar</option>
                    </select>
                  </div>
                </div>

                {/* Directory Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                        <th className="py-3 px-space-md rounded-l-lg">Faculty Member</th>
                        <th className="py-3 px-space-md">Department &amp; College</th>
                        <th className="py-3 px-space-md">Office &amp; Campus</th>
                        <th className="py-3 px-space-md">Assigned Load</th>
                        <th className="py-3 px-space-md">Contact Channel</th>
                        <th className="py-3 px-space-md">Tenure Status</th>
                        <th className="py-3 px-space-md text-right rounded-r-lg">
                          Administrative Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container text-body-sm font-body-sm">
                      {visibleFaculty.map((member) => (
                        <tr
                          className="hover:bg-surface-container-low/60 transition-colors"
                          data-dept={member.deptCode}
                          data-rank={member.rank}
                          key={member.email}
                        >
                          <td className="py-3.5 px-space-md">
                            <div className="flex items-center gap-space-sm">
                              <div
                                className={`w-10 h-10 rounded-full ${member.avatarClass} flex items-center justify-center font-bold font-title-md text-title-md shadow-sm`}
                              >
                                {member.initials}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-title-md text-title-md text-on-surface font-semibold">
                                  {member.name}
                                </span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant">
                                  {member.title}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-space-md">
                            <div className="font-medium text-on-surface">{member.dept}</div>
                            <div className="font-label-mono text-label-mono text-on-surface-variant">
                              {member.deptLabel}
                            </div>
                          </td>
                          <td className="py-3.5 px-space-md">
                            <div className="flex items-center gap-1.5 text-on-surface">
                              <span className="material-symbols-outlined text-sm text-secondary">
                                location_on
                              </span>
                              <span>{member.office}</span>
                            </div>
                            <div className="font-label-mono text-label-mono text-on-surface-variant">
                              {member.campus}
                            </div>
                          </td>
                          <td className="py-3.5 px-space-md">
                            <div className="flex items-center gap-2">
                              <span className="font-label-mono text-label-mono font-bold text-primary">
                                {member.credits}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-label-mono bg-surface-container-high text-on-surface font-semibold">
                                {member.sections}
                              </span>
                            </div>
                            <span className="font-label-mono text-label-mono text-outline">
                              {member.courses}
                            </span>
                          </td>
                          <td className="py-3.5 px-space-md">
                            <div className="text-primary font-medium">{member.email}</div>
                            <div className="font-label-mono text-label-mono text-on-surface-variant">
                              {member.ext}
                            </div>
                          </td>
                          <td className="py-3.5 px-space-md">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${member.tenureClass}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${member.dotClass}`}></span>
                              {member.tenure}
                            </span>
                          </td>
                          <td className="py-3.5 px-space-md text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                className="p-1.5 hover:bg-surface-container rounded text-primary transition-colors"
                                onClick={() => showTeacherDossier(member)}
                                title="View Academic Dossier"
                              >
                                <span className="material-symbols-outlined text-base">
                                  description
                                </span>
                              </button>
                              <button
                                className="p-1.5 hover:bg-surface-container rounded text-primary transition-colors"
                                title="Reassign Timetable"
                              >
                                <span className="material-symbols-outlined text-base">
                                  edit_calendar
                                </span>
                              </button>
                              <button
                                className="p-1.5 hover:bg-surface-container rounded text-primary transition-colors"
                                title="Send Official Dispatch"
                              >
                                <span className="material-symbols-outlined text-base">mail</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Directory Pagination & Footer Info */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-space-md gap-space-sm">
                  <div className="font-label-mono text-label-mono text-on-surface-variant">
                    Showing {visibleFaculty.length} of {facultyRoster.length} Active Teaching Faculty • Certified Census Database
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 bg-surface-container-low text-on-surface rounded font-label-md text-label-md hover:bg-surface-container transition-colors disabled:opacity-50"
                      disabled
                    >
                      Previous
                    </button>
                    <span className="px-2 font-label-mono text-label-mono text-primary font-bold">
                      1 / 98
                    </span>
                    <button className="px-3 py-1 bg-surface-container-low text-on-surface rounded font-label-md text-label-md hover:bg-surface-container transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3B: Student Registry & Enrollment Records */}
            <section className="px-margin pb-space-lg">
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-space-md gap-space-md">
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className="p-1 rounded bg-secondary-container text-on-secondary-container">
                        <span className="material-symbols-outlined text-base">groups</span>
                      </span>
                      <h2 className="font-headline-sm text-headline-sm text-primary">
                        Student Registry &amp; Enrollment Records
                      </h2>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Complete scholar directory with matriculation, academic standing, advisor
                      assignments, contact details and guardian records.
                    </p>
                  </div>
                  <button
                    className="flex items-center gap-1.5 h-9 px-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm"
                    onClick={() => setOnboardMode("student")}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">person_add</span>
                    <span>Add Student</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1050px]">
                    <thead>
                      <tr className="bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                        <th className="py-3 px-space-md rounded-l-lg">Enrolled Scholar</th>
                        <th className="py-3 px-space-md">Matriculation &amp; Programme</th>
                        <th className="py-3 px-space-md">Level &amp; Standing</th>
                        <th className="py-3 px-space-md">Advisor &amp; Load</th>
                        <th className="py-3 px-space-md">Contact &amp; Funding</th>
                        <th className="py-3 px-space-md">Campus &amp; Guardian</th>
                        <th className="py-3 px-space-md text-right rounded-r-lg">
                          Administrative Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container text-body-sm font-body-sm">
                      {students.map((student) => (
                        <tr
                          className="hover:bg-surface-container-low/60 transition-colors"
                          key={`${student.studentId}-${student.email}`}
                        >
                          <td className="py-3.5 px-space-md">
                            <div className="flex items-center gap-space-sm">
                              <div
                                className={`w-10 h-10 rounded-full ${student.avatarClass} flex items-center justify-center font-bold font-title-md text-title-md shadow-sm`}
                              >
                                {student.initials}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-title-md text-title-md text-on-surface font-semibold">
                                  {student.name}
                                </span>
                                <span className="font-label-mono text-label-mono text-on-surface-variant">
                                  DOB: {student.dob}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-space-md">
                            <div className="font-label-mono text-label-mono font-bold text-primary">
                              {student.studentId}
                            </div>
                            <div className="font-medium text-on-surface max-w-[220px]">
                              {student.program}
                            </div>
                            <div className="font-label-mono text-label-mono text-on-surface-variant">
                              {student.deptLabel}
                            </div>
                          </td>
                          <td className="py-3.5 px-space-md">
                            <div className="text-on-surface">{student.level}</div>
                            <span
                              className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${student.statusClass}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {student.status}
                            </span>
                            <div className="font-label-mono text-label-mono text-outline mt-1">
                              Enrolled {student.enrollmentDate}
                            </div>
                          </td>
                          <td className="py-3.5 px-space-md">
                            <div className="text-on-surface">{student.advisor}</div>
                            <div className="font-label-mono text-label-mono text-primary font-bold mt-0.5">
                              {student.credits} • GPA {student.gpa}
                            </div>
                          </td>
                          <td className="py-3.5 px-space-md">
                            <div className="text-primary font-medium">{student.email}</div>
                            <div className="font-label-mono text-label-mono text-on-surface-variant">
                              {student.phone}
                            </div>
                            <div className="font-label-mono text-label-mono text-secondary font-semibold mt-1">
                              {student.scholarship}
                            </div>
                          </td>
                          <td className="py-3.5 px-space-md">
                            <div className="flex items-center gap-1.5 text-on-surface">
                              <span className="material-symbols-outlined text-sm text-secondary">
                                location_on
                              </span>
                              <span>{student.campus}</span>
                            </div>
                            <div className="font-label-mono text-label-mono text-on-surface-variant mt-1">
                              Guardian: {student.guardianName}
                            </div>
                            <div className="font-label-mono text-label-mono text-outline">
                              {student.guardianPhone}
                            </div>
                          </td>
                          <td className="py-3.5 px-space-md text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                className="p-1.5 hover:bg-surface-container rounded text-primary transition-colors"
                                onClick={() => showStudentDossier(student)}
                                title="View Full Student Dossier"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-base">
                                  description
                                </span>
                              </button>
                              <button
                                className="p-1.5 hover:bg-surface-container rounded text-primary transition-colors"
                                onClick={() =>
                                  showToast(`Advisor reassignment opened for ${student.name}.`)
                                }
                                title="Reassign Academic Advisor"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-base">
                                  edit_calendar
                                </span>
                              </button>
                              <button
                                className="p-1.5 hover:bg-surface-container rounded text-primary transition-colors"
                                onClick={() =>
                                  showToast(`Dispatch queued for ${student.name}.`)
                                }
                                title="Send Official Dispatch"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-base">mail</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {students.length === 0 ? (
                        <tr>
                          <td
                            className="py-space-lg px-space-md text-center font-body-sm text-body-sm text-on-surface-variant"
                            colSpan={7}
                          >
                            No students have been registered yet. Use “Add Student” to enroll the
                            first scholar.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between pt-space-md gap-space-sm">
                  <div className="font-label-mono text-label-mono text-on-surface-variant">
                    Showing {students.length} registered scholars • Matriculation Census Database
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 bg-surface-container-low text-on-surface rounded font-label-md text-label-md hover:bg-surface-container transition-colors disabled:opacity-50"
                      disabled
                    >
                      Previous
                    </button>
                    <span className="px-2 font-label-mono text-label-mono text-primary font-bold">
                      1 / 1
                    </span>
                    <button
                      className="px-3 py-1 bg-surface-container-low text-on-surface rounded font-label-md text-label-md hover:bg-surface-container transition-colors disabled:opacity-50"
                      disabled
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Institutional Governance & Semester Operations Widget */}
            <section className="px-margin pb-space-xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
                {/* Widget 1: University Calendar & Midterm Countdown */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-space-sm">
                      <span className="font-label-mono text-label-mono uppercase tracking-wider text-secondary font-bold">
                        Academic Calendar Protocol
                      </span>
                      <span className="p-1 rounded bg-surface-container text-primary">
                        <span className="material-symbols-outlined text-base">alarm</span>
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">
                      Midterm Grade Submissions
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Standard registrar submission window for all faculty leads across undergraduate
                      disciplines.
                    </p>
                    {/* Metric Ring / Time Left */}
                    <div className="my-space-md p-space-md bg-surface-container-low rounded-lg flex items-center justify-between">
                      <div>
                        <span className="font-label-mono text-label-mono text-outline uppercase">
                          Submission Deadline
                        </span>
                        <div className="font-headline-lg text-headline-lg text-primary font-bold">
                          6 Days, 14 Hrs
                        </div>
                        <span className="font-body-sm text-body-sm text-error font-medium">
                          Cutoff: October 28, 23:59 EST
                        </span>
                      </div>
                      {/* SVG Progress Ring */}
                      <div className="relative w-16 h-16">
                        <svg
                          className="w-full h-full transform -rotate-90"
                          viewBox="0 0 36 36"
                        >
                          <path
                            className="text-surface-container-high"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                          ></path>
                          <path
                            className="text-secondary"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeDasharray="72, 100"
                            strokeLinecap="round"
                            strokeWidth="3.5"
                          ></path>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-label-mono text-label-mono font-bold text-primary">
                          72%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-space-xs">
                    <span className="font-label-mono text-label-mono text-on-surface-variant">
                      350 / 486 Rosters Submitted
                    </span>
                    <button className="font-label-lg text-label-lg text-primary hover:text-primary-container font-semibold inline-flex items-center gap-1">
                      <span>Send Reminder Alert</span>
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Widget 2: Institutional Accreditation Audit Tracker */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-space-sm">
                      <span className="font-label-mono text-label-mono uppercase tracking-wider text-primary font-bold">
                        Standard of Excellence
                      </span>
                      <span className="p-1 rounded bg-surface-container text-secondary">
                        <span className="material-symbols-outlined text-base">policy</span>
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">
                      ABET &amp; SACSCOC Audit Readiness
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Continuous compliance metric across institutional syllabus standards and learning
                      outcome verification.
                    </p>
                    <div className="mt-space-md space-y-3">
                      {AUDIT_BARS.map((bar) => (
                        <div key={bar.label}>
                          <div className="flex justify-between text-xs font-label-md mb-1">
                            <span className="text-on-surface">{bar.label}</span>
                            <span className="text-primary font-bold">{bar.value}</span>
                          </div>
                          <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                            <div
                              className={`${bar.bar} h-full rounded-full`}
                              style={{ width: bar.width }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-space-md flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-label-mono text-secondary font-bold">
                      <span className="material-symbols-outlined text-sm">verified</span> Next On-Site
                      Site Visit: Q2 2025
                    </span>
                    <button className="font-label-lg text-label-lg text-primary hover:text-primary-container font-semibold inline-flex items-center gap-1">
                      <span>Audit Vault</span>
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Widget 3: Departmental Budget Approvals Status */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-space-sm">
                      <span className="font-label-mono text-label-mono uppercase tracking-wider text-secondary font-bold">
                        Fiscal Administration
                      </span>
                      <span className="p-1 rounded bg-surface-container text-primary">
                        <span className="material-symbols-outlined text-base">
                          account_balance_wallet
                        </span>
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">
                      Departmental Grant &amp; Budget Authorizations
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Provost expenditure approvals for Fall Research &amp; Teaching Equipment
                      allocations.
                    </p>
                    <div className="mt-space-md space-y-2.5">
                      {BUDGETS.map((budget) => (
                        <div
                          className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-lg"
                          key={budget.title}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full ${budget.dot}`}></span>
                            <div>
                              <div className="font-label-lg text-label-lg text-on-surface">
                                {budget.title}
                              </div>
                              <div className="font-label-mono text-label-mono text-on-surface-variant">
                                {budget.meta}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-label-mono ${budget.statusClass}`}
                          >
                            {budget.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-space-md flex items-center justify-between">
                    <span className="font-label-mono text-label-mono text-on-surface-variant">
                      $1.84M Total Allocated
                    </span>
                    <button className="font-label-lg text-label-lg text-primary hover:text-primary-container font-semibold inline-flex items-center gap-1">
                      <span>Treasury Ledger</span>
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Slide-over Panel for Course Scheduling (Simulated Modal Drawer) */}
            <div
              className={`fixed inset-y-0 right-0 w-full max-w-md bg-surface-container-lowest shadow-2xl z-50 transform transition-transform duration-300 ease-in-out p-space-lg flex flex-col justify-between overflow-y-auto ${
                drawerOpen ? "" : "translate-x-full"
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-space-md">
                  <div>
                    <span className="font-label-mono text-label-mono text-secondary uppercase font-bold tracking-wider">
                      Executive Registrar Dispatch
                    </span>
                    <h2 className="font-headline-sm text-headline-sm text-primary">
                      Assign New Course Section
                    </h2>
                  </div>
                  <button
                    className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                  Create an authorized section mapping to lecture halls and faculty workloads for Fall
                  Session 2024.
                </p>
                <form className="space-y-space-md">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface uppercase mb-1">
                      Course Code &amp; Descriptor
                    </label>
                    <input
                      className="w-full h-10 px-3 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="e.g., CS-402 Advanced Distributed Systems"
                      required
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface uppercase mb-1">
                      Primary Faculty Member
                    </label>
                    <select className="w-full h-10 px-3 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
                      <option>Prof. Marcus Thorne, Ph.D. (EECS)</option>
                      <option>Dr. Alistair Chen, M.D., Ph.D. (Medicine)</option>
                      <option>Dean Robert Albright, J.D. (Law)</option>
                      <option>Prof. Katherine Jenkins, Ph.D. (Engineering)</option>
                      <option>Prof. Clara Sterling, LL.M. (Economics)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface uppercase mb-1">
                      Lecture Hall / Facility
                    </label>
                    <select className="w-full h-10 px-3 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
                      <option>Archimedes Hall A (300 Seats - North Quad)</option>
                      <option>Turing Lab 204 (45 Stations - Science Complex)</option>
                      <option>Hamilton Rm 102 (30 Seats - Humanities)</option>
                      <option>Galileo Auditorium B (220 Seats - South Quad)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface uppercase mb-1">
                        Days Pattern
                      </label>
                      <select className="w-full h-10 px-3 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
                        <option>Mon / Wed / Fri</option>
                        <option>Tue / Thu</option>
                        <option>Wednesday Evening</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface uppercase mb-1">
                        Time Block
                      </label>
                      <select className="w-full h-10 px-3 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
                        <option>09:00 - 10:30</option>
                        <option>11:00 - 12:30</option>
                        <option>13:30 - 15:00</option>
                        <option>15:30 - 17:00</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface uppercase mb-1">
                      Maximum Student Enrolment Limit
                    </label>
                    <input
                      className="w-full h-10 px-3 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                      defaultValue={45}
                      max={350}
                      min={5}
                      type="number"
                    />
                  </div>
                  <div className="p-3 bg-surface-container rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-lg">info</span>
                    <span className="font-label-mono text-label-mono text-on-surface-variant">
                      System verifies zero calendar collisions before committing changes to master
                      registry.
                    </span>
                  </div>
                </form>
              </div>
              <div className="pt-space-lg flex items-center gap-space-sm">
                <button
                  className="flex-1 py-2.5 bg-surface-container text-on-surface font-label-lg text-label-lg rounded-lg hover:bg-surface-container-high transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2.5 bg-primary text-on-primary font-label-lg text-label-lg rounded-lg hover:bg-primary-container transition-colors shadow"
                  onClick={() => {
                    setDrawerOpen(false);
                    showToast("Course Section Assigned: Archimedes Hall Matrix synchronized.");
                  }}
                >
                  Commit Section
                </button>
              </div>
            </div>

            {/* Teacher / Student Onboarding Slide-over */}
            {onboardMode ? (
              <OnboardDrawer
                mode={onboardMode}
                onClose={() => setOnboardMode(null)}
                onSubmitStudent={handleAddStudent}
                onSubmitTeacher={handleAddTeacher}
              />
            ) : null}

            {/* Notification Toast for Administrative Action */}
            <div
              className={`fixed bottom-6 right-6 bg-primary text-on-primary px-space-md py-3 rounded-lg shadow-xl z-50 transform transition-all duration-300 flex items-center gap-space-sm ${
                toast ? "" : "translate-y-24 opacity-0"
              }`}
            >
              <span className="material-symbols-outlined text-secondary">check_circle</span>
              <span className="font-body-sm text-body-sm">
                {toast ?? "Master Registry Updated Successfully."}
              </span>
            </div>
          </div>
        </main>
    </div>
  );
}
