import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  BrainCircuit,
  Download,
  Loader2,
} from 'lucide-react';
import { clsx } from 'clsx';
import { getTeacherClasses, Class as ClassType } from '../services/classes';
import api from '../services/api';

// 分析数据接口
interface ClassStats {
  averageScore: number;
  passRate: number;
  maxScore: number;
  weakPoints: number;
}

interface KnowledgePoint {
  name: string;
  mastery: number;
  status: 'success' | 'normal' | 'warning' | 'danger';
  trend: 'up' | 'down';
}

interface AIInsight {
  type: 'warning' | 'success' | 'info';
  title: string;
  content: string;
}

interface ClassActivity {
  day: string;
  count: number;
}

const LearningAnalysis: React.FC = () => {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // 动态数据状态
  const [stats, setStats] = useState([
    {
      label: '平均分',
      value: '--',
      icon: Target,
      color: 'indigo',
      trend: '--',
    },
    {
      label: '及格率',
      value: '--',
      icon: CheckCircle2,
      color: 'green',
      trend: '--',
    },
    {
      label: '最高分',
      value: '--',
      icon: TrendingUp,
      color: 'blue',
      trend: '--',
    },
    {
      label: '薄弱环节',
      value: '--',
      icon: AlertTriangle,
      color: 'orange',
      trend: '--',
    },
  ]);

  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [classActivity, setClassActivity] = useState<ClassActivity[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadAnalysisData(selectedClass);
    }
  }, [selectedClass]);

  const loadClasses = async () => {
    try {
      const response = await getTeacherClasses();
      const classList = response.classes || [];
      setClasses(classList);
      if (classList.length > 0) {
        setSelectedClass(classList[0].name);
      }
    } catch (error) {
      console.error('加载班级失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalysisData = async (className: string) => {
    setDataLoading(true);
    try {
      // 并行加载所有分析数据
      const [statsRes, knowledgeRes, insightsRes, activityRes] =
        await Promise.all([
          api.get(`/analytics/class/${encodeURIComponent(className)}`),
          api.get(
            `/analytics/knowledge-mastery?class_name=${encodeURIComponent(className)}`
          ),
          api.get(
            `/analytics/ai-insight?class_name=${encodeURIComponent(className)}`
          ),
          api.get('/analytics/class-activity'),
        ]);

      const statsData = statsRes.data as any;
      const knowledgeData = knowledgeRes.data as any;
      const insightsData = insightsRes.data as any;
      const activityData = activityRes.data as any;

      // 更新统计数据
      if (statsData?.stats) {
        setStats([
          {
            label: '平均分',
            value: String(statsData.stats.averageScore || 0),
            icon: Target,
            color: 'indigo',
            trend: '+0.0',
          },
          {
            label: '及格率',
            value: `${statsData.stats.passRate || 0}%`,
            icon: CheckCircle2,
            color: 'green',
            trend: '+0.0',
          },
          {
            label: '最高分',
            value: '100',
            icon: TrendingUp,
            color: 'blue',
            trend: '持平',
          },
          {
            label: '薄弱环节',
            value: String(
              statsData.submissions?.filter((s: any) => parseFloat(s.score) < 60)
                .length || 0
            ),
            icon: AlertTriangle,
            color: 'orange',
            trend: '-0',
          },
        ]);
      }

      // 更新知识点掌握度
      if (knowledgeData?.knowledgeMastery) {
        setKnowledgePoints(
          knowledgeData.knowledgeMastery.map((k: any) => ({
            name: k.chapter,
            mastery: Math.round(parseFloat(k.mastery) || 0),
            status: k.status,
            trend: parseFloat(k.mastery) > 60 ? 'up' : 'down',
          }))
        );
      }

      // 更新AI洞察
      if (insightsData?.insights) {
        setAiInsights(insightsData.insights);
      }

      // 更新班级活跃度
      if (activityData?.classActivity) {
        setClassActivity(activityData.classActivity);
      }
    } catch (error) {
      console.error('加载分析数据失败:', error);
      // 如果API失败，显示空状态
      setKnowledgePoints([]);
      setAiInsights([]);
      setClassActivity([]);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-indigo-50 rounded-2xl text-indigo-600">
              <BarChart2 size={28} />
            </div>
            班级学习情况分析
          </h1>
          <p className="text-slate-400 font-bold mt-2 text-sm uppercase tracking-wider">
            Classroom Learning Intelligence Analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-8 py-3 bg-white text-slate-700 border border-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} />
            导出分析报告
          </button>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest outline-none shadow-xl shadow-indigo-200 cursor-pointer appearance-none border-none"
          >
            {classes.length === 0 && <option>暂无班级</option>}
            {classes.map((cls) => (
              <option key={cls.id} value={cls.name}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm group hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div
                className={clsx(
                  'p-4 rounded-3xl transition-transform group-hover:scale-110 shadow-sm',
                  stat.color === 'indigo'
                    ? 'bg-indigo-50 text-indigo-600'
                    : stat.color === 'green'
                      ? 'bg-green-50 text-green-600'
                      : stat.color === 'blue'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-orange-50 text-orange-600'
                )}
              >
                <stat.icon size={24} />
              </div>
              <span
                className={clsx(
                  'text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider',
                  stat.trend.startsWith('+')
                    ? 'bg-green-50 text-green-600'
                    : stat.trend.startsWith('-')
                      ? 'bg-red-50 text-red-600'
                      : 'bg-slate-50 text-slate-400'
                )}
              >
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">
              {stat.label}
            </p>
            <p className="text-3xl font-black text-slate-800 tracking-tighter">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Knowledge Point Mastery */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-black text-slate-800 flex items-center gap-3 tracking-tight">
              <PieChart size={20} className="text-indigo-600" />
              知识点掌握分布
            </h3>
            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
              查看详情
            </button>
          </div>
          <div className="p-8 space-y-8">
            {knowledgePoints.length > 0 ? (
              knowledgePoints.map((point, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-slate-700">
                      {point.name}
                    </span>
                    <div className="flex items-center gap-4">
                      <span
                        className={clsx(
                          'text-xs font-black',
                          point.status === 'success'
                            ? 'text-green-600'
                            : point.status === 'warning'
                              ? 'text-orange-600'
                              : point.status === 'danger'
                                ? 'text-red-600'
                                : 'text-slate-600'
                        )}
                      >
                        {point.mastery}%
                      </span>
                      {point.trend === 'up' ? (
                        <ArrowUpRight size={16} className="text-green-500" />
                      ) : (
                        <ArrowDownRight size={16} className="text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        'h-full rounded-full transition-all duration-1000 shadow-sm',
                        point.status === 'success'
                          ? 'bg-green-500'
                          : point.status === 'warning'
                            ? 'bg-orange-500'
                            : point.status === 'danger'
                              ? 'bg-red-500'
                              : 'bg-indigo-500'
                      )}
                      style={{ width: `${point.mastery}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PieChart size={32} className="text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">暂无知识点掌握数据</p>
                <p className="text-slate-400 text-sm mt-1">
                  请等待学生提交作业后查看分析
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <BrainCircuit size={28} className="text-indigo-200" />
                <h3 className="text-lg font-black tracking-tight">
                  AI 教学洞察
                </h3>
              </div>
              <div className="space-y-6">
                {aiInsights.length > 0 ? (
                  aiInsights.map((insight, index) => (
                    <div
                      key={index}
                      className={clsx(
                        'rounded-2xl p-5 backdrop-blur-md border transition-all',
                        insight.type === 'warning'
                          ? 'bg-orange-500/20 border-orange-400/30'
                          : insight.type === 'success'
                            ? 'bg-green-500/20 border-green-400/30'
                            : 'bg-white/10 border-white/10'
                      )}
                    >
                      <p
                        className={clsx(
                          'text-[10px] font-black mb-2 uppercase tracking-[0.2em]',
                          insight.type === 'warning'
                            ? 'text-orange-200'
                            : insight.type === 'success'
                              ? 'text-green-200'
                              : 'text-indigo-100'
                        )}
                      >
                        {insight.title}
                      </p>
                      <p className="text-sm leading-relaxed font-medium">
                        {insight.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-md border border-white/10">
                    <p className="text-sm leading-relaxed font-medium text-indigo-100">
                      暂无分析数据，请等待学生提交作业后查看AI洞察。
                    </p>
                  </div>
                )}
              </div>
              <button className="w-full mt-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg">
                生成完整分析简报
              </button>
            </div>
            {/* Mascot decor */}
            <div className="absolute top-0 right-0 p-4 text-7xl opacity-10 translate-x-6 -translate-y-6 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              🦖
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm p-8 group hover:shadow-xl transition-all">
            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-3 tracking-tight">
              <Users size={18} className="text-slate-300" />
              班级活跃度
            </h3>
            <div className="flex items-end justify-between h-32 gap-2 px-2">
              {classActivity.length > 0 ? (
                classActivity.map((activity, i) => {
                  const maxCount = Math.max(
                    ...classActivity.map((a) => a.count),
                    1
                  );
                  const height =
                    maxCount > 0 ? (activity.count / maxCount) * 100 : 0;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-indigo-50 rounded-t-xl relative group/bar"
                    >
                      <div
                        className="absolute bottom-0 left-0 w-full bg-indigo-500 rounded-t-xl transition-all duration-1000 group-hover/bar:bg-indigo-600 shadow-sm"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity">
                          {activity.count}次
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full text-center text-slate-400 text-sm py-8">
                  暂无活跃度数据
                </div>
              )}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-black text-slate-300 px-1 uppercase tracking-[0.2em]">
              <span>周日</span>
              <span>周六</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningAnalysis;
