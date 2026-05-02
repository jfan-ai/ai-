import React, { useState, useEffect } from 'react';
import {
  Plus,
  Users,
  Trash2,
  Edit2,
  X,
  UserPlus,
  UserMinus,
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  getTeacherClasses,
  createClass,
  updateClass,
  deleteClass,
  getClassDetail,
  addStudentToClass,
  removeStudentFromClass,
  type Class,
  type ClassDetail,
} from '../services/classes';

const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [editClassName, setEditClassName] = useState('');
  const [editClassDesc, setEditClassDesc] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const data = await getTeacherClasses();
      setClasses(data.classes);
    } catch (err: any) {
      setError(err.message || '加载班级失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    try {
      setLoading(true);
      await createClass({ name: newClassName, description: newClassDesc });
      setSuccess('班级创建成功');
      setShowCreateModal(false);
      setNewClassName('');
      setNewClassDesc('');
      loadClasses();
    } catch (err: any) {
      setError(err.message || '创建班级失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !editClassName.trim()) return;

    try {
      setLoading(true);
      await updateClass(selectedClass.class.id, {
        name: editClassName,
        description: editClassDesc,
      });
      setSuccess('班级更新成功');
      setShowEditModal(false);
      loadClasses();
      if (selectedClass) {
        const detail = await getClassDetail(selectedClass.class.id);
        setSelectedClass(detail);
      }
    } catch (err: any) {
      setError(err.message || '更新班级失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('确定要删除这个班级吗？')) return;

    try {
      setLoading(true);
      await deleteClass(classId);
      setSuccess('班级删除成功');
      setSelectedClass(null);
      loadClasses();
    } catch (err: any) {
      setError(err.message || '删除班级失败');
    } finally {
      setLoading(false);
    }
  };

  const handleViewClass = async (classId: string) => {
    try {
      setLoading(true);
      const detail = await getClassDetail(classId);
      setSelectedClass(detail);
    } catch (err: any) {
      setError(err.message || '加载班级详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !studentEmail.trim()) return;

    try {
      setLoading(true);
      await addStudentToClass(selectedClass.class.id, studentEmail);
      setSuccess('学生添加成功');
      setStudentEmail('');
      setShowAddStudentModal(false);
      const detail = await getClassDetail(selectedClass.class.id);
      setSelectedClass(detail);
      loadClasses();
    } catch (err: any) {
      setError(err.message || '添加学生失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!selectedClass) return;
    if (!confirm('确定要移除这个学生吗？')) return;

    try {
      setLoading(true);
      await removeStudentFromClass(selectedClass.class.id, studentId);
      setSuccess('学生移除成功');
      const detail = await getClassDetail(selectedClass.class.id);
      setSelectedClass(detail);
      loadClasses();
    } catch (err: any) {
      setError(err.message || '移除学生失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800">班级管理</h2>
          <p className="text-slate-400 mt-1">创建和管理您的教学班级</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand/20"
        >
          <Plus size={20} />
          创建班级
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-600 text-sm font-medium">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Class List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
            我的班级 ({classes.length})
          </h3>
          {classes.length === 0 ? (
            <div className="p-8 bg-slate-50 rounded-3xl text-center">
              <p className="text-slate-400">还没有创建班级</p>
              <p className="text-sm text-slate-300 mt-2">
                点击上方按钮创建第一个班级
              </p>
            </div>
          ) : (
            classes.map((cls) => (
              <div
                key={cls.id}
                onClick={() => handleViewClass(cls.id)}
                className={clsx(
                  'p-5 rounded-2xl border-2 cursor-pointer transition-all',
                  selectedClass?.class.id === cls.id
                    ? 'bg-brand-bg border-brand'
                    : 'bg-white border-slate-100 hover:border-brand-light'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800">{cls.name}</h4>
                    <p className="text-sm text-slate-400 mt-1 line-clamp-1">
                      {cls.description || '暂无描述'}
                    </p>
                  </div>
                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                    <Users size={16} />
                    <span>{cls.studentCount || 0}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Class Detail */}
        <div className="lg:col-span-2">
          {selectedClass ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    {selectedClass.class.name}
                  </h3>
                  <p className="text-slate-400 mt-1">
                    {selectedClass.class.description || '暂无描述'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditClassName(selectedClass.class.name);
                      setEditClassDesc(selectedClass.class.description || '');
                      setShowEditModal(true);
                    }}
                    className="p-2 text-slate-400 hover:text-brand hover:bg-brand-bg rounded-xl transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClass(selectedClass.class.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Students List */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-700">
                    学生列表 ({selectedClass.students.length})
                  </h4>
                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-bg text-brand rounded-xl text-sm font-bold hover:bg-brand hover:text-white transition-all"
                  >
                    <UserPlus size={16} />
                    添加学生
                  </button>
                </div>

                {selectedClass.students.length === 0 ? (
                  <div className="p-8 bg-slate-50 rounded-2xl text-center">
                    <p className="text-slate-400">班级还没有学生</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedClass.students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-brand-light/20 rounded-xl flex items-center justify-center text-brand-dark font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-700">
                              {student.name}
                            </p>
                            <p className="text-sm text-slate-400">
                              {student.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveStudent(student.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <UserMinus size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-slate-50 rounded-3xl">
              <div className="text-center">
                <Users size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-400">选择一个班级查看详情</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-800">创建班级</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateClass}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    班级名称 *
                  </label>
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    placeholder="例如：2024级应用物理1班"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    班级描述
                  </label>
                  <textarea
                    value={newClassDesc}
                    onChange={(e) => setNewClassDesc(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none"
                    rows={3}
                    placeholder="可选：输入班级描述"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand-dark transition-all disabled:opacity-50"
                >
                  {loading ? '创建中...' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {showEditModal && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-800">编辑班级</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateClass}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    班级名称 *
                  </label>
                  <input
                    type="text"
                    value={editClassName}
                    onChange={(e) => setEditClassName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    班级描述
                  </label>
                  <textarea
                    value={editClassDesc}
                    onChange={(e) => setEditClassDesc(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand-dark transition-all disabled:opacity-50"
                >
                  {loading ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-800">添加学生</h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddStudent}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  学生邮箱 *
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  placeholder="输入学生注册邮箱"
                  required
                />
                <p className="text-xs text-slate-400 mt-2">
                  学生需要先注册账号才能被添加到班级
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand-dark transition-all disabled:opacity-50"
                >
                  {loading ? '添加中...' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;
