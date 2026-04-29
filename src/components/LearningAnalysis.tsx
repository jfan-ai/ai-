import React from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  PieChart,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  BrainCircuit,
  Download
} from 'lucide-react';
import { clsx } from 'clsx';

const LearningAnalysis: React.FC = () => {
  const knowledgePoints = [
    { name: '洛伦兹变换', mastery: 65, status: 'warning', trend: 'down' },
    { name: '狭义相对论时空观', mastery: 42, status: 'danger', trend: 'down' },
    { name: '动量守恒定律', mastery: 92, status: 'success', trend: 'up' },
    { name: '简谐振动的合成', mastery: 78, status: 'normal', trend: 'up' },
    { name: '多普勒效应', mastery: 85, status: 'normal', trend: 'up' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-indigo-50 rounded-2xl text-indigo-600">
              <BarChart2 size={28} />
            </div>
            班级学习情况分析
          </h1>
          <p className="text-slate-400 font-bold mt-2 text-sm uppercase tracking-wider">Classroom Learning Intelligence Analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-8 py-3 bg-white text-slate-700 border border-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} />
            导出分析报告
          </button>
          <select className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest outline-none shadow-xl shadow-indigo-200 cursor-pointer appearance-none border-none">
            <option>应用物理24-1班</option>
            <option>应用物理24-2班</option>
            <option>材料工程24-1班</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: '平均分', value: '82.5', icon: Target, color: 'indigo', trend: '+2.4' },
          { label: '及格率', value: '94.2%', icon: CheckCircle2, color: 'green', trend: '+1.1' },
          { label: '最高分', value: '98', icon: TrendingUp, color: 'blue', trend: '持平' },
          { label: '薄弱环节', value: '2', icon: AlertTriangle, color: 'orange', trend: '-1' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm group hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className={clsx(
                "p-4 rounded-3xl transition-transform group-hover:scale-110 shadow-sm",
                stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
                stat.color === 'green' ? "bg-green-50 text-green-600" :
                stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                "bg-orange-50 text-orange-600"
              )}>
                <stat.icon size={24} />
              </div>
              <span className={clsx(
                "text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider",
                stat.trend.startsWith('+') ? "bg-green-50 text-green-600" :
                stat.trend.startsWith('-') ? "bg-red-50 text-red-600" :
                "bg-slate-50 text-slate-400"
              )}>{stat.trend}</span>
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Knowledge Point Mastery */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-black text-slate-800 flex items-center gap-3 tracking-tight">
              <PieChart size={20} className="text-indigo-600" />
              知识点掌握分布
            </h3>
            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">查看详情</button>
          </div>
          <div className="p-8 space-y-8">
            {knowledgePoints.map((point, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-700">{point.name}</span>
                  <div className="flex items-center gap-4">
                    <span className={clsx(
                      "text-xs font-black",
                      point.status === 'success' ? "text-green-600" :
                      point.status === 'warning' ? "text-orange-600" :
                      point.status === 'danger' ? "text-red-600" :
                      "text-slate-600"
                    )}>{point.mastery}%</span>
                    {point.trend === 'up' ? <ArrowUpRight size={16} className="text-green-500" /> : <ArrowDownRight size={16} className="text-red-500" />}
                  </div>
                </div>
                <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className={clsx(
                      "h-full rounded-full transition-all duration-1000 shadow-sm",
                      point.status === 'success' ? "bg-green-500" :
                      point.status === 'warning' ? "bg-orange-500" :
                      point.status === 'danger' ? "bg-red-500" :
                      "bg-indigo-500"
                    )} 
                    style={{ width: `${point.mastery}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <BrainCircuit size={28} className="text-indigo-200" />
                <h3 className="text-lg font-black tracking-tight">AI 教学洞察</h3>
              </div>
              <div className="space-y-6">
                <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-all">
                  <p className="text-[10px] font-black text-indigo-100 mb-2 uppercase tracking-[0.2em]">重点预警</p>
                  <p className="text-sm leading-relaxed font-medium">
                    本班在“相对论”章节的平均掌握度仅为54%，建议在下节课增加15分钟的专题串讲。
                  </p>
                </div>
                <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-all">
                  <p className="text-[10px] font-black text-indigo-100 mb-2 uppercase tracking-[0.2em]">优生提拔</p>
                  <p className="text-sm leading-relaxed font-medium">
                    有5名同学（如：张*、李*）在力学综合题中表现出色，可推荐参与“物理竞赛初级培训”。
                  </p>
                </div>
              </div>
              <button className="w-full mt-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg">
                生成完整分析简报
              </button>
            </div>
            {/* Mascot decor */}
            <div className="absolute top-0 right-0 p-4 text-7xl opacity-10 translate-x-6 -translate-y-6 rotate-12 group-hover:rotate-0 transition-transform duration-700">🦖</div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm p-8 group hover:shadow-xl transition-all">
            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-3 tracking-tight">
              <Users size={18} className="text-slate-300" />
              班级活跃度
            </h3>
            <div className="flex items-end justify-between h-32 gap-2 px-2">
              {[40, 65, 30, 85, 45, 90, 55].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-50 rounded-t-xl relative group/bar">
                  <div 
                    className="absolute bottom-0 left-0 w-full bg-indigo-500 rounded-t-xl transition-all duration-1000 group-hover/bar:bg-indigo-600 shadow-sm" 
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity">
                      {h}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-black text-slate-300 px-1 uppercase tracking-[0.2em]">
              <span>Mon</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningAnalysis;
