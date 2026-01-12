
export type AttendanceStatus = 'Present' | 'Late' | 'Absent';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type Subject = 'Mathematics' | 'Physics' | 'Literature';

export interface StudentData {
  studentId: number;
  subject: Subject;
  date: string;
  classTime: string;
  attendanceStatus: AttendanceStatus;
  stressLevel: number;
  sleepHours: number;
  moodScore: number;
  riskLevel: RiskLevel;
}

export interface User {
  id: string;
  password: string;
  role: UserRole;
  subject?: Subject; // Only for mentors
  studentId?: number; // Only for students
  dob?: string; // Date of Birth for students
}

export type UserRole = 'mentor' | 'student';
