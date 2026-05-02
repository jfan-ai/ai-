import React, { useState, useEffect } from 'react';
import { getUserInfo } from '../utils/storage';
import { getSystemConfig, SystemConfig, MenuItem } from '../services/config';
import { getStudentAssignments } from '../services/assignments';

import {
  Home,
  PenTool,
  BookMarked,
  PieChart,
  BrainCircuit,
  Calculator,
  ClipboardCheck,
  History as HistoryIcon,
  Search,
  Bell,
  ChevronRight,
  User,
  Zap,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings,
  Loader2,
} from 'lucide-react';
import { clsx } from 'clsx';

import StudentProfile from '../components/StudentProfile';
import StudentHomework from '../components/StudentHomework';
import ErrorBook from '../components/ErrorBook';
import GrowthReport from '../components/GrowthReport';
import StudentReviewMode from '../components/StudentReviewMode';

// 图标映射表
const iconMap: Record<string, React.ElementType> = {
  Home,
  PenTool,
  BookMarked,
  PieChart,
  Settings,
};

// 待办事项类型
interface TodoItem {
  id: string;
  title: string;
  deadline: string;
  type: 'assignment' | 'error' | 'report';
}

// 最近作业类型
interface RecentAssignment {
  id: string;
  title: string;
  score: number;
  submitTime: string;
  status: string;
}

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [mode, setMode] = useState<'normal' | 'review'>('normal');
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [menuItems, setMenuItems] = useState<
    Array<{ id: string; label: string; icon: React.ElementType }>
  >([]);
  
  // 待办事项数据（从API获取）
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  // 最近作业数据（从API获取）
  const [recentAssignments, setRecentAssignments] = useState<RecentAssignment[]>([]);
  // 加载状态
  const [loading, setLoading] = useState(true);

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
      if (systemConfig?.student?.menu) {
        const menus = systemConfig.student.menu.map((item: MenuItem) => ({
          id: item.id,
          label: item.label,
          icon: iconMap[item.icon || 'Home'] || Home,
        }));
        setMenuItems(menus);
      }
    };
    loadConfig();
  }, []);

  /**
   * 获取学生作业数据
   * 包括待办事项和最近完成的作业
   */
  useEffect(() => {
    const loadAssignments = async () => {
      try {
        setLoading(true);
        const response = await getStudentAssignments();
        const assignments = response.assignments || [];

        // 转换为待办事项（未完成的作业）
        const todos: TodoItem[] = assignments
          .filter((a: any) => a.status === 'pending' || a.status === 'in_progress')
          .map((a: any) => ({
            id: a.id,
            title: a.title,
            deadline: a.deadline || '未设置',
            type: 'assignment' as const,
          }));
        setTodoItems(todos);

        // 转换为最近完成的作业
        const recent: RecentAssignment[] = assignments
          .filter((a: any) => a.status === 'completed' || a.status === 'graded')
          .slice(0, 5)
          .map((a: any) => ({
            id: a.id,
            title: a.title,
            score: a.score || 0,
            submitTime: a.submittedAt || a.createdAt,
            status: a.status,
          }));
        setRecentAssignments(recent);
      } catch (error) {
        console.error('加载作业数据失败:', error);
        // API失败时显示空状态，不显示假数据
        setTodoItems([]);
        setRecentAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, []);

  return (
    <div className="flex h-screen bg-emerald-50/30 text-slate-900 overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-emerald-100 flex flex-col z-30">
        <div className="p-6 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 animate-float shadow-sm border border-emerald-100">
            <span className="text-xl">{config?.system?.logo || '🦖'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-800 tracking-tighter">
              {config?.system?.name || '阅小师'}
            </span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              {config?.student?.title || 'Student Pro'}
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
                  ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200 scale-[1.02]'
                  : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-700'
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

        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl p-5 text-white shadow-lg shadow-emerald-200 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={18} className="text-emerald-200" />
                <span className="text-xs font-black uppercase tracking-wider">
                  学习进度
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                <div className="bg-white h-2 rounded-full w-[65%] transition-all duration-1000"></div>
              </div>
              <p className="text-[10px] font-bold text-emerald-100">
                本周已完成 12 个任务
              </p>
            </div>
            {/* Mascot background decoration */}
            <div className="absolute -bottom-4 -right-4 text-4xl opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-500 transform group-hover:-rotate-12">
              🦖
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-emerald-50/20">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-emerald-50 flex items-center justify-between px-8 shrink-0 z-20 shadow-sm shadow-emerald-500/5">
          <div className="flex items-center gap-10">
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-4 group cursor-pointer text-left"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border-2 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                <User size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-700 group-hover:text-emerald-600 transition-colors">
                  {user?.name || '未登录'}
                </p>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.1em] mt-1">
                  {user?.email || ''}
                </p>
              </div>
            </button>

            <div className="h-8 w-px bg-slate-100"></div>

            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              <button
                onClick={() => setMode('normal')}
                className={clsx(
                  'px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                  mode === 'normal'
                    ? 'bg-white text-emerald-700 shadow-lg shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-emerald-600'
                )}
              >
                普通模式
              </button>
              <button
                onClick={() => setMode('review')}
                className={clsx(
                  'px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                  mode === 'review'
                    ? 'bg-white text-emerald-700 shadow-lg shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-emerald-600'
                )}
              >
                复习模式
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="搜索课程、作业、公式..."
                className="pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl text-sm w-64 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all outline-none font-medium"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-3 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 shadow-sm group">
                <Calculator
                  size={18}
                  className="group-hover:rotate-12 transition-transform"
                />
                公式库
              </button>

              <button className="p-3 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all relative group">
                <Bell
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="absolute top-3 right-3 w-2 h-2 bg-orange-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Workspace */}
          <main className="flex-1 overflow-y-auto p-8">
            {mode === 'normal' ? (
              <>
                {activeTab === 'home' && (
                  <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                    {/* AI Features */}
                    <section>
                      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <BrainCircuit className="text-emerald-600" size={20} />
                        AI 智能学习工具
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          onClick={() => setActiveTab('homework')}
                          className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                              <PenTool size={24} />
                            </div>
                            <ChevronRight
                              size={20}
                              className="text-slate-300 group-hover:text-blue-600 transition-all"
                            />
                          </div>
                          <h3 className="font-bold text-slate-800 mb-1">
                            AI 题目分步解析
                          </h3>
                          <p className="text-xs text-slate-400">
                            公式推理、解题思路、易错点精准点评
                          </p>
                        </div>
                        <div
                          onClick={() => setActiveTab('errors')}
                          className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-all">
                              <HistoryIcon size={24} />
                            </div>
                            <ChevronRight
                              size={20}
                              className="text-slate-300 group-hover:text-purple-600 transition-all"
                            />
                          </div>
                          <h3 className="font-bold text-slate-800 mb-1">
                            AI 公式补全与纠错
                          </h3>
                          <p className="text-xs text-slate-400">
                            大学物理公式智能索引与书写规范校验
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Recent Activity - 最近完成的作业 */}
                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-800">
                          最近完成的作业
                        </h2>
                        <button
                          onClick={() => setActiveTab('homework')}
                          className="text-sm text-emerald-600 font-medium hover:underline"
                        >
                          查看全部
                        </button>
                      </div>
                      
                      {loading ? (
                        // 加载状态
                        <div className="flex items-center justify-center py-8">
                          <Loader2 size={24} className="text-emerald-600 animate-spin" />
                        </div>
                      ) : recentAssignments.length > 0 ? (
                        // 显示最近作业列表
                        <div className="space-y-4">
                          {recentAssignments.map((assignment) => (
                            <div
                              key={assignment.id}
                              className="p-5 bg-white rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-emerald-200 transition-all shadow-sm cursor-pointer"
                              onClick={() => setActiveTab('homework')}
                            >
                              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold">
                                {assignment.score}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-700 text-sm">
                                  {assignment.title}
                                </h4>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                  <Clock size={12} /> 提交于 {new Date(assignment.submitTime).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={clsx(
                                  'px-3 py-1 rounded-full text-xs font-bold',
                                  assignment.status === 'graded'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-blue-50 text-blue-600'
                                )}>
                                  {assignment.status === 'graded' ? '已批改' : '已完成'}
                                </span>
                                <ChevronRight
                                  size={18}
                                  className="text-slate-300"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        // 空状态
                        <div className="text-center py-8 text-slate-400">
                          <p>暂无最近完成的作业</p>
                          <p className="text-xs mt-1">快去完成作业吧！</p>
                        </div>
                      )}
                    </section>
                  </div>
                )}

                {activeTab === 'homework' && <StudentHomework />}
                {activeTab === 'errors' && <ErrorBook />}
                {activeTab === 'report' && <GrowthReport />}
                {activeTab === 'profile' && <StudentProfile />}

                {activeTab !== 'home' &&
                  !['homework', 'errors', 'report', 'profile'].includes(
                    activeTab
                  ) && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 animate-in fade-in duration-300">
                      <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600">
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
              <StudentReviewMode />
            )}
          </main>

          {/* Right Sidebar - Todos */}
          <aside className="w-80 bg-white border-l border-emerald-50 p-6 overflow-y-auto">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ClipboardCheck className="text-emerald-600" size={20} />
              待办事项
            </h3>
            <div className="space-y-4">
              {todoItems.map((todo) => (
                <div
                  key={todo.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={clsx(
                        'p-2 rounded-lg',
                        todo.type === 'assignment'
                          ? 'bg-blue-100 text-blue-600'
                          : todo.type === 'error'
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-emerald-100 text-emerald-600'
                      )}
                    >
                      {todo.type === 'assignment' ? (
                        <PenTool size={16} />
                      ) : todo.type === 'error' ? (
                        <BookMarked size={16} />
                      ) : (
                        <PieChart size={16} />
                      )}
                    </div>
                    {todo.deadline === '已完成' ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : (
                      <AlertCircle size={16} className="text-orange-500" />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-700 text-sm mb-1 group-hover:text-emerald-600 transition-colors">
                    {todo.title}
                  </h4>
                  <p className="text-xs text-slate-400">
                    截止日期: {todo.deadline}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Star className="text-amber-500" size={20} />
                AI 个性化补习建议
              </h3>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-xs text-amber-800 leading-relaxed">
                  基于你最近在“狭义相对论”章节的错误表现，建议复习以下内容：
                </p>
                <ul className="mt-2 space-y-1">
                  <li className="text-xs text-amber-700 flex items-center gap-1">
                    <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                    洛伦兹变换的推导过程
                  </li>
                  <li className="text-xs text-amber-700 flex items-center gap-1">
                    <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                    长度收缩效应的计算
                  </li>
                </ul>
                <button className="w-full mt-4 py-2 bg-white text-amber-600 text-xs font-bold rounded-xl border border-amber-200 hover:bg-amber-100 transition-all">
                  立即开始补习
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
