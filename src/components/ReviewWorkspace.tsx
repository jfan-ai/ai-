import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  BrainCircuit, 
  Save, 
  PenTool,
  Image as ImageIcon,
  MessageSquare
} from 'lucide-react';
import { clsx } from 'clsx';

const ReviewWorkspace: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<number>(1);

  const students = [
    { id: 1, name: '张三', status: '待批改', aiScore: 85, submitTime: '10:30' },
    { id: 2, name: '李四', status: '待批改', aiScore: 92, submitTime: '11:15' },
    { id: 3, name: '王五', status: '已批改', score: 78, submitTime: '09:20' },
    { id: 4, name: '赵六', status: '待批改', aiScore: 65, submitTime: '13:45' },
    { id: 5, name: '陈七', status: '已批改', score: 88, submitTime: '08:50' },
  ];

  return (
    <div className="flex h-full gap-6 animate-in fade-in duration-500">
      {/* Left List */}
      <div className="w-80 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-lg font-black text-slate-800 tracking-tight mb-4">《电磁感应》课后作业</h2>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="搜索学生姓名..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand-light/30 transition-all outline-none font-medium"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudent(student.id)}
              className={clsx(
                "w-full text-left p-4 rounded-2xl transition-all border",
                selectedStudent === student.id 
                  ? "bg-brand text-white border-brand shadow-lg shadow-brand/20" 
                  : "bg-white text-slate-700 border-slate-50 hover:border-brand-light/30 hover:bg-brand-bg"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-base">{student.name}</span>
                <span className={clsx(
                  "text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider",
                  student.status === '待批改' 
                    ? (selectedStudent === student.id ? "bg-white/20 text-white" : "bg-orange-50 text-orange-600")
                    : (selectedStudent === student.id ? "bg-white/20 text-white" : "bg-green-50 text-green-600")
                )}>
                  {student.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className={clsx(selectedStudent === student.id ? "text-brand-light" : "text-slate-400")}>
                  提交: {student.submitTime}
                </span>
                <span className="font-bold">
                  {student.status === '待批改' ? `AI预估: ${student.aiScore}分` : `得分: ${student.score}分`}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Review Area */}
      <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="h-16 border-b border-slate-50 flex items-center justify-between px-8 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-light/20 text-brand-dark rounded-xl flex items-center justify-center font-black">
              {students.find(s => s.id === selectedStudent)?.name[0]}
            </div>
            <div>
              <h3 className="font-black text-slate-800">{students.find(s => s.id === selectedStudent)?.name} 的作业</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">学号: 2024010{selectedStudent}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all">
              <AlertCircle size={16} /> 打回重做
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-brand text-white rounded-xl font-bold text-sm shadow-lg shadow-brand/20 hover:scale-105 transition-all">
              <Save size={16} /> 完成批改
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Answer Display */}
          <div className="flex-1 border-r border-slate-50 p-8 overflow-y-auto bg-slate-50/30 custom-scrollbar">
            <div className="mb-6">
              <h4 className="text-sm font-black text-slate-800 mb-2">题目 1：电磁感应定律综合应用</h4>
              <p className="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-100">
                如图所示，在一个均匀磁场中，有一个矩形线圈以恒定速度v向右运动。求线圈中的感应电动势，并分析其中的能量转换过程。
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <ImageIcon size={16} className="text-brand" /> 学生作答图片
              </h4>
              <div className="aspect-[4/3] bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 relative group cursor-pointer hover:border-brand/50 transition-colors">
                <ImageIcon size={48} className="mb-4 opacity-20 group-hover:opacity-50 transition-opacity" />
                <p className="font-medium text-sm">学生上传的解答图片.jpg</p>
                <p className="text-xs mt-2 opacity-60">点击放大查看</p>
                
                {/* Mock Annotation */}
                <div className="absolute top-1/4 left-1/4 w-32 h-16 border-2 border-red-400 rounded-lg bg-red-400/10 flex items-start justify-end p-1">
                  <span className="text-[10px] font-black text-red-500 bg-white px-1.5 rounded">公式错误</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis & Grading Panel */}
          <div className="w-[400px] flex flex-col bg-white shrink-0">
            <div className="p-6 border-b border-slate-50 bg-gradient-to-br from-brand-bg to-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-brand-light/20 text-brand-dark rounded-lg">
                  <BrainCircuit size={18} />
                </div>
                <h4 className="font-black text-slate-800 text-sm">AI 智能分析</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">法拉第电磁感应定律公式书写正确，方向判断无误。</p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">在计算能量转换时，忽略了线圈自身的焦耳热损耗，导致最终能量守恒等式不平。</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-xl border border-brand-light/30 shadow-sm flex items-center justify-between">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">AI 建议得分</span>
                <span className="text-2xl font-black text-brand-dark">{students.find(s => s.id === selectedStudent)?.aiScore || 85}<span className="text-sm text-slate-400 ml-1">/ 100</span></span>
              </div>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
              <div>
                <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-3">
                  <PenTool size={16} className="text-slate-400" />
                  最终评分
                </label>
                <input 
                  type="number" 
                  defaultValue={students.find(s => s.id === selectedStudent)?.score || students.find(s => s.id === selectedStudent)?.aiScore || 85}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xl font-black text-center text-slate-800 focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-3">
                  <MessageSquare size={16} className="text-slate-400" />
                  教师评语
                </label>
                <textarea 
                  rows={6}
                  placeholder="请输入对该学生的评语和指导建议..."
                  defaultValue="整体思路清晰，但在能量守恒的分析上不够严谨。请复习课本第45页关于焦耳热的计算，注意在非理想情况下的能量损耗。"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none leading-relaxed"
                ></textarea>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors">👍 棒极了</button>
                  <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors">📝 注意细节</button>
                  <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors">✨ AI 润色</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewWorkspace;