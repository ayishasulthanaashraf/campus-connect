// Mock data types and data for the entire app

// ── Auth ──
export type Student = {
  uid: string;
  name: string;
  regNo: string;
  email: string;
  department: string;
  semester: string;
  batch: string;
  college: string;
};

export const MOCK_STUDENT: Student = {
  uid: 'mock-uid-001',
  name: 'Ayisha Sulthana',
  regNo: 'PROV22CS045',
  email: 'ayisha@providence.edu.in',
  department: 'Computer Science & Engineering',
  semester: 'S5',
  batch: '2022-26',
  college: 'Providence College of Engineering',
};

// ── Subjects ──
export type Subject = {
  code: string;
  name: string;
  type: 'lecture' | 'lab';
  faculty: string;
  creditHours: number;
};

export const SUBJECTS: Subject[] = [
  { code: 'PCCGT501', name: 'Foundations of Cryptography', type: 'lecture', faculty: 'Dr. Rajan K.', creditHours: 3 },
  { code: 'PCCST502', name: 'Design and Analysis of Algorithms', type: 'lecture', faculty: 'Prof. Meena S.', creditHours: 4 },
  { code: 'PCCGT503', name: 'Microprocessors and Microcontrollers for IoT', type: 'lecture', faculty: 'Dr. Kumar P.', creditHours: 3 },
  { code: 'PBCGT504', name: 'Software Engineering and Design Concepts', type: 'lecture', faculty: 'Prof. Arjun R.', creditHours: 3 },
  { code: 'PECST525', name: 'Data Mining', type: 'lecture', faculty: 'Dr. Priya L.', creditHours: 3 },
  { code: 'UCHUM506', name: 'Constitution of India (MOOC)', type: 'lecture', faculty: '—', creditHours: 2 },
];

// ── Attendance ──
export type AttendanceRecord = {
  subjectCode: string;
  attended: number;
  total: number;
};

export const ATTENDANCE: AttendanceRecord[] = [
  { subjectCode: 'PCCGT501', attended: 32, total: 39 },
  { subjectCode: 'PCCST502', attended: 54, total: 62 },
  { subjectCode: 'PCCGT503', attended: 35, total: 45 },
  { subjectCode: 'PBCGT504', attended: 39, total: 49 },
  { subjectCode: 'PECST525', attended: 17, total: 24 },
  { subjectCode: 'UCHUM506', attended: 0, total: 0 },
];

// ── Timetable ──
export type Period = {
  subjectCode: string;
  startTime: string; // "HH:MM"
  endTime: string;
  room: string;
  type: 'lecture' | 'lab' | 'free';
};

export type DaySchedule = Period[];

export const TIMETABLE: Record<string, DaySchedule> = {
  Mon: [
    { subjectCode: 'PCCGT501', startTime: '09:00', endTime: '09:50', room: 'A101', type: 'lecture' },
    { subjectCode: 'PCCST502', startTime: '10:00', endTime: '10:50', room: 'A102', type: 'lecture' },
    { subjectCode: 'PCCGT503', startTime: '11:00', endTime: '11:50', room: 'A101', type: 'lecture' },
    { subjectCode: 'PBCGT504', startTime: '14:00', endTime: '14:50', room: 'A203', type: 'lecture' },
    { subjectCode: 'PECST525', startTime: '15:00', endTime: '15:50', room: 'A203', type: 'lecture' },
  ],
  Tue: [
    { subjectCode: 'PCCST502', startTime: '09:00', endTime: '09:50', room: 'A102', type: 'lecture' },
    { subjectCode: 'PCCGT503', startTime: '10:00', endTime: '10:50', room: 'Lab 1', type: 'lab' },
    { subjectCode: 'PCCGT503', startTime: '11:00', endTime: '11:50', room: 'Lab 1', type: 'lab' },
    { subjectCode: 'PCCGT501', startTime: '14:00', endTime: '14:50', room: 'A101', type: 'lecture' },
    { subjectCode: 'UCHUM506', startTime: '15:00', endTime: '15:50', room: 'A301', type: 'lecture' },
  ],
  Wed: [
    { subjectCode: 'PBCGT504', startTime: '09:00', endTime: '09:50', room: 'A203', type: 'lecture' },
    { subjectCode: 'PECST525', startTime: '10:00', endTime: '10:50', room: 'A203', type: 'lecture' },
    { subjectCode: 'PCCGT501', startTime: '11:00', endTime: '11:50', room: 'A101', type: 'lecture' },
    { subjectCode: 'PCCST502', startTime: '14:00', endTime: '14:50', room: 'Lab 2', type: 'lab' },
    { subjectCode: 'PCCST502', startTime: '15:00', endTime: '15:50', room: 'Lab 2', type: 'lab' },
  ],
  Thu: [
    { subjectCode: 'PCCGT503', startTime: '09:00', endTime: '09:50', room: 'A101', type: 'lecture' },
    { subjectCode: 'PBCGT504', startTime: '10:00', endTime: '10:50', room: 'A203', type: 'lecture' },
    { subjectCode: 'PECST525', startTime: '11:00', endTime: '11:50', room: 'A203', type: 'lecture' },
    { subjectCode: 'PCCST502', startTime: '14:00', endTime: '14:50', room: 'A102', type: 'lecture' },
  ],
  Fri: [
    { subjectCode: 'PCCGT501', startTime: '09:00', endTime: '09:50', room: 'A101', type: 'lecture' },
    { subjectCode: 'UCHUM506', startTime: '10:00', endTime: '10:50', room: 'A301', type: 'lecture' },
    { subjectCode: 'PBCGT504', startTime: '11:00', endTime: '12:50', room: 'Lab 3', type: 'lab' },
    { subjectCode: 'PECST525', startTime: '14:00', endTime: '14:50', room: 'A203', type: 'lecture' },
  ],
  Sat: [],
};

