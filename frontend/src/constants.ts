
import { StudentData, RiskLevel, AttendanceStatus, Subject } from './types';

export const MENTOR_CREDENTIALS: Record<Subject, { id: string; pass: string }> = {
  'Mathematics': { id: 'math_mentor', pass: 'math123' },
  'Physics': { id: 'phys_mentor', pass: 'phys123' },
  'Literature': { id: 'lit_mentor', pass: 'lit123' }
};

const generateInitialData = (): StudentData[] => {
  const data: StudentData[] = [];
  const subjects: Subject[] = ['Mathematics', 'Physics', 'Literature'];
  const today = new Date();
  
  subjects.forEach(subject => {
    for (let id = 1; id <= 25; id++) {
      const recordsCount = 4 + Math.floor(Math.random() * 2);
      for (let i = 0; i < recordsCount; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (recordsCount - i));
        const dateStr = date.toISOString().split('T')[0];
        
        const sleep = 5 + Math.random() * 4;
        const status: AttendanceStatus = Math.random() > 0.85 ? 'Absent' : (Math.random() > 0.7 ? 'Late' : 'Present');
        
        // Calculate derived metrics based on Register No (id), status, and sleep
        const statusPenalty = status === 'Absent' ? 3 : (status === 'Late' ? 1 : 0);
        const sleepScore = (sleep / 9) * 10;
        
        let mood = Math.max(1, Math.min(10, sleepScore - statusPenalty + (id % 3)));
        let stress = Math.max(0, Math.min(5, (10 - sleepScore) * 0.4 + (statusPenalty * 0.5)));
        
        let risk: RiskLevel = 'Low';
        if (stress > 3.5 || mood < 4) risk = 'High';
        else if (stress > 2.2 || mood < 6) risk = 'Medium';

        data.push({
          studentId: id,
          subject,
          date: dateStr,
          classTime: "09:00-15:00",
          attendanceStatus: status,
          stressLevel: parseFloat(stress.toFixed(2)),
          sleepHours: parseFloat(sleep.toFixed(1)),
          moodScore: Math.round(mood),
          riskLevel: risk
        });
      }
    }
  });
  return data;
};

export const INITIAL_RAW_DATA: StudentData[] = generateInitialData();
