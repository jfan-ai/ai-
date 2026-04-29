import React from 'react';
import { Bell, Shield, Key } from 'lucide-react';
import { clsx } from 'clsx';

const TeacherSettings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-8">系统设置</h2>
        <div className="space-y-6">
          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Bell size={20} className="text-brand" />
              通知偏好
            </h3>
            {[
              { label: '作业提交提醒', enabled: true },
              { label: '批改完成通知', enabled: true },
              { label: '系统公告', enabled: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-bold text-slate-600">{item.label}</span>
                <button className={clsx(
                  "w-12 h-6 rounded-full transition-all relative",
                  item.enabled ? "bg-brand" : "bg-slate-200"
                )}>
                  <div className={clsx(
                    "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                    item.enabled ? "right-1" : "left-1"
                  )}></div>
                </button>
              </div>
            ))}
          </div>

          {/* Security Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Shield size={20} className="text-brand" />
              安全设置
            </h3>
            {[
              { title: '两步验证', desc: '未开启', icon: Key, danger: true },
              { title: '登录设备管理', desc: '当前有 2 台设备登录', icon: Shield },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-brand-light/50 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm group-hover:text-brand transition-all">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-700">{item.title}</p>
                    <p className={clsx(
                      "text-[10px] font-bold mt-0.5",
                      item.danger ? "text-red-500" : "text-slate-400"
                    )}>{item.desc}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-brand transition-all">修改 →</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSettings;
