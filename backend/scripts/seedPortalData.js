const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

dotenv.config();

const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const User = require("../models/User");

const LECTURE = {
  badge: "Lecture",
  badgeClass: "bg-primary text-on-primary",
  blockClass: "bg-primary-fixed text-on-primary-fixed",
  codeClass: "text-primary",
  detailClass: "text-on-primary-fixed-variant",
};

const NEUTRAL_LECTURE = {
  badge: "Lecture",
  badgeClass: "bg-surface-tint text-on-tertiary",
  blockClass: "bg-surface-container-highest text-on-surface",
  codeClass: "text-primary",
  detailClass: "text-on-surface-variant",
};

const LAB = {
  badge: "Lab",
  badgeClass: "bg-tertiary-container text-on-tertiary",
  blockClass: "bg-tertiary-fixed text-on-tertiary-fixed",
  codeClass: "text-tertiary",
  detailClass: "text-on-tertiary-fixed-variant",
};

const ELECTIVE = {
  badge: "Elective",
  badgeClass: "bg-secondary text-on-secondary",
  blockClass: "bg-secondary-fixed text-on-secondary-fixed",
  codeClass: "text-secondary",
  detailClass: "text-on-secondary-fixed-variant",
};

const SEMINAR = {
  badge: "Student Club",
  badgeClass: "bg-surface-container-highest text-on-surface",
  blockClass: "bg-surface-container text-on-surface",
  codeClass: "text-outline",
  detailClass: "text-on-surface-variant",
};

const CLASS_BLOCK_PROPS = [
  {
    ...LECTURE,
    code: "CS-301",
    title: "Algorithms & Complexity",
    room: "Turing Rm 402",
    instructor: "Prof. Marcus Thorne",
    day: "Sun",
    startTime: "08:30",
    endTime: "10:00",
  },
  {
    ...LECTURE,
    code: "CS-301",
    title: "Algorithms & Complexity",
    room: "Turing Rm 402",
    instructor: "Prof. Marcus Thorne",
    day: "Tue",
    startTime: "08:30",
    endTime: "10:00",
  },
  {
    ...LAB,
    badge: "Lab Section",
    code: "CS-301L",
    title: "Algorithm Optimization Lab",
    room: "Comp Center Lab 3",
    instructor: "Fellow D. Zhao",
    day: "Thu",
    startTime: "08:30",
    endTime: "10:00",
  },
  {
    ...NEUTRAL_LECTURE,
    code: "MATH-240",
    title: "Linear Algebra & Matrices",
    room: "Archimedes Aud B",
    instructor: "Dr. Julian Croft",
    day: "Sun",
    startTime: "10:15",
    endTime: "11:45",
  },
  {
    ...LECTURE,
    code: "CS-340",
    title: "Distributed Databases",
    room: "Turing Rm 204",
    instructor: "Prof. Rachel Kim",
    day: "Mon",
    startTime: "10:15",
    endTime: "11:45",
  },
  {
    ...NEUTRAL_LECTURE,
    code: "MATH-240",
    title: "Linear Algebra & Matrices",
    room: "Archimedes Aud B",
    instructor: "Dr. Julian Croft",
    day: "Tue",
    startTime: "10:15",
    endTime: "11:45",
  },
  {
    ...LECTURE,
    code: "CS-340",
    title: "Distributed Databases",
    room: "Turing Rm 204",
    instructor: "Prof. Rachel Kim",
    day: "Wed",
    startTime: "10:15",
    endTime: "11:45",
  },
  {
    ...ELECTIVE,
    badge: "Tutorial",
    code: "MATH-240T",
    title: "Linear Algebra Problem Set",
    room: "Newton Hall 102",
    instructor: "TA Sarah Jenkins",
    day: "Thu",
    startTime: "10:15",
    endTime: "11:45",
  },
  {
    ...NEUTRAL_LECTURE,
    badgeClass: "bg-primary-container text-on-primary",
    code: "PHYS-201",
    title: "Quantum Mechanics I",
    room: "Faraday Hall 301",
    instructor: "Dr. Henrik Lindqvist",
    day: "Sun",
    startTime: "14:00",
    endTime: "15:30",
  },
  {
    ...ELECTIVE,
    code: "ENG-210",
    title: "Technical Research Writing",
    room: "Humanities B-12",
    instructor: "Prof. Clara Sterling",
    day: "Mon",
    startTime: "14:00",
    endTime: "15:30",
  },
  {
    ...NEUTRAL_LECTURE,
    badgeClass: "bg-primary-container text-on-primary",
    code: "PHYS-201",
    title: "Quantum Mechanics I",
    room: "Faraday Hall 301",
    instructor: "Dr. Henrik Lindqvist",
    day: "Tue",
    startTime: "14:00",
    endTime: "15:30",
  },
  {
    ...ELECTIVE,
    badge: "Workshop",
    code: "ENG-210",
    title: "Peer Review Colloquium",
    room: "Humanities B-12",
    instructor: "Prof. Clara Sterling",
    day: "Wed",
    startTime: "14:00",
    endTime: "15:30",
  },
  {
    ...LAB,
    code: "CS-340L",
    title: "PostgreSQL & Sharding Lab",
    room: "Comp Center Lab 1",
    instructor: "Fellow K. Patel",
    day: "Mon",
    startTime: "15:45",
    endTime: "17:15",
  },
  {
    ...LAB,
    code: "PHYS-201L",
    title: "Spectroscopy Lab",
    room: "Faraday Wing 109",
    instructor: "Dr. Henrik Lindqvist",
    day: "Wed",
    startTime: "15:45",
    endTime: "17:15",
  },
  {
    ...SEMINAR,
    code: "SEMINAR",
    title: "AI Alignment Seminar",
    room: "Student Union 204",
    instructor: "Alexander Wright (Lead)",
    day: "Thu",
    startTime: "15:45",
    endTime: "17:15",
  },
];

