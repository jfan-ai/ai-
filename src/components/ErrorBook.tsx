import React, { useState, useEffect } from 'react';
import { 
  BookMarked, 
  Search, 
  RotateCcw, 
  BrainCircuit, 
  ChevronRight, 
  Calendar,
  Filter,
  Trash2,
  ExternalLink,
  Zap,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { 
  getErrorQuestions, 
  getErrorStats, 
  deleteErrorQuestion,
  getPracticeRecommendations
} from '../services/errorBook';
import type { ErrorQuestion } from '../types';

const ErrorBook: React.FC = () => {
  // 状态管理
  const [errorQuestions, setErrorQuestions] = useState<ErrorQuestion[]>([]);
  const [stats, setStats] = useState({
    totalErrors: 0,
    reviewedCount: 0,
    weakPoint: '暂无数据',
    streakDays: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // 组件加载时获取数据
  useEffect(() => {
    loadErrorData();
  }, []);

  // 加载错题数据
  const loadErrorData = async () => {
    try {
      setLoading(true);
      // 并行获取错题列表和统计数据
      const [questionsRes, statsRes] = await Promise.all([
        getErrorQuestions({ page: 1, limit: 20 }),
        getErrorStats()
      ]);

      // API直接返回数据，不需要.data
      setErrorQuestions((questionsRes as any).errors || []);
      
      // 处理统计数据
      const statsData = statsRes as any;
      // 找出错误最多的章节作为薄弱点
      const weakChapter = statsData.byChapter?.sort((a: any, b: any) => b.count - a.count)[0];
      
      setStats({
        totalErrors: statsData.totalErrors || 0,
        reviewedCount: statsData.reviewedCount || 0,
        weakPoint: weakChapter?.chapter || '暂无数据',
        streakDays: statsData.streakDays || 0
      });
    } catch (err: any) {
      console.error('加载错题数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 搜索错题
  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await getErrorQuestions({ 
        chapter: selectedChapter || undefined,
        page: 1, 
        limit: 20 
      });
      // API直接返回数据
      let filtered = (res as any).errors || [];
      if (searchKeyword) {
        filtered = filtered.filter((q: ErrorQuestion) => 
          q.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          q.chapter?.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }
      setErrorQuestions(filtered);
    } catch (err: any) {
      console.error('搜索错题失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 删除错题
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这道错题记录吗？')) return;
    
    try {
      await deleteErrorQuestion(id);
      // 删除成功后刷新列表
      loadErrorData();
    } catch (err: any) {
      alert('删除失败: ' + err.message);
    }
  };

  // AI智能推题复练
  const handleAIRecommend = async () => {
    if (errorQuestions.length === 0) {
      alert('暂无错题可供推荐');
      return;
    }
    
    setAiLoading(true);
    try {
      // 选择第一道错题进行推荐
      const firstError = errorQuestions[0];
      const res = await getPracticeRecommendations(firstError.id);
      const resData = res as any;
      alert(`AI推荐完成！\n\n薄弱点：${resData.analysis?.weakPoint}\n建议：${resData.analysis?.suggestion}\n\n已为您推荐 ${resData.recommendations?.length || 0} 道相关练习题。`);
    } catch (err: any) {
      alert('AI推荐失败: ' + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookMarked className="text-orange-600" size={28} />
            物理错题本复盘
          </h1>
          <p className="text-slate-500 mt-1">AI 自动收录作业错题，助力精准复习与薄弱点突破</p>
        </div>
        <button 
          onClick={handleAIRecommend}
          disabled={aiLoading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50"
        >
          {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
          {aiLoading ? 'AI思考中...' : 'AI 智能推题复练'}
        </button>
      </div>

      {/* Analysis Section - 从API获取的统计数据 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-white text-orange-600 rounded-2xl flex items-center justify-center shadow-sm">
            <RotateCcw size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">待复盘错题</p>
            <p className="text-2xl font-bold text-orange-900">{stats.totalErrors - stats.reviewedCount} <span className="text-xs font-normal">道</span></p>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
            <BrainCircuit size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">核心薄弱点</p>
            <p className="text-2xl font-bold text-blue-900">{stats.weakPoint}</p>
          </div>
        </div>
        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">连续复盘天数</p>
            <p className="text-2xl font-bold text-emerald-900">{stats.streakDays} <span className="text-xs font-normal">天</span></p>
          </div>
        </div>
      </div>

      {/* Filter Bar - 支持搜索和筛选 */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="搜索错题关键字、知识点..."
            className="w-full pl-12 pr-4 py-2 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-orange-500/5 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedChapter}
            onChange={(e) => {
              setSelectedChapter(e.target.value);
              handleSearch();
            }}
            className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold border-none outline-none cursor-pointer"
          >
            <option value="">全部章节</option>
            <option value="力学">力学</option>
            <option value="电磁学">电磁学</option>
            <option value="热学">热学</option>
            <option value="光学">光学</option>
          </select>
          <button 
            onClick={handleSearch}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100"
          >
            <Filter size={14} /> 筛选
          </button>
        </div>
      </div>

      {/* Error List - 从API获取的错题列表 */}
      <div className="space-y-4">
        {errorQuestions.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl">
            <BookMarked size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">暂无错题记录</p>
            <p className="text-sm text-slate-400 mt-2">完成作业后，错题会自动收录到这里</p>
          </div>
        ) : (
          errorQuestions.map((q) => (
            <div key={q.id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all cursor-pointer">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">#{q.id.slice(0, 8)}</span>
                      <span className={clsx(
                        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                        q.difficulty === '困难' ? "bg-red-50 text-red-600" :
                        q.difficulty === '中等' ? "bg-amber-50 text-amber-600" :
                        "bg-green-50 text-green-600"
                      )}>{q.difficulty || '中等'}</span>
                      <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">错误 {q.errorCount || 1} 次</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDelete(q.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{q.title}</h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {(q.tags || []).map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <Calendar size={14} />
                      上次复盘: {q.lastReview || '未复盘'}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <BookMarked size={14} />
                      章节: {q.chapter || '未分类'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-3 min-w-[140px]">
                  <button className="w-full py-3 bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-200 hover:scale-105 transition-all">
                    重新练习
                  </button>
                  <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                    查看解析 <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ErrorBook;
