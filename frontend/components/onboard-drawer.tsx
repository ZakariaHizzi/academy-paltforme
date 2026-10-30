"use client";

import { useState } from "react";

export type DepartmentCode = "eecs" | "bio" | "law" | "business";
export type FacultyRank = "dean" | "full" | "assoc" | "assist" | "visiting";

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
  employeeId: string;
  title: string;
  department: DepartmentCode;
  rank: FacultyRank;
  office: string;
  campus: string;
  email: string;
  phone: string;
  ext: string;
  credits: string;
  sections: string;
  courses: string;
  tenure: string;
  hireDate: string;
  qualification: string;
  specialization: string;
  status: string;
};

export type StudentDraft = {
  firstName: string;
  middleName: string;
  lastName: string;
  studentId: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  program: string;
  department: DepartmentCode;
  level: string;
  status: string;
  advisor: string;
  credits: string;
  gpa: string;
  campus: string;
  enrollmentDate: string;
  address: string;
  city: string;
  country: string;
  guardianName: string;
  guardianPhone: string;
  scholarship: string;
  notes: string;
};

type OnboardMode = "teacher" | "student";

type OnboardDrawerProps = {
  mode: OnboardMode;
  onClose: () => void;
  onSubmitTeacher: (draft: TeacherDraft) => void;
  onSubmitStudent: (draft: StudentDraft) => void;
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
  { value: "dean", label: "Dean / Department Chair" },
  { value: "full", label: "Full Professor" },
  { value: "assoc", label: "Associate Professor" },
  { value: "assist", label: "Assistant Professor" },
  { value: "visiting", label: "Visiting Scholar / Lecturer" },
];

const TENURE_OPTIONS = [
  { value: "Tenured Chair", label: "Tenured Chair" },
  { value: "Tenured", label: "Tenured" },
  { value: "Tenure-Track", label: "Tenure-Track" },
  { value: "Visiting Scholar", label: "Visiting Scholar" },
  { value: "Adjunct Faculty", label: "Adjunct Faculty" },
  { value: "Emeritus", label: "Emeritus" },
];

const STAFF_STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "On Leave", label: "On Leave" },
  { value: "Emeritus", label: "Emeritus" },
];

const STUDENT_LEVEL_OPTIONS = [
  { value: "Undergraduate Year 1", label: "Undergraduate — Year 1" },
  { value: "Undergraduate Year 2", label: "Undergraduate — Year 2" },
  { value: "Undergraduate Year 3", label: "Undergraduate — Year 3" },
  { value: "Undergraduate Year 4", label: "Undergraduate — Year 4" },
  { value: "Master's", label: "Master's Candidate" },
  { value: "Doctoral", label: "Doctoral Candidate" },
];

const STUDENT_STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Probationary", label: "Probationary" },
  { value: "Suspended", label: "Suspended" },
  { value: "Graduated", label: "Graduated" },
];

const SCHOLARSHIP_OPTIONS = [
  { value: "None", label: "None / Self-Funded" },
  { value: "Merit Scholarship", label: "Merit Scholarship" },
  { value: "Need-Based Grant", label: "Need-Based Grant" },
  { value: "Research Assistantship", label: "Research Assistantship" },
  { value: "Athletic Scholarship", label: "Athletic Scholarship" },
];

