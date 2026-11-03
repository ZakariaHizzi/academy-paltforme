"use client";

import { useState } from "react";

export type DepartmentCode = "eecs" | "bio" | "law" | "business";
export type FacultyRank =
  | "Lecturer"
  | "Assistant Professor"
  | "Associate Professor"
  | "Professor";

export const DEPARTMENT_LABELS: Record<DepartmentCode, string> = {
  eecs: "Electrical Eng. & Computer Science",
  bio: "Biomedical Sciences",
  law: "Veritas Law School",
  business: "School of Economics & Management",
};

export const DEPARTMENT_COLLEGES: Record<DepartmentCode, string> = {
  eecs: "College of Engineering",
  bio: "School of Medicine",
  law: "Faculty of Law",
  business: "School of Management",
};

export type TeacherDraft = {
  firstName: string;
  middleName: string;
  lastName: string;
  department: DepartmentCode;
  rank: FacultyRank;
  office: string;
  email: string;
  password: string;
  teachingLoad: string;
};

export type StudentDraft = {
  firstName: string;
  middleName: string;
  lastName: string;
  studentId: string;
  email: string;
  password: string;
  major: string;
  gpa: string;
  creditsCompleted: string;
  campusCardBalance: string;
};

type OnboardMode = "teacher" | "student";

type OnboardDrawerProps = {
  mode: OnboardMode;
  onClose: () => void;
  onSubmitTeacher: (draft: TeacherDraft) => Promise<void> | void;
  onSubmitStudent: (draft: StudentDraft) => Promise<void> | void;
};

const inputClass =
  "w-full h-10 px-3 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary";

const labelClass =
  "block font-label-md text-label-md text-on-surface uppercase mb-1";