// ── Calendar events ──
export type CalendarEvent = {
  date: string; // YYYY-MM-DD
  title: string;
  type: 'exam' | 'holiday' | 'event' | 'deadline';
};

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { date: '2026-10-28', title: 'Internal Exam 1 – Cryptography', type: 'exam' },
  { date: '2026-10-29', title: 'Internal Exam 1 – DAA', type: 'exam' },
  { date: '2026-10-30', title: 'Internal Exam 1 – Microprocessors', type: 'exam' },
  { date: '2026-11-01', title: 'Diwali Holiday', type: 'holiday' },
  { date: '2026-11-05', title: 'Assignment Submission – SE', type: 'deadline' },
  { date: '2026-11-10', title: 'Tech Fest', type: 'event' },
  { date: '2026-11-15', title: 'Internal Exam 2 begins', type: 'exam' },
  { date: '2026-11-25', title: 'Last date – Lab record submission', type: 'deadline' },
  { date: '2026-12-01', title: 'End Semester Exam begins', type: 'exam' },
];

// ── Marks ──
export type MarkEntry = {
  component: string;
  scored: number;
  max: number;
};

export type SubjectMarks = {
  subjectCode: string;
  marks: MarkEntry[];
};

export const MARKS: SubjectMarks[] = [
  { subjectCode: 'PCCGT501', marks: [
    { component: 'Series Test 1', scored: 18, max: 25 },
    { component: 'Series Test 2', scored: 20, max: 25 },
    { component: 'Assignment 1', scored: 9, max: 10 },
    { component: 'Assignment 2', scored: 8, max: 10 },
  ]},
  { subjectCode: 'PCCST502', marks: [
    { component: 'Series Test 1', scored: 22, max: 25 },
    { component: 'Series Test 2', scored: 21, max: 25 },
    { component: 'Assignment 1', scored: 10, max: 10 },
    { component: 'Assignment 2', scored: 9, max: 10 },
  ]},
  { subjectCode: 'PCCGT503', marks: [
    { component: 'Series Test 1', scored: 15, max: 25 },
    { component: 'Series Test 2', scored: 17, max: 25 },
    { component: 'Lab Record', scored: 20, max: 25 },
  ]},
  { subjectCode: 'PBCGT504', marks: [
    { component: 'Series Test 1', scored: 20, max: 25 },
    { component: 'Assignment 1', scored: 8, max: 10 },
  ]},
  { subjectCode: 'PECST525', marks: [
    { component: 'Series Test 1', scored: 14, max: 25 },
    { component: 'Series Test 2', scored: 16, max: 25 },
    { component: 'Assignment 1', scored: 7, max: 10 },
  ]},
];
