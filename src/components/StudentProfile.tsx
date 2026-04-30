import React, { useState, useEffect } from 'react';
import { getUserInfo } from '../utils/storage';
import { getSystemConfig, SystemConfig } from '../services/config';

import {
  Mail,
  Phone,
  Shield,
  Calendar,
  Award,
  TrendingUp,
  BookOpen,
  Lock,
} from 'lucide-react';

const StudentProfile: React.FC = () => {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    studentId?: string;
    major?: string;
    grade?: string;
  } | null>(null);
  const [config, setConfig] = useState<SystemConfig | null>(null);

  useEffect(() => {
    const userInfo = getUserInfo<{
      name: string;
      email: string;
      studentId?: string;
      major?: string;
      grade?: string;
    }>();
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  // 获取系统配置
  useEffect(() => {
    const loadConfig = async () => {
      const systemConfig = await getSystemConfig();
      setConfig(systemConfig);
    };
    loadConfig();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Profile Header */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-emerald-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 text-4xl font-black shadow-lg border-2 border-emerald-100">
            {user?.name?.charAt(0) || '?'}
          </div>
          <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
            Physics Student
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {user?.name || '未登录'}
          </h2>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">
            {user?.grade || ''}{' '}
            {user?.major || config?.student?.default_major || '应用物理学'}
          </p>

          <div className="flex items-center gap-4 mt-4 justify-center md:justify-start">
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
              Level 1
            </span>
            <span className="px-4 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100">
              0 积分
            </span>
          </div>
        </div>
        <button className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-200 hover:scale-105 transition-all">
          编辑资料
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Academic Stats & Learning Footprint */}
        <div className="md:col-span-2 space-y-6">
          {/* Academic Stats */}
          <div className="bg-white rounded-[2.5rem] border border-emerald-50 shadow-sm p-8 space-y-6">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-3">
              <TrendingUp size={20} className="text-emerald-600" />
              学习数据概览
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: '完成作业', value: '32', icon: BookOpen },
                { label: '正确率', value: '88%', icon: Award },
                { label: '学习天数', value: '45', icon: Calendar },
                { label: '积分排名', value: '#12', icon: TrendingUp },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 text-center group hover:bg-emerald-50 transition-all"
                >
                  <stat.icon
                    size={20}
                    className="mx-auto mb-2 text-emerald-400"
                  />
                  <p className="text-xl font-black text-slate-800">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Footprint */}
          <div className="bg-white rounded-[2.5rem] border border-emerald-50 shadow-sm p-8 space-y-6">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Calendar size={20} className="text-emerald-600" />
              学习足迹
            </h3>
            <div className="space-y-4">
              {[
                {
                  date: '2024-04-20',
                  event: '完成了《电磁感应》章节学习',
                  points: '+50',
                },
                {
                  date: '2024-04-19',
                  event: '连续学习达到 7 天',
                  points: '+100',
                },
                {
                  date: '2024-04-18',
                  event: '在“力学”专题获得满分',
                  points: '+80',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-100 transition-all"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                    <Award size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-700">
                      {item.event}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">
                      {item.date}
                    </p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    {item.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Security */}
          <div className="bg-white rounded-[2.5rem] border border-emerald-50 shadow-sm p-8 space-y-6">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Shield size={20} className="text-emerald-600" />
              账号安全
            </h3>
            <div className="space-y-3">
              {[
                { label: '登录密码', icon: Lock },
                { label: '绑定邮箱', icon: Mail },
                { label: '手机验证', icon: Phone },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-emerald-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className="text-slate-300" />
                    <span className="text-sm font-bold text-slate-600">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase">
                    修改
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Student ID */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
            <div className="absolute -bottom-4 -right-4 text-6xl opacity-10">
              🦖
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-4">
                数字学生证
              </p>
              <div className="space-y-4">
                <p className="text-2xl font-black tracking-tight">
                  {user?.name || '未登录'}
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-bold opacity-80">
                    {user?.grade || ''} {user?.major || '应用物理学'}
                  </p>
                  <p className="text-xs font-bold opacity-80">
                    学号：{user?.studentId || user?.email || '未设置'}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                  <Award size={16} className="text-emerald-200" />
                  <span className="text-xs font-bold text-emerald-100">
                    Physics Student Level 1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
