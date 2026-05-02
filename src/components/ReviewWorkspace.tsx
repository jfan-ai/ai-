import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Search,
  BrainCircuit,
  Save,
  PenTool,
  Image as ImageIcon,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  getPendingGradingList,
  getStudentSubmissionDetail,
  gradeStudentSubmission,
  rejectSubmission,
} from '../services/assignments';

// 学生作业状态类型
interface StudentSubmission {
  id: string;
  name: string;
  status: '待批改' | '已批改';
  aiScore?: number;
  score?: number;
  submitTime: string;
}

// AI分析结果类型
interface AIAnalysis {
  score: number;
  feedback: string;
  correctPoints: string[];
  errorPoints: string[];
}

interface ReviewWorkspaceProps {
  assignmentId?: string;
}

const ReviewWorkspace: React.FC<ReviewWorkspaceProps> = ({ assignmentId: propAssignmentId }) => {
  // 当前选中的学生ID
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  // 学生列表
  const [students, setStudents] = useState<StudentSubmission[]>([]);
  // 加载状态
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // 错误信息
  const [error, setError] = useState('');
  // 搜索关键词
  const [searchQuery, setSearchQuery] = useState('');
  // AI分析结果
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  // 教师评分
  const [teacherScore, setTeacherScore] = useState<number>(0);
  // 教师评语
  const [teacherComments, setTeacherComments] = useState('');

  // 从props或URL参数获取作业ID
  const [assignmentId, setAssignmentId] = useState<string>('');
  
  useEffect(() => {
    // 优先使用props传入的assignmentId
    if (propAssignmentId) {
      setAssignmentId(propAssignmentId);
    } else {
      // 从URL参数获取
      const params = new URLSearchParams(window.location.search);
      const idFromUrl = params.get('assignmentId');
      if (idFromUrl) {
        setAssignmentId(idFromUrl);
      }
    }
  }, [propAssignmentId]);

  /**
   * 获取待批改学生列表
   * 组件加载时调用
   */
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const response = await getPendingGradingList(assignmentId);
        // 从API响应中获取学生列表
        const studentList = response.students || [];
        setStudents(studentList);
        // 默认选中第一个学生
        if (studentList.length > 0 && !selectedStudentId) {
          setSelectedStudentId(studentList[0].id);
        }
      } catch (err: any) {
        setError(err.message || '加载学生列表失败');
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [assignmentId]);

  /**
   * 当选中学生变化时，获取该学生的作业详情
   */
  useEffect(() => {
    const loadStudentDetail = async () => {
      if (!selectedStudentId) return;

      try {
        setLoading(true);
        const response = await getStudentSubmissionDetail(
          assignmentId,
          selectedStudentId
        );

        // 设置AI分析结果
        if (response.aiAnalysis) {
          setAiAnalysis(response.aiAnalysis);
          // 默认使用AI评分作为教师评分
          setTeacherScore(response.aiAnalysis.score);
        }

        // 设置教师评语（如果有）
        setTeacherComments('');
      } catch (err: any) {
        setError(err.message || '加载学生作业详情失败');
      } finally {
        setLoading(false);
      }
    };

    loadStudentDetail();
  }, [selectedStudentId, assignmentId]);

  // 获取当前选中的学生信息
  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // 过滤后的学生列表（根据搜索关键词）
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * 处理打回重做
   * 调用API将作业状态改为需要重做
   */
  const handleReject = async () => {
    if (!selectedStudent) return;

    const reason = prompt('请输入打回原因：');
    if (!reason) return;

    try {
      setSubmitting(true);
      await rejectSubmission(assignmentId, selectedStudent.id, reason);
      alert(`已将 ${selectedStudent.name} 的作业打回重做`);
      // 刷新列表
      const response = await getPendingGradingList(assignmentId);
      setStudents(response.students || []);
    } catch (err: any) {
      setError(err.message || '打回作业失败');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 处理完成批改
   * 提交教师评分和评语
   */
  const handleComplete = async () => {
    if (!selectedStudent) return;

    try {
      setSubmitting(true);
      await gradeStudentSubmission(assignmentId, selectedStudent.id, {
        score: teacherScore,
        feedback: aiAnalysis?.feedback || '',
        teacherComments: teacherComments,
      });

      alert(`已完成 ${selectedStudent.name} 的作业批改`);

      // 更新本地状态
      setStudents(
        students.map((s) =>
          s.id === selectedStudentId
            ? { ...s, status: '已批改', score: teacherScore }
            : s
        )
      );
    } catch (err: any) {
      setError(err.message || '批改作业失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 显示加载状态
  if (loading && students.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-brand animate-spin" />
          <p className="text-sm text-slate-400">加载中...</p>
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
            className="mt-4 px-4 py-2 bg-brand text-white rounded-lg text-sm"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6 animate-in fade-in duration-500">
      {/* Left List - 学生列表 */}
      <div className="w-80 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-lg font-black text-slate-800 tracking-tight mb-4">
            《电磁感应》课后作业
          </h2>
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="搜索学生姓名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand-light/30 transition-all outline-none font-medium"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {filteredStudents.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudentId(student.id)}
              className={clsx(
                'w-full text-left p-4 rounded-2xl transition-all border',
                selectedStudentId === student.id
                  ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20'
                  : 'bg-white text-slate-700 border-slate-50 hover:border-brand-light/30 hover:bg-brand-bg'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-base">{student.name}</span>
                <span
                  className={clsx(
                    'text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider',
                    student.status === '待批改'
                      ? selectedStudentId === student.id
                        ? 'bg-white/20 text-white'
                        : 'bg-orange-50 text-orange-600'
                      : selectedStudentId === student.id
                        ? 'bg-white/20 text-white'
                        : 'bg-green-50 text-green-600'
                  )}
                >
                  {student.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span
                  className={clsx(
                    selectedStudentId === student.id
                      ? 'text-brand-light'
                      : 'text-slate-400'
                  )}
                >
                  提交: {student.submitTime}
                </span>
                <span className="font-bold">
                  {student.status === '待批改'
                    ? `AI预估: ${student.aiScore}分`
                    : `得分: ${student.score}分`}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Review Area - 批改区域 */}
      <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="h-16 border-b border-slate-50 flex items-center justify-between px-8 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-light/20 text-brand-dark rounded-xl flex items-center justify-center font-black">
              {selectedStudent?.name?.[0] || '?'}
            </div>
            <div>
              <h3 className="font-black text-slate-800">
                {selectedStudent?.name || '请选择学生'} 的作业
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                学号: {selectedStudent?.id || '--'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              disabled={submitting || selectedStudent?.status === '已批改'}
              className="flex items-center gap-2 px-5 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
            >
              <AlertCircle size={16} /> 打回重做
            </button>
            <button
              onClick={handleComplete}
              disabled={submitting || selectedStudent?.status === '已批改'}
              className="flex items-center gap-2 px-6 py-2 bg-brand text-white rounded-xl font-bold text-sm shadow-lg shadow-brand/20 hover:scale-105 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              完成批改
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Answer Display - 答案展示区域 */}
          <div className="flex-1 border-r border-slate-50 p-8 overflow-y-auto bg-slate-50/30 custom-scrollbar">
            <div className="mb-6">
              <h4 className="text-sm font-black text-slate-800 mb-2">
                题目 1：电磁感应定律综合应用
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-100">
                如图所示，在一个均匀磁场中，有一个矩形线圈以恒定速度v向右运动。求线圈中的感应电动势，并分析其中的能量转换过程。
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <ImageIcon size={16} className="text-brand" /> 学生作答图片
              </h4>
              <div className="aspect-[4/3] bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 relative group cursor-pointer hover:border-brand/50 transition-colors">
                <ImageIcon
                  size={48}
                  className="mb-4 opacity-20 group-hover:opacity-50 transition-opacity"
                />
                <p className="font-medium text-sm">学生上传的解答图片.jpg</p>
                <p className="text-xs mt-2 opacity-60">点击放大查看</p>

                {/* Mock Annotation */}
                <div className="absolute top-1/4 left-1/4 w-32 h-16 border-2 border-red-400 rounded-lg bg-red-400/10 flex items-start justify-end p-1">
                  <span className="text-[10px] font-black text-red-500 bg-white px-1.5 rounded">
                    公式错误
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis & Grading Panel - AI分析和评分面板 */}
          <div className="w-[400px] flex flex-col bg-white shrink-0">
            <div className="p-6 border-b border-slate-50 bg-gradient-to-br from-brand-bg to-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-brand-light/20 text-brand-dark rounded-lg">
                  <BrainCircuit size={18} />
                </div>
                <h4 className="font-black text-slate-800 text-sm">
                  AI 智能分析
                </h4>
              </div>

              {/* AI分析结果 */}
              {aiAnalysis ? (
                <div className="space-y-3">
                  {/* 正确点 */}
                  {aiAnalysis.correctPoints.map((point, index) => (
                    <div key={`correct-${index}`} className="flex items-start gap-3">
                      <CheckCircle2
                        size={16}
                        className="text-green-500 mt-0.5 shrink-0"
                      />
                      <p className="text-xs font-medium text-slate-600 leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                  {/* 错误点 */}
                  {aiAnalysis.errorPoints.map((point, index) => (
                    <div key={`error-${index}`} className="flex items-start gap-3">
                      <AlertCircle
                        size={16}
                        className="text-red-500 mt-0.5 shrink-0"
                      />
                      <p className="text-xs font-medium text-slate-600 leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400 text-sm">
                  暂无AI分析结果
                </div>
              )}

              <div className="mt-6 p-4 bg-white rounded-xl border border-brand-light/30 shadow-sm flex items-center justify-between">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  AI 建议得分
                </span>
                <span className="text-2xl font-black text-brand-dark">
                  {aiAnalysis?.score || selectedStudent?.aiScore || 85}
                  <span className="text-sm text-slate-400 ml-1">/ 100</span>
                </span>
              </div>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
              {/* 最终评分输入 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-3">
                  <PenTool size={16} className="text-slate-400" />
                  最终评分
                </label>
                <input
                  type="number"
                  value={teacherScore}
                  onChange={(e) => setTeacherScore(Number(e.target.value))}
                  min={0}
                  max={100}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xl font-black text-center text-slate-800 focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                />
              </div>

              {/* 教师评语输入 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-3">
                  <MessageSquare size={16} className="text-slate-400" />
                  教师评语
                </label>
                <textarea
                  rows={6}
                  value={teacherComments}
                  onChange={(e) => setTeacherComments(e.target.value)}
                  placeholder="请输入对该学生的评语和指导建议..."
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none leading-relaxed"
                ></textarea>
                {/* 快捷评语按钮 */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() =>
                      setTeacherComments('整体思路清晰，解答过程规范，继续保持！')
                    }
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors"
                  >
                    👍 棒极了
                  </button>
                  <button
                    onClick={() =>
                      setTeacherComments('注意细节，建议多检查计算过程。')
                    }
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors"
                  >
                    📝 注意细节
                  </button>
                  <button
                    onClick={() =>
                      setTeacherComments(
                        aiAnalysis?.feedback || '请根据AI分析进行针对性改进。'
                      )
                    }
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors"
                  >
                    ✨ AI 润色
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewWorkspace;
