import React, { useState, useEffect } from 'react';
import { getUserInfo } from '../utils/storage';
import {
  getSystemConfig,
  SystemConfig,
  MenuItem,
  AIModuleConfig,
} from '../services/config';
import api from '../services/api';

import {
  LayoutDashboard,
  BookOpen,
  FileEdit,
  BarChart2,
  Settings,
  Search,
  Bell,
  Download,
  HelpCircle,
  ChevronDown,
  BrainCircuit,
  Plus,
  ArrowRight,
  Database,
  Cloud,
  FileText,
  ScanLine,
  Zap,
  Users,
} from 'lucide-react';
import { clsx } from 'clsx';

// 统计数据接口
interface DashboardStats {
  weeklyAssignments: { value: number; detail: string; color: string };
  pendingGrading: { value: number; detail: string; color: string };
  passRate: { value: string; detail: string; color: string };
  errorRate: { value: string; detail: string; color: string };
}

interface DashboardData {
  stats: DashboardStats;
  todos: {
    pendingAssignments: number;
    aiReports: number;
  };
}

import AIModule from '../components/AIModule';
import TeacherProfile from '../components/TeacherProfile';
import QuestionBank from '../components/QuestionBank';
import AssignmentManagement from '../components/AssignmentManagement';
import LearningAnalysis from '../components/LearningAnalysis';
import ReviewWorkspace from '../components/ReviewWorkspace';
import TeacherSettings from '../components/TeacherSettings';
import ClassManagement from '../components/ClassManagement';

// 图标映射表
const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  BookOpen,
  FileEdit,
  BarChart2,
  Settings,
};

const TeacherDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('homepage');
  const [mode, setMode] = useState<'management' | 'review'>('management');
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [menuItems, setMenuItems] = useState<
    Array<{ id: string; label: string; icon: React.ElementType }>
  >([]);
  const [aiModules, setAiModules] = useState<AIModuleConfig[]>([]);

  // 动态统计数据
  const [dashboardStats, setDashboardStats] = useState<DashboardData | null>(
    null
  );
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const userInfo = getUserInfo<{ name: string; email: string }>();
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  // 获取系统配置
  useEffect(() => {
    const loadConfig = async () => {
      const systemConfig = await getSystemConfig();
      setConfig(systemConfig);

      // 转换菜单数据
      if (systemConfig?.teacher?.menu) {
        const menus = systemConfig.teacher.menu.map((item: MenuItem) => ({
          id: item.id,
          label: item.label,
          icon: iconMap[item.icon || 'LayoutDashboard'] || LayoutDashboard,
        }));
        setMenuItems(menus);
      }

      // 设置AI模块
      if (systemConfig?.ai?.modules) {
        setAiModules(systemConfig.ai.modules);
      }
    };
    loadConfig();
  }, []);

  // 获取首页统计数据
  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const data: DashboardData = await api.get('/dashboard/stats');
        setDashboardStats(data);
      } catch (error) {
        console.error('加载首页统计数据失败:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    loadDashboardStats();
  }, []);

  // 准备统计数据
  const statsData = dashboardStats?.stats
    ? [
        {
          label: '本周作业',
          value: String(dashboardStats.stats.weeklyAssignments.value),
          detail: dashboardStats.stats.weeklyAssignments.detail,
          color: dashboardStats.stats.weeklyAssignments.color,
        },
        {
          label: '待阅卷',
          value: String(dashboardStats.stats.pendingGrading.value),
          detail: dashboardStats.stats.pendingGrading.detail,
          color: dashboardStats.stats.pendingGrading.color,
        },
        {
          label: '及格率',
          value: dashboardStats.stats.passRate.value,
          detail: dashboardStats.stats.passRate.detail,
          color: dashboardStats.stats.passRate.color,
        },
        {
          label: '错题频率',
          value: dashboardStats.stats.errorRate.value,
          detail: dashboardStats.stats.errorRate.detail,
          color: dashboardStats.stats.errorRate.color,
        },
      ]
    : [
        { label: '本周作业', value: '--', detail: '加载中', color: 'brand' },
        { label: '待阅卷', value: '--', detail: '加载中', color: 'amber' },
        { label: '及格率', value: '--', detail: '加载中', color: 'green' },
        { label: '错题频率', value: '--', detail: '加载中', color: 'indigo' },
      ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col z-30">
        <div className="p-6 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-light/20 rounded-2xl flex items-center justify-center text-brand-dark animate-float shadow-sm border border-brand-light/30">
            <span className="text-xl">{config?.system?.logo || '🦖'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-brand-dark tracking-tighter">
              {config?.system?.name || '阅小师'}
            </span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              {config?.teacher?.title || 'Teacher Pro'}
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group',
                activeTab === item.id
                  ? 'bg-brand text-white shadow-xl shadow-brand/20 scale-[1.02]'
                  : 'text-slate-400 hover:bg-brand-bg hover:text-brand-dark'
              )}
            >
              <item.icon
                size={20}
                className={clsx(
                  'transition-transform duration-300',
                  activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'
                )}
              />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-50">
          <div className="bg-brand-bg rounded-3xl p-5 border border-brand-light/20 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-brand-dark/40 mb-3 uppercase tracking-widest">
                待办概览
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    待批作业
                  </span>
                  <span className="px-2 py-0.5 bg-brand-dark text-white rounded-lg text-[10px] font-black">
                    {dashboardStats?.todos?.pendingAssignments ?? '--'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    AI报告
                  </span>
                  <span className="px-2 py-0.5 bg-brand-light text-brand-dark rounded-lg text-[10px] font-black">
                    {dashboardStats?.todos?.aiReports ?? '--'}
                  </span>
                </div>
              </div>
            </div>
            {/* Mascot background decoration */}
            <div className="absolute -bottom-4 -right-4 text-4xl opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-500 transform group-hover:rotate-12">
              🦖
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-50 flex items-center justify-between px-8 shrink-0 z-20 shadow-sm shadow-slate-100/50">
          <div className="flex items-center gap-8">
            {/* Mode Switcher - Matching screenshot style */}
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              <button
                onClick={() => setMode('management')}
                className={clsx(
                  'px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2',
                  mode === 'management'
                    ? 'bg-white text-brand-dark shadow-lg shadow-brand/10'
                    : 'text-slate-400 hover:text-slate-600'
                )}
              >
                管理模式
              </button>
              <button
                onClick={() => setMode('review')}
                className={clsx(
                  'px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2',
                  mode === 'review'
                    ? 'bg-white text-brand-dark shadow-lg shadow-brand/10'
                    : 'text-slate-400 hover:text-slate-600'
                )}
              >
                阅卷模式
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="搜索题目、学生或班级..."
                className="pl-12 pr-12 py-3 bg-slate-50 border-transparent rounded-2xl text-sm w-[400px] focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand-light/30 transition-all outline-none font-medium"
              />
              <HelpCircle
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand cursor-pointer transition-colors"
                size={18}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 mr-4">
              <button className="p-3 text-slate-400 hover:text-brand hover:bg-brand-bg rounded-2xl transition-all group">
                <Download
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </button>
              <button className="p-3 text-slate-400 hover:text-brand hover:bg-brand-bg rounded-2xl transition-all relative group">
                <Bell
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>
            </div>

            <div className="h-8 w-px bg-slate-100 mx-2"></div>

            <button
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-3 pl-3 pr-2 py-2 hover:bg-brand-bg rounded-2xl transition-all group border border-transparent hover:border-brand-light/20"
            >
              <div className="w-10 h-10 bg-brand-light/20 rounded-xl flex items-center justify-center text-brand-dark font-black text-base shadow-sm group-hover:bg-brand group-hover:text-white transition-all">
                {user?.name?.charAt(0) || '?'}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-black text-slate-700 leading-tight group-hover:text-brand transition-colors">
                  {user?.name || '未登录'}
                </p>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.1em] mt-1">
                  {user?.email || ''}
                </p>
              </div>
              <ChevronDown
                size={16}
                className="text-slate-300 group-hover:text-brand transition-colors"
              />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {mode === 'management' ? (
            <>
              {activeTab === 'homepage' && (
                <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsData.map((stat, i) => (
                      <div
                        key={i}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand/5 transition-all group"
                      >
                        <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest group-hover:text-brand transition-colors">
                          {stat.label}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-slate-800">
                            {stat.value}
                          </span>
                          <span
                            className={clsx(
                              'text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider',
                              stat.color === 'brand'
                                ? 'text-brand-dark bg-brand-light/20'
                                : stat.color === 'amber'
                                  ? 'text-amber-600 bg-amber-50'
                                  : stat.color === 'green'
                                    ? 'text-green-600 bg-green-50'
                                    : 'text-indigo-600 bg-indigo-50'
                            )}
                          >
                            {stat.detail}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Assistant Section */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-6 bg-brand rounded-full"></div>
                      <h2 className="text-xl font-black text-slate-800 tracking-tight">
                        AI 教学助手
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {aiModules.length > 0 ? (
                        aiModules.map((module) => (
                          <AIModule
                            key={module.type}
                            type={module.type}
                            title={module.title}
                            description={module.description}
                          />
                        ))
                      ) : (
                        <>
                          <AIModule
                            type="generation"
                            title="智能组卷"
                            description="基于章节、难度、题型自动生成"
                          />
                          <AIModule
                            type="correction"
                            title="专业批改"
                            description="OCR扫描与分步逻辑校验"
                          />
                          <AIModule
                            type="analysis"
                            title="学情分析"
                            description="班级薄弱知识点精准画像"
                          />
                        </>
                      )}
                    </div>
                  </section>

                  {/* Core Functional Modules */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                    {/* Physics Question Bank Intelligence Module */}
                    <div
                      onClick={() => setActiveTab('question-bank')}
                      className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden cursor-pointer group hover:border-brand-light/50 hover:shadow-2xl hover:shadow-brand/5 transition-all"
                    >
                      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-brand-light/20 text-brand-dark rounded-2xl group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                            <Database size={24} />
                          </div>
                          <h3 className="text-lg font-black text-slate-800 tracking-tight">
                            物理题库智能组卷模块
                          </h3>
                        </div>
                        <button className="text-brand text-sm font-bold flex items-center gap-1 hover:underline">
                          查看全部 <ArrowRight size={14} />
                        </button>
                      </div>
                      <div className="p-8 grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-[1.5rem] bg-slate-50 hover:bg-brand-bg transition-all group cursor-pointer border border-transparent hover:border-brand-light/20">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-brand mb-4 shadow-sm transition-colors">
                            <Search size={24} />
                          </div>
                          <p className="font-black text-slate-700 text-sm">
                            校本物理题库
                          </p>
                          <p className="text-xs text-slate-400 mt-1 font-medium">
                            涵盖力/电/光等章节
                          </p>
                        </div>
                        <div className="p-5 rounded-[1.5rem] bg-slate-50 hover:bg-brand-bg transition-all group cursor-pointer border border-transparent hover:border-brand-light/20">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-brand mb-4 shadow-sm transition-colors">
                            <Cloud size={24} />
                          </div>
                          <p className="font-black text-slate-700 text-sm">
                            云端题库
                          </p>
                          <p className="text-xs text-slate-400 mt-1 font-medium">
                            共享全国名校优质资源
                          </p>
                        </div>
                        <div className="col-span-2 p-6 rounded-[1.5rem] bg-gradient-to-r from-brand to-brand-dark text-white cursor-pointer hover:shadow-xl hover:shadow-brand/20 transition-all relative overflow-hidden">
                          <div className="flex items-center justify-between relative z-10">
                            <div>
                              <p className="text-lg font-black tracking-tight">
                                AI 智能组卷
                              </p>
                              <p className="text-xs text-brand-light/80 mt-1 font-bold">
                                按章节、难度、题型一键生成
                              </p>
                            </div>
                            <Zap size={32} className="text-brand-light/50" />
                          </div>
                          {/* Mascot decor */}
                          <div className="absolute top-0 right-0 p-2 text-6xl opacity-10 translate-x-4 -translate-y-4 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                            🦖
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Daily Assignment Module */}
                    <div
                      onClick={() => setActiveTab('assignment')}
                      className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden cursor-pointer group hover:border-brand-light/50 hover:shadow-2xl hover:shadow-brand/5 transition-all"
                    >
                      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-brand-light/20 text-brand-dark rounded-2xl group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                            <FileText size={24} />
                          </div>
                          <h3 className="text-lg font-black text-slate-800 tracking-tight">
                            日常物理作业模块
                          </h3>
                        </div>
                        <button className="px-6 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-brand transition-all shadow-lg shadow-brand/20">
                          <Plus size={16} /> 发布作业
                        </button>
                      </div>
                      <div className="p-8 space-y-4">
                        <div className="flex items-center gap-5 p-4 rounded-2xl hover:bg-brand-bg transition-all border border-transparent hover:border-brand-light/20 cursor-pointer group">
                          <div className="w-14 h-14 bg-brand-bg text-brand rounded-2xl flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                            <ScanLine size={28} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-black text-slate-700">
                              OCR 扫描批改
                            </p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                              支持纸质作业快速数字化与批改
                            </p>
                          </div>
                          <ArrowRight
                            size={20}
                            className="text-slate-200 group-hover:text-brand transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-5 p-4 rounded-2xl hover:bg-brand-bg transition-all border border-transparent hover:border-brand-light/20 cursor-pointer group">
                          <div className="w-14 h-14 bg-brand-bg text-brand rounded-2xl flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                            <BrainCircuit size={28} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-black text-slate-700">
                              AI 客观题自动批改
                            </p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                              选择、判断、填空即时出分
                            </p>
                          </div>
                          <ArrowRight
                            size={20}
                            className="text-slate-200 group-hover:text-brand transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'classes' && <ClassManagement />}
              {activeTab === 'question-bank' && <QuestionBank />}
              {activeTab === 'assignment' && <AssignmentManagement />}
              {activeTab === 'analysis' && <LearningAnalysis />}
              {activeTab === 'profile' && <TeacherProfile />}
              {activeTab === 'settings' && <TeacherSettings />}

              {activeTab !== 'homepage' &&
                ![
                  'classes',
                  'question-bank',
                  'assignment',
                  'analysis',
                  'profile',
                  'settings',
                ].includes(activeTab) && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 animate-in fade-in duration-300">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                      <Settings size={32} className="animate-spin-slow" />
                    </div>
                    <p className="font-medium">
                      {menuItems.find((i) => i.id === activeTab)?.label}{' '}
                      模块正在开发中...
                    </p>
                  </div>
                )}
            </>
          ) : (
            <ReviewWorkspace />
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