export default function OnboardDrawer({
  mode,
  onClose,
  onSubmitTeacher,
  onSubmitStudent,
}: OnboardDrawerProps) {
  const [submitting, setSubmitting] = useState(false);
  const isTeacher = mode === "teacher";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const get = (key: string) => String(form.get(key) ?? "").trim();

    setSubmitting(true);
    if (isTeacher) {
      onSubmitTeacher({
        firstName: get("firstName"),
        middleName: get("middleName"),
        lastName: get("lastName"),
        employeeId: get("employeeId"),
        title: get("title"),
        department: get("department") as DepartmentCode,
        rank: get("rank") as FacultyRank,
        office: get("office"),
        campus: get("campus"),
        email: get("email"),
        phone: get("phone"),
        ext: get("ext"),
        credits: get("credits"),
        sections: get("sections"),
        courses: get("courses"),
        tenure: get("tenure"),
        hireDate: get("hireDate"),
        qualification: get("qualification"),
        specialization: get("specialization"),
        status: get("status"),
      });
    } else {
      onSubmitStudent({
        firstName: get("firstName"),
        middleName: get("middleName"),
        lastName: get("lastName"),
        studentId: get("studentId"),
        email: get("email"),
        phone: get("phone"),
        dob: get("dob"),
        gender: get("gender"),
        program: get("program"),
        department: get("department") as DepartmentCode,
        level: get("level"),
        status: get("status"),
        advisor: get("advisor"),
        credits: get("credits"),
        gpa: get("gpa"),
        campus: get("campus"),
        enrollmentDate: get("enrollmentDate"),
        address: get("address"),
        city: get("city"),
        country: get("country"),
        guardianName: get("guardianName"),
        guardianPhone: get("guardianPhone"),
        scholarship: get("scholarship"),
        notes: get("notes"),
      });
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
                ? "Record the complete appointment, academic assignment and contact profile for a new teacher."
                : "Record the complete academic, personal and guardian profile for a new student."}
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
                  subtitle="Legal name and institutional staff identifier."
                  title="Identity & Employment Record"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <TextField
                    label="Employee ID"
                    name="employeeId"
                    placeholder="FAC-401"
                    required
                  />
                  <TextField
                    label="Date of Hire"
                    name="hireDate"
                    required
                    type="date"
                  />
                  <TextField
                    label="Official Title"
                    name="title"
                    placeholder="Professor of Computer Science"
                    required
                  />
                  <SelectField
                    defaultValue="full"
                    label="Employment Status"
                    name="status"
                    options={STAFF_STATUS_OPTIONS}
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
                    label="Academic Rank"
                    name="rank"
                    options={RANK_OPTIONS}
                    required
                  />
                  <SelectField
                    label="Tenure Status"
                    name="tenure"
                    options={TENURE_OPTIONS}
                    required
                  />
                  <TextField
                    label="Assigned Credits"
                    min={0}
                    name="credits"
                    placeholder="12"
                    type="number"
                  />
                  <TextField
                    label="Sections Assigned"
                    min={0}
                    name="sections"
                    placeholder="3"
                    type="number"
                  />
                  <TextField
                    label="Courses Taught"
                    name="courses"
                    placeholder="CS-101, CS-501"
                  />
                </div>

                <SectionTitle
                  icon="contact_mail"
                  subtitle="Office location, campus, official channels and credentials."
                  title="Contact & Credentials"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <TextField
                    label="Office Location"
                    name="office"
                    placeholder="Turing Center 402"
                    required
                  />
                  <TextField
                    label="Campus"
                    name="campus"
                    placeholder="Science Quadrangle"
                    required
                  />
                  <TextField
                    label="Official Email"
                    name="email"
                    placeholder="m.thorne@veritas.edu"
                    required
                    type="email"
                  />
                  <TextField
                    label="Phone Number"
                    name="phone"
                    placeholder="+1 (555) 010-4408"
                  />
                  <TextField
                    label="Campus Extension"
                    name="ext"
                    placeholder="Ext. 4108"
                  />
                  <TextField
                    label="Highest Qualification"
                    name="qualification"
                    placeholder="Ph.D. in Computer Science"
                  />
                  <TextField
                    className="sm:col-span-2"
                    label="Specialization / Research Focus"
                    name="specialization"
                    placeholder="Artificial intelligence, autonomous systems"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <TextField
                    label="Matriculation Number"
                    name="studentId"
                    placeholder="VU-81920"
                    required
                  />
                  <TextField
                    label="Date of Birth"
                    name="dob"
                    required
                    type="date"
                  />
                  <SelectField
                    label="Gender"
                    name="gender"
                    options={[
                      { value: "Female", label: "Female" },
                      { value: "Male", label: "Male" },
                      { value: "Non-binary", label: "Non-binary" },
                      { value: "Prefer not to say", label: "Prefer not to say" },
                    ]}
                    required
                  />
                  <TextField
                    label="Enrollment Date"
                    name="enrollmentDate"
                    required
                    type="date"
                  />
                </div>

                <SectionTitle
                  icon="menu_book"
                  subtitle="Programme, department, level and academic standing."
                  title="Academic Record"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <TextField
                    className="sm:col-span-2"
                    label="Program of Study"
                    name="program"
                    placeholder="B.Sc. Computer Science & Artificial Intelligence"
                    required
                  />
                  <SelectField
                    label="Department"
                    name="department"
                    options={DEPARTMENT_OPTIONS}
                    required
                  />
                  <SelectField
                    label="Level / Year"
                    name="level"
                    options={STUDENT_LEVEL_OPTIONS}
                    required
                  />
                  <SelectField
                    label="Enrollment Status"
                    name="status"
                    options={STUDENT_STATUS_OPTIONS}
                    required
                  />
                  <TextField
                    label="Academic Advisor"
                    name="advisor"
                    placeholder="Prof. Marcus Thorne"
                  />
                  <TextField
                    label="Registered Credits"
                    min={0}
                    name="credits"
                    placeholder="18"
                    type="number"
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
                  <SelectField
                    label="Scholarship / Funding"
                    name="scholarship"
                    options={SCHOLARSHIP_OPTIONS}
                  />
                  <TextField
                    label="Campus"
                    name="campus"
                    placeholder="Main Campus"
                  />
                </div>

                <SectionTitle
                  icon="home"
                  subtitle="Direct contact details, residence and emergency guardian."
                  title="Contact, Residence & Guardian"
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
                    label="Phone Number"
                    name="phone"
                    placeholder="+1 (555) 010-8192"
                    required
                  />
                  <TextField
                    className="sm:col-span-2"
                    label="Residential Address"
                    name="address"
                    placeholder="14 Scholars Row, Apt 2B"
                  />
                  <TextField label="City" name="city" placeholder="Veritas City" />
                  <TextField label="Country" name="country" placeholder="United States" />
                  <TextField
                    label="Guardian Full Name"
                    name="guardianName"
                    placeholder="Ngozi Okafor"
                  />
                  <TextField
                    label="Guardian Phone"
                    name="guardianPhone"
                    placeholder="+1 (555) 010-7711"
                  />
                  <TextField
                    className="sm:col-span-2"
                    label="Administrative Notes"
                    name="notes"
                    placeholder="Accommodations, transfer credits or other remarks"
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
