
import React, { useState, useEffect } from 'react';
import { analyzeStudentTrend } from '../geminiService';
import { StudentData } from '../types';

interface Props {
  history: StudentData[];
  studentId: number;
}

const AiAnalysisPanel: React.FC<Props> = ({ history, studentId }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await analyzeStudentTrend(history);
    setAnalysis(result);
    setLoading(false);
  };

  useEffect(() => {
    handleGenerate();
  }, [studentId]);

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 ring-1 ring-slate-200/50">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-900 to-slate-800 text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
            <i className="fa-solid fa-wand-magic-sparkles text-amber-400 animate-pulse"></i>
          </div>
          <div>
            <h3 className="font-black text-sm tracking-tight">AI Support Insight</h3>
            <p className="text-[10px] text-indigo-200 uppercase font-black tracking-widest">Powered by Gemini Pro</p>
          </div>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="text-xs bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-xl transition-all disabled:opacity-50 font-bold active:scale-95"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-circle-notch animate-spin"></i> Analyzing
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-rotate"></i> Recalculate
            </span>
          )}
        </button>
      </div>
      
      <div className="p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-2">
                <p className="text-slate-800 font-bold text-lg">Synthesizing Behavioral Patterns</p>
                <p className="text-slate-400 text-sm max-w-xs mx-auto italic">Cross-referencing physiological markers with attendance history...</p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            {analysis ? (
              <div className="space-y-8">
                 <div className="relative group">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500 rounded-full"></div>
                    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
                        <div className="whitespace-pre-wrap text-sm sm:text-base">
                            {analysis}
                        </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                    <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 flex gap-4 transition-all hover:shadow-md group">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-rose-500 shadow-sm border border-rose-100 shrink-0 group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] mb-1">Critical Insight</p>
                            <p className="text-sm text-slate-700 font-bold leading-snug">Multiple physiological indicators show burnout patterns synchronized with attendance drops.</p>
                        </div>
                    </div>

                    <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex gap-4 transition-all hover:shadow-md group">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100 shrink-0 group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-hand-holding-medical text-xl"></i>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Recommended Vector</p>
                            <p className="text-sm text-slate-700 font-bold leading-snug">Low-pressure outreach focuses on stress management rather than academic performance.</p>
                        </div>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <i className="fa-solid fa-robot text-4xl mb-4 opacity-10"></i>
                <p>Click recalculate to generate specialized AI insights for this student.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiAnalysisPanel;
