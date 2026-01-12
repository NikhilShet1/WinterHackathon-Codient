
import React, { useMemo } from 'react';
import { StudentData } from '../types';
import StudentTrendChart from './StudentTrendChart';

interface Props {
  studentId: number;
  allData: StudentData[];
}

const StudentDashboard: React.FC<Props> = ({ studentId, allData }) => {
  const studentHistory = useMemo(() => {
    return allData.filter(d => d.studentId === studentId);
  }, [studentId, allData]);

  const latest = useMemo(() => {
    return studentHistory.length > 0 
      ? studentHistory[studentHistory.length - 1] 
      : null;
  }, [studentHistory]);

  if (!latest) return <div className="p-10 text-center text-slate-400">No profile data found. Please contact your mentor.</div>;

  const getMetricGrade = (val: number, isHigherBetter: boolean) => {
    if (isHigherBetter) {
      if (val >= 8) return 'text-emerald-500';
      if (val >= 5) return 'text-amber-500';
      return 'text-red-500';
    } else {
      if (val <= 2) return 'text-emerald-500';
      if (val <= 3.5) return 'text-amber-500';
      return 'text-red-500';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="bg-slate-900 -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-8 py-16 text-white mb-8 rounded-b-[64px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex-1">
            <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
                <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20">
                    <i className="fa-solid fa-graduation-cap text-indigo-400 text-3xl"></i>
                </div>
                <h1 className="text-5xl font-black tracking-tighter">Student Profile #{studentId}</h1>
            </div>
            <p className="text-slate-400 text-lg font-medium">Monitoring your academic wellbeing and behavioral signals.</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 text-center min-w-[150px] shadow-2xl">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2">Current Mood</p>
                <p className="text-5xl font-black text-indigo-400">{latest.moodScore}<span className="text-xl opacity-30">/10</span></p>
             </div>
             <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 text-center min-w-[150px] shadow-2xl">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2">Sleep Avg</p>
                <p className="text-5xl font-black text-emerald-400">{latest.sleepHours}<span className="text-xl opacity-30">h</span></p>
             </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm ring-1 ring-slate-100">
                <h3 className="font-black text-slate-800 mb-8 flex items-center gap-3 text-sm uppercase tracking-widest">
                    <i className="fa-solid fa-chart-simple text-indigo-500"></i>
                    Daily Signal Check
                </h3>
                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-black text-slate-400 uppercase">Sleep Quality</span>
                            <span className={`text-sm font-black ${getMetricGrade(latest.sleepHours, true)}`}>{latest.sleepHours} Hours</span>
                        </div>
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: `${(latest.sleepHours / 10) * 100}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-black text-slate-400 uppercase">Stress Index</span>
                            <span className={`text-sm font-black ${getMetricGrade(latest.stressLevel, false)}`}>{latest.stressLevel.toFixed(1)} / 5</span>
                        </div>
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(latest.stressLevel / 5) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</span>
                        <span className={`text-xs font-black px-4 py-1.5 rounded-xl uppercase tracking-widest ${latest.attendanceStatus === 'Present' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {latest.attendanceStatus}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-indigo-900 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group border border-indigo-800">
                <div className="absolute -right-4 -bottom-4 text-indigo-800 text-8xl opacity-20 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-brain"></i>
                </div>
                <h3 className="font-black text-indigo-200 mb-4 flex items-center gap-2 relative z-10 text-xs uppercase tracking-widest">
                    <i className="fa-solid fa-shield-heart"></i>
                    Wellbeing Guard
                </h3>
                <p className="text-indigo-50 text-base leading-relaxed font-bold relative z-10">
                    Your current patterns indicate a <span className="text-emerald-400 underline decoration-2 underline-offset-4">{latest.riskLevel.toLowerCase()} risk</span> level. 
                    {latest.riskLevel === 'High' ? ' We recommend scheduling a coffee chat with your mentor to adjust your current workload.' : ' You are maintaining a healthy balance between sleep and attendance!'}
                </p>
            </div>
        </div>

        <div className="md:col-span-2 bg-white p-10 rounded-[2.5rem] border shadow-sm ring-1 ring-slate-100">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 tracking-tighter">
                    <i className="fa-solid fa-wave-square text-indigo-500"></i>
                    Behavioral Visualization
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 px-3 py-1.5 rounded-lg border">Register #{studentId}</span>
            </div>
            <StudentTrendChart data={studentHistory} />
            <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 shrink-0">
                    <i className="fa-solid fa-lock text-slate-400"></i>
                </div>
                <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Privacy Protocol</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Data shown is derived from daily logs provided by subject mentors. Your "Mood" and "Stress" scores are calculated based on your attendance regularity and sleep hygiene.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
