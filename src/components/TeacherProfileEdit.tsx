import React from 'react';
import { User, Mail, Phone, Lock, Save, X } from 'lucide-react';

const TeacherProfileEdit: React.FC<{ onSave: () => void; onCancel: () => void; }> = ({ onSave, onCancel }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-8">编辑个人资料</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">姓名</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" defaultValue="王建国" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-brand/20 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="email" defaultValue="wangjianguo@university.edu.cn" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-brand/20 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">手机号码</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="tel" defaultValue="138****4567" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-brand/20 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">新密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="password" placeholder="留空则不修改" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-brand/20 outline-none" />
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="flex items-center gap-2 px-6 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all">
              <X size={16} /> 取消
            </button>
            <button type="button" onClick={onSave} className="flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-xl font-bold text-sm shadow-lg shadow-brand/20 hover:scale-105 transition-all">
              <Save size={16} /> 保存更改
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherProfileEdit;
