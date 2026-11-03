"use client";

import { useEffect, useMemo, useState } from "react";

import { api } from "../../lib/api";
import type { StudentProfile, TeacherProfile } from "../../lib/types";
import { getPopulatedEmail, initialsFromName } from "../../lib/types";
import LogoutButton from "../../components/logout-button";
import { useToast } from "../../components/toast-provider";

type Student = {
  id: string;
  name: string;
  year: number;
  program: string;
  track: string;
  avatarRing: "surface-variant" | "error";
  rowTint?: string;
  roll: {
    P: "ok" | "error" | "idle";
    A: "ok" | "error" | "idle";
    L: "ok" | "error" | "idle";
    E: "ok" | "error" | "idle";
  };
  rollSummary: string;
  rollTone?: "default" | "error";
  midterm: number | null;
  labs: number | null;
  examBonus: number;
  dossier: { icon: string; label: string; tone: "secondary" | "error" };
  gpa: string;
  letter: string;
  gpaTone?: "default" | "error";
  iconActions: {
    edit: boolean;
    flag: "flag" | "notification_important";
    flagTitle: string;
    flagStyle: "outline" | "error";
  };
  alertIcon?: boolean;
  hasDot?: boolean;
};

function yearFromCredits(credits: number): number {
  if (credits >= 90) {
    return 4;
  }

  if (credits >= 60) {
    return 3;
  }

  if (credits >= 30) {
    return 2;
  }

  return 1;
}

function letterFromGpa(gpa: number): string {
  if (gpa >= 3.9) return "A";
  if (gpa >= 3.7) return "A-";
  if (gpa >= 3.3) return "B+";
  if (gpa >= 3.0) return "B";
  if (gpa >= 2.7) return "B-";
  if (gpa >= 2.3) return "C+";
  if (gpa >= 2.0) return "C";
  if (gpa >= 1.7) return "C-";
  return "D";
}

type DossierStatus =
  | "verified"
  | "submitted"
  | "in-review"
  | "incomplete"
  | "honors"
  | "none";

const DOSSIER_META: Record<
  DossierStatus,
  { icon: string; label: string; tone: "secondary" | "error" }
> = {
  verified: {
    icon: "check_circle",
    label: "Milestone Verified",
    tone: "secondary",
  },
  submitted: { icon: "task_alt", label: "Spec Submitted", tone: "secondary" },
  "in-review": { icon: "pending", label: "In Review", tone: "secondary" },
  incomplete: { icon: "schedule", label: "Incomplete Draft", tone: "error" },
  honors: {
    icon: "military_tech",
    label: "Honors Capstone",
    tone: "secondary",
  },
  none: { icon: "pending", label: "No Dossier", tone: "secondary" },
};

function toRosterStudent(profile: StudentProfile): Student {
  const roster = profile.roster ?? {};
  const gpa = profile.gpa ?? 0;
  const attendanceStatus = roster.attendanceStatus ?? "idle";
  const dossier =
    DOSSIER_META[roster.dossierStatus ?? "none"] ?? DOSSIER_META.none;

  return {
    id: profile.studentId,
    name: profile.name,
    year: roster.year ?? yearFromCredits(profile.creditsCompleted ?? 0),
    program: profile.major,
    track: roster.track?.trim() || "Registered Coursework",
    avatarRing: roster.academicAlert ? "error" : "surface-variant",
    rowTint: roster.academicAlert ? "bg-error-container/10" : undefined,
    roll: {
      P: attendanceStatus === "present" ? "ok" : "idle",
      A: attendanceStatus === "absent" ? "error" : "idle",
      L: attendanceStatus === "late" ? "error" : "idle",
      E: attendanceStatus === "excused" ? "error" : "idle",
    },
    rollSummary: roster.attendanceSummary?.trim() || "No attendance recorded",
    rollTone: attendanceStatus === "absent" ? "error" : undefined,
    midterm:
      typeof roster.midtermScore === "number" ? roster.midtermScore : null,
    labs: typeof roster.labsScore === "number" ? roster.labsScore : null,
    examBonus: roster.examBonus ?? 0,
    dossier: {
      icon: dossier.icon,
      label: roster.dossierLabel?.trim() || dossier.label,
      tone: dossier.tone,
    },
    gpa: gpa.toFixed(2),
    letter: roster.letterGrade?.trim() || letterFromGpa(gpa),
    gpaTone: gpa < 2.5 ? "error" : undefined,
    iconActions: {
      edit: true,
      flag: roster.academicAlert ? "notification_important" : "flag",
      flagTitle: roster.academicAlert
        ? "Tutoring Referral Dispatched"
        : "Flag for Academic Support",
      flagStyle: roster.academicAlert ? "error" : "outline",
    },
    alertIcon: roster.academicAlert,
    hasDot: (roster.letterGrade ?? "").startsWith("A"),
  };
}

type GradeDraft = {
  student: string;
  studentId: string;
  assignment: string;
  raw: number;
  bonus: number;
};

