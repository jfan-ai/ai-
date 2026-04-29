import React, { useState } from 'react';
import { 
  FileEdit, 
  Plus, 
  MoreVertical, 
  Calendar, 
  Users, 
  ClipboardCheck, 
  ChevronRight,
  Clock,
  LayoutGrid,
  List,
  Search,
  Zap,
  Filter,
  Save,
  Send
} from 'lucide-react';
import { clsx } from 'clsx';
import Modal from './Modal';

const AssignmentManagement: React.FC = () => {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const assignments = [
    { id: 1, title: '《电磁感应》综合课后习题', class: '应用物理24-1班', status: '进行中', submissions: 28, total: 45, deadline: '2024-04-25 23:59', type: 'AI批改' },
    { id: 2, title: '大学物理（上）期中模拟测试', class: '应用物理24-2班', status: '待批改', submissions: 42, total: 42, deadline: '已结束', type: '人工+AI' },
    { id: 3, title: '质点运动学基本概念练习', class: '材料工程24-1班', status: '已完成', submissions: 38, total: 38, deadline: '已结束', type: 'AI批改' },
    { id: 4, title: '狭义相对论初探', class: '应用物理24-1班', status: '草稿', submissions: 0, total: 45, deadline: '未发布', type: 'AI批改' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-emerald-50 rounded-2xl text-emerald-600">
              <FileEdit size={28} />
            </div>
            物理作业布置管理
          </h1>
          <p className="text-slate-400 font-bold mt-2 text-sm uppercase tracking-wider">Physics Assignment Management</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPublishModalOpen(true)}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 hover:shadow-2xl hover:scale-105 transition-all"
          >
            <Plus size={18} />
            发布新作业
          </button>
          <button className="p-3 bg-white text-slate-300 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
            <LayoutGrid size={22} />
          </button>
          <button className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl hover:bg-emerald-100 transition-all shadow-sm">
            <List size={22} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: '进行中作业', value: '12', unit: '个', icon: ClipboardCheck, color: 'blue' },
          { label: '待批改作业', value: '45', unit: '人次', icon: Zap, color: 'orange' },
          { label: '覆盖学生总数', value: '128', unit: '人', icon: Users, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
            <div className={clsx(
              "w-16 h-16 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110",
              stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
              stat.color === 'orange' ? "bg-orange-50 text-orange-600" :
              "bg-emerald-50 text-emerald-600"
            )}>
              <stat.icon size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800 tracking-tighter">
                {stat.value} <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{stat.unit}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 relative group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="搜索作业名称、班级..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all outline-none font-medium"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
            <Filter size={16} /> 筛选
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
            按时间排序
          </button>
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-6">
        {assignments.map((a) => (
          <div key={a.id} className="group bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all cursor-pointer">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <span className={clsx(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]",
                    a.status === '进行中' ? "bg-blue-50 text-blue-600" :
                    a.status === '待批改' ? "bg-orange-50 text-orange-600" :
                    a.status === '已完成' ? "bg-emerald-50 text-emerald-600" :
                    "bg-slate-50 text-slate-400"
                  )}>{a.status}</span>
                  <span className="px-3 py-1 bg-slate-50 text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">{a.type}</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors mb-6 tracking-tight leading-tight">{a.title}</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">班级</p>
                    <p className="text-sm font-black text-slate-700 flex items-center gap-2">
                      <Users size={16} className="text-slate-200" />
                      {a.class}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">截止日期</p>
                    <p className="text-sm font-black text-slate-700 flex items-center gap-2">
                      <Calendar size={16} className="text-slate-200" />
                      {a.deadline}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">提交进度</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden">
                        <div 
                          className={clsx(
                            "h-full rounded-full transition-all duration-1000",
                            a.status === '进行中' ? "bg-blue-500" : "bg-emerald-500"
                          )} 
                          style={{ width: `${(a.submissions/a.total)*100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-black text-slate-800">{a.submissions}/{a.total}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">最后更新</p>
                    <p className="text-sm font-black text-slate-700 flex items-center gap-2">
                      <Clock size={16} className="text-slate-200" />
                      2小时前
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className={clsx(
                  "px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-emerald-200/50 hover:shadow-xl",
                  a.status === '待批改' ? "bg-emerald-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                )}>
                  {a.status === '待批改' ? '开始批改' : '查看详情'}
                </button>
                <button className="p-3 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all">
                  <MoreVertical size={24} />
                </button>
                <div className="ml-4 p-4 bg-slate-50 text-slate-300 rounded-3xl group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-emerald-300/30">
                  <ChevronRight size={28} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Assignment Modal */}
      <Modal isOpen={isPublishModalOpen} onClose={() => setIsPublishModalOpen(false)} title="发布新作业" maxWidth="max-w-3xl">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">作业名称</label>
              <input type="text" placeholder="例如：《电磁感应》课后作业" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">发布班级</label>
              <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none">
                <option>应用物理24-1班</option>
                <option>光电工程24-2班</option>
                <option>材料科学24-1班</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">截止日期</label>
              <input type="datetime-local" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">选题方式</label>
              <div className="flex gap-4">
                <label className="flex-1 flex items-center justify-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl cursor-pointer">
                  <input type="radio" name="select_method" defaultChecked className="text-emerald-600 focus:ring-emerald-500" />
                  <span className="font-bold text-sm">从题库选题</span>
                </label>
                <label className="flex-1 flex items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl cursor-pointer hover:bg-slate-100">
                  <input type="radio" name="select_method" className="text-emerald-600 focus:ring-emerald-500" />
                  <span className="font-bold text-sm">AI 智能组卷</span>
                </label>
                <label className="flex-1 flex items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl cursor-pointer hover:bg-slate-100">
                  <input type="radio" name="select_method" className="text-emerald-600 focus:ring-emerald-500" />
                  <span className="font-bold text-sm">手动上传</span>
                </label>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">批改模式</label>
              <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none">
                <option>AI 智能批改（推荐）</option>
                <option>人工批改</option>
                <option>AI初筛 + 人工复核</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button onClick={() => setIsPublishModalOpen(false)} className="px-6 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all">取消</button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all">
              <Save size={16} /> 保存草稿
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 hover:scale-105 transition-all">
              <Send size={16} /> 确认发布
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssignmentManagement;
