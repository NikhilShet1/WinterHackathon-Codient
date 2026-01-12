
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { StudentData, RiskLevel, AttendanceStatus, Subject } from '../types';
import StudentTrendChart from './StudentTrendChart';
import AiAnalysisPanel from './AiAnalysisPanel';
import * as XLSX from 'xlsx';

interface Props {
  allData: StudentData[];
  onAddRecord: (record: StudentData) => void;
  onAddBatchRecords: (records: StudentData[]) => void;
  subject: Subject;
}

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case 'High': return 'bg-rose-50 text-rose-600 border-rose-100';
    case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'Low': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    default: return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

const MentorDashboard: React.FC<Props> = ({ allData, onAddRecord, onAddBatchRecords, subject }) => {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    studentId: 1,
    sleep: 7.5,
    status: 'Present' as AttendanceStatus
  });

  // Sync formData with selectedStudent
  useEffect(() => {
    if (selectedStudent !== null) {
      setFormData(prev => ({ ...prev, studentId: selectedStudent }));
    }
  }, [selectedStudent]);

  const studentGroups = useMemo(() => {
    const groups: Record<number, StudentData[]> = {};
    allData.forEach(record => {
      if (!groups[record.studentId]) groups[record.studentId] = [];
      groups[record.studentId].push(record);
    });
    return groups;
  }, [allData]);

  const studentsList = useMemo(() => {
    return Object.keys(studentGroups).map(id => {
      const history = studentGroups[parseInt(id)];
      const lastRecord = history[history.length - 1];
      return {
        id: parseInt(id),
        lastStatus: lastRecord.attendanceStatus,
        currentRisk: lastRecord.riskLevel,
        avgMood: history.reduce((acc, curr) => acc + curr.moodScore, 0) / history.length
      };
    }).sort((a, b) => {
        const priority = { 'High': 3, 'Medium': 2, 'Low': 1 };
        if (priority[b.currentRisk] !== priority[a.currentRisk]) {
            return (priority[b.currentRisk] || 0) - (priority[a.currentRisk] || 0);
        }
        return a.id - b.id;
    });
  }, [studentGroups]);

  const calculateMetrics = (id: number, status: AttendanceStatus, sleep: number) => {
    const registerNoFactor = (id % 10) * 0.1;
    const statusPenalty = status === 'Absent' ? 3.5 : (status === 'Late' ? 1.5 : 0);
    
    let stress = ((9 - sleep) * 0.4) + (statusPenalty * 0.4) + registerNoFactor;
    stress = Math.max(0, Math.min(5, stress));

    let mood = (sleep * 0.8) - (statusPenalty * 1.2) + 3 + registerNoFactor;
    mood = Math.max(1, Math.min(10, mood));

    let risk: RiskLevel = 'Low';
    if (stress > 3.5 || mood < 4) risk = 'High';
    else if (stress > 2.5 || mood < 6) risk = 'Medium';

    return { 
      stress: parseFloat(stress.toFixed(2)), 
      mood: Math.round(mood), 
      risk 
    };
  };

  const handleManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const metrics = calculateMetrics(formData.studentId, formData.status, formData.sleep);
    onAddRecord({
      studentId: formData.studentId, subject, date: new Date().toISOString().split('T')[0],
      classTime: "Manual", attendanceStatus: formData.status, stressLevel: metrics.stress,
      sleepHours: formData.sleep, moodScore: metrics.mood,
      riskLevel: metrics.risk
    });
    setStatusMessage(`Log recorded for Student #${formData.studentId}`);
    setShowEntryForm(false);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleXlsxImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bstr = event.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        const today = new Date().toISOString().split('T')[0];
        const batchRecords: StudentData[] = [];

        data.forEach((row) => {
          // Normalize header keys
          const normalizedRow: any = {};
          Object.keys(row).forEach(key => {
            normalizedRow[key.toLowerCase().replace(/[\s_]/g, '')] = row[key];
          });

          const id = parseInt(normalizedRow.registerno || normalizedRow.regno || normalizedRow.id || normalizedRow.studentid);
          const status = (normalizedRow.status || normalizedRow.attendance || 'Present') as AttendanceStatus;
          const sleep = parseFloat(normalizedRow.sleep || normalizedRow.sleephours || 7.5);

          if (!isNaN(id)) {
            const metrics = calculateMetrics(id, status, sleep);
            batchRecords.push({
              studentId: id,
              subject,
              date: today,
              classTime: "Daily Batch",
              attendanceStatus: status,
              stressLevel: metrics.stress,
              sleepHours: sleep,
              moodScore: metrics.mood,
              riskLevel: metrics.risk
            });
          }
        });

        if (batchRecords.length > 0) {
          onAddBatchRecords(batchRecords);
          setStatusMessage(`Successfully processed ${batchRecords.length} student records.`);
        } else {
          setStatusMessage("No valid records found in file. Check headers.");
        }
      } catch (err) {
        setStatusMessage("Error parsing Excel file. Check format.");
      } finally {
        setIsProcessing(false);
        setTimeout(() => setStatusMessage(null), 4000);
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getSubjectIcon = () => {
    switch(subject) {
        case 'Mathematics': return 'fa-calculator';
        case 'Physics': return 'fa-atom';
        case 'Literature': return 'fa-book-open';
        default: return 'fa-chalkboard';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 text-3xl">
                <i className={`fa-solid ${getSubjectIcon()}`}></i>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">{subject} Central</h2>
              <p className="text-slate-400 font-medium tracking-tight">AI Early Warning • Stress & Mood Analytics</p>
            </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-6 py-4 rounded-2xl border shadow-sm text-center min-w-[120px] border-l-4 border-l-red-500 ring-1 ring-slate-100">
            <span className="text-2xl font-black text-red-500">{studentsList.filter(s => s.currentRisk === 'High').length}</span>
            <p className="text-[9px] text-slate-400 uppercase font-black mt-1 tracking-widest">High Risk</p>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl border shadow-sm text-center min-w-[120px] border-l-4 border-l-amber-500 ring-1 ring-slate-100">
            <span className="text-2xl font-black text-amber-500">{studentsList.filter(s => s.currentRisk === 'Medium').length}</span>
            <p className="text-[9px] text-slate-400 uppercase font-black mt-1 tracking-widest">Moderate</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border shadow-sm overflow-hidden ring-1 ring-slate-100 h-[750px] flex flex-col">
          <div className="p-5 border-b bg-slate-50/50 flex flex-col gap-3 shrink-0">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Cohort Monitor</h3>
              <div className="flex items-center gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-100/50"
                    disabled={isProcessing}
                  >
                    <i className={`fa-solid ${isProcessing ? 'fa-spinner animate-spin' : 'fa-file-excel'}`}></i>
                    XLSX Import
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleXlsxImport} accept=".xlsx, .xls, .csv" className="hidden" />
              </div>
            </div>
            {statusMessage && (
              <div className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-3 py-2 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <i className="fa-solid fa-circle-info mr-1"></i> {statusMessage}
              </div>
            )}
          </div>
          <div className="divide-y divide-slate-50 overflow-y-auto custom-scrollbar flex-1">
            {studentsList.length > 0 ? studentsList.map(student => (
              <div key={student.id} onClick={() => setSelectedStudent(student.id)} className={`p-4 cursor-pointer transition-all flex items-center justify-between group relative ${selectedStudent === student.id ? 'bg-indigo-50/80' : 'hover:bg-slate-50/50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm transition-transform ${selectedStudent === student.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>{student.id}</div>
                  <div>
                    <p className={`font-bold text-sm ${selectedStudent === student.id ? 'text-indigo-900' : 'text-slate-800'}`}>Reg #{student.id}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase mt-0.5 tracking-tighter">Avg Mood: {student.avgMood.toFixed(1)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase ${getRiskColor(student.currentRisk)}`}>{student.currentRisk}</span>
                </div>
                {selectedStudent === student.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>}
              </div>
            )) : (
              <div className="p-8 text-center text-slate-400 text-xs italic">
                No students enrolled yet.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedStudent ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-white p-8 rounded-3xl border shadow-sm ring-1 ring-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <span className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xs">#{selectedStudent}</span>
                        Risk Profiler
                    </h3>
                    <p className="text-slate-400 text-sm font-medium mt-1">Metrics derived from Register No, Attendance Status, and Sleep Duration.</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => setShowEntryForm(!showEntryForm)} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${showEntryForm ? 'bg-slate-800 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>
                      {showEntryForm ? 'Cancel' : 'Add Record'}
                    </button>
                  </div>
                </div>

                {showEntryForm && (
                  <form onSubmit={handleManualEntry} className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Register No</label>
                        <input type="number" min="1" value={formData.studentId} readOnly className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:outline-none cursor-not-allowed text-slate-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as AttendanceStatus})} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none">
                          <option value="Present">Present</option>
                          <option value="Late">Late</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sleep (Hrs)</label>
                        <input type="number" step="0.5" value={formData.sleep} onChange={e => setFormData({...formData, sleep: parseFloat(e.target.value)})} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between items-center pt-6 border-t border-slate-200">
                        <p className="text-[10px] text-slate-400 font-bold italic">Note: Stress and Mood are calculated using Register No, Status and Sleep.</p>
                        <button type="submit" className="bg-indigo-600 text-white font-black uppercase tracking-widest px-8 py-3 rounded-xl text-[10px] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                            Save Log
                        </button>
                    </div>
                  </form>
                )}
                <StudentTrendChart data={studentGroups[selectedStudent]} />
              </div>
              <AiAnalysisPanel history={studentGroups[selectedStudent]} studentId={selectedStudent} />
            </div>
          ) : (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white rounded-[40px] border-2 border-dashed border-slate-200 text-slate-400 p-12 group transition-all">
              <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 ring-1 ring-slate-100 group-hover:scale-110 transition-transform duration-500">
                <i className={`fa-solid ${getSubjectIcon()} text-4xl opacity-10 text-indigo-600`}></i>
              </div>
              <h4 className="text-xl font-black text-slate-600 mb-2 tracking-tight">{subject} Department</h4>
              <p className="text-center max-w-sm leading-relaxed text-sm font-medium">Batch update your entire cohort once a day using Excel. Metrics are automatically derived for instant risk mapping.</p>
              
              <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100 max-w-md w-full">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-file-excel"></i> XLSX Template for Batch Update
                </h5>
                <div className="overflow-x-auto">
                    <table className="w-full text-[10px] border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-500 uppercase tracking-tighter">
                                <th className="p-2 border border-slate-200 font-black">register_no</th>
                                <th className="p-2 border border-slate-200 font-black">status</th>
                                <th className="p-2 border border-slate-200 font-black">sleep</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2 border border-slate-200 font-bold text-center">101</td>
                                <td className="p-2 border border-slate-200 text-center">Present</td>
                                <td className="p-2 border border-slate-200 text-center">7.5</td>
                            </tr>
                            <tr className="bg-slate-50">
                                <td className="p-2 border border-slate-200 font-bold text-center">102</td>
                                <td className="p-2 border border-slate-200 text-center">Absent</td>
                                <td className="p-2 border border-slate-200 text-center">4.0</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
