
import React, { useState, useEffect, useCallback } from 'react';
import MentorDashboard from './components/MentorDashboard';
import StudentDashboard from './components/StudentDashboard';
import { UserRole, StudentData, Subject, User } from './types';
import { INITIAL_RAW_DATA } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'signup'>('landing');
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Form states
  const [formId, setFormId] = useState('');
  const [formPass, setFormPass] = useState('');
  const [formDob, setFormDob] = useState('');
  const [formSubject, setFormSubject] = useState<Subject>('Mathematics');
  const [loginError, setLoginError] = useState('');

  // Persistent Data States
  const [allData, setAllData] = useState<StudentData[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem('silent_signals_data');
    const storedUsers = localStorage.getItem('silent_signals_users');
    
    if (storedData) {
      setAllData(JSON.parse(storedData));
    } else {
      setAllData(INITIAL_RAW_DATA);
      localStorage.setItem('silent_signals_data', JSON.stringify(INITIAL_RAW_DATA));
    }

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Default users for testing
      const defaultUsers: User[] = [
        { id: 'math_mentor', password: 'math123', role: 'mentor', subject: 'Mathematics' },
        { id: '1', password: '2005-01-01', role: 'student', studentId: 1, dob: '2005-01-01' }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('silent_signals_users', JSON.stringify(defaultUsers));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (allData.length > 0) {
      localStorage.setItem('silent_signals_data', JSON.stringify(allData));
    }
  }, [allData]);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('silent_signals_users', JSON.stringify(users));
    }
  }, [users]);

  const addDataRecord = useCallback((newRecord: StudentData) => {
    setAllData(prev => [...prev, newRecord]);
  }, []);

  const addBatchRecords = useCallback((newRecords: StudentData[]) => {
    setAllData(prev => [...prev, ...newRecords]);
  }, []);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (users.find(u => u.id === formId)) {
      setLoginError('User ID already exists.');
      return;
    }

    const newUser: User = {
      id: formId,
      password: activeRole === 'student' ? formDob : formPass,
      role: activeRole!,
      subject: activeRole === 'mentor' ? formSubject : undefined,
      studentId: activeRole === 'student' ? parseInt(formId) : undefined,
      dob: activeRole === 'student' ? formDob : undefined
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setView('landing');
    setLoginError('');
    alert(`Success! ${activeRole === 'student' ? 'Your account is ready.' : 'Mentor account created.'}`);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const effectivePass = activeRole === 'student' ? formDob : formPass;
    const user = users.find(u => u.id === formId && u.password === effectivePass && u.role === activeRole);
    
    if (user) {
      setCurrentUser(user);
      setLoginError('');
      setView('landing');
    } else {
      setLoginError(activeRole === 'student' ? 'Invalid ID or Date of Birth.' : 'Invalid credentials or role mismatch.');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setView('landing');
    setFormId('');
    setFormPass('');
    setFormDob('');
  };

  if (currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <nav className="bg-white border-b sticky top-0 z-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <i className="fa-solid fa-satellite-dish text-white text-xs"></i>
              </div>
              <span className="font-black text-lg text-slate-800 tracking-tighter uppercase">Silent Signals</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                   {currentUser.role === 'mentor' ? `${currentUser.subject} Dept` : `Student ID: ${currentUser.studentId}`}
                 </span>
              </div>
              <button onClick={logout} className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center">
                <i className="fa-solid fa-power-off text-sm"></i>
              </button>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {currentUser.role === 'mentor' ? (
            <MentorDashboard 
              allData={allData.filter(d => d.subject === currentUser.subject)} 
              onAddRecord={addDataRecord} 
              onAddBatchRecords={addBatchRecords}
              subject={currentUser.subject!}
            />
          ) : (
            <StudentDashboard studentId={currentUser.studentId!} allData={allData} />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-950 px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden">
        {view === 'landing' ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-900/20 rotate-3">
              <i className="fa-solid fa-satellite-dish text-white text-3xl animate-pulse"></i>
            </div>
            <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tighter">Silent Signals AI</h1>
            <p className="text-slate-400 mb-10 text-sm font-medium">Detect academic distress through behavioral markers.</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => { setActiveRole('mentor'); setView('login'); }}
                className="group w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3"><i className="fa-solid fa-chalkboard-user text-indigo-400"></i>Mentor Portal</div>
                <i className="fa-solid fa-arrow-right text-xs opacity-50"></i>
              </button>
              <button 
                onClick={() => { setActiveRole('student'); setView('login'); }}
                className="group w-full border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 text-slate-700 font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3"><i className="fa-solid fa-graduation-cap text-indigo-600"></i>Student Workspace</div>
                <i className="fa-solid fa-arrow-right text-xs opacity-50"></i>
              </button>
            </div>
            <p className="mt-8 text-xs text-slate-400 font-bold uppercase tracking-widest">V2.1 • Student ID & DOB Auth</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button onClick={() => { setView('landing'); setLoginError(''); }} className="text-slate-400 hover:text-indigo-600 mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <i className="fa-solid fa-arrow-left"></i> Back
            </button>
            
            <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">
              {view === 'login' ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p className="text-slate-400 text-sm font-medium mb-8">
              {activeRole === 'mentor' ? 'Secure Mentor Access' : 'Student Identity Verification'}
            </p>

            <form onSubmit={view === 'login' ? handleLogin : handleSignup} className="space-y-5">
              {view === 'signup' && activeRole === 'mentor' && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Department</label>
                  <select 
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value as Subject)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all text-sm font-bold"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Literature">Literature</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
                  {activeRole === 'student' ? 'Register Number / ID' : 'Mentor ID'}
                </label>
                <input 
                  type={activeRole === 'student' ? 'number' : 'text'} required value={formId} onChange={(e) => setFormId(e.target.value)}
                  placeholder={activeRole === 'student' ? "Enter Reg No" : "e.g. mentor_01"}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all text-sm font-bold"
                />
              </div>
              
              {activeRole === 'mentor' ? (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Password</label>
                  <input 
                    type="password" required value={formPass} onChange={(e) => setFormPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all text-sm font-bold"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Date of Birth</label>
                  <input 
                    type="date" required value={formDob} onChange={(e) => setFormDob(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all text-sm font-bold"
                  />
                </div>
              )}
              
              {loginError && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">{loginError}</p>}
              
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg transition-all uppercase tracking-widest text-[10px]">
                {view === 'login' ? 'Login Securely' : 'Complete Registration'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-50 text-center">
              <button 
                onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setLoginError(''); }}
                className="text-indigo-600 font-bold text-xs hover:underline"
              >
                {view === 'login' ? "New user? Create account" : "Existing user? Log in"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
