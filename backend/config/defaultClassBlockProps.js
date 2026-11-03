/**
 * Default weekly timetable assigned to every student.
 *
 * Used when a new student is created from the director intake form, and by the
 * portal seed script, so every student portal shows the same schedule.
 */

const LECTURE = {
  badge: 'Lecture',
  badgeClass: 'bg-primary text-on-primary',
  blockClass: 'bg-primary-fixed text-on-primary-fixed',
  codeClass: 'text-primary',
  detailClass: 'text-on-primary-fixed-variant',
};

const NEUTRAL_LECTURE = {
  badge: 'Lecture',
  badgeClass: 'bg-surface-tint text-on-tertiary',
  blockClass: 'bg-surface-container-highest text-on-surface',
  codeClass: 'text-primary',
  detailClass: 'text-on-surface-variant',
};

const LAB = {
  badge: 'Lab',
  badgeClass: 'bg-tertiary-container text-on-tertiary',
  blockClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
  codeClass: 'text-tertiary',
  detailClass: 'text-on-tertiary-fixed-variant',
};

const ELECTIVE = {
  badge: 'Elective',
  badgeClass: 'bg-secondary text-on-secondary',
  blockClass: 'bg-secondary-fixed text-on-secondary-fixed',
  codeClass: 'text-secondary',
  detailClass: 'text-on-secondary-fixed-variant',
};

const SEMINAR = {
  badge: 'Student Club',
  badgeClass: 'bg-surface-container-highest text-on-surface',
  blockClass: 'bg-surface-container text-on-surface',
  codeClass: 'text-outline',
  detailClass: 'text-on-surface-variant',
};

const DEFAULT_CLASS_BLOCK_PROPS = [
  {
    ...LECTURE,
    code: 'CS-301',
    title: 'Algorithms & Complexity',
    room: 'Turing Rm 402',
    instructor: 'Prof. Marcus Thorne',
    day: 'Sun',
    startTime: '08:30',
    endTime: '10:00',
  },
  {
    ...LECTURE,
    code: 'CS-301',
    title: 'Algorithms & Complexity',
    room: 'Turing Rm 402',
    instructor: 'Prof. Marcus Thorne',
    day: 'Tue',
    startTime: '08:30',
    endTime: '10:00',
  },
  {
    ...LAB,
    badge: 'Lab Section',
    code: 'CS-301L',
    title: 'Algorithm Optimization Lab',
    room: 'Comp Center Lab 3',
    instructor: 'Fellow D. Zhao',
    day: 'Thu',
    startTime: '08:30',
    endTime: '10:00',
  },
  {
    ...NEUTRAL_LECTURE,
    code: 'MATH-240',
    title: 'Linear Algebra & Matrices',
    room: 'Archimedes Aud B',
    instructor: 'Dr. Julian Croft',
    day: 'Sun',
    startTime: '10:15',
    endTime: '11:45',
  },
  {
    ...LECTURE,
    code: 'CS-340',
    title: 'Distributed Databases',
    room: 'Turing Rm 204',
    instructor: 'Prof. Rachel Kim',
    day: 'Mon',
    startTime: '10:15',
    endTime: '11:45',
  },
  {
    ...NEUTRAL_LECTURE,
    code: 'MATH-240',
    title: 'Linear Algebra & Matrices',
    room: 'Archimedes Aud B',
    instructor: 'Dr. Julian Croft',
    day: 'Tue',
    startTime: '10:15',
    endTime: '11:45',
  },
  {
    ...LECTURE,
    code: 'CS-340',
    title: 'Distributed Databases',
    room: 'Turing Rm 204',
    instructor: 'Prof. Rachel Kim',
    day: 'Wed',
    startTime: '10:15',
    endTime: '11:45',
  },
  {
    ...ELECTIVE,
    badge: 'Tutorial',
    code: 'MATH-240T',
    title: 'Linear Algebra Problem Set',
    room: 'Newton Hall 102',
    instructor: 'TA Sarah Jenkins',
    day: 'Thu',
    startTime: '10:15',
    endTime: '11:45',
  },
  {
    ...NEUTRAL_LECTURE,
    badgeClass: 'bg-primary-container text-on-primary',
    code: 'PHYS-201',
    title: 'Quantum Mechanics I',
    room: 'Faraday Hall 301',
    instructor: 'Dr. Henrik Lindqvist',
    day: 'Sun',
    startTime: '14:00',
    endTime: '15:30',
  },
  {
    ...ELECTIVE,
    code: 'ENG-210',
    title: 'Technical Research Writing',
    room: 'Humanities B-12',
    instructor: 'Prof. Clara Sterling',
    day: 'Mon',
    startTime: '14:00',
    endTime: '15:30',
  },
  {
    ...NEUTRAL_LECTURE,
    badgeClass: 'bg-primary-container text-on-primary',
    code: 'PHYS-201',
    title: 'Quantum Mechanics I',
    room: 'Faraday Hall 301',
    instructor: 'Dr. Henrik Lindqvist',
    day: 'Tue',
    startTime: '14:00',
    endTime: '15:30',
  },
  {
    ...ELECTIVE,
    badge: 'Workshop',
    code: 'ENG-210',
    title: 'Peer Review Colloquium',
    room: 'Humanities B-12',
    instructor: 'Prof. Clara Sterling',
    day: 'Wed',
    startTime: '14:00',
    endTime: '15:30',
  },
  {
    ...LAB,
    code: 'CS-340L',
    title: 'PostgreSQL & Sharding Lab',
    room: 'Comp Center Lab 1',
    instructor: 'Fellow K. Patel',
    day: 'Mon',
    startTime: '15:45',
    endTime: '17:15',
  },
  {
    ...LAB,
    code: 'PHYS-201L',
    title: 'Spectroscopy Lab',
    room: 'Faraday Wing 109',
    instructor: 'Dr. Henrik Lindqvist',
    day: 'Wed',
    startTime: '15:45',
    endTime: '17:15',
  },
  {
    ...SEMINAR,
    code: 'SEMINAR',
    title: 'AI Alignment Seminar',
    room: 'Student Union 204',
    instructor: 'Alexander Wright (Lead)',
    day: 'Thu',
    startTime: '15:45',
    endTime: '17:15',
  },
];

module.exports = { DEFAULT_CLASS_BLOCK_PROPS };