const DEMO_STUDENTS = [
  {
    name: "Marcus Sterling",
    studentId: "VU-883109",
    email: "marcus.sterling@veritas.edu",
    major: "B.S. Comp. Science",
    gpa: 3.91,
    creditsCompleted: 75,
    campusCardBalance: 210.75,
    roster: {
      year: 3,
      track: "Algorithms Track",
      midtermScore: 94.5,
      labsScore: 96,
      letterGrade: "A",
      attendanceSummary: "96% Overall",
      attendanceStatus: "present",
      dossierStatus: "verified",
      dossierLabel: "Milestone 2 Verified",
      academicAlert: false,
      examBonus: 2,
    },
  },
  {
    name: "Elena Rostova",
    studentId: "VU-884210",
    email: "elena.rostova@veritas.edu",
    major: "B.S. Software Eng.",
    gpa: 3.75,
    creditsCompleted: 45,
    campusCardBalance: 152.4,
    roster: {
      year: 2,
      track: "Systems Elective",
      midtermScore: 89,
      labsScore: 91.5,
      letterGrade: "A-",
      attendanceSummary: "100% Perfect",
      attendanceStatus: "present",
      dossierStatus: "submitted",
      dossierLabel: "Spec Submitted",
      academicAlert: false,
      examBonus: 1,
    },
  },
  {
    name: "Devaughn Miller",
    studentId: "VU-879942",
    email: "devaughn.miller@veritas.edu",
    major: "B.S. Comp. Science",
    gpa: 2.18,
    creditsCompleted: 75,
    campusCardBalance: 38.2,
    roster: {
      year: 3,
      track: "Core Requirement",
      midtermScore: 64,
      labsScore: 71,
      letterGrade: "C-",
      attendanceSummary: "78% Low (3 Missed)",
      attendanceStatus: "absent",
      dossierStatus: "incomplete",
      dossierLabel: "Incomplete Draft",
      academicAlert: true,
      examBonus: 0,
    },
  },
  {
    name: "Zhiyuan Chen",
    studentId: "VU-881029",
    email: "zhiyuan.chen@veritas.edu",
    major: "B.S. Math & CS",
    gpa: 4,
    creditsCompleted: 105,
    campusCardBalance: 320,
    roster: {
      year: 4,
      track: "Honors Scholar",
      midtermScore: 100,
      labsScore: 98,
      letterGrade: "A+",
      attendanceSummary: "97% Regular",
      attendanceStatus: "present",
      dossierStatus: "honors",
      dossierLabel: "Honors Capstone",
      academicAlert: false,
      examBonus: 1,
    },
  },
  {
    name: "Maya Lin-Torres",
    studentId: "VU-890123",
    email: "maya.lin-torres@veritas.edu",
    major: "B.S. Comp. Science",
    gpa: 3.48,
    creditsCompleted: 75,
    campusCardBalance: 96.5,
    roster: {
      year: 3,
      track: "AI Minor",
      midtermScore: 84.5,
      labsScore: 89,
      letterGrade: "B+",
      attendanceSummary: "92% Regular",
      attendanceStatus: "present",
      dossierStatus: "in-review",
      dossierLabel: "In Review",
      academicAlert: false,
      examBonus: 0,
    },
  },
];

