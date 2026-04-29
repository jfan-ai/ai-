import React from 'react';
import { 
  BookMarked, 
  Search, 
  RotateCcw, 
  BrainCircuit, 
  ChevronRight, 
  Calendar,
  Filter,
  Trash2,
  ExternalLink,
  Zap
} from 'lucide-react';
import { clsx } from 'clsx';

const ErrorBook: React.FC = () => {
  const errorQuestions = [
    { id: 1, title: '电磁感应中的动生电动势计算', chapter: '电磁学', errorCount: 3, lastReview: '2024-04-20', difficulty: '困难', tags: ['公式应用错误', '计算失误'] },
    { id: 2, title: '安培环路定理的适用条件', chapter: '电磁学', errorCount: 1, lastReview: '2024-04-18', difficulty: '中等', tags: ['概念模糊'] },
    { id: 3, title: '理想气体的压强与温度关系', chapter: '热学', errorCount: 2, lastReview: '2024-04-15', difficulty: '简单', tags: ['单位换算'] },
    { id: 4, title: '杨氏双缝干涉的条纹间距', chapter: '光学', errorCount: 1, lastReview: '2024-04-10', difficulty: '中等', tags: ['公式记错'] },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookMarked className="text-orange-600" size={28} />
            物理错题本复盘
          </h1>
          <p className="text-slate-500 mt-1">AI 自动收录作业错题，助力精准复习与薄弱点突破</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-105 transition-all">
          <Zap size={18} />
          AI 智能推题复练
        </button>
      </div>

      {/* Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-white text-orange-600 rounded-2xl flex items-center justify-center shadow-sm">
            <RotateCcw size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">待复盘错题</p>
            <p className="text-2xl font-bold text-orange-900">18 <span className="text-xs font-normal">道</span></p>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
            <BrainCircuit size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">核心薄弱点</p>
            <p className="text-2xl font-bold text-blue-900">电磁感应</p>
          </div>
        </div>
        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">连续复盘天数</p>
            <p className="text-2xl font-bold text-emerald-900">7 <span className="text-xs font-normal">天</span></p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索错题关键字、知识点..."
            className="w-full pl-12 pr-4 py-2 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-orange-500/5 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100">
            <Filter size={14} /> 按章节
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100">
            按错误频率
          </button>
        </div>
      </div>

      {/* Error List */}
      <div className="space-y-4">
        {errorQuestions.map((q) => (
          <div key={q.id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all cursor-pointer">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">#{q.id}</span>
                    <span className={clsx(
                      "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                      q.difficulty === '困难' ? "bg-red-50 text-red-600" :
                      q.difficulty === '中等' ? "bg-amber-50 text-amber-600" :
                      "bg-green-50 text-green-600"
                    )}>{q.difficulty}</span>
                    <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">错误 {q.errorCount} 次</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{q.title}</h3>
                
                <div className="flex flex-wrap gap-2">
                  {q.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-bold">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Calendar size={14} />
                    上次复盘: {q.lastReview}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <BookMarked size={14} />
                    章节: {q.chapter}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-3 min-w-[140px]">
                <button className="w-full py-3 bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-200 hover:scale-105 transition-all">
                  重新练习
                </button>
                <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                  查看解析 <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorBook;
