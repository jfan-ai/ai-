import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  BookOpen,
  Zap,
  MoreVertical,
  CheckCircle2,
  ChevronRight,
  Database,
  Cloud,
  FileText,
  BrainCircuit,
  Save,
} from 'lucide-react';
import { clsx } from 'clsx';
import Modal from './Modal';

const QuestionBank: React.FC = () => {
  const [activeSource, setActiveSource] = useState<'local' | 'cloud'>('local');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 筛选状态
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('全部章节');
  const [selectedDifficulty, setSelectedDifficulty] = useState('全部难度');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: '质点运动学：匀加速直线运动',
      type: '选择题',
      difficulty: '简单',
      chapter: '力学',
      usedCount: 124,
    },
    {
      id: 2,
      title: '牛顿运动定律：受力分析综合',
      type: '计算题',
      difficulty: '中等',
      chapter: '力学',
      usedCount: 89,
    },
    {
      id: 3,
      title: '动能定理与机械能守恒',
      type: '计算题',
      difficulty: '中等',
      chapter: '力学',
      usedCount: 210,
    },
    {
      id: 4,
      title: '静电场：电场强度与电势',
      type: '选择题',
      difficulty: '中等',
      chapter: '电磁学',
      usedCount: 56,
    },
    {
      id: 5,
      title: '高斯定理的应用',
      type: '填空题',
      difficulty: '困难',
      chapter: '电磁学',
      usedCount: 42,
    },
    {
      id: 6,
      title: '热力学第一定律',
      type: '选择题',
      difficulty: '简单',
      chapter: '热学',
      usedCount: 78,
    },
    {
      id: 7,
      title: '光的干涉与衍射',
      type: '计算题',
      difficulty: '困难',
      chapter: '光学',
      usedCount: 34,
    },
    {
      id: 8,
      title: '相对论基础',
      type: '填空题',
      difficulty: '中等',
      chapter: '近代物理',
      usedCount: 45,
    },
  ]);

  // 筛选逻辑
  const filteredQuestions = questions.filter((q) => {
    // 搜索筛选
    const matchesSearch =
      searchQuery === '' ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.chapter.toLowerCase().includes(searchQuery.toLowerCase());

    // 章节筛选
    const matchesChapter =
      selectedChapter === '全部章节' || q.chapter === selectedChapter;

    // 难度筛选
    const matchesDifficulty =
      selectedDifficulty === '全部难度' || q.difficulty === selectedDifficulty;

    return matchesSearch && matchesChapter && matchesDifficulty;
  });

  // 分页逻辑
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 章节选项
  const chapters = ['全部章节', '力学', '热学', '电磁学', '光学', '近代物理'];
  const difficulties = ['全部难度', '简单', '中等', '困难'];

  // 处理AI组卷
  const handleAIGenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('AI组卷功能需要连接后端API');
      setIsAiModalOpen(false);
    }, 1000);
  };

  // 处理手动录题
  const handleManualSave = () => {
    alert('保存题目功能需要连接后端API');
    setIsManualModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-brand-light/20 rounded-2xl text-brand-dark">
              <BookOpen size={28} />
            </div>
            大学物理专题题库
          </h1>
          <p className="text-slate-400 font-bold mt-2 text-sm uppercase tracking-wider">
            Physics Question Bank Intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand to-brand-dark text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand/20 hover:shadow-2xl hover:scale-105 transition-all"
          >
            <Zap size={18} />
            AI 智能组卷
          </button>
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-2 px-8 py-3 bg-white text-slate-700 border border-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            <Plus size={18} />
            手动录题
          </button>
        </div>
      </div>

      {/* Source Selector & Search */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <button
              onClick={() => setActiveSource('local')}
              className={clsx(
                'px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all',
                activeSource === 'local'
                  ? 'bg-white text-brand-dark shadow-md shadow-brand/10'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <Database size={16} />
              校本题库
            </button>
            <button
              onClick={() => setActiveSource('cloud')}
              className={clsx(
                'px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all',
                activeSource === 'cloud'
                  ? 'bg-white text-brand-dark shadow-md shadow-brand/10'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <Cloud size={16} />
              云端资源
            </button>
          </div>
          <div className="flex-1 max-w-md relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="搜索题目关键字、知识点..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // 重置到第一页
              }}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand-light/30 transition-all outline-none font-medium"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-50">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mr-4 flex items-center gap-2">
            <Filter size={14} /> 智能筛选
          </span>
          {chapters.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSelectedChapter(item);
                setCurrentPage(1);
              }}
              className={clsx(
                'px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                selectedChapter === item
                  ? 'bg-brand text-white shadow-lg shadow-brand/20'
                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
              )}
            >
              {item}
            </button>
          ))}
          <div className="w-px h-4 bg-slate-100 mx-4"></div>
          {difficulties.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSelectedDifficulty(item);
                setCurrentPage(1);
              }}
              className={clsx(
                'px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                selectedDifficulty === item
                  ? 'bg-brand text-white shadow-lg shadow-brand/20'
                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-6">
        {paginatedQuestions.length > 0 ? (
          paginatedQuestions.map((q) => (
            <div
              key={q.id}
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:border-brand-light/50 hover:shadow-2xl hover:shadow-brand/5 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">
                      #{q.id}
                    </span>
                    <span
                      className={clsx(
                        'px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]',
                        q.difficulty === '简单'
                          ? 'bg-green-50 text-green-600'
                          : q.difficulty === '中等'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-red-50 text-red-600'
                      )}
                    >
                      {q.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-brand-light/20 text-brand-dark rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">
                      {q.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 group-hover:text-brand transition-colors tracking-tight leading-tight">
                    {q.title}
                  </h3>
                  <div className="flex items-center gap-8 mt-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      <BookOpen size={14} className="text-slate-200" />
                      章节: <span className="text-slate-600">{q.chapter}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      <FileText size={14} className="text-slate-200" />
                      引用次数:{' '}
                      <span className="text-slate-600">{q.usedCount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-green-500 uppercase tracking-widest">
                      <CheckCircle2 size={14} />
                      已校对
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-3 text-slate-300 hover:text-brand hover:bg-brand-bg rounded-2xl transition-all">
                    <Download size={22} />
                  </button>
                  <button className="p-3 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all">
                    <MoreVertical size={22} />
                  </button>
                  <div className="ml-6 p-4 bg-slate-50 text-slate-300 rounded-3xl group-hover:bg-brand group-hover:text-white transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-brand/30">
                    <ChevronRight size={28} />
                  </div>
                </div>
              </div>
              {/* Hover Decor */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-brand scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500"></div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-400 font-medium">未找到符合条件的题目</p>
            <p className="text-slate-300 text-sm mt-1">请尝试调整筛选条件</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <div className="flex items-center gap-2">
            {/* 上一页 */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={clsx(
                'w-10 h-10 rounded-xl font-bold text-sm transition-all flex items-center justify-center',
                currentPage === 1
                  ? 'text-slate-200 cursor-not-allowed'
                  : 'text-slate-400 hover:bg-slate-100'
              )}
            >
              ←
            </button>

            {/* 页码 */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={clsx(
                  'w-10 h-10 rounded-xl font-bold text-sm transition-all',
                  p === currentPage
                    ? 'bg-brand text-white shadow-lg shadow-brand/20'
                    : 'text-slate-400 hover:bg-slate-100'
                )}
              >
                {p}
              </button>
            ))}

            {/* 下一页 */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={clsx(
                'w-10 h-10 rounded-xl font-bold text-sm transition-all flex items-center justify-center',
                currentPage === totalPages
                  ? 'text-slate-200 cursor-not-allowed'
                  : 'text-slate-400 hover:bg-slate-100'
              )}
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* AI Generation Modal */}
      <Modal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="AI 智能组卷"
      >
        <div className="space-y-6">
          <div className="p-4 bg-brand-light/10 rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-brand-light/20 text-brand-dark rounded-xl">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">AI 组卷助手</h4>
              <p className="text-xs text-slate-500 mt-1">
                设置参数，AI 将从题库中智能抽取或生成题目，一键生成试卷。
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                选择章节
              </label>
              <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-brand/20 outline-none">
                <option>力学综合</option>
                <option>电磁学</option>
                <option>热学</option>
                <option>光学</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                题目数量
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  defaultValue={10}
                  className="w-24 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-center focus:ring-2 focus:ring-brand/20 outline-none"
                />
                <span className="text-sm text-slate-500">题</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                难度偏好
              </label>
              <div className="flex gap-4">
                {['简单', '中等', '困难', '综合'].map((diff) => (
                  <label
                    key={diff}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      defaultChecked={diff === '综合'}
                      className="text-brand focus:ring-brand"
                    />
                    <span className="text-sm text-slate-600">{diff}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button
              onClick={() => setIsAiModalOpen(false)}
              className="px-6 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all"
            >
              取消
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-xl font-bold text-sm shadow-lg shadow-brand/20 hover:scale-105 transition-all">
              <Zap size={16} /> 开始生成
            </button>
          </div>
        </div>
      </Modal>

      {/* Manual Input Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="手动录题"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                题目题干
              </label>
              <textarea
                rows={4}
                placeholder="在此输入题干内容..."
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-brand/20 outline-none resize-none"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                题目类型
              </label>
              <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-brand/20 outline-none">
                <option>单选题</option>
                <option>多选题</option>
                <option>填空题</option>
                <option>计算题</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                所属章节
              </label>
              <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-brand/20 outline-none">
                <option>力学</option>
                <option>电磁学</option>
                <option>光学</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                标准答案与解析
              </label>
              <textarea
                rows={4}
                placeholder="在此输入标准答案和详细解析..."
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-brand/20 outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button
              onClick={() => setIsManualModalOpen(false)}
              className="px-6 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all"
            >
              取消
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all">
              <Save size={16} /> 保存题目
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuestionBank;
