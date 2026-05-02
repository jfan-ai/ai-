import React, { useState, useEffect } from 'react';
import {
  BookMarked,
  BrainCircuit,
  ChevronRight,
  Zap,
  Clock,
  PlayCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { clsx } from 'clsx';
import { getStudentWeakPoints } from '../services/analytics';
import { getUserInfo } from '../utils/storage';

// 薄弱知识点类型
interface WeakTopic {
  id: string;
  title: string;
  errorCount: number;
  mastery: number;
}

// AI诊断结果类型
interface AIDiagnosis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
}

// 复习任务类型
interface ReviewTask {
  id: number;
  title: string;
  duration: string;
  description: string;
}

const StudentReviewMode: React.FC = () => {
  // 当前选中的知识点ID
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  // 薄弱知识点列表
  const [topics, setTopics] = useState<WeakTopic[]>([]);
  // AI诊断结果
  const [aiDiagnosis, setAiDiagnosis] = useState<AIDiagnosis | null>(null);
  // 复习任务列表
  const [reviewTasks, setReviewTasks] = useState<ReviewTask[]>([]);
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 错误信息
  const [error, setError] = useState('');

  // 从用户信息获取学生ID
  const [studentId, setStudentId] = useState<string>('');
  
  useEffect(() => {
    const userInfo = getUserInfo<{ id: string }>();
    if (userInfo?.id) {
      setStudentId(userInfo.id);
    }
  }, []);

  /**
   * 获取学生薄弱知识点数据
   * 组件加载时调用
   */
  useEffect(() => {
    const loadWeakPoints = async () => {
      try {
        setLoading(true);
        const response = await getStudentWeakPoints(studentId);

        // 设置薄弱知识点列表
        const topicList = response.topics || [];
        setTopics(topicList);

        // 默认选中第一个知识点
        if (topicList.length > 0) {
          setSelectedTopicId(topicList[0].id);
        }

        // 设置AI诊断结果
        if (response.aiDiagnosis) {
          setAiDiagnosis(response.aiDiagnosis);
        }

        // 设置复习任务
        setReviewTasks(response.reviewTasks || []);
      } catch (err: any) {
        setError(err.message || '加载薄弱知识点失败');
      } finally {
        setLoading(false);
      }
    };

    loadWeakPoints();
  }, [studentId]);

  // 获取当前选中的知识点
  const selectedTopic = topics.find((t) => t.id === selectedTopicId);

  // 显示加载状态
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-emerald-600 animate-spin" />
          <p className="text-sm text-slate-400">AI正在分析您的学习数据...</p>
        </div>
      </div>
    );
  }

  // 显示错误信息
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  // 如果没有薄弱知识点数据
  if (topics.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <BookMarked size={48} className="text-emerald-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">太棒了！暂无薄弱知识点</p>
          <p className="text-sm text-slate-400 mt-2">
            继续保持，定期复习巩固知识
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6 animate-in fade-in duration-500">
      {/* Left List - 薄弱知识点列表 */}
      <div className="w-80 bg-white rounded-[2rem] border border-emerald-100 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="p-6 border-b border-emerald-50 bg-emerald-50/30">
          <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
            <BookMarked className="text-emerald-600" size={20} />
            薄弱知识点突破
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            基于您的错题记录和作业数据生成
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id)}
              className={clsx(
                'w-full text-left p-4 rounded-2xl transition-all border group',
                selectedTopicId === topic.id
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-200'
                  : 'bg-white text-slate-700 border-emerald-50 hover:border-emerald-200 hover:bg-emerald-50/50'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm">{topic.title}</span>
                <span
                  className={clsx(
                    'text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider',
                    selectedTopicId === topic.id
                      ? 'bg-white/20 text-white'
                      : 'bg-orange-50 text-orange-600'
                  )}
                >
                  {topic.errorCount}道错题
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span
                    className={clsx(
                      selectedTopicId === topic.id
                        ? 'text-emerald-100'
                        : 'text-slate-400'
                    )}
                  >
                    掌握度
                  </span>
                  <span
                    className={clsx(
                      selectedTopicId === topic.id
                        ? 'text-white'
                        : 'text-slate-700'
                    )}
                  >
                    {topic.mastery}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      'h-full rounded-full transition-all duration-1000',
                      selectedTopicId === topic.id
                        ? 'bg-white'
                        : 'bg-emerald-500'
                    )}
                    style={{ width: `${topic.mastery}%` }}
                  ></div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Review Area - 复习区域 */}
      <div className="flex-1 bg-white rounded-[2rem] border border-emerald-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-8 border-b border-emerald-50 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
              {selectedTopic?.title || '请选择知识点'} - 专项复习
            </h3>
            <p className="text-sm font-medium text-slate-500">
              AI
              已为您生成个性化复习路径，包含知识点讲解、易错点剖析和针对性练习。
            </p>
          </div>
          <button className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 hover:shadow-2xl hover:scale-105 transition-all">
            <PlayCircle size={18} /> 开始专属复习
          </button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto bg-emerald-50/20 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* AI Summary - AI学情诊断 */}
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <BrainCircuit size={20} />
                </div>
                <h4 className="font-bold text-slate-800">AI 学情诊断</h4>
              </div>

              {aiDiagnosis ? (
                <>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {aiDiagnosis.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {/* 优势标签 */}
                    {aiDiagnosis.strengths.map((strength, index) => (
                      <span
                        key={`strength-${index}`}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100"
                      >
                        {strength} ✅
                      </span>
                    ))}
                    {/* 薄弱点标签 */}
                    {aiDiagnosis.weaknesses.map((weakness, index) => (
                      <span
                        key={`weakness-${index}`}
                        className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-lg border border-orange-100"
                      >
                        {weakness} ⚠️
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-400">
                  暂无AI诊断数据，请完成更多练习以获取个性化分析。
                </p>
              )}
            </div>

            {/* Review Steps - 推荐复习任务 */}
            <div className="space-y-4">
              <h4 className="font-black text-slate-800 flex items-center gap-2">
                <Zap size={18} className="text-emerald-500" /> 推荐复习任务
              </h4>

              {reviewTasks.length > 0 ? (
                reviewTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={clsx(
                          'w-10 h-10 rounded-xl flex items-center justify-center font-black',
                          index === 0
                            ? 'bg-blue-50 text-blue-600'
                            : index === 1
                              ? 'bg-orange-50 text-orange-600'
                              : 'bg-purple-50 text-purple-600'
                        )}
                      >
                        {task.id}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{task.title}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {task.description}
                          {task.duration && (
                            <span className="flex items-center gap-1 mt-1">
                              <Clock size={12} /> 约 {task.duration}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                ))
              ) : (
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 text-center text-slate-400">
                  暂无推荐任务
                </div>
              )}
            </div>

            {/* 当前知识点统计 */}
            {selectedTopic && (
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white">
                <h4 className="font-bold mb-4">当前知识点统计</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-2xl font-black">{selectedTopic.errorCount}</p>
                    <p className="text-xs text-emerald-100">相关错题数</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-2xl font-black">{selectedTopic.mastery}%</p>
                    <p className="text-xs text-emerald-100">当前掌握度</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReviewMode;
