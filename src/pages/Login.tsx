import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, GraduationCap } from 'lucide-react';
import { clsx } from 'clsx';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'teacher') {
      navigate('/teacher');
    } else {
      navigate('/student');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-brand-bg text-slate-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-light/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand/10 rounded-full blur-[100px] animate-pulse"></div>

      {/* Header */}
      <div className="text-center mb-10 z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-xl border border-brand-light/30 flex items-center justify-center overflow-hidden animate-float">
            {/* Logo Placeholder - In real project, use <img src="/logo.png" /> */}
            <div className="text-4xl">🦖</div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-brand-dark text-white text-[10px] px-2 py-1 rounded-lg font-bold shadow-lg">
            v1.0
          </div>
        </div>
        <h1 className="text-4xl font-black text-brand-dark mb-2 tracking-tight">阅小师</h1>
        <p className="text-slate-500 font-medium">大学物理智能AI批改系统 · 精准高效答疑解惑</p>
      </div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-4xl shadow-2xl p-10 border border-white z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Login/Register Switch */}
        <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-10 border border-slate-100">
          <button
            className={clsx(
              "flex-1 py-2.5 font-bold text-sm transition-all rounded-xl",
              isLogin ? "bg-white text-brand-dark shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
            onClick={() => setIsLogin(true)}
          >
            登录
          </button>
          <button
            className={clsx(
              "flex-1 py-2.5 font-bold text-sm transition-all rounded-xl",
              !isLogin ? "bg-white text-brand-dark shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
            onClick={() => setIsLogin(false)}
          >
            注册
          </button>
        </div>

        {/* Role Switch */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={() => setRole('teacher')}
            className={clsx(
              "flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all group",
              role === 'teacher'
                ? "bg-brand/5 border-brand text-brand-dark shadow-lg shadow-brand/10"
                : "bg-white border-slate-100 text-slate-400 hover:border-brand-light/50 hover:bg-slate-50"
            )}
          >
            <div className={clsx(
              "p-2 rounded-xl transition-colors",
              role === 'teacher' ? "bg-brand text-white" : "bg-slate-50 text-slate-400 group-hover:bg-brand-light/20"
            )}>
              <User size={20} />
            </div>
            <span className="text-sm font-bold">教师端</span>
          </button>
          <button
            onClick={() => setRole('student')}
            className={clsx(
              "flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all group",
              role === 'student'
                ? "bg-primary-student/5 border-primary-student text-primary-student shadow-lg shadow-primary-student/10"
                : "bg-white border-slate-100 text-slate-400 hover:border-primary-student/50 hover:bg-slate-50"
            )}
          >
            <div className={clsx(
              "p-2 rounded-xl transition-colors",
              role === 'student' ? "bg-primary-student text-white" : "bg-slate-50 text-slate-400 group-hover:bg-primary-student/20"
            )}>
              <GraduationCap size={20} />
            </div>
            <span className="text-sm font-bold">学生端</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">邮箱/账号</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand/5 focus:bg-white focus:border-brand/30 transition-all font-medium"
                placeholder="请输入您的邮箱或账号"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">密码</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand/5 focus:bg-white focus:border-brand/30 transition-all font-medium"
                placeholder="请输入密码"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Helpers */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-500 cursor-pointer font-medium">
              <input type="checkbox" className="w-4 h-4 rounded-lg border-slate-200 text-brand focus:ring-brand/20 transition-all" />
              记住账号
            </label>
            <button type="button" className="text-brand font-bold hover:underline">忘记密码？</button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={clsx(
              "w-full py-4 rounded-2xl font-black text-white shadow-2xl transition-all transform active:scale-[0.98] hover:scale-[1.02]",
              role === 'teacher' ? "bg-brand hover:bg-brand-dark shadow-brand/30" : "bg-primary-student hover:bg-emerald-600 shadow-primary-student/30"
            )}
          >
            {isLogin ? '立即登录' : '立即注册'}
          </button>
        </form>

        {/* Bottom Link */}
        <div className="mt-10 text-center text-sm text-slate-400 font-medium">
          {isLogin ? (
            <p>还没有账号？ <button onClick={() => setIsLogin(false)} className="text-brand font-black hover:underline ml-1">快速加入</button></p>
          ) : (
            <p>已有账号？ <button onClick={() => setIsLogin(true)} className="text-brand font-black hover:underline ml-1">返回登录</button></p>
          )}
        </div>
      </div>

      {/* Footer Text */}
      <div className="mt-12 text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em] z-10">
        © 2026 Physics AI Grading System · 阅小师
      </div>
    </div>
  );
};

export default Login;