const run = async () => {
  const mongoUri = process.env.MONGO_URL || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URL or MONGO_URI must be configured");
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });

  const plainPassword = process.env.SEED_STUDENT_PASSWORD;
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  for (const entry of DEMO_STUDENTS) {
    let user = await User.findOne({ email: entry.email });

    if (!user) {
      user = await User.create({
        email: entry.email,
        password: hashedPassword,
        role: "student",
      });
    }

    const existing = await Student.findOne({ studentId: entry.studentId });
    const needsTimetable =
      !existing ||
      !existing.classBlockProps ||
      existing.classBlockProps.length === 0;

    if (!existing) {
      await Student.create({
        user: user._id,
        name: entry.name,
        studentId: entry.studentId,
        major: entry.major,
        gpa: entry.gpa,
        creditsCompleted: entry.creditsCompleted,
        campusCardBalance: entry.campusCardBalance,
        roster: entry.roster,
        classBlockProps: CLASS_BLOCK_PROPS,
      });
      continue;
    }

    await Student.updateOne(
      { _id: existing._id },
      {
        $set: {
          name: entry.name,
          major: entry.major,
          gpa: entry.gpa,
          creditsCompleted: entry.creditsCompleted,
          campusCardBalance: entry.campusCardBalance,
          roster: entry.roster,
          ...(needsTimetable ? { classBlockProps: CLASS_BLOCK_PROPS } : {}),
        },
      },
    );
  }

  const studentsMissingTimetable = await Student.find({
    $or: [
      { classBlockProps: { $exists: false } },
      { classBlockProps: null },
      { classBlockProps: { $size: 0 } },
    ],
  });

  for (const student of studentsMissingTimetable) {
    student.classBlockProps = CLASS_BLOCK_PROPS;
    await student.save();
  }

  const allStudentIds = (await Student.find({}, "_id")).map(
    (student) => student._id,
  );
  const teachers = await Teacher.find({});

  for (const teacher of teachers) {
    if (!teacher.students || teacher.students.length === 0) {
      teacher.students = allStudentIds;
      await teacher.save();
    }
  }

  console.log(`Demo students ready: ${DEMO_STUDENTS.length}`);
  console.log(
    `Timetables applied to: ${studentsMissingTimetable.length + DEMO_STUDENTS.length} students`,
  );
  console.log(`Teachers linked to the student roster: ${teachers.length}`);
  console.log(`Demo student password: ${plainPassword}`);

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Portal seed failed:", error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
