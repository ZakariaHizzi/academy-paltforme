"use client";

type ClassBlockProps = {
  blockClass: string;
  code: string;
  codeClass: string;
  badge: string;
  badgeClass: string;
  title: string;
  room: string;
  instructor: string;
  detailClass: string;
  onClick: () => void;
};

function ClassBlock({
  blockClass,
  code,
  codeClass,
  badge,
  badgeClass,
  title,
  room,
  instructor,
  detailClass,
  onClick,
}: ClassBlockProps) {
  return (
    <div
      className={`p-2.5 rounded-lg ${blockClass} shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <span
            className={`font-label-mono text-[10px] font-bold ${codeClass} uppercase`}
          >
            {code}
          </span>
          <span
            className={`px-1.5 py-0.2 ${badgeClass} text-[9px] rounded font-medium`}
          >
            {badge}
          </span>
        </div>
        <span className="font-label-lg text-[12px] font-bold leading-tight mt-0.5">
          {title}
        </span>
      </div>
      <div
        className={`mt-2 pt-1.5 flex flex-col gap-0.5 text-[10px] ${detailClass}`}
      >
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px]">place</span>{" "}
          {room}
        </span>
        <span className="truncate">{instructor}</span>
      </div>
    </div>
  );
}

function FreeSlot({ label }: { label: string }) {
  return (
    <div className="p-2 rounded-lg bg-surface-container-low/60 flex items-center justify-center text-center">
      <span className="font-label-mono text-[11px] text-outline-variant italic">
        {label}
      </span>
    </div>
  );
}

const WEEK_DAYS = [
  { day: "Sun", date: "Oct 20" },
  { day: "Mon", date: "Oct 21" },
  { day: "Tue", date: "Oct 22" },
  { day: "Wed", date: "Oct 23" },
  { day: "Thu", date: "Oct 24" },
];

export default function StudentPortalPage() {
  return (
    <main className="bg-surface min-h-screen">
          <div className="flex flex-col w-full">
            <div className="px-margin py-space-lg flex flex-col gap-space-xl max-w-[1440px] mx-auto w-full">
              {/* Top Profile & Overview Section */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-lg">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
                  {/* Student Information Details */}
                  <div className="flex items-start sm:items-center gap-space-md">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt=""
                        className="w-20 h-20 rounded-full object-cover shadow-sm"
                        data-alt="Professional collegiate portrait of a focused undergraduate male student wearing a navy knit sweater in a modern university library with warm book stacks in background"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKH2vtrhnSzTpeldPn6W7r-GyikuQf2mkE-oqGksMrV33vhsCsGBZbox1DO3titCP4ucvmTiQ-3X5MzSA2O0W4NqPakpfBpE2_BE_numakP6sdbdv-OILttuojvJBo80fBtZAwkd0gS23Ks_SphO7gEEG_2e1FQwL4zUSjN2hGdAmxJf9Kp2UOIUd83xWATMncOtFDW6o1qeRQOSrm-nG5UKYHelJzcZgBlXZQnS7t2c2OVytU9v0x_g"
                      />
                      <span
                        className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow"
                        title="Dean's List Scholar"
                      >
                        <span className="material-symbols-outlined text-xs">
                          verified
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-space-xs">
                        <h1 className="font-headline-lg text-headline-lg text-primary">
                          Alexander Wright
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-secondary">
                            workspace_premium
                          </span>
                          Dean&apos;s List Honoree
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 text-on-surface-variant font-body-sm text-body-sm">
                        <span className="font-label-mono text-label-mono text-primary font-semibold">
                          ID: VU-883921
                        </span>
                        <span>•</span>
                        <span className="font-medium text-on-surface">
                          B.Sc. Computer Science &amp; Artificial Intelligence
                        </span>
                        <span>•</span>
                        <span>Year 3 (Junior Standing)</span>
                        <span>•</span>
                        <span>
                          Advisor:{" "}
                          <strong className="text-on-surface font-semibold">
                            Dr. Eleanor Vance
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Quick Actions Cluster */}
                  <div className="flex flex-wrap items-center gap-space-xs self-start lg:self-auto">
                    <button
                      className="flex items-center gap-space-xs px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-lg text-label-lg shadow-sm transition-all"
                      onClick={() =>
                        alert(
                          "Generating official PDF transcript with institutional cryptoseal...",
                        )
                      }
                    >
                      <span className="material-symbols-outlined text-base">
                        description
                      </span>
                      Official Transcript
                    </button>
                    <button
                      className="flex items-center gap-space-xs px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-lg text-label-lg shadow-sm transition-all"
                      onClick={() =>
                        alert(
                          "Opening Course Registration Cart (2 reserved seats)",
                        )
                      }
                    >
                      <span className="material-symbols-outlined text-base">
                        shopping_cart
                      </span>
                      Registration Cart
                      <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center font-bold">
                        2
                      </span>
                    </button>
                    <button
                      className="flex items-center gap-space-xs px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm transition-all"
                      onClick={() =>
                        alert("Directing to Dean of Students Petition Desk")
                      }
                    >
                      <span className="material-symbols-outlined text-base">
                        assignment_turned_in
                      </span>
                      Petition Leave
                    </button>
                    <div className="flex items-center gap-space-xs px-3.5 py-2 rounded-lg bg-secondary-fixed text-on-secondary-fixed shadow-sm">
                      <span className="material-symbols-outlined text-base text-secondary">
                        account_balance_wallet
                      </span>
                      <div className="flex flex-col text-left leading-none">
                        <span className="font-label-md text-[10px] uppercase text-on-secondary-fixed-variant">
                          Campus Card
                        </span>
                        <span className="font-label-lg text-label-lg font-bold">
                          $148.50
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Quick Metrics Ribbon */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md pt-space-md bg-surface-container-low p-space-md rounded-xl">
                  {/* Metric 1: GPA */}
                  <div className="flex items-center gap-space-md">
                    <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-2xl">
                        grade
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-mono text-label-mono text-outline uppercase tracking-wider">
                        Cumulative GPA
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-headline-md text-headline-md font-bold text-primary">
                          3.84
                        </span>
                        <span className="font-body-sm text-body-sm text-outline">
                          / 4.00
                        </span>
                      </div>
                      <span className="font-body-sm text-[11px] text-secondary font-medium">
                        Top 5% of Department
                      </span>
                    </div>
                  </div>
                  {/* Metric 2: Enrolled Credits */}
                  <div className="flex items-center gap-space-md">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-2xl">
                        layers
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-mono text-label-mono text-outline uppercase tracking-wider">
                        Active Credits
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">
                          16.0
                        </span>
                        <span className="font-body-sm text-body-sm text-outline">
                          Credits
                        </span>
                      </div>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">
                        Full-time Regular Track
                      </span>
                    </div>
                  </div>
                  {/* Metric 3: Attendance */}
                  <div className="flex items-center gap-space-md">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-2xl">
                        co_present
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-mono text-label-mono text-outline uppercase tracking-wider">
                        Attendance Rate
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">
                          96.2%
                        </span>
                      </div>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">
                        51 / 53 Sessions Present
                      </span>
                    </div>
                  </div>
                  {/* Metric 4: Deadlines & Progress */}
                  <div className="flex items-center gap-space-md">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high text-tertiary-container flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-2xl">
                        event_upcoming
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-mono text-label-mono text-outline uppercase tracking-wider">
                        Semester Progress
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">
                          Week 8
                        </span>
                        <span className="font-body-sm text-body-sm text-outline">
                          of 15
                        </span>
                      </div>
                      <span className="font-body-sm text-[11px] text-error font-semibold">
                        3 Deadlines This Week
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Timetable */}
              <div className="flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-xs gap-space-sm">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-xl">
                          calendar_month
                        </span>
                        <h2 className="font-headline-sm text-headline-sm text-primary">
                          Weekly Timetable
                        </h2>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Standard Academic Schedule • Sunday to Thursday Schedule
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-lg bg-surface-container-high p-0.5">
                        <button className="px-3 py-1 text-xs font-semibold rounded bg-surface-container-lowest text-primary shadow-sm">
                          Week View
                        </button>
                        <button className="px-3 py-1 text-xs font-medium text-on-surface-variant hover:text-on-surface transition-all">
                          Daily Agenda
                        </button>
                      </div>
                      <button
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
                        title="Print Timetable"
                      >
                        <span className="material-symbols-outlined text-lg">
                          print
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* Timetable Grid Canvas */}
                  <div className="overflow-x-auto pb-space-xs">
                    <div className="min-w-[760px] grid grid-cols-6 gap-2 text-left">
                      {/* Header Row */}
                      <div className="p-2 text-center rounded bg-surface-container-low font-label-mono text-label-mono text-outline uppercase font-semibold">
                        Time
                      </div>
                      {WEEK_DAYS.map((entry) => (
                        <div
                          className="p-2 text-center rounded bg-surface-container-low font-label-md text-label-md text-primary font-semibold"
                          key={entry.day}
                        >
                          {entry.day}{" "}
                          <span className="text-xs font-normal text-on-surface-variant block">
                            {entry.date}
                          </span>
                        </div>
                      ))}

                      {/* Block 1: 08:30 - 10:00 */}
                      <div className="p-2 rounded bg-surface-container-low font-label-mono text-[11px] text-outline flex items-center justify-center font-medium">
                        08:30 – 10:00
                      </div>
                      <ClassBlock
                        badge="Lecture"
                        badgeClass="bg-primary text-on-primary"
                        blockClass="bg-primary-fixed text-on-primary-fixed"
                        code="CS-301"
                        codeClass="text-primary"
                        detailClass="text-on-primary-fixed-variant"
                        instructor="Prof. Marcus Thorne"
                        onClick={() =>
                          alert(
                            "CS-301: Algorithms & Complexity\nProf. Marcus Thorne\nTuring Hall Rm 402",
                          )
                        }
                        room="Turing Rm 402"
                        title="Algorithms & Complexity"
                      />
                      <FreeSlot label="Academic Advising Open Hours" />
                      <ClassBlock
                        badge="Lecture"
                        badgeClass="bg-primary text-on-primary"
                        blockClass="bg-primary-fixed text-on-primary-fixed"
                        code="CS-301"
                        codeClass="text-primary"
                        detailClass="text-on-primary-fixed-variant"
                        instructor="Prof. Marcus Thorne"
                        onClick={() =>
                          alert(
                            "CS-301: Algorithms & Complexity\nProf. Marcus Thorne\nTuring Hall Rm 402",
                          )
                        }
                        room="Turing Rm 402"
                        title="Algorithms & Complexity"
                      />
                      <FreeSlot label="Autonomous Study" />
                      <ClassBlock
                        badge="Lab Section"
                        badgeClass="bg-tertiary-container text-on-tertiary"
                        blockClass="bg-tertiary-fixed text-on-tertiary-fixed"
                        code="CS-301L"
                        codeClass="text-tertiary"
                        detailClass="text-on-tertiary-fixed-variant"
                        instructor="Fellow D. Zhao"
                        onClick={() =>
                          alert(
                            "CS-301L: Advanced Algo Lab\nLab Fellow D. Zhao\nComputing Center Lab 3",
                          )
                        }
                        room="Comp Center Lab 3"
                        title="Algorithm Optimization Lab"
                      />

                      {/* Block 2: 10:15 - 11:45 */}
                      <div className="p-2 rounded bg-surface-container-low font-label-mono text-[11px] text-outline flex items-center justify-center font-medium">
                        10:15 – 11:45
                      </div>
                      <ClassBlock
                        badge="Lecture"
                        badgeClass="bg-surface-tint text-on-tertiary"
                        blockClass="bg-surface-container-highest text-on-surface"
                        code="MATH-240"
                        codeClass="text-primary"
                        detailClass="text-on-surface-variant"
                        instructor="Dr. Julian Croft"
                        onClick={() =>
                          alert(
                            "MATH-240: Linear Algebra & Matrix Computing\nDr. Julian Croft\nArchimedes Auditorium B",
                          )
                        }
                        room="Archimedes Aud B"
                        title="Linear Algebra & Matrices"
                      />
                      <ClassBlock
                        badge="Lecture"
                        badgeClass="bg-primary text-on-primary"
                        blockClass="bg-primary-fixed text-on-primary-fixed"
                        code="CS-340"
                        codeClass="text-primary"
                        detailClass="text-on-primary-fixed-variant"
                        instructor="Prof. Rachel Kim"
                        onClick={() =>
                          alert(
                            "CS-340: Distributed Database Systems\nProf. Rachel Kim\nTuring Hall Rm 204",
                          )
                        }
                        room="Turing Rm 204"
                        title="Distributed Databases"
                      />
                      <ClassBlock
                        badge="Lecture"
                        badgeClass="bg-surface-tint text-on-tertiary"
                        blockClass="bg-surface-container-highest text-on-surface"
                        code="MATH-240"
                        codeClass="text-primary"
                        detailClass="text-on-surface-variant"
                        instructor="Dr. Julian Croft"
                        onClick={() =>
                          alert(
                            "MATH-240: Linear Algebra & Matrix Computing\nDr. Julian Croft\nArchimedes Auditorium B",
                          )
                        }
                        room="Archimedes Aud B"
                        title="Linear Algebra & Matrices"
                      />
                      <ClassBlock
                        badge="Lecture"
                        badgeClass="bg-primary text-on-primary"
                        blockClass="bg-primary-fixed text-on-primary-fixed"
                        code="CS-340"
                        codeClass="text-primary"
                        detailClass="text-on-primary-fixed-variant"
                        instructor="Prof. Rachel Kim"
                        onClick={() =>
                          alert(
                            "CS-340: Distributed Database Systems\nProf. Rachel Kim\nTuring Hall Rm 204",
                          )
                        }
                        room="Turing Rm 204"
                        title="Distributed Databases"
                      />
                      <ClassBlock
                        badge="Tutorial"
                        badgeClass="bg-secondary text-on-secondary"
                        blockClass="bg-secondary-fixed text-on-secondary-fixed"
                        code="MATH-240T"
                        codeClass="text-secondary"
                        detailClass="text-on-secondary-fixed-variant"
                        instructor="TA Sarah Jenkins"
                        onClick={() =>
                          alert(
                            "MATH-240T: Problem Solving Session\nTA Sarah Jenkins\nNewton Hall 102",
                          )
                        }
                        room="Newton Hall 102"
                        title="Linear Algebra Problem Set"
                      />

                      {/* Block 3: 12:00 - 13:30 (Midday Break / Seminars) */}
                      <div className="p-2 rounded bg-surface-container-low font-label-mono text-[11px] text-outline flex items-center justify-center font-medium">
                        12:00 – 13:30
                      </div>
                      <div className="col-span-5 p-2 rounded-lg bg-surface-container-low/40 flex items-center justify-between px-space-md text-on-surface-variant font-label-mono text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">
                            restaurant
                          </span>{" "}
                          Faculty Common Dining &amp; Campus Recess
                        </span>
                        <span className="text-secondary font-medium">
                          Honors Society Mentorship Hours available
                        </span>
                      </div>

                      {/* Block 4: 14:00 - 15:30 */}
                      <div className="p-2 rounded bg-surface-container-low font-label-mono text-[11px] text-outline flex items-center justify-center font-medium">
                        14:00 – 15:30
                      </div>
                      <ClassBlock
                        badge="Lecture"
                        badgeClass="bg-primary-container text-on-primary"
                        blockClass="bg-surface-container-highest text-on-surface"
                        code="PHYS-201"
                        codeClass="text-primary"
                        detailClass="text-on-surface-variant"
                        instructor="Dr. Henrik Lindqvist"
                        onClick={() =>
                          alert(
                            "PHYS-201: Quantum Mechanics I\nDr. Henrik Lindqvist\nFaraday Hall 301",
                          )
                        }
                        room="Faraday Hall 301"
                        title="Quantum Mechanics I"
                      />
                      <ClassBlock
                        badge="Elective"
                        badgeClass="bg-secondary text-on-secondary"
                        blockClass="bg-secondary-fixed text-on-secondary-fixed"
                        code="ENG-210"
                        codeClass="text-secondary"
                        detailClass="text-on-secondary-fixed-variant"
                        instructor="Prof. Clara Sterling"
                        onClick={() =>
                          alert(
                            "ENG-210: Technical Communications & Research Writing\nProf. Clara Sterling\nHumanities B-12",
                          )
                        }
                        room="Humanities B-12"
                        title="Technical Research Writing"
                      />
                      <ClassBlock
                        badge="Lecture"
                        badgeClass="bg-primary-container text-on-primary"
                        blockClass="bg-surface-container-highest text-on-surface"
                        code="PHYS-201"
                        codeClass="text-primary"
                        detailClass="text-on-surface-variant"
                        instructor="Dr. Henrik Lindqvist"
                        onClick={() =>
                          alert(
                            "PHYS-201: Quantum Mechanics I\nDr. Henrik Lindqvist\nFaraday Hall 301",
                          )
                        }
                        room="Faraday Hall 301"
                        title="Quantum Mechanics I"
                      />
                      <ClassBlock
                        badge="Workshop"
                        badgeClass="bg-secondary text-on-secondary"
                        blockClass="bg-secondary-fixed text-on-secondary-fixed"
                        code="ENG-210"
                        codeClass="text-secondary"
                        detailClass="text-on-secondary-fixed-variant"
                        instructor="Prof. Clara Sterling"
                        onClick={() =>
                          alert(
                            "ENG-210: Peer Review Colloquium\nProf. Clara Sterling\nHumanities B-12",
                          )
                        }
                        room="Humanities B-12"
                        title="Peer Review Colloquium"
                      />
                      <FreeSlot label="Campus Colloquium Slot" />

                      {/* Block 5: 15:45 - 17:15 */}
                      <div className="p-2 rounded bg-surface-container-low font-label-mono text-[11px] text-outline flex items-center justify-center font-medium">
                        15:45 – 17:15
                      </div>
                      <FreeSlot label="Open Lab Hours" />
                      <ClassBlock
                        badge="Lab"
                        badgeClass="bg-tertiary-container text-on-tertiary"
                        blockClass="bg-tertiary-fixed text-on-tertiary-fixed"
                        code="CS-340L"
                        codeClass="text-tertiary"
                        detailClass="text-on-tertiary-fixed-variant"
                        instructor="Fellow K. Patel"
                        onClick={() =>
                          alert(
                            "CS-340L: Database Systems Practicum\nLab Fellow K. Patel\nComputing Center Lab 1",
                          )
                        }
                        room="Comp Center Lab 1"
                        title="PostgreSQL & Sharding Lab"
                      />
                      <FreeSlot label="Autonomous Study" />
                      <ClassBlock
                        badge="Lab"
                        badgeClass="bg-tertiary-container text-on-tertiary"
                        blockClass="bg-tertiary-fixed text-on-tertiary-fixed"
                        code="PHYS-201L"
                        codeClass="text-tertiary"
                        detailClass="text-on-tertiary-fixed-variant"
                        instructor="Dr. Henrik Lindqvist"
                        onClick={() =>
                          alert(
                            "PHYS-201L: Spectroscopy Laboratory\nDr. Henrik Lindqvist\nFaraday Physics Wing 109",
                          )
                        }
                        room="Faraday Wing 109"
                        title="Spectroscopy Lab"
                      />
                      <ClassBlock
                        badge="Student Club"
                        badgeClass="bg-surface-container-highest text-on-surface"
                        blockClass="bg-surface-container text-on-surface"
                        code="SEMINAR"
                        codeClass="text-outline"
                        detailClass="text-on-surface-variant"
                        instructor="Alexander Wright (Lead)"
                        onClick={() =>
                          alert("Student Research Circle: AI Alignment Seminar")
                        }
                        room="Student Union 204"
                        title="AI Alignment Seminar"
                      />
                    </div>
                  </div>
                  {/* Timetable Legend */}
                  <div className="flex flex-wrap items-center gap-space-md pt-space-xs text-xs text-on-surface-variant">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-primary-fixed"></span>
                      <span>Core Computer Science</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-surface-container-highest"></span>
                      <span>Mathematics &amp; Natural Science</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-secondary-fixed"></span>
                      <span>Electives / Humanities</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-tertiary-fixed"></span>
                      <span>Practicum &amp; Lab Units</span>
                    </div>
                  </div>
                </div>

              {/* Assigned Faculty Advisor */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col lg:flex-row lg:items-center gap-space-lg">
                <div className="flex items-center gap-space-md lg:min-w-[300px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Dr. Eleanor Vance"
                    className="w-14 h-14 rounded-full object-cover shadow-sm"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxAd9fseyVMbYlKjY4O7SeWa4oH_rqAneRdZqZRk1PzaG1L0rNiQVUkdljoLJe4JXvYrHn7l9rH7qHZr-KrrOF2_6mY6nqodIIYVox6uUge16ijiwTqPqSC0eazl0_k-5gxywy7sMiin1BoO2Odek-s_pHKwm7G01Vz6SPubBLt18_UTeK2ipmKqt3fF3AUsSSV_6NN1HsKclBr19vIaLKzBeQCGZRqN0kahCcdbq8Ojlxap404yxY9g"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-mono text-[10px] text-outline uppercase tracking-wider">
                        Assigned Faculty Advisor
                      </span>
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    </div>
                    <span className="font-title-md text-title-md text-primary">
                      Dr. Eleanor Vance
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Associate Chair of Computer Science
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-space-md lg:border-l lg:border-surface-container lg:pl-space-lg">
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Next Office Hours: Tuesdays &amp; Thursdays 14:00 - 16:00
                    (Room 312, Turing Hall).
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      className="py-2 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-label-md font-semibold transition-all"
                      onClick={() =>
                        alert(
                          "Scheduling advising session with Dr. Vance for Oct 29",
                        )
                      }
                    >
                      Book Advising Slot
                    </button>
                    <button
                      className="p-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary transition-all"
                      title="Send Internal Academic Mail"
                    >
                      <span className="material-symbols-outlined text-base">
                        mail
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Comprehensive Grades & Academic Performance Table */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-xl">
                        assessment
                      </span>
                      <h2 className="font-headline-sm text-headline-sm text-primary">
                        Fall Semester 2024 Course Gradebook
                      </h2>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Current continuous assessment breakdown, weighted
                      projections, and cumulative grade points.
                    </p>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <span className="font-label-mono text-label-mono text-outline">
                      Grading Scale: Standard 4.00
                    </span>
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-all"
                      onClick={() =>
                        alert(
                          "Exporting grade sheet in .CSV institutional schema",
                        )
                      }
                    >
                      <span className="material-symbols-outlined text-sm">
                        download
                      </span>
                      Export Audit
                    </button>
                  </div>
                </div>
                {/* Tabular Records */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low font-label-mono text-label-mono text-outline uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4 rounded-l">
                          Course Code &amp; Title
                        </th>
                        <th className="py-3 px-3 text-center">Credits</th>
                        <th className="py-3 px-3 text-center">Midterm Exam</th>
                        <th className="py-3 px-3 text-center">
                          Labs &amp; Coursework
                        </th>
                        <th className="py-3 px-3 text-center">Final Weight</th>
                        <th className="py-3 px-3 text-center">
                          Projected Score
                        </th>
                        <th className="py-3 px-3 text-center">Grade</th>
                        <th className="py-3 px-3 text-center">Quality Pts</th>
                        <th className="py-3 px-4 text-right rounded-r">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-surface-container">
                      {/* Row 1: CS-301 */}
                      <tr className="hover:bg-surface-container-low/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
                            <div className="flex flex-col">
                              <span className="font-label-lg text-label-lg text-primary font-bold">
                                CS-301: Advanced Data Structures &amp;
                                Algorithms
                              </span>
                              <span className="font-body-sm text-xs text-on-surface-variant">
                                Instructor: Prof. Marcus Thorne
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-medium">
                          4.0
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-bold text-primary">
                          94 / 100
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="font-label-mono font-medium">
                            98.0%
                          </span>
                          <span className="text-[10px] text-outline block">
                            5 of 5 submitted
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono text-outline">
                          40%
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-semibold text-on-surface">
                          96.4%
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded font-headline-sm text-xs font-bold bg-primary-container text-on-primary">
                            A
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-bold text-primary">
                          16.00
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-md text-[11px] font-semibold">
                            <span className="material-symbols-outlined text-xs">
                              star
                            </span>{" "}
                            Distinction Candidate
                          </span>
                        </td>
                      </tr>
                      {/* Row 2: MATH-240 */}
                      <tr className="hover:bg-surface-container-low/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-surface-tint shrink-0"></span>
                            <div className="flex flex-col">
                              <span className="font-label-lg text-label-lg text-primary font-bold">
                                MATH-240: Linear Algebra &amp; Matrix
                                Computation
                              </span>
                              <span className="font-body-sm text-xs text-on-surface-variant">
                                Instructor: Dr. Julian Croft
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-medium">
                          3.0
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-bold text-primary">
                          88 / 100
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="font-label-mono font-medium">
                            91.5%
                          </span>
                          <span className="text-[10px] text-outline block">
                            6 problem sets
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono text-outline">
                          45%
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-semibold text-on-surface">
                          90.2%
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded font-headline-sm text-xs font-bold bg-surface-container-highest text-primary">
                            A-
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-bold text-primary">
                          11.10
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high text-on-surface font-label-md text-[11px] font-semibold">
                            <span className="material-symbols-outlined text-xs text-primary">
                              check_circle
                            </span>{" "}
                            Pass / On Track
                          </span>
                        </td>
                      </tr>
                      {/* Row 3: CS-340 */}
                      <tr className="hover:bg-surface-container-low/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
                            <div className="flex flex-col">
                              <span className="font-label-lg text-label-lg text-primary font-bold">
                                CS-340: Distributed Database Architecture
                              </span>
                              <span className="font-body-sm text-xs text-on-surface-variant">
                                Instructor: Prof. Rachel Kim
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-medium">
                          3.0
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-bold text-primary">
                          96 / 100
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="font-label-mono font-medium">
                            95.0%
                          </span>
                          <span className="text-[10px] text-outline block">
                            Raft Consensus Proj
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono text-outline">
                          35%
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-semibold text-on-surface">
                          97.8%
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded font-headline-sm text-xs font-bold bg-primary text-on-primary">
                            A+
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-bold text-primary">
                          12.00
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-md text-[11px] font-semibold">
                            <span className="material-symbols-outlined text-xs">
                              star
                            </span>{" "}
                            Distinction Candidate
                          </span>
                        </td>
                      </tr>
                      {/* Row 4: PHYS-201 */}
                      <tr className="hover:bg-surface-container-low/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-surface-tint shrink-0"></span>
                            <div className="flex flex-col">
                              <span className="font-label-lg text-label-lg text-primary font-bold">
                                PHYS-201: Principles of Quantum Mechanics I
                              </span>
                              <span className="font-body-sm text-xs text-on-surface-variant">
                                Instructor: Dr. Henrik Lindqvist
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-medium">
                          3.0
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-bold text-primary">
                          85 / 100
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="font-label-mono font-medium">
                            89.0%
                          </span>
                          <span className="text-[10px] text-outline block">
                            4 Labs verified
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono text-outline">
                          50%
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-semibold text-on-surface">
                          86.7%
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded font-headline-sm text-xs font-bold bg-surface-container-highest text-primary">
                            B+
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-bold text-primary">
                          9.90
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high text-on-surface font-label-md text-[11px] font-semibold">
                            <span className="material-symbols-outlined text-xs text-primary">
                              check_circle
                            </span>{" "}
                            Pass / On Track
                          </span>
                        </td>
                      </tr>
                      {/* Row 5: ENG-210 */}
                      <tr className="hover:bg-surface-container-low/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0"></span>
                            <div className="flex flex-col">
                              <span className="font-label-lg text-label-lg text-primary font-bold">
                                ENG-210: Technical Communication &amp; Research
                              </span>
                              <span className="font-body-sm text-xs text-on-surface-variant">
                                Instructor: Prof. Clara Sterling
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-medium">
                          3.0
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-bold text-primary">
                          92 / 100
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="font-label-mono font-medium">
                            94.0%
                          </span>
                          <span className="text-[10px] text-outline block">
                            Whitepaper Draft A
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono text-outline">
                          30%
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-semibold text-on-surface">
                          93.5%
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded font-headline-sm text-xs font-bold bg-primary-container text-on-primary">
                            A
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-label-mono font-bold text-primary">
                          12.00
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-md text-[11px] font-semibold">
                            <span className="material-symbols-outlined text-xs">
                              star
                            </span>{" "}
                            Distinction Candidate
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* Semester Summary Footer & Progress Breakdown */}
                <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
                  {/* GPA Breakdown Stats */}
                  <div className="flex flex-wrap items-center gap-space-lg">
                    <div className="flex flex-col">
                      <span className="font-label-mono text-[10px] uppercase text-outline">
                        Term Credits
                      </span>
                      <span className="font-label-lg text-label-lg font-bold text-primary">
                        16.0 Enrolled
                      </span>
                    </div>
                    <div className="h-8 w-px bg-surface-variant hidden sm:block"></div>
                    <div className="flex flex-col">
                      <span className="font-label-mono text-[10px] uppercase text-outline">
                        Total Quality Points
                      </span>
                      <span className="font-label-lg text-label-lg font-bold text-primary">
                        61.00 Pts
                      </span>
                    </div>
                    <div className="h-8 w-px bg-surface-variant hidden sm:block"></div>
                    <div className="flex flex-col">
                      <span className="font-label-mono text-[10px] uppercase text-outline">
                        Projected Term GPA
                      </span>
                      <span className="font-headline-sm text-headline-sm font-bold text-secondary">
                        3.81 / 4.00
                      </span>
                    </div>
                  </div>
                  {/* Degree Completion Progress Gauge */}
                  <div className="flex flex-col sm:min-w-[280px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-label-mono text-label-mono text-on-surface-variant">
                        Degree Completion
                      </span>
                      <span className="font-label-mono text-label-mono font-bold text-primary">
                        84 / 128 Credits (65.6%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: "65.6%" }}
                      ></div>
                    </div>
                    <span className="font-body-sm text-[11px] text-outline mt-1 text-right">
                      44 Credits remaining for Graduation (Spring 2026)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </main>
  );
}
