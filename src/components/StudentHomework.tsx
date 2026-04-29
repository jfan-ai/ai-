import React from 'react';
import { 
  PenTool, 
  Clock, 
  ChevronRight, 
  Search, 
  Filter,
  BrainCircuit,
  FileText
} from 'lucide-react';
import { clsx } from 'clsx';

const StudentHomework: React.FC = () => {
  const homeworkList = [
    { id: 1, title: '《电磁感应》课后作业', course: '大学物理（下）', deadline: '今天 23:59', status: '待完成', type: 'AI批改', difficulty: '中等' },
    { id: 2, title: '恒定电流章节练习', course: '大学物理（下）', deadline: '明天 12:00', status: '待完成', type: 'AI批改', difficulty: '简单' },
    { id: 3, title: '期中考试模拟卷', course: '大学物理（下）', deadline: '2024-04-28', status: '未开始', type: '人工+AI', difficulty: '困难' },
    { id: 4, title: '质点运动学回顾', course: '大学物理（上）', deadline: '已截止', status: '已完成', score: 95, type: 'AI批改', difficulty: '中等' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-emerald-50 rounded-2xl text-emerald-600">
              <PenTool size={28} />
            </div>
            待完成物理作业
          </h1>
          <p className="text-slate-400 font-bold mt-2 text-sm uppercase tracking-wider">Your Pending Physics Assignments</p>
        </div>
        <div className="flex bg-emerald-50 p-1.5 rounded-2xl border border-emerald-100 shadow-sm">
          <button className="px-8 py-2.5 bg-white text-emerald-600 shadow-md rounded-xl text-xs font-black uppercase tracking-widest transition-all">全部</button>
          <button className="px-8 py-2.5 text-slate-400 hover:text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all">进行中</button>
          <button className="px-8 py-2.5 text-slate-400 hover:text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all">已完成</button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="搜索作业、课程名称..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-emerald-50 rounded-[1.5rem] text-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all outline-none shadow-sm font-medium"
          />
        </div>
        <button className="px-8 py-4 bg-white border border-emerald-50 text-slate-500 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm flex items-center justify-center gap-3">
          <Filter size={18} className="text-emerald-400" /> 智能筛选
        </button>
      </div>

      {/* Homework List */}
      <div className="space-y-6">
        {homeworkList.map((hw) => (
          <div key={hw.id} className="group bg-white p-8 rounded-[2.5rem] border border-emerald-50 shadow-sm hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all cursor-pointer relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className={clsx(
                "w-20 h-20 rounded-3xl flex items-center justify-center font-black text-2xl shadow-sm transition-transform group-hover:scale-110",
                hw.status === '已完成' ? "bg-emerald-50 text-emerald-600" :
                hw.status === '待完成' ? "bg-orange-50 text-orange-600" :
                "bg-slate-50 text-slate-300"
              )}>
                {hw.status === '已完成' ? hw.score : <FileText size={32} />}
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-4">
                  <span className={clsx(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]",
                    hw.status === '已完成' ? "bg-emerald-100 text-emerald-700" :
                    hw.status === '待完成' ? "bg-orange-100 text-orange-700" :
                    "bg-slate-100 text-slate-500"
                  )}>{hw.status}</span>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{hw.course}</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors tracking-tight">{hw.title}</h3>
                <div className="flex items-center gap-8 pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    <Clock size={14} className="text-slate-200" />
                    截止: <span className={clsx(
                      "font-black",
                      hw.deadline === '今天 23:59' ? "text-orange-500" : "text-slate-600"
                    )}>{hw.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    <BrainCircuit size={14} className="text-slate-200" />
                    难度: <span className="text-slate-600 font-black">{hw.difficulty}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {hw.status !== '已完成' && (
                  <button className="px-10 py-4 bg-emerald-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 hover:shadow-2xl hover:scale-105 transition-all">
                    开始作业
                  </button>
                )}
                <div className="p-4 bg-slate-50 text-slate-300 rounded-3xl group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-emerald-300/30">
                  <ChevronRight size={28} />
                </div>
              </div>
            </div>
            
            {/* AI Label Decor */}
            <div className="absolute top-0 right-0 px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-[1.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 shadow-lg">
              AI 智能批改
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentHomework;
