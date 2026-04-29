import React, { useState } from 'react';
import { 
  BookMarked, 
  BrainCircuit, 
  ChevronRight, 
  Zap, 
  Clock,
  PlayCircle
} from 'lucide-react';
import { clsx } from 'clsx';

const StudentReviewMode: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<number>(1);

  const topics = [
    { id: 1, title: '电磁感应定律', errorCount: 12, mastery: 65 },
    { id: 2, title: '恒定电流', errorCount: 5, mastery: 88 },
    { id: 3, title: '牛顿运动定律', errorCount: 8, mastery: 75 },
    { id: 4, title: '动量守恒', errorCount: 3, mastery: 92 },
  ];

  return (
    <div className="flex h-full gap-6 animate-in fade-in duration-500">
      {/* Left List */}
      <div className="w-80 bg-white rounded-[2rem] border border-emerald-100 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="p-6 border-b border-emerald-50 bg-emerald-50/30">
          <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
            <BookMarked className="text-emerald-600" size={20} />
            薄弱知识点突破
          </h2>
          <p className="text-xs text-slate-500 mt-2">基于您的错题记录和作业数据生成</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={clsx(
                "w-full text-left p-4 rounded-2xl transition-all border group",
                selectedTopic === topic.id 
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-200" 
                  : "bg-white text-slate-700 border-emerald-50 hover:border-emerald-200 hover:bg-emerald-50/50"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm">{topic.title}</span>
                <span className={clsx(
                  "text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider",
                  selectedTopic === topic.id ? "bg-white/20 text-white" : "bg-orange-50 text-orange-600"
                )}>
                  {topic.errorCount}道错题
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className={clsx(selectedTopic === topic.id ? "text-emerald-100" : "text-slate-400")}>掌握度</span>
                  <span className={clsx(selectedTopic === topic.id ? "text-white" : "text-slate-700")}>{topic.mastery}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <div 
                    className={clsx(
                      "h-full rounded-full transition-all duration-1000",
                      selectedTopic === topic.id ? "bg-white" : "bg-emerald-500"
                    )}
                    style={{ width: `${topic.mastery}%` }}
                  ></div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Review Area */}
      <div className="flex-1 bg-white rounded-[2rem] border border-emerald-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-8 border-b border-emerald-50 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
              {topics.find(t => t.id === selectedTopic)?.title} - 专项复习
            </h3>
            <p className="text-sm font-medium text-slate-500">
              AI 已为您生成个性化复习路径，包含知识点讲解、易错点剖析和针对性练习。
            </p>
          </div>
          <button className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 hover:shadow-2xl hover:scale-105 transition-all">
            <PlayCircle size={18} /> 开始专属复习
          </button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto bg-emerald-50/20 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* AI Summary */}
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <BrainCircuit size={20} />
                </div>
                <h4 className="font-bold text-slate-800">AI 学情诊断</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                根据您最近的作业和考试表现，您在<span className="font-bold text-emerald-600"> {topics.find(t => t.id === selectedTopic)?.title} </span>部分的公式运用较为熟练，但在<span className="font-bold text-orange-500">复杂物理场景的模型构建</span>上容易出错。建议重点复习受力分析和能量转换的过程。
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">核心公式记忆 ✅</span>
                <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-lg border border-orange-100">复杂场景建模 ⚠️</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">综合计算能力 📈</span>
              </div>
            </div>

            {/* Review Steps */}
            <div className="space-y-4">
              <h4 className="font-black text-slate-800 flex items-center gap-2">
                <Zap size={18} className="text-emerald-500" /> 推荐复习任务
              </h4>
              
              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">1</div>
                  <div>
                    <p className="font-bold text-slate-800">知识点精讲微课</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <Clock size={12} /> 约 15 分钟
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-black">2</div>
                  <div>
                    <p className="font-bold text-slate-800">错题重做与变式训练</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      包含 {topics.find(t => t.id === selectedTopic)?.errorCount} 道原题 + 3 道变式题
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>
              
              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-black">3</div>
                  <div>
                    <p className="font-bold text-slate-800">AI 互动答疑</p>
                    <p className="text-xs text-slate-500 mt-1">针对不理解的步骤随时提问</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReviewMode;