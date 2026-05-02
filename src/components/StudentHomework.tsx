import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  Clock, 
  ChevronRight, 
  Search, 
  Filter,
  BrainCircuit,
  FileText,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { getStudentAssignments } from '../services/assignments';
import type { Assignment } from '../types';

const StudentHomework: React.FC = () => {
  // 状态管理
  const [homeworkList, setHomeworkList] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 组件加载时获取作业列表
  useEffect(() => {
    loadHomework();
  }, []);

  // 加载作业数据
  const loadHomework = async () => {
    try {
      setLoading(true);
      const res = await getStudentAssignments();
      setHomeworkList((res as any).assignments || []);
    } catch (err: any) {
      console.error('加载作业列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 根据状态筛选作业
  const filteredHomework = homeworkList.filter(hw => {
    // 状态筛选
    if (filterStatus === 'pending') {
      return hw.status === 'active' || hw.status === 'draft';
    } else if (filterStatus === 'completed') {
      return hw.status === 'finished' || hw.status === 'graded';
    }
    // 搜索筛选
    if (searchKeyword) {
      return hw.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
             hw.className.toLowerCase().includes(searchKeyword.toLowerCase());
    }
    return true;
  });

  // 格式化截止日期显示
  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '已截止';
    if (diffDays === 0) return '今天 23:59';
    if (diffDays === 1) return '明天 12:00';
    return date.toLocaleDateString('zh-CN');
  };

  // 获取作业状态显示
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'graded':
      case 'finished':
        return { text: '已完成', color: 'bg-emerald-100 text-emerald-700' };
      case 'active':
        return { text: '待完成', color: 'bg-orange-100 text-orange-700' };
      case 'draft':
        return { text: '未开始', color: 'bg-slate-100 text-slate-500' };
      default:
        return { text: '待完成', color: 'bg-orange-100 text-orange-700' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

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
          <button 
            onClick={() => setFilterStatus('all')}
            className={clsx(
              "px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              filterStatus === 'all' 
                ? "bg-white text-emerald-600 shadow-md" 
                : "text-slate-400 hover:text-emerald-600"
            )}
          >
            全部
          </button>
          <button 
            onClick={() => setFilterStatus('pending')}
            className={clsx(
              "px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              filterStatus === 'pending' 
                ? "bg-white text-emerald-600 shadow-md" 
                : "text-slate-400 hover:text-emerald-600"
            )}
          >
            进行中
          </button>
          <button 
            onClick={() => setFilterStatus('completed')}
            className={clsx(
              "px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              filterStatus === 'completed' 
                ? "bg-white text-emerald-600 shadow-md" 
                : "text-slate-400 hover:text-emerald-600"
            )}
          >
            已完成
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜索作业、课程名称..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-emerald-50 rounded-[1.5rem] text-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all outline-none shadow-sm font-medium"
          />
        </div>
        <button 
          onClick={() => setSearchKeyword('')}
          className="px-8 py-4 bg-white border border-emerald-50 text-slate-500 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm flex items-center justify-center gap-3"
        >
          <Filter size={18} className="text-emerald-400" /> 
          {searchKeyword ? '清除筛选' : '智能筛选'}
        </button>
      </div>

      {/* Homework List - 从API获取的数据 */}
      <div className="space-y-6">
        {filteredHomework.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl">
            <FileText size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">暂无作业</p>
            <p className="text-sm text-slate-400 mt-2">
              {filterStatus !== 'all' ? '切换筛选条件查看更多' : '老师发布作业后会显示在这里'}
            </p>
          </div>
        ) : (
          filteredHomework.map((hw) => {
            const statusDisplay = getStatusDisplay(hw.status);
            const isCompleted = hw.status === 'finished' || hw.status === 'graded';
            
            return (
              <div key={hw.id} className="group bg-white p-8 rounded-[2.5rem] border border-emerald-50 shadow-sm hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all cursor-pointer relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className={clsx(
                    "w-20 h-20 rounded-3xl flex items-center justify-center font-black text-2xl shadow-sm transition-transform group-hover:scale-110",
                    isCompleted ? "bg-emerald-50 text-emerald-600" :
                    hw.status === 'active' ? "bg-orange-50 text-orange-600" :
                    "bg-slate-50 text-slate-300"
                  )}>
                    {isCompleted ? '95' : <FileText size={32} />}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4">
                      <span className={clsx(
                        "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]",
                        statusDisplay.color
                      )}>{statusDisplay.text}</span>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{hw.className}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors tracking-tight">{hw.title}</h3>
                    <div className="flex items-center gap-8 pt-2">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        <Clock size={14} className="text-slate-200" />
                        截止: <span className={clsx(
                          "font-black",
                          formatDeadline(hw.deadline) === '今天 23:59' ? "text-orange-500" : "text-slate-600"
                        )}>{formatDeadline(hw.deadline)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        <BrainCircuit size={14} className="text-slate-200" />
                        批改: <span className="text-slate-600 font-black">{hw.gradingType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {!isCompleted && (
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
                  {hw.gradingType} 批改
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentHomework;