function TextField({
  label,
  name,
  type = "text",
  placeholder,
  required,
  defaultValue,
  min,
  max,
  step,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={labelClass} htmlFor={`onboard-${name}`}>
        {label}
        {required ? <span className="text-error"> *</span> : null}
      </label>
      <input
        className={inputClass}
        defaultValue={defaultValue}
        id={`onboard-${name}`}
        max={max}
        min={min}
        name={name}
        placeholder={placeholder}
        required={required}
        step={step}
        type={type}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  required,
  defaultValue,
  options,
  className = "",
}: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={labelClass} htmlFor={`onboard-${name}`}>
        {label}
        {required ? <span className="text-error"> *</span> : null}
      </label>
      <select
        className={`${inputClass} cursor-pointer`}
        defaultValue={defaultValue}
        id={`onboard-${name}`}
        name={name}
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-2 pt-space-xs">
      <span className="p-1 rounded bg-surface-container text-primary">
        <span className="material-symbols-outlined text-base">{icon}</span>
      </span>
      <div>
        <h3 className="font-title-md text-title-md text-primary font-semibold">
          {title}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

const DEPARTMENT_OPTIONS = (
  Object.keys(DEPARTMENT_LABELS) as DepartmentCode[]
).map((code) => ({ value: code, label: DEPARTMENT_LABELS[code] }));

const RANK_OPTIONS = [
  { value: "Lecturer", label: "Lecturer" },
  { value: "Assistant Professor", label: "Assistant Professor" },
  { value: "Associate Professor", label: "Associate Professor" },
  { value: "Professor", label: "Professor" },
];

export default function OnboardDrawer({
  mode,
  onClose,
  onSubmitTeacher,
  onSubmitStudent,
}: OnboardDrawerProps) {
  const [submitting, setSubmitting] = useState(false);
  const isTeacher = mode === "teacher";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const get = (key: string) => String(form.get(key) ?? "").trim();

    setSubmitting(true);

    try {
      if (isTeacher) {
        await onSubmitTeacher({
          firstName: get("firstName"),
          middleName: get("middleName"),
          lastName: get("lastName"),
          department: get("department") as DepartmentCode,
          rank: get("rank") as FacultyRank,
          office: get("office"),
          email: get("email"),
          password: get("password"),
          teachingLoad: get("teachingLoad"),
        });
      } else {
        await onSubmitStudent({
          firstName: get("firstName"),
          middleName: get("middleName"),
          lastName: get("lastName"),
          studentId: get("studentId"),
          email: get("email"),
          password: get("password"),
          major: get("major"),
          gpa: get("gpa"),
          creditsCompleted: get("creditsCompleted"),
          campusCardBalance: get("campusCardBalance"),
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close onboarding panel"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
        type="button"
      />
      <div className="relative w-full max-w-2xl h-full bg-surface-container-lowest shadow-2xl flex flex-col">
        <div className="flex items-start justify-between gap-space-md p-space-lg border-b border-surface-container">
          <div>
            <span className="font-label-mono text-label-mono text-secondary uppercase font-bold tracking-wider">
              Registrar Intake
            </span>
            <h2 className="font-headline-sm text-headline-sm text-primary">
              {isTeacher ? "Onboard Teaching Faculty" : "Onboard New Scholar"}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              {isTeacher
                ? "Record the name, department, rank, office and teaching load for a new teacher."
                : "Record the name, matriculation number and academic record for a new student."}
            </p>
          </div>
          <button
            aria-label="Close onboarding panel"
            className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form className="flex-1 flex flex-col min-h-0" onSubmit={handleSubmit}>
          <div className="flex-1 overflow-y-auto p-space-lg space-y-space-md">
            {isTeacher ? (
              <>
                <SectionTitle
                  icon="badge"
                  subtitle="Legal name of the teacher."
                  title="Identity Record"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                  <TextField
                    label="First Name"
                    name="firstName"
                    placeholder="Marcus"
                    required
                  />
                  <TextField
                    label="Middle Name"
                    name="middleName"
                    placeholder="A."
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    placeholder="Thorne"
                    required
                  />
                </div>

                <SectionTitle
                  icon="school"
                  subtitle="Department, academic rank and teaching load allocation."
                  title="Academic Appointment"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <SelectField
                    label="Department"
                    name="department"
                    options={DEPARTMENT_OPTIONS}
                    required
                  />
                  <SelectField
                    defaultValue="Lecturer"
                    label="Academic Rank"
                    name="rank"
                    options={RANK_OPTIONS}
                    required
                  />
                  <TextField
                    label="Teaching Load (Credits)"
                    min={0}
                    name="teachingLoad"
                    placeholder="12"
                    type="number"
                  />
                  <TextField
                    label="Office Location"
                    name="office"
                    placeholder="Turing Center 402"
                  />
                </div>

                <SectionTitle
                  icon="contact_mail"
                  subtitle="Login details for the faculty account. Stored in the users collection."
                  title="Account Access"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <TextField
                    label="Official Email"
                    name="email"
                    placeholder="m.thorne@veritas.edu"
                    required
                    type="email"
                  />
                  <TextField
                    label="Initial Password"
                    name="password"
                    placeholder="Minimum 8 characters"
                    required
                    type="password"
                  />
                </div>
              </>
            ) : (
              <>
                <SectionTitle
                  icon="person"
                  subtitle="Legal name and institutional matriculation identifier."
                  title="Scholar Identity"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                  <TextField
                    label="First Name"
                    name="firstName"
                    placeholder="Amara"
                    required
                  />
                  <TextField
                    label="Middle Name"
                    name="middleName"
                    placeholder="N."
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    placeholder="Okafor"
                    required
                  />
                </div>
                <TextField
                  label="Matriculation Number"
                  name="studentId"
                  placeholder="VU-81920"
                  required
                />

                <SectionTitle
                  icon="menu_book"
                  subtitle="Programme of study and academic standing."
                  title="Academic Record"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <TextField
                    className="sm:col-span-2"
                    label="Program of Study (Major)"
                    name="major"
                    placeholder="B.Sc. Computer Science & Artificial Intelligence"
                    required
                  />
                  <TextField
                    label="Cumulative GPA"
                    max={4}
                    min={0}
                    name="gpa"
                    placeholder="3.75"
                    step="0.01"
                    type="number"
                  />
                  <TextField
                    label="Credits Completed"
                    min={0}
                    name="creditsCompleted"
                    placeholder="48"
                    type="number"
                  />
                  <TextField
                    label="Campus Card Balance"
                    min={0}
                    name="campusCardBalance"
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                  />
                </div>

                <SectionTitle
                  icon="contact_mail"
                  subtitle="Login details for the student account. Stored in the users collection."
                  title="Account Access"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <TextField
                    label="Official Email"
                    name="email"
                    placeholder="a.okafor@veritas.edu"
                    required
                    type="email"
                  />
                  <TextField
                    label="Initial Password"
                    name="password"
                    placeholder="Minimum 8 characters"
                    required
                    type="password"
                  />
                </div>
              </>
            )}
          </div>

          <div className="border-t border-surface-container p-space-lg flex items-center gap-space-sm">
            <button
              className="flex-1 py-2.5 bg-surface-container text-on-surface font-label-lg text-label-lg rounded-lg hover:bg-surface-container-high transition-colors"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="flex-1 py-2.5 bg-primary text-on-primary font-label-lg text-label-lg rounded-lg hover:bg-primary-container transition-colors shadow disabled:opacity-60"
              disabled={submitting}
              type="submit"
            >
              {isTeacher ? "Add Teacher to Registry" : "Add Student to Registry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