export default function FacultyHubPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [standingFilter, setStandingFilter] = useState("all");
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [profileState, setProfileState] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [gradeDraft, setGradeDraft] = useState<GradeDraft>({
    student: "",
    studentId: "",
    assignment: "Midterm Exam 2 - Graph Algorithms & Dynamic Programming",
    raw: 0,
    bonus: 0,
  });
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [curveModalOpen, setCurveModalOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadFacultyAndStudents() {
      try {
        setProfileState("loading");
        const teacherData = await api.faculty.getProfile();
        if (!active) return;
        setProfile(teacherData);

        // Fetch each student by ID from the student array in the teacher schema
        const studentList = teacherData.students ?? [];
        const studentIds: string[] = studentList
          .map((item) =>
            typeof item === "string"
              ? item
              : item?._id || item?.studentId,
          )
          .filter((id): id is string => Boolean(id));

        let detailedStudents: StudentProfile[] = [];

        if (studentIds.length > 0) {
          const results = await Promise.allSettled(
            studentIds.map((id) => api.student.getById(id)),
          );

          detailedStudents = results
            .map((res, index) => {
              if (res.status === "fulfilled" && res.value) {
                return res.value;
              }
              const fallback = studentList[index];
              return fallback && typeof fallback === "object" && "name" in fallback
                ? (fallback as StudentProfile)
                : null;
            })
            .filter((item): item is StudentProfile => item !== null);
        } else if (
          studentList.length > 0 &&
          typeof studentList[0] === "object" &&
          "name" in studentList[0]
        ) {
          detailedStudents = studentList as StudentProfile[];
        }

        if (!active) return;
        setStudents(detailedStudents);

        const firstStudent = detailedStudents[0];

        if (firstStudent) {
          setGradeDraft({
            student: firstStudent.name,
            studentId: firstStudent.studentId,
            assignment:
              "Midterm Exam 2 - Graph Algorithms & Dynamic Programming",
            raw: firstStudent.roster?.midtermScore ?? 0,
            bonus: firstStudent.roster?.examBonus ?? 0,
          });
        }

        setProfileState("ready");
      } catch (error: unknown) {
        if (!active) return;
        setProfileError(
          error instanceof Error
            ? error.message
            : "Unable to load your faculty profile.",
        );
        setProfileState("error");
      }
    }

    loadFacultyAndStudents();

    return () => {
      active = false;
    };
  }, []);

  const profileEmail = getPopulatedEmail(profile?.user);

  const roster = useMemo(
    () => students.map(toRosterStudent),
    [students],
  );

  const visibleStudents = useMemo(() => {
    const term = search.toLowerCase();
    return roster.filter((student) => {
      const matchesSearch = `${student.name} ${student.id} ${student.program} ${student.track}`
        .toLowerCase()
        .includes(term);

      if (!matchesSearch) return false;

      if (standingFilter === "honors") {
        const score = student.midterm ?? Number(student.gpa) * 25;
        if (score < 90) return false;
      } else if (standingFilter === "borderline") {
        const score = student.midterm ?? Number(student.gpa) * 25;
        if (score < 70 || score >= 80) return false;
      } else if (standingFilter === "alert") {
        if (!student.alertIcon && Number(student.gpa) >= 2.5) return false;
      }

      if (attendanceFilter === "flagged") {
        if (
          student.roll.A !== "error" &&
          !student.rollSummary.toLowerCase().includes("missed") &&
          !student.rollSummary.toLowerCase().includes("low")
        ) {
          return false;
        }
      } else if (attendanceFilter === "perfect") {
        if (student.roll.A === "error" || student.roll.L === "error") {
          return false;
        }
      }

      return true;
    });
  }, [roster, search, standingFilter, attendanceFilter]);

  const avgGpa = useMemo(() => {
    if (students.length === 0) return "0.00";
    const sum = students.reduce((acc, s) => acc + (s.gpa ?? 0), 0);
    return (sum / students.length).toFixed(2);
  }, [students]);

  const gpaPercent = Math.min(100, Math.max(0, (Number(avgGpa) / 4) * 100));

  const presentCount = useMemo(
    () => roster.filter((s) => s.roll.P === "ok" || s.roll.E === "ok").length,
    [roster],
  );

  const attendanceRate = useMemo(() => {
    if (roster.length === 0) return 0;
    return Math.round((presentCount / roster.length) * 100);
  }, [roster, presentCount]);

  const alertsCount = useMemo(
    () => roster.filter((s) => s.alertIcon || Number(s.gpa) < 2.5).length,
    [roster],
  );

  const submissionsCount = useMemo(
    () =>
      roster.filter(
        (s) => s.labs !== null || s.dossier.tone === "secondary",
      ).length,
    [roster],
  );

  const gradeStats = useMemo(() => {
    const total = roster.length || 1;
    let countA = 0;
    let countB = 0;
    let countC = 0;
    let countD = 0;
    const scores: number[] = [];

    for (const s of roster) {
      const letter = (s.letter || "").toUpperCase();
      if (letter.startsWith("A")) countA++;
      else if (letter.startsWith("B")) countB++;
      else if (letter.startsWith("C")) countC++;
      else countD++;

      if (s.midterm !== null) {
        scores.push(s.midterm);
      }
    }

    scores.sort((a, b) => a - b);
    const median =
      scores.length === 0
        ? 0
        : scores.length % 2 === 1
        ? scores[Math.floor(scores.length / 2)]
        : (scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2;

    const maxScore = scores.length === 0 ? 0 : Math.max(...scores);

    return {
      countA,
      countB,
      countC,
      countD,
      pctA: Math.round((countA / total) * 100),
      pctB: Math.round((countB / total) * 100),
      pctC: Math.round((countC / total) * 100),
      pctD: Math.round((countD / total) * 100),
      median: median.toFixed(1),
      maxScore: maxScore.toFixed(1),
    };
  }, [roster]);

  function updateAttendance(
    studentId: string,
    status: "present" | "absent" | "late" | "excused",
  ) {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId !== studentId) return s;
        const summary =
          status === "present"
            ? "Present"
            : status === "absent"
            ? "Absent"
            : status === "late"
            ? "Tardy"
            : "Excused Absence";
        return {
          ...s,
          roster: {
            ...s.roster,
            attendanceStatus: status,
            attendanceSummary: summary,
          },
        };
      }),
    );
  }

  function handleBatchMarkPresent() {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        roster: {
          ...s.roster,
          attendanceStatus: "present" as const,
          attendanceSummary: "100% Present Today",
        },
      })),
    );
    toast(
      `All ${visibleStudents.length} scholars marked present for today's session.`,
      {
        variant: "success",
      },
    );
  }

  function handleSaveGrade(isPublish: boolean) {
    const computedTotal = total;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId !== gradeDraft.studentId) return s;
        return {
          ...s,
          roster: {
            ...s.roster,
            midtermScore: gradeDraft.raw,
            examBonus: gradeDraft.bonus,
            letterGrade: isPublish
              ? letterFromGpa((computedTotal / 100) * 4)
              : s.roster?.letterGrade,
          },
        };
      }),
    );
    toast(
      isPublish
        ? `Official grade of ${computedTotal.toFixed(1)}% has been published for ${gradeDraft.student}.`
        : `Grade draft saved locally for ${gradeDraft.student}.`,
      { variant: "success" },
    );
    setGradeModalOpen(false);
  }

  function handleApplyCurve() {
    setStudents((prev) =>
      prev.map((s) => {
        const curMidterm = s.roster?.midtermScore ?? 0;
        const newMidterm = Math.min(100, curMidterm + 2);
        return {
          ...s,
          roster: {
            ...s.roster,
            midtermScore: newMidterm,
            letterGrade: letterFromGpa((newMidterm / 100) * 4),
          },
        };
      }),
    );
    toast(
      "Cohort curve (+2.0 points) applied across all student midterm scores.",
      {
        variant: "success",
      },
    );
    setCurveModalOpen(false);
  }

  const total = Math.min(100, Math.max(0, gradeDraft.raw + gradeDraft.bonus));

  function openGradeModal(
    studentName: string,
    studentId: string,
    assignmentName: string,
    rawScore: number,
    bonus: number,
  ) {
    setGradeDraft({
      student: studentName,
      studentId,
      assignment: assignmentName,
      raw: rawScore,
      bonus,
    });
    setGradeModalOpen(true);
  }

  function downloadCSVExport() {
    const rows = visibleStudents.map((student) =>
      [
        student.id,
        student.name,
        "CS-301",
        student.midterm === null ? "" : student.midterm.toFixed(1),
        student.labs === null ? "" : student.labs.toFixed(1),
        student.gpa,
        student.letter,
      ].join(","),
    );

    const csvContent =
      "data:text/csv;charset=utf-8,Student ID,Name,Course,Midterm,Labs,Overall GPA,Grade\n" +
      rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Veritas_CS301_Roster_Ledger.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function simulateBroadcastAlert() {
    toast(
      `Notice successfully dispatched to ${roster.length} student portals.`,
      {
        variant: "success",
      },
    );
  }

  return (
    <div className="min-h-screen">
      <main className="bg-surface min-h-screen">
        <div className="flex flex-col w-full">
          {profileState !== "ready" ? (
            <div
              className={`mx-margin mt-space-md flex items-start gap-2 p-3 rounded-lg shadow-sm ${
                profileState === "error"
                  ? "bg-error-container text-on-error-container"
                  : "bg-surface-container text-on-surface-variant"
              }`}
              role="status"
            >
              <span className="material-symbols-outlined text-lg">
                {profileState === "error" ? "error" : "sync"}
              </span>
              <span className="font-body-sm text-body-sm">
                {profileState === "error"
                  ? profileError
                  : "Loading your faculty profile..."}
              </span>
            </div>
          ) : null}
          {/* Top Academic Context Ribbon */}
          <div className="w-full bg-surface-container-lowest px-margin py-space-sm flex flex-wrap items-center justify-between gap-space-sm shadow-sm">
            <div className="flex items-center gap-space-sm">
              <span className="font-label-mono text-label-mono uppercase tracking-widest text-primary font-bold bg-primary-fixed px-2 py-0.5 rounded">
                Faculty Gradebook &amp; Course Operations
              </span>
              <span className="text-outline-variant font-label-mono text-label-mono">
                /
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Academic Year 2024–2025 • Term I
              </span>
            </div>
            <div className="flex items-center gap-space-md">
              <span className="flex items-center gap-1.5 text-on-surface-variant font-label-mono text-label-mono">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Official Grade Sync: Locked &amp; Encrypted
              </span>
              <div className="h-3.5 w-px bg-outline-variant"></div>
              <button className="font-label-md text-label-md text-primary font-semibold hover:text-on-primary-container transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-base">
                  print
                </span>{" "}
                Print Official Syllabus &amp; Sheet
              </button>
              <div className="h-3.5 w-px bg-outline-variant"></div>
              <LogoutButton className="font-label-md text-label-md text-primary font-semibold hover:text-on-primary-container transition-colors flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed" />
            </div>
          </div>

          {/* Faculty Header & Active Courses Selector */}
          <div className="px-margin pt-space-lg pb-space-md">
            <div className="bg-primary text-on-primary rounded-xl p-space-lg relative overflow-hidden shadow-md">
              {/* Background subtle heraldic pattern */}
              <div className="absolute -right-8 -bottom-10 opacity-5 pointer-events-none text-white select-none">
                <span className="material-symbols-outlined text-[260px]">
                  school
                </span>
              </div>
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-lg">
                <div className="flex items-start gap-space-md max-w-2xl">
                  <div className="relative">
                    <div
                      aria-hidden="true"
                      className="w-20 h-20 rounded-lg bg-secondary text-on-secondary ring-2 ring-secondary-container shadow-md flex items-center justify-center font-bold text-2xl"
                    >
                      {initialsFromName(profile?.name, "FC")}
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-secondary text-on-secondary text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wider uppercase font-label-mono">
                      FELLOW
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-space-sm flex-wrap">
                      <h1 className="font-headline-lg text-headline-lg text-on-primary font-bold">
                        {profile?.name ?? "Faculty Profile"}
                      </h1>
                      <span className="bg-primary-container text-primary-fixed text-xs font-semibold px-2 py-0.5 rounded uppercase font-label-mono">
                        {profile?.rank ?? "Faculty"}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-primary-fixed-dim mt-0.5">
                      {profile?.department ?? "Department not loaded"} • Faculty
                      Portal
                    </p>
                    <div className="flex items-center gap-space-md mt-2 text-primary-fixed text-body-sm font-label-md">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-secondary-fixed">
                          mail
                        </span>{" "}
                        {profileEmail}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-secondary-fixed">
                          location_on
                        </span>{" "}
                        {profile?.office ?? "Office not assigned"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-secondary-fixed">
                          schedule
                        </span>{" "}
                        Office Hours: Tue/Thu 14:00–16:00
                      </span>
                    </div>
                  </div>
                </div>
                {/* Quick Institutional Action */}
                <div className="flex flex-row lg:flex-col items-start lg:items-end justify-between gap-space-sm">
                  <div className="bg-primary-container px-3.5 py-2 rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary-fixed text-lg">
                      verified_user
                    </span>
                    <span className="font-label-mono text-label-mono text-surface-variant font-medium">
                      Teaching Load: {profile?.teachingLoad ?? "—"} Credits
                    </span>
                  </div>
                  <button className="px-space-md py-2 bg-secondary text-on-secondary font-label-lg text-label-lg rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">
                      campaign
                    </span>{" "}
                    Broadcast Cohort Notice
                  </button>
                </div>
              </div>
              {/* Course Switcher Strip */}
              <div className="mt-space-lg pt-space-md border-t border-primary-container flex flex-wrap items-center gap-space-sm">
                <span className="font-label-md text-label-md uppercase tracking-wider text-primary-fixed-dim mr-2">
                  Active Teaching Roster:
                </span>
                <button className="px-space-md py-2 rounded-lg font-label-lg text-label-lg bg-surface-container-lowest text-primary font-bold shadow-sm flex items-center gap-2 ring-2 ring-secondary transition-all">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span>CS-301: Data Structures &amp; Algorithms</span>
                  <span className="text-xs bg-primary-fixed text-primary px-1.5 py-0.5 rounded font-label-mono font-medium">
                    Sec 01 • {roster.length} Enrolled
                  </span>
                </button>
                <button className="px-space-md py-2 rounded-lg font-label-lg text-label-lg bg-primary-container/80 hover:bg-primary-container text-surface-variant hover:text-on-primary transition-all flex items-center gap-2">
                  <span>CS-502: Advanced Machine Learning</span>
                  <span className="text-xs bg-tertiary-container text-tertiary-fixed px-1.5 py-0.5 rounded font-label-mono">
                    Sec 02 • 28 Enrolled
                  </span>
                </button>
                <button className="px-space-md py-2 rounded-lg font-label-lg text-label-lg bg-primary-container/80 hover:bg-primary-container text-surface-variant hover:text-on-primary transition-all flex items-center gap-2">
                  <span>ENGR-101: Engineering Ethics Seminar</span>
                  <span className="text-xs bg-tertiary-container text-tertiary-fixed px-1.5 py-0.5 rounded font-label-mono">
                    Sec 04 • 65 Enrolled
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics & Performance Highlights (CS-301 Section 01) */}
          <div className="px-margin py-space-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {/* Metric 1: Class GPA */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono text-label-mono uppercase tracking-wider text-outline">
                    Average Class GPA
                  </span>
                  <span className="p-1.5 rounded-lg bg-surface-container text-primary">
                    <span className="material-symbols-outlined text-lg">
                      analytics
                    </span>
                  </span>
                </div>
                <div className="mt-space-sm flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg font-bold text-primary">
                    {avgGpa}
                  </span>
                  <span className="font-label-mono text-label-mono text-secondary font-bold">
                    / 4.00
                  </span>
                  <span className="ml-auto font-label-mono text-label-mono text-on-surface-variant font-semibold bg-surface-container-high px-2 py-0.5 rounded">
                    Active Cohort
                  </span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${gpaPercent}%` }}
                  ></div>
                </div>
              </div>
              {/* Metric 2: Attendance Rate */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono text-label-mono uppercase tracking-wider text-outline">
                    Attendance Rate
                  </span>
                  <span className="p-1.5 rounded-lg bg-surface-container text-secondary">
                    <span className="material-symbols-outlined text-lg">
                      event_available
                    </span>
                  </span>
                </div>
                <div className="mt-space-sm flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg font-bold text-primary">
                    {attendanceRate}%
                  </span>
                  <span className="font-label-mono text-label-mono text-outline">
                    {presentCount} / {roster.length} Present
                  </span>
                  <span className="ml-auto font-label-mono text-label-mono text-secondary font-bold bg-secondary-fixed/50 px-2 py-0.5 rounded">
                    {attendanceRate >= 90 ? "High Honor" : "Standard"}
                  </span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-secondary h-full rounded-full transition-all duration-500"
                    style={{ width: `${attendanceRate}%` }}
                  ></div>
                </div>
              </div>
              {/* Metric 3: Submissions */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono text-label-mono uppercase tracking-wider text-outline">
                    Continuous Evaluation Active
                  </span>
                  <span className="p-1.5 rounded-lg bg-surface-container text-tertiary">
                    <span className="material-symbols-outlined text-lg">
                      assignment_turned_in
                    </span>
                  </span>
                </div>
                <div className="mt-space-sm flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg font-bold text-primary">
                    {submissionsCount}
                    <span className="text-on-surface-variant text-headline-md font-normal">
                      /{roster.length}
                    </span>
                  </span>
                  <span className="ml-auto font-label-mono text-label-mono text-outline-variant font-bold bg-surface-container px-2 py-0.5 rounded">
                    Graded Units
                  </span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-tertiary-container h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${roster.length > 0 ? (submissionsCount / roster.length) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
              {/* Metric 4: Pending Grade Reviews */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono text-label-mono uppercase tracking-wider text-outline">
                    Academic Alerts
                  </span>
                  <span className="p-1.5 rounded-lg bg-error-container text-on-error-container">
                    <span className="material-symbols-outlined text-lg">
                      rate_review
                    </span>
                  </span>
                </div>
                <div className="mt-space-sm flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg font-bold text-error">
                    {alertsCount}
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant">
                    {alertsCount === 1 ? "Scholar Flagged" : "Scholars Flagged"}
                  </span>
                  <span className="ml-auto font-label-mono text-label-mono text-error font-bold bg-error-container px-2 py-0.5 rounded">
                    {alertsCount > 0 ? "Action Req." : "Clear"}
                  </span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-error h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${roster.length > 0 ? (alertsCount / roster.length) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Work Area: Roster Table & Side Analytics Column */}
          <div className="px-margin py-space-md grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
            {/* Left Column: Student Roster & Live Gradebook (8 Cols) */}
            <div className="xl:col-span-8 flex flex-col gap-space-md">
              {/* Table Controls & Filter Bar */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm flex-1 max-w-md">
                  <div className="relative w-full">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                      search
                    </span>
                    <input
                      className="w-full h-10 pl-9 pr-3 bg-surface text-on-surface font-body-sm text-body-sm rounded-lg border-0 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline"
                      id="studentSearch"
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Filter by student name, ID (VU-######), or status..."
                      type="text"
                      value={search}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-space-sm flex-wrap">
                  <select
                    className="h-10 px-3 bg-surface text-on-surface font-label-md text-label-md rounded-lg border-0 shadow-inner focus:ring-2 focus:ring-primary focus:outline-none"
                    value={standingFilter}
                    onChange={(event) => setStandingFilter(event.target.value)}
                  >
                    <option value="all">All Grade Standings ({roster.length})</option>
                    <option value="honors">Honors / Top Tier (≥ 90%)</option>
                    <option value="borderline">Borderline Tier (70% - 79%)</option>
                    <option value="alert">Academic Alert (&lt; 70%)</option>
                  </select>
                  <select
                    className="h-10 px-3 bg-surface text-on-surface font-label-md text-label-md rounded-lg border-0 shadow-inner focus:ring-2 focus:ring-primary focus:outline-none"
                    value={attendanceFilter}
                    onChange={(event) => setAttendanceFilter(event.target.value)}
                  >
                    <option value="all">All Attendance Status</option>
                    <option value="flagged">Absence Flagged</option>
                    <option value="perfect">Perfect Attendance</option>
                  </select>
                  <button
                    className="h-10 px-3 bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                    onClick={downloadCSVExport}
                  >
                    <span className="material-symbols-outlined text-base">
                      download
                    </span>{" "}
                    Export Ledger (.csv)
                  </button>
                </div>
              </div>

              {/* Gradebook Table Surface */}
              <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-space-md py-space-sm bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-primary text-base">
                      table_chart
                    </span>
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">
                      Roster &amp; Continuous Evaluation Registry
                    </span>
                    <span className="bg-primary text-on-primary text-xs px-2 py-0.5 rounded-full font-label-mono font-medium">
                      Sec 01 Active
                    </span>
                  </div>
                  <span className="font-label-mono text-label-mono text-outline">
                    Click any score pill to update grade directly
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table
                    className="w-full text-left border-collapse"
                    id="rosterTable"
                  >
                    <thead>
                      <tr className="bg-surface-container font-label-mono text-label-mono uppercase tracking-wider text-outline text-[11px] select-none">
                        <th className="py-3 px-space-md">Student / ID</th>
                        <th className="py-3 px-space-sm">Program</th>
                        <th className="py-3 px-space-sm text-center">
                          Today&apos;s Roll
                        </th>
                        <th className="py-3 px-space-sm text-center">
                          Midterm Exam (40%)
                        </th>
                        <th className="py-3 px-space-sm text-center">
                          Lab / Assignments (30%)
                        </th>
                        <th className="py-3 px-space-sm text-center">
                          Project Dossier
                        </th>
                        <th className="py-3 px-space-sm text-right">
                          Overall GPA
                        </th>
                        <th className="py-3 px-space-md text-center">
                          Operations
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high font-body-sm text-body-sm text-on-surface">
                      {visibleStudents.length === 0 ? (
                        <tr>
                          <td
                            className="py-space-lg px-space-md text-center text-on-surface-variant"
                            colSpan={8}
                          >
                            {roster.length === 0
                              ? "No students are assigned to your roster yet. Ask the director to assign scholars to your faculty profile."
                              : "No students match the current search."}
                          </td>
                        </tr>
                      ) : null}
                      {visibleStudents.map((student) => (
                        <tr
                          className={`hover:bg-surface-container transition-colors group ${
                            student.rowTint ?? ""
                          }`}
                          key={student.id}
                        >
                          <td className="py-3 px-space-md">
                            <div className="flex items-center gap-space-sm">
                              <div
                                aria-hidden="true"
                                className={`w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shadow-sm ring-1 ${
                                  student.avatarRing === "error"
                                    ? "ring-error"
                                    : "ring-surface-variant"
                                }`}
                              >
                                {initialsFromName(student.name)}
                              </div>
                              <div>
                                <div className="font-label-lg text-label-lg font-bold text-primary flex items-center gap-1.5">
                                  {student.name}
                                  {student.hasDot && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                  )}
                                  {student.alertIcon && (
                                    <span
                                      className="material-symbols-outlined text-error text-xs"
                                      title="Pending Grade Appeal & Academic Alert"
                                    >
                                      warning
                                    </span>
                                  )}
                                </div>
                                <div className="font-label-mono text-label-mono text-outline text-[11px]">
                                  {student.id} • Year {student.year}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-space-sm">
                            <span className="font-label-md text-label-md text-on-surface font-medium">
                              {student.program}
                            </span>
                            <div className="text-[10px] text-outline font-label-mono">
                              {student.track}
                            </div>
                          </td>
                          <td className="py-3 px-space-sm text-center">
                            <div className="inline-flex p-0.5 bg-surface-container rounded-lg">
                              <button
                                className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                                  student.roll.P === "ok"
                                    ? "font-bold font-label-mono bg-primary text-on-primary"
                                    : "font-label-mono text-outline hover:text-on-surface"
                                }`}
                                onClick={() =>
                                  updateAttendance(student.id, "present")
                                }
                                title="Mark Present"
                              >
                                P
                              </button>
                              <button
                                className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                                  student.roll.A === "error"
                                    ? "font-bold font-label-mono bg-error text-on-error"
                                    : "font-label-mono text-outline hover:text-on-surface"
                                }`}
                                onClick={() =>
                                  updateAttendance(student.id, "absent")
                                }
                                title="Mark Absent"
                              >
                                A
                              </button>
                              <button
                                className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                                  student.roll.L === "error"
                                    ? "font-bold font-label-mono bg-tertiary-container text-on-tertiary"
                                    : "font-label-mono text-outline hover:text-on-surface"
                                }`}
                                onClick={() =>
                                  updateAttendance(student.id, "late")
                                }
                                title="Mark Late"
                              >
                                L
                              </button>
                              <button
                                className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                                  student.roll.E === "error"
                                    ? "font-bold font-label-mono bg-secondary-container text-on-secondary"
                                    : "font-label-mono text-outline hover:text-on-surface"
                                }`}
                                onClick={() =>
                                  updateAttendance(student.id, "excused")
                                }
                                title="Mark Excused"
                              >
                                E
                              </button>
                            </div>
                            <div
                              className={`text-[10px] font-label-mono mt-0.5 ${
                                student.rollTone === "error"
                                  ? "text-error font-semibold"
                                  : "text-outline"
                              }`}
                            >
                              {student.rollSummary}
                            </div>
                          </td>
                          <td className="py-3 px-space-sm text-center">
                            <button
                              className={
                                student.gpaTone === "error"
                                  ? "px-2.5 py-1 bg-error-container text-on-error-container hover:bg-error hover:text-on-error rounded font-label-mono font-bold transition-all text-xs"
                                  : "px-2.5 py-1 bg-surface-container-highest hover:bg-primary hover:text-on-primary rounded font-label-mono font-bold text-primary transition-all text-xs shadow-inner"
                              }
                              onClick={() =>
                                openGradeModal(
                                  student.name,
                                  student.id,
                                  "Midterm Exam 2 - Graph Algorithms & Dynamic Programming",
                                  student.midterm ?? 0,
                                  student.examBonus,
                                )
                              }
                            >
                              {student.midterm === null
                                ? "—"
                                : `${student.midterm.toFixed(1)}%`}
                            </button>
                          </td>
                          <td className="py-3 px-space-sm text-center">
                            <button
                              className="px-2.5 py-1 bg-surface-container-high hover:bg-primary hover:text-on-primary rounded font-label-mono font-bold text-on-surface transition-all text-xs"
                              onClick={() =>
                                openGradeModal(
                                  student.name,
                                  student.id,
                                  "Continuous Coursework - Lab Series 1-5",
                                  student.labs ?? 0,
                                  0,
                                )
                              }
                            >
                              {student.labs === null
                                ? "—"
                                : `${student.labs.toFixed(1)}%`}
                            </button>
                          </td>
                          <td className="py-3 px-space-sm text-center">
                            <span
                              className={
                                student.dossier.tone === "error"
                                  ? "inline-flex items-center gap-1 text-[11px] font-semibold text-error font-label-mono bg-error-container px-2 py-0.5 rounded"
                                  : "inline-flex items-center gap-1 text-[11px] font-semibold text-secondary font-label-mono bg-secondary-fixed/50 px-2 py-0.5 rounded"
                              }
                            >
                              <span className="material-symbols-outlined text-xs">
                                {student.dossier.icon}
                              </span>{" "}
                              {student.dossier.label}
                            </span>
                          </td>
                          <td className="py-3 px-space-sm text-right">
                            <span
                              className={`font-headline-sm text-headline-sm font-bold ${
                                student.gpaTone === "error"
                                  ? "text-error"
                                  : "text-primary"
                              }`}
                            >
                              {student.gpa}
                            </span>
                            <div
                              className={`text-[10px] font-label-mono font-bold uppercase ${
                                student.gpaTone === "error"
                                  ? "text-error"
                                  : "text-secondary"
                              }`}
                            >
                              {student.letter}
                            </div>
                          </td>
                          <td className="py-3 px-space-md text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                className="p-1.5 rounded text-primary hover:bg-surface-container-high transition-colors"
                                onClick={() =>
                                  openGradeModal(
                                    student.name,
                                    student.id,
                                    "Midterm Exam 2",
                                    student.midterm ?? 0,
                                    student.examBonus,
                                  )
                                }
                                title="Quick Grade Editor"
                              >
                                <span className="material-symbols-outlined text-base">
                                  edit_note
                                </span>
                              </button>
                              <button
                                className={
                                  student.iconActions.flagStyle === "error"
                                    ? "p-1.5 rounded text-error bg-error-container/50 hover:bg-error-container transition-colors"
                                    : "p-1.5 rounded text-outline hover:text-error hover:bg-surface-container-high transition-colors"
                                }
                                title={student.iconActions.flagTitle}
                              >
                                <span className="material-symbols-outlined text-base">
                                  {student.iconActions.flag}
                                </span>
                              </button>
                              <button
                                className="p-1.5 rounded text-outline hover:text-primary hover:bg-surface-container-high transition-colors"
                                title="Message Student"
                              >
                                <span className="material-symbols-outlined text-base">
                                  chat_bubble
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination & Bulk Execution Footer */}
                <div className="px-space-md py-space-sm bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-label-mono text-label-mono text-outline">
                      Displaying 1–{visibleStudents.length} of {roster.length}{" "}
                      Registered Scholars
                    </span>
                    <span className="text-outline-variant font-label-mono">
                      •
                    </span>
                    <button
                      className="font-label-md text-label-md text-primary font-semibold hover:underline"
                      onClick={handleBatchMarkPresent}
                    >
                      Batch Mark Present All
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-mono text-xs font-semibold hover:bg-surface-container-high disabled:opacity-50"
                      disabled
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 rounded bg-primary text-on-primary font-label-mono text-xs font-bold">
                      1
                    </span>
                    <button className="px-3 py-1 rounded bg-surface-container text-on-surface-variant font-label-mono text-xs font-semibold hover:bg-surface-container-high">
                      2
                    </button>
                    <button className="px-3 py-1 rounded bg-surface-container text-on-surface-variant font-label-mono text-xs font-semibold hover:bg-surface-container-high">
                      3
                    </button>
                    <button className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-mono text-xs font-semibold hover:bg-surface-container-high">
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Action Floating Bar / Fast Batch Note */}
              <div className="bg-surface-container-high p-space-md rounded-xl flex items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-xl">
                    psychology
                  </span>
                  <div>
                    <div className="font-label-lg text-label-lg font-bold text-primary">
                      Teaching Assistant Automated Proctoring Active
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">
                      Code Plagiarism check completed via MOSS suite: 0
                      high-similarity anomalies reported in Lab 05.
                    </div>
                  </div>
                </div>
                <button className="px-space-md py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-semibold hover:bg-primary-container transition-all flex items-center gap-1 whitespace-nowrap">
                  <span className="material-symbols-outlined text-base">
                    verified
                  </span>{" "}
                  View MOSS Report
                </button>
              </div>
            </div>

            {/* Right Column: Class Grade Distribution & Fast Announcement Hub (4 Cols) */}
            <div className="xl:col-span-4 flex flex-col gap-space-md">
              {/* Grade Distribution Analytics Card */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                      Grade Distribution
                    </h2>
                    <p className="font-label-mono text-label-mono text-outline uppercase tracking-wider">
                      CS-301 Midterm Curvature
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-label-mono text-xs font-bold">
                    Standard Bell
                  </span>
                </div>
                {/* Distribution Histogram Graphic */}
                <div className="space-y-3 pt-2">
                  {/* Grade A */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-label-mono mb-1">
                      <span className="font-bold text-primary">
                        Grade A (90 - 100%)
                      </span>
                      <span className="text-on-surface-variant font-semibold">
                        {gradeStats.countA} Scholars • {gradeStats.pctA}%
                      </span>
                    </div>
                    <div className="w-full bg-surface-container h-5 rounded-md overflow-hidden flex items-center px-2">
                      <div
                        className="bg-primary h-3 rounded transition-all duration-500"
                        style={{
                          width: `${Math.max(gradeStats.pctA > 0 ? 5 : 0, gradeStats.pctA)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  {/* Grade B */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-label-mono mb-1">
                      <span className="font-bold text-primary">
                        Grade B (80 - 89%)
                      </span>
                      <span className="text-secondary font-bold">
                        {gradeStats.countB} Scholars • {gradeStats.pctB}%
                      </span>
                    </div>
                    <div className="w-full bg-surface-container h-5 rounded-md overflow-hidden flex items-center px-2">
                      <div
                        className="bg-secondary h-3 rounded transition-all duration-500"
                        style={{
                          width: `${Math.max(gradeStats.pctB > 0 ? 5 : 0, gradeStats.pctB)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  {/* Grade C */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-label-mono mb-1">
                      <span className="font-bold text-primary">
                        Grade C (70 - 79%)
                      </span>
                      <span className="text-on-surface-variant font-semibold">
                        {gradeStats.countC} Scholars • {gradeStats.pctC}%
                      </span>
                    </div>
                    <div className="w-full bg-surface-container h-5 rounded-md overflow-hidden flex items-center px-2">
                      <div
                        className="bg-primary-container h-3 rounded transition-all duration-500"
                        style={{
                          width: `${Math.max(gradeStats.pctC > 0 ? 5 : 0, gradeStats.pctC)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  {/* Grade D */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-label-mono mb-1">
                      <span className="font-bold text-error">
                        Grade D / Marginal (&lt; 70%)
                      </span>
                      <span className="text-error font-semibold">
                        {gradeStats.countD} Scholars • {gradeStats.pctD}%
                      </span>
                    </div>
                    <div className="w-full bg-surface-container h-5 rounded-md overflow-hidden flex items-center px-2">
                      <div
                        className="bg-error h-3 rounded transition-all duration-500"
                        style={{
                          width: `${Math.max(gradeStats.pctD > 0 ? 5 : 0, gradeStats.pctD)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/* Statistical Digest Table */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-surface-container-low rounded-lg text-center">
                  <div>
                    <div className="font-label-mono text-label-mono text-outline uppercase text-[10px]">
                      Median Score
                    </div>
                    <div className="font-headline-sm text-headline-sm font-bold text-primary">
                      {gradeStats.median}%
                    </div>
                  </div>
                  <div>
                    <div className="font-label-mono text-label-mono text-outline uppercase text-[10px]">
                      Average GPA
                    </div>
                    <div className="font-headline-sm text-headline-sm font-bold text-primary">
                      {avgGpa}
                    </div>
                  </div>
                  <div>
                    <div className="font-label-mono text-label-mono text-outline uppercase text-[10px]">
                      Max Recorded
                    </div>
                    <div className="font-headline-sm text-headline-sm font-bold text-secondary">
                      {gradeStats.maxScore}%
                    </div>
                  </div>
                </div>
                <button
                  className="w-full py-2 bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5"
                  onClick={() => setCurveModalOpen(true)}
                >
                  <span className="material-symbols-outlined text-base">
                    tune
                  </span>{" "}
                  Configure Polynomial Curve (+2.0pt)
                </button>
              </div>

              {/* Quick Announcement & Cohort Communication Card */}
              <div
                className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm"
                id="announcementBox"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Class Dispatch
                  </h2>
                  <span className="font-label-mono text-label-mono text-outline text-xs">
                    Section 01 Channel
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Broadcast official notice to all 42 enrolled students via
                  student portal inbox and collegiate email alerts.
                </p>
                <div className="space-y-space-sm mt-1">
                  <div>
                    <label className="block font-label-mono text-label-mono text-outline uppercase text-[10px] mb-1">
                      Subject Header
                    </label>
                    <input
                      className="w-full h-9 px-3 bg-surface text-on-surface font-body-sm text-body-sm rounded-lg border-0 shadow-inner focus:ring-2 focus:ring-primary focus:outline-none"
                      defaultValue="Midterm 2 Regrade Windows & Office Hours Expansion"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block font-label-mono text-label-mono text-outline uppercase text-[10px] mb-1">
                      Announcement Body
                    </label>
                    <textarea
                      className="w-full p-2.5 bg-surface text-on-surface font-body-sm text-body-sm rounded-lg border-0 shadow-inner focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-outline"
                      defaultValue="Please note that grade appeal reviews for Graph Theory will conclude on Friday at 17:00 EST. Please ensure you have reviewed your rubric rubric deductions prior to booking slot."
                      placeholder="Write urgent assignment reminders, syllabus updates, or lab instructions..."
                      rows={3}
                    ></textarea>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        className="rounded text-primary focus:ring-0"
                        defaultChecked
                        type="checkbox"
                      />
                      <span className="font-label-md text-label-md text-on-surface-variant">
                        Send Push Notification
                      </span>
                    </label>
                    <button
                      className="px-space-md py-2 bg-primary text-on-primary font-label-md text-label-md font-semibold rounded-lg hover:bg-primary-container shadow-sm transition-all flex items-center gap-1.5"
                      onClick={simulateBroadcastAlert}
                    >
                      <span className="material-symbols-outlined text-base">
                        send
                      </span>{" "}
                      Broadcast
                    </button>
                  </div>
                </div>
              </div>

              {/* Department Calendar / Approaching Deadlines Card */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm">
                <span className="font-label-mono text-label-mono uppercase tracking-wider text-outline text-[11px]">
                  Milestone Deadlines
                </span>
                <div className="space-y-2 mt-1">
                  <div className="p-2.5 rounded-lg bg-surface-container-low flex items-start gap-3">
                    <span className="font-headline-sm text-headline-sm font-bold text-secondary pt-0.5">
                      24
                    </span>
                    <div>
                      <div className="font-label-lg text-label-lg font-bold text-primary">
                        Final Project Dossier Review
                      </div>
                      <div className="font-body-sm text-body-sm text-outline">
                        Nov 24 • Due 23:59 PM • Canvas / Veritas Hub
                      </div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container-low flex items-start gap-3">
                    <span className="font-headline-sm text-headline-sm font-bold text-outline pt-0.5">
                      02
                    </span>
                    <div>
                      <div className="font-label-lg text-label-lg font-bold text-primary">
                        Registrar Final Grade Lock
                      </div>
                      <div className="font-body-sm text-body-sm text-outline">
                        Dec 02 • Hard Census Deadline
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Grade Input Modal / Dedicated Interactive Drawer (Item 3 in requirements) */}
          <div
            className={`fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 transition-opacity ${
              gradeModalOpen ? "" : "hidden"
            }`}
            id="gradeModal"
          >
            <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-2xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] overflow-hidden flex flex-col border border-surface-container-high animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="shrink-0 p-4 sm:p-space-lg bg-primary text-on-primary flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary-fixed text-xl">
                      grading
                    </span>
                    <span className="font-label-mono text-label-mono uppercase tracking-widest text-primary-fixed">
                      CS-301 Gradebook Suite
                    </span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm font-bold mt-1 text-on-primary">
                    Quick Grade Input &amp; Score Verification
                  </h2>
                  <p
                    className="font-body-sm text-body-sm text-primary-fixed-dim"
                    id="modalStudentName"
                  >
                    {gradeDraft.student} ({gradeDraft.studentId})
                  </p>
                </div>
                <button
                  className="shrink-0 text-primary-fixed hover:text-white p-1 rounded-lg hover:bg-primary-container transition-colors"
                  onClick={() => setGradeModalOpen(false)}
                >
                  <span className="material-symbols-outlined text-2xl">
                    close
                  </span>
                </button>
              </div>
              {/* Modal Body */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-space-lg flex flex-col gap-space-md">
                {/* Assignment Title Banner */}
                <div className="bg-surface-container p-space-sm rounded-lg flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-label-mono text-label-mono text-outline uppercase text-[10px]">
                      Evaluating Assessment:
                    </span>
                    <div
                      className="font-label-lg text-label-lg font-bold text-primary"
                      id="modalAssignmentName"
                    >
                      {gradeDraft.assignment}
                    </div>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 bg-surface-container-lowest text-primary font-label-mono text-xs font-bold rounded shadow-sm">
                    Weight: 40%
                  </span>
                </div>
                {/* Numeric Score Breakdown Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                  <div className="bg-surface-container-low p-space-sm rounded-lg">
                    <label className="block font-label-mono text-label-mono text-outline uppercase text-[10px] mb-1">
                      Max Score
                    </label>
                    <input
                      className="w-full h-10 px-3 bg-surface-container-high text-on-surface-variant font-label-mono text-label-mono font-bold rounded border-0 cursor-not-allowed"
                      disabled
                      defaultValue="100.0"
                      type="text"
                    />
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-lg">
                    <label className="block font-label-mono text-label-mono text-primary font-bold uppercase text-[10px] mb-1">
                      Raw Exam Score
                    </label>
                    <input
                      className="w-full h-10 px-3 bg-surface-container-lowest text-primary font-label-mono text-label-mono font-bold rounded border-0 shadow-inner focus:ring-2 focus:ring-primary focus:outline-none"
                      id="rawScoreInput"
                      onChange={(event) =>
                        setGradeDraft((draft) => ({
                          ...draft,
                          raw: Number(event.target.value) || 0,
                        }))
                      }
                      step="0.5"
                      type="number"
                      value={gradeDraft.raw}
                    />
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-lg">
                    <label className="block font-label-mono text-label-mono text-secondary font-bold uppercase text-[10px] mb-1">
                      Curve / Bonus (+)
                    </label>
                    <input
                      className="w-full h-10 px-3 bg-surface-container-lowest text-secondary font-label-mono text-label-mono font-bold rounded border-0 shadow-inner focus:ring-2 focus:ring-secondary focus:outline-none"
                      id="curveBonusInput"
                      onChange={(event) =>
                        setGradeDraft((draft) => ({
                          ...draft,
                          bonus: Number(event.target.value) || 0,
                        }))
                      }
                      step="0.5"
                      type="number"
                      value={gradeDraft.bonus}
                    />
                  </div>
                </div>
                {/* Scoring Rubric Breakdown Sliders / Metrics */}
                <div className="border-t border-surface-container-high pt-space-sm">
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mb-2">
                    <span className="font-label-mono text-label-mono text-outline uppercase tracking-wider">
                      Assessment Rubric Decomposition
                    </span>
                    <span className="font-label-mono text-label-mono text-primary font-bold">
                      Aggregate:{" "}
                      <span id="aggregateRubricText">{total.toFixed(1)}</span> /
                      100
                    </span>
                  </div>
                  <div className="space-y-3">
                    {/* Criterion 1 */}
                    <div className="bg-surface-container-low p-2.5 rounded-lg flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 text-xs font-label-mono mb-1">
                          <span className="font-bold text-primary">
                            Problem Formulation &amp; State Invariant
                          </span>
                          <span className="font-bold text-primary">
                            25 / 25 pts
                          </span>
                        </div>
                        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    {/* Criterion 2 */}
                    <div className="bg-surface-container-low p-2.5 rounded-lg flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 text-xs font-label-mono mb-1">
                          <span className="font-bold text-primary">
                            Time &amp; Space Complexity Analysis
                          </span>
                          <span className="font-bold text-secondary">
                            23 / 25 pts (-2 O(V+E) proof)
                          </span>
                        </div>
                        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-secondary h-full rounded-full"
                            style={{ width: "92%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    {/* Criterion 3 */}
                    <div className="bg-surface-container-low p-2.5 rounded-lg flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 text-xs font-label-mono mb-1">
                          <span className="font-bold text-primary">
                            Algorithmic Correctness &amp; Proof
                          </span>
                          <span className="font-bold text-primary">
                            44.5 / 50 pts (+2 Curve)
                          </span>
                        </div>
                        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-primary-container h-full rounded-full"
                            style={{ width: "89%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Feedback & Remarks Textarea */}
                <div className="border-t border-surface-container-high pt-space-sm">
                  <label className="block font-label-mono text-label-mono text-outline uppercase tracking-wider text-[11px] mb-1">
                    Instructor Qualitative Feedback &amp; Verification Remarks
                  </label>
                  <textarea
                    className="w-full p-3 bg-surface text-on-surface font-body-sm text-body-sm rounded-lg border-0 shadow-inner focus:ring-2 focus:ring-primary focus:outline-none"
                    defaultValue="Exceptional reduction on dynamic programming state transition; minor edge-case oversight in question 4 regarding non-connected digraph traversal."
                    id="feedbackTextarea"
                    rows={3}
                  ></textarea>
                  <span className="text-[11px] font-label-mono text-outline mt-1 block">
                    Feedback will be visible on the student&apos;s personal
                    grade report upon publishing.
                  </span>
                </div>
              </div>
              {/* Modal Actions Footer */}
              <div className="shrink-0 p-4 sm:p-space-md bg-surface-container-low flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-space-sm border-t border-surface-container">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-label-mono text-label-mono text-outline whitespace-nowrap">
                    Computed Grade:
                  </span>
                  <span
                    className="font-headline-sm text-headline-sm font-bold text-primary"
                    id="totalComputedScoreDisplay"
                  >
                    {total.toFixed(1)}%
                  </span>
                  <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-mono text-xs font-bold">
                    Grade A
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      className="flex-1 sm:flex-none whitespace-nowrap px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded-lg transition-colors"
                      onClick={() => setGradeModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 sm:flex-none whitespace-nowrap px-3 py-2 bg-surface-container-highest hover:bg-surface-variant text-primary font-label-md text-label-md font-semibold rounded-lg transition-colors"
                      onClick={() => handleSaveGrade(false)}
                    >
                      Save as Draft
                    </button>
                  </div>
                  <button
                    className="w-full sm:w-auto whitespace-nowrap px-3 py-2 bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                    onClick={() => handleSaveGrade(true)}
                  >
                    <span className="material-symbols-outlined text-base">
                      check_circle
                    </span>{" "}
                    Save &amp; Publish Grade
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Curve Audit Config Modal (Secondary helper modal) */}
          <div
            className={`fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity ${
              curveModalOpen ? "" : "hidden"
            }`}
            id="curveAuditModal"
          >
            <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-md w-full p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                  Cohort Grading Adjustment
                </h3>
                <button
                  className="text-outline hover:text-on-surface"
                  onClick={() => setCurveModalOpen(false)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Apply standard collegiate normalization across the 42 students
                of CS-301 Section 01 according to departmental curriculum
                bylaws.
              </p>
              <div>
                <label className="block font-label-mono text-label-mono text-outline uppercase text-[10px] mb-1">
                  Adjustment Method
                </label>
                <select className="w-full h-10 px-3 bg-surface text-on-surface font-label-md text-label-md rounded-lg border-0 shadow-inner">
                  <option>
                    Flat Increment (+2.0 points to all active tests)
                  </option>
                  <option>Square Root Curve: 10 * sqrt(Raw Score)</option>
                  <option>Scale Top Score to 100%</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  className="px-4 py-2 bg-surface-container rounded-lg font-label-md text-label-md"
                  onClick={() => setCurveModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-semibold"
                  onClick={handleApplyCurve}
                >
                  Apply to Ledger
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
