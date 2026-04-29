import React from 'react';
import { 
  PieChart, 
  TrendingUp, 
  CheckCircle2, 
  Target, 
  BrainCircuit, 
  Star, 
  ArrowUpRight, 
  Award, 
  Zap,
  BarChart2,
  Calendar,
  ChevronRight,
  Calculator
} from 'lucide-react';
import { clsx } from 'clsx';

const GrowthReport: React.FC = () => {
  const learningStats = [
    { label: '已完成作业', value: '32', icon: CheckCircle2, color: 'emerald' },
    { label: '平均正确率', value: '88.5%', icon: Target, color: 'blue' },
    { label: '攻克难题', value: '12', icon: Zap, color: 'orange' },
    { label: '超越同级', value: '75%', icon: TrendingUp, color: 'purple' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-emerald-50 rounded-2xl text-emerald-600">
              <PieChart size={28} />
            </div>
            个人学习成长报告
          </h1>
          <p className="text-slate-400 font-bold mt-2 text-sm uppercase tracking-wider">Your Physics Learning Journey</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-8 py-3 bg-white text-slate-700 border border-emerald-100 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm">
            <Calendar size={18} />
            本学期
          </button>
          <button className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 hover:shadow-2xl hover:scale-105 transition-all">
            <Award size={18} />
            获取认证报告
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {learningStats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-emerald-50 shadow-sm group hover:shadow-xl transition-all">
            <div className={clsx(
              "w-14 h-14 rounded-3xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-sm",
              stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
              stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
              stat.color === 'orange' ? "bg-orange-50 text-orange-600" :
              "bg-purple-50 text-purple-600"
            )}>
              <stat.icon size={28} />
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Progress Chart */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-emerald-50 shadow-sm p-10 group hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-3 tracking-tight">
              <BarChart2 size={20} className="text-emerald-600" />
              每周学习时长趋势
            </h3>
            <div className="flex items-center gap-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm"></div> 本周
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-slate-200 rounded-full shadow-sm"></div> 上周
              </div>
            </div>
          </div>
          
          <div className="flex items-end justify-between h-56 gap-6 px-4">
            {[35, 60, 45, 90, 65, 80, 50].map((h, i) => (
              <div key={i} className="flex-1 space-y-4">
                <div className="relative h-full flex items-end justify-center group/bar">
                  <div className="absolute w-full bg-slate-50 rounded-t-2xl h-[90%] -z-10"></div>
                  <div 
                    className="w-full bg-emerald-500 rounded-t-2xl transition-all duration-1000 group-hover/bar:bg-emerald-600 cursor-pointer shadow-sm" 
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all">
                      {h}min
                    </div>
                  </div>
                </div>
                <p className="text-[10px] font-black text-slate-300 text-center uppercase tracking-[0.2em]">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight & Recommendations */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <BrainCircuit size={28} className="text-emerald-200" />
                <h3 className="text-lg font-black tracking-tight">AI 成长洞察</h3>
              </div>
              <div className="space-y-8">
                <div className="flex items-start gap-5 group/item">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover/item:bg-white/20 transition-all">
                    <Star size={24} className="text-emerald-200" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black tracking-tight uppercase tracking-widest">卓越进步</p>
                    <p className="text-xs text-emerald-100/80 leading-relaxed font-medium">
                      你在“热学”章节的掌握度从 45% 提升至 82%，是本月进步最快的学生之一。
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-5 group/item">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover/item:bg-white/20 transition-all">
                    <Calculator size={24} className="text-emerald-200" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black tracking-tight uppercase tracking-widest">学习建议</p>
                    <p className="text-xs text-emerald-100/80 leading-relaxed font-medium">
                      建议增加对“迈克尔逊干涉仪”实验原理的复习，近三次作业中此类错误率较高。
                    </p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-10 py-4 bg-white text-emerald-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2">
                查看详细建议 <ArrowUpRight size={20} />
              </button>
            </div>
            {/* Mascot decor */}
            <div className="absolute top-0 right-0 p-4 text-8xl opacity-10 translate-x-8 -translate-y-8 rotate-12 group-hover:rotate-0 transition-transform duration-700">🦖</div>
          </div>

          <div className="bg-white rounded-[3rem] border border-emerald-50 shadow-sm p-8 group hover:shadow-xl transition-all">
            <h3 className="text-sm font-black text-slate-800 mb-8 flex items-center gap-3 tracking-tight">
              <Award size={20} className="text-amber-500" />
              荣誉勋章成就
            </h3>
            <div className="flex justify-between items-center gap-4">
              {[
                { name: '力学先锋', color: 'bg-blue-50 text-blue-500 border-blue-100' },
                { name: '公式达人', color: 'bg-emerald-50 text-emerald-500 border-emerald-100' },
                { name: '逻辑大师', color: 'bg-purple-50 text-purple-500 border-purple-100' },
              ].map((m, i) => (
                <div key={i} className={clsx("w-16 h-16 rounded-full flex items-center justify-center shadow-sm border-2 transition-transform hover:scale-110 cursor-pointer", m.color)}>
                  <Award size={32} />
                </div>
              ))}
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 hover:border-emerald-300 hover:text-emerald-300 transition-all cursor-pointer">
                <ChevronRight size={28} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthReport;
