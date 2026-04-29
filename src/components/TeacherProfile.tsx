import React, { useState } from 'react';
import TeacherProfileEdit from './TeacherProfileEdit';
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Shield,
  Key,
  Calendar,
  BookOpen
} from 'lucide-react';
import { clsx } from 'clsx';

const TeacherProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return <TeacherProfileEdit onSave={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Profile Header */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex items-center gap-8">
        <div className="w-24 h-24 bg-brand-light/20 rounded-3xl flex items-center justify-center text-brand-dark text-4xl font-black shadow-lg border border-brand-light/30">
          王
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">王建国</h2>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">物理学院 · 副教授</p>
          <div className="flex items-center gap-4 mt-4">
            <span className="px-4 py-1.5 bg-brand text-white text-[10px] font-black uppercase tracking-widest rounded-full">已认证</span>
            <span className="px-4 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-100">阅卷系统管理员</span>
          </div>
        </div>
        <button onClick={() => setIsEditing(true)} className="px-8 py-3 bg-brand text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand/20 hover:scale-105 transition-all">
          编辑资料
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Account Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-3">
              <User size={20} className="text-brand" />
              账号信息
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: '绑定邮箱', value: 'wangjianguo@university.edu.cn', icon: Mail },
                { label: '手机号码', value: '138****4567', icon: Phone },
                { label: '入职时间', value: '2018-09-01', icon: Calendar },
                { label: '教授科目', value: '大学物理（上/下）', icon: BookOpen },
              ].map((item, i) => (
                <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-brand-light/50 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon size={14} className="text-slate-300" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.label}</span>
                  </div>
                  <p className="text-sm font-black text-slate-700">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Shield size={20} className="text-brand" />
              安全设置
            </h3>
            <div className="space-y-4">
              {[
                { title: '登录密码', desc: '上次修改于 30 天前', icon: Lock },
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

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notification Settings */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Bell size={20} className="text-brand" />
              通知偏好
            </h3>
            <div className="space-y-4">
              {[
                { label: '作业提交提醒', enabled: true },
                { label: '批改完成通知', enabled: true },
                { label: '系统公告', enabled: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
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
          </div>

          {/* Teacher ID Card */}
          <div className="bg-gradient-to-br from-brand to-brand-dark rounded-[2.5rem] p-8 text-white shadow-xl shadow-brand/20 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-4">教职工身份卡</p>
              <div className="space-y-4">
                <p className="text-2xl font-black tracking-tight">王建国</p>
                <div className="space-y-2">
                  <p className="text-xs font-bold opacity-80">物理学院 · 副教授</p>
                  <p className="text-xs font-bold opacity-80">工号：T-2018-0965</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 text-6xl opacity-10">🦖</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
