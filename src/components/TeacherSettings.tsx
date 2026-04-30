import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

const TeacherSettings: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 清除登录信息
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // 跳转到登录页面
    navigate('/login');
  };

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

          {/* Logout Button */}
          <div className="pt-6 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 p-5 bg-red-50 rounded-2xl border border-red-100 text-red-600 hover:bg-red-100 transition-all group"
            >
              <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-black">退出登录</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSettings;
