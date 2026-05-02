/**
 * ============================================
 * 作业管理组件
 * ============================================
 * 功能：
 * 1. 展示作业列表（支持筛选、搜索、排序）
 * 2. 发布新作业
 * 3. 保存作业草稿
 * 4. 查看作业详情和提交进度
 * 5. 开始批改作业
 * 
 * 数据流向：
 * 组件加载 -> 调用assignmentApi.getAssignments() -> 后端返回数据 -> 渲染列表
 */

import React, { useState, useEffect } from 'react';
import {
  FileEdit,
  Plus,
  MoreVertical,
  Calendar,
  Users,
  ClipboardCheck,
  ChevronRight,
  Clock,
  Search,
  Zap,
  Filter,
  Save,
  ChevronDown,
  X,
  Loader2,
} from 'lucide-react';
import { clsx } from 'clsx';
import Modal from './Modal';
import {
  getAssignments,
  getAssignmentStats,
  createAssignment,
  saveAssignmentDraft,
} from '../services/assignments';
import { getTeacherClasses } from '../services/classes';
import type { Assignment, GradingType } from '../types';
import type { Class } from '../services/classes';

const AssignmentManagement: React.FC = () => {
  // ============================================
  // 状态管理
  // ============================================
  
  // 模态框状态
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  
  // 统计数据
  const [stats, setStats] = useState({
    activeAssignments: 0,
    pendingGrading: 0,
    totalStudents: 0,
  });
  
  // 加载状态
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  
  // 作业列表
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  
  // 筛选和搜索
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<'time' | 'status'>('time');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // 班级列表（用于发布作业时选择）
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  
  // 发布作业表单
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    selectedClass: '',
    deadline: '',
    selectMethod: 'bank' as 'bank' | 'ai' | 'manual',
    gradingMode: 'AI' as GradingType,
    selectedQuestions: [] as Array<{ id: string; content: string; type: string; difficulty: string }>,
  });

  // ============================================
  // 数据获取
  // ============================================
  
  /**
   * 加载统计数据
   */
  const loadStats = async () => {
    try {
      const data = await getAssignmentStats();
      setStats(data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  /**
   * 加载作业列表
   */
  const loadAssignments = async () => {
    setLoading(true);
    try {
      const data = await getAssignments({
        status: selectedStatus || undefined,
      });
      setAssignments(data.assignments);
    } catch (error) {
      console.error('获取作业列表失败:', error);
      alert('获取作业列表失败，请检查后端服务');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 加载班级列表
   */
  const loadClasses = async () => {
    setIsLoadingClasses(true);
    try {
      const data = await getTeacherClasses();
      setClasses(data.classes);
      if (data.classes.length > 0 && !assignmentForm.selectedClass) {
        setAssignmentForm(prev => ({ ...prev, selectedClass: data.classes[0].id }));
      }
    } catch (error) {
      console.error('获取班级列表失败:', error);
    } finally {
      setIsLoadingClasses(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    loadStats();
    loadAssignments();
  }, []);

  // 筛选条件变化时重新加载
  useEffect(() => {
    loadAssignments();
  }, [selectedStatus]);

  // 打开发布模态框时加载班级列表
  useEffect(() => {
    if (isPublishModalOpen) {
      loadClasses();
    }
  }, [isPublishModalOpen]);

  // ============================================
  // 筛选和排序逻辑（前端处理）
  // ============================================
  const filteredAssignments = assignments
    .filter((a) => {
      const matchesSearch =
        searchQuery === '' ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.className.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'time') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      return 0;
    });

  // ============================================
  // 辅助函数
  // ============================================
  
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      active: '进行中',
      submitted: '待批改',
      graded: '已完成',
      draft: '草稿',
      finished: '已结束',
    };
    return statusMap[status] || status;
  };

  const getGradingTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      AI: 'AI批改',
      '人工': '人工批改',
      'AI+人工': '人工+AI',
    };
    return typeMap[type] || type;
  };

  const formatDeadline = (deadline: string) => {
    if (!deadline) return '未设置';
    const date = new Date(deadline);
    if (isNaN(date.getTime())) return deadline;
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLastUpdate = (createdAt?: string) => {
    if (!createdAt) return '未知';
    const created = new Date(createdAt);
    const now = new Date();
    const diff = now.getTime() - created.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  };

  // 生成日期选项
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 0, 0);
    options.push({ label: '明天 23:59', value: tomorrow.toISOString() });
    
    const threeDays = new Date(today);
    threeDays.setDate(threeDays.getDate() + 3);
    threeDays.setHours(23, 59, 0, 0);
    options.push({ label: '3天后 23:59', value: threeDays.toISOString() });
    
    const oneWeek = new Date(today);
    oneWeek.setDate(oneWeek.getDate() + 7);
    oneWeek.setHours(23, 59, 0, 0);
    options.push({ label: '一周后 23:59', value: oneWeek.toISOString() });
    
    const twoWeeks = new Date(today);
    twoWeeks.setDate(twoWeeks.getDate() + 14);
    twoWeeks.setHours(23, 59, 0, 0);
    options.push({ label: '两周后 23:59', value: twoWeeks.toISOString() });
    
    return options;
  };

  const dateOptions = generateDateOptions();

  // ============================================
  // 事件处理
  // ============================================
  
  /**
   * 处理发布作业
   */
  const handlePublish = async () => {
    if (!assignmentForm.title.trim()) {
      alert('请输入作业名称');
      return;
    }
    if (!assignmentForm.selectedClass) {
      alert('请选择发布班级');
      return;
    }
    if (!assignmentForm.deadline) {
      alert('请选择截止日期');
      return;
    }

    setIsPublishing(true);
    try {
      await createAssignment({
        title: assignmentForm.title,
        className: classes.find(c => c.id === assignmentForm.selectedClass)?.name || '',
        deadline: assignmentForm.deadline,
        gradingType: assignmentForm.gradingMode,
        questionIds: assignmentForm.selectedQuestions.map(q => q.id),
      });
      
      alert('作业发布成功！');
      setIsPublishModalOpen(false);
      resetForm();
      loadAssignments();
      loadStats();
    } catch (error) {
      console.error('发布作业失败:', error);
      alert('发布作业失败，请检查后端服务');
    } finally {
      setIsPublishing(false);
    }
  };

  /**
   * 处理保存草稿
   */
  const handleSaveDraft = async () => {
    if (!assignmentForm.title.trim()) {
      alert('请输入作业名称');
      return;
    }

    setIsSavingDraft(true);
    try {
      await saveAssignmentDraft({
        title: assignmentForm.title,
        className: assignmentForm.selectedClass 
          ? classes.find(c => c.id === assignmentForm.selectedClass)?.name 
          : undefined,
        deadline: assignmentForm.deadline || undefined,
        gradingType: assignmentForm.gradingMode,
        questionIds: assignmentForm.selectedQuestions.map(q => q.id),
      });
      
      alert('草稿保存成功！');
      setIsPublishModalOpen(false);
      resetForm();
      loadAssignments();
    } catch (error) {
      console.error('保存草稿失败:', error);
      alert('保存草稿失败，请检查后端服务');
    } finally {
      setIsSavingDraft(false);
    }
  };

  /**
   * 重置表单
   */
  const resetForm = () => {
    setAssignmentForm({
      title: '',
      selectedClass: '',
      deadline: '',
      selectMethod: 'bank',
      gradingMode: 'AI',
      selectedQuestions: [],
    });
  };

  /**
   * 添加题目
   */
  const handleAddQuestion = () => {
    const newQuestion = {
      id: `temp-${Date.now()}`,
      content: '',
      type: 'subjective',
      difficulty: 'medium',
    };
    setAssignmentForm(prev => ({
      ...prev,
      selectedQuestions: [...prev.selectedQuestions, newQuestion],
    }));
  };

  /**
   * 更新题目
   */
  const handleUpdateQuestion = (id: string, content: string) => {
    setAssignmentForm(prev => ({
      ...prev,
      selectedQuestions: prev.selectedQuestions.map(q =>
        q.id === id ? { ...q, content } : q
      ),
    }));
  };

  /**
   * 删除题目
   */
  const handleRemoveQuestion = (id: string) => {
    setAssignmentForm(prev => ({
      ...prev,
      selectedQuestions: prev.selectedQuestions.filter(q => q.id !== id),
    }));
  };

  // ============================================
  // 渲染
  // ============================================
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
          <p className="text-slate-400 font-bold mt-2 text-sm uppercase tracking-wider">
            Physics Assignment Management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 hover:shadow-2xl hover:scale-105 transition-all"
          >
            <Plus size={18} />
            发布新作业
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: '进行中作业',
            value: loading ? '-' : stats.activeAssignments,
            unit: '个',
            icon: ClipboardCheck,
            color: 'blue',
          },
          {
            label: '待批改作业',
            value: loading ? '-' : stats.pendingGrading,
            unit: '人次',
            icon: Zap,
            color: 'orange',
          },
          {
            label: '覆盖学生总数',
            value: loading ? '-' : stats.totalStudents,
            unit: '人',
            icon: Users,
            color: 'emerald',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all"
          >
            <div
              className={clsx(
                'w-16 h-16 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110',
                stat.color === 'blue'
                  ? 'bg-blue-50 text-blue-600'
                  : stat.color === 'orange'
                    ? 'bg-orange-50 text-orange-600'
                    : 'bg-emerald-50 text-emerald-600'
              )}
            >
              <stat.icon size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-slate-800 tracking-tighter">
                {stat.value}{' '}
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  {stat.unit}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 relative group w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="搜索作业名称、班级..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all outline-none font-medium"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* 筛选下拉 */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={clsx(
                'flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border',
                selectedStatus
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : 'bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100 hover:border-slate-200'
              )}
            >
              <Filter size={16} />
              {selectedStatus ? getStatusLabel(selectedStatus) : '筛选'}
              <ChevronDown size={14} />
            </button>
            {showFilterDropdown && (
              <div className="absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 min-w-[140px] z-10">
                <button
                  onClick={() => {
                    setSelectedStatus('');
                    setShowFilterDropdown(false);
                  }}
                  className={clsx(
                    'w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                    selectedStatus === ''
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  全部状态
                </button>
                {[
                  { value: 'active', label: '进行中' },
                  { value: 'submitted', label: '待批改' },
                  { value: 'graded', label: '已完成' },
                  { value: 'draft', label: '草稿' },
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() => {
                      setSelectedStatus(status.value);
                      setShowFilterDropdown(false);
                    }}
                    className={clsx(
                      'w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                      selectedStatus === status.value
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 排序按钮 */}
          <button
            onClick={() => setSortBy(sortBy === 'time' ? 'status' : 'time')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
          >
            {sortBy === 'time' ? '按时间排序' : '按状态排序'}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="text-emerald-600 animate-spin" />
          <span className="ml-3 text-slate-400">加载中...</span>
        </div>
      )}

      {/* Assignment List */}
      {!loading && (
        <div className="space-y-6">
          {filteredAssignments.length === 0 ? (
            <div className="bg-white p-12 rounded-[2.5rem] border border-slate-50 text-center">
              <p className="text-slate-400 font-medium">暂无作业数据</p>
            </div>
          ) : (
            filteredAssignments.map((a) => (
              <div
                key={a.id}
                className="group bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span
                        className={clsx(
                          'px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]',
                          a.status === 'active'
                            ? 'bg-blue-50 text-blue-600'
                            : a.status === 'finished'
                              ? 'bg-orange-50 text-orange-600'
                              : a.status === 'graded'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-slate-50 text-slate-400'
                        )}
                      >
                        {getStatusLabel(a.status)}
                      </span>
                      <span className="px-3 py-1 bg-slate-50 text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">
                        {getGradingTypeLabel(a.gradingType)}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors mb-6 tracking-tight leading-tight">
                      {a.title}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div className="space-y-2">
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
                          班级
                        </p>
                        <p className="text-sm font-black text-slate-700 flex items-center gap-2">
                          <Users size={16} className="text-slate-200" />
                          {a.className}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
                          截止日期
                        </p>
                        <p className="text-sm font-black text-slate-700 flex items-center gap-2">
                          <Calendar size={16} className="text-slate-200" />
                          {formatDeadline(a.deadline)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
                          提交进度
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden">
                            <div
                              className={clsx(
                                'h-full rounded-full transition-all duration-1000',
                                a.status === 'active' ? 'bg-blue-500' : 'bg-emerald-500'
                              )}
                              style={{
                                width: `${a.submissionsCount ? Math.min((a.submissionsCount / 50) * 100, 100) : 0}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs font-black text-slate-800">
                            {a.submissionsCount || 0}/50
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
                          最后更新
                        </p>
                        <p className="text-sm font-black text-slate-700 flex items-center gap-2">
                          <Clock size={16} className="text-slate-200" />
                          {getLastUpdate(a.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => alert(`查看作业 ${a.id} 的详情`)}
                      className={clsx(
                        'px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-emerald-200/50 hover:shadow-xl',
                        a.status === 'finished'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      )}
                    >
                      {a.status === 'finished' ? '开始批改' : '查看详情'}
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
            ))
          )}
        </div>
      )}

      {/* Publish Assignment Modal */}
      <Modal
        isOpen={isPublishModalOpen}
        onClose={() => !isPublishing && !isSavingDraft && setIsPublishModalOpen(false)}
        title="发布新作业"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-6">
            {/* 作业名称 */}
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                作业名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="例如：《电磁感应》课后作业"
                value={assignmentForm.title}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>
            
            {/* 发布班级 */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                发布班级 <span className="text-red-500">*</span>
              </label>
              <select
                value={assignmentForm.selectedClass}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, selectedClass: e.target.value }))}
                disabled={isLoadingClasses}
                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none disabled:opacity-50"
              >
                {isLoadingClasses ? (
                  <option>加载中...</option>
                ) : classes.length === 0 ? (
                  <option>暂无班级</option>
                ) : (
                  classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            {/* 截止日期 */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                截止日期 <span className="text-red-500">*</span>
              </label>
              <select
                value={assignmentForm.deadline}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="">请选择截止日期</option>
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* 选题方式 */}
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                选题方式
              </label>
              <div className="flex gap-4">
                {[
                  { value: 'bank', label: '从题库选题' },
                  { value: 'ai', label: 'AI 智能组卷' },
                  { value: 'manual', label: '手动上传' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={clsx(
                      'flex-1 flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-all',
                      assignmentForm.selectMethod === method.value
                        ? 'bg-emerald-50 border-2 border-emerald-200 text-emerald-700'
                        : 'bg-slate-50 border-2 border-slate-100 text-slate-500 hover:bg-slate-100'
                    )}
                  >
                    <input
                      type="radio"
                      name="select_method"
                      value={method.value}
                      checked={assignmentForm.selectMethod === method.value}
                      onChange={(e) => setAssignmentForm(prev => ({ 
                        ...prev, 
                        selectMethod: e.target.value as typeof assignmentForm.selectMethod 
                      }))}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-sm">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* 批改模式 */}
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                批改模式
              </label>
              <select
                value={assignmentForm.gradingMode}
                onChange={(e) => setAssignmentForm(prev => ({ 
                  ...prev, 
                  gradingMode: e.target.value as GradingType 
                }))}
                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="AI">AI 智能批改（推荐）</option>
                <option value="人工">人工批改</option>
                <option value="AI+人工">AI初筛 + 人工复核</option>
              </select>
            </div>
          </div>

          {/* 题目列表区域 */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-slate-700">
                作业题目
              </label>
              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all"
              >
                <Plus size={14} />
                添加题目
              </button>
            </div>
            
            {assignmentForm.selectedQuestions.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                <p className="text-slate-400 text-sm">暂无题目，点击上方按钮添加</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignmentForm.selectedQuestions.map((question, index) => (
                  <div key={question.id} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <textarea
                          placeholder="请输入题目内容..."
                          value={question.content}
                          onChange={(e) => handleUpdateQuestion(question.id, e.target.value)}
                          className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
                          rows={2}
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveQuestion(question.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 底部按钮 */}
          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button
              onClick={() => setIsPublishModalOpen(false)}
              disabled={isPublishing || isSavingDraft}
              className="px-6 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
            >
              取消
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={isPublishing || isSavingDraft}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              {isSavingDraft ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save size={16} /> 保存草稿
                </>
              )}
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing || isSavingDraft}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 hover:scale-105 transition-all disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  发布中...
                </>
              ) : (
                <>
                  <Plus size={16} /> 立即发布
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssignmentManagement;
                     