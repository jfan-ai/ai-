import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Save, X, BookOpen, GraduationCap } from 'lucide-react';
import { getUserInfo, setUserInfo } from '../utils/storage';
import { api } from '../services/api';

const StudentProfileEdit: React.FC<{
  onSave: () => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const [, setUser] = useState<{
    name: string;
    email: string;
    phone?: string;
    studentId?: string;
    major?: string;
    grade?: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    major: '',
    grade: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const userInfo = getUserInfo<{
      name: string;
      email: string;
      phone?: string;
      studentId?: string;
      major?: string;
      grade?: string;
    }>();
    if (userInfo) {
      setUser(userInfo);
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        studentId: userInfo.studentId || '',
        major: userInfo.major || '',
        grade: userInfo.grade || '',
        password: '',
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // 调用后端 API 更新个人资料
      await api.put<{ message: string; user: { id: string; email: string; name: string; avatar: string; phone: string; role: string } }>('/profile', {
        name: formData.name,
        phone: formData.phone || null,
        class_name: formData.grade,
        // email 通常不允许修改，或者需要单独验证
      });

      // 更新 localStorage 中的用户信息
      const userInfo = getUserInfo();
      if (userInfo) {
        const updatedUser = { 
          ...userInfo, 
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          studentId: formData.studentId,
          major: formData.major,
          grade: formData.grade,
        };
        setUserInfo(updatedUser);
      }
      
      onSave();
    } catch (err: any) {
      setError(err.message || '保存失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white rounded-[2.5rem] p-8 border border-emerald-100 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-8">
          编辑个人资料
        </h2>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold">
            {error}
          </div>
        )}
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                姓名
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="请输入姓名"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-emerald/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                邮箱
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="请输入邮箱"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-emerald/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                学号
              </label>
              <div className="relative">
                <GraduationCap
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="请输入学号"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-emerald/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                手机号码
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="请输入手机号码"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-emerald/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                专业
              </label>
              <div className="relative">
                <BookOpen
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="请输入专业"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-emerald/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                年级
              </label>
              <div className="relative">
                <GraduationCap
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  placeholder="请输入年级"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-emerald/20 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                新密码
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="留空则不修改"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:ring-2 focus:ring-emerald/20 outline-none"
                />
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 px-6 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all"
            >
              <X size={16} /> 取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald/20 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save size={16} /> 保存更改
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfileEdit;
