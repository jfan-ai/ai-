import React, { useState } from 'react';
import { Brain, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

interface AIModuleProps {
  type: 'generation' | 'correction' | 'analysis';
  title: string;
  description: string;
}

const AIModule: React.FC<AIModuleProps> = ({ type, title, description }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAction = () => {
    if (!input.trim()) return;
    setIsLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
      if (type === 'generation') {
        setResult('已根据您的要求生成 5 道关于“牛顿第一定律”的练习题。');
      } else if (type === 'correction') {
        setResult('批改完成：85分。错误点：在计算摩擦力时未考虑斜面倾角。');
      } else {
        setResult('分析完成：该班级对“简谐运动”章节掌握程度较高，但在“相位差”理解上存在普遍薄弱。');
      }
    }, 1500);
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-50 shadow-sm overflow-hidden flex flex-col h-full group hover:border-brand-light/50 hover:shadow-2xl hover:shadow-brand/5 transition-all">
      <div className="p-5 bg-slate-50/50 border-b border-slate-50 flex items-center gap-4">
        <div className="p-2.5 bg-white rounded-xl shadow-sm text-brand-dark group-hover:bg-brand group-hover:text-white transition-all">
          <Brain size={22} />
        </div>
        <div>
          <h4 className="font-black text-slate-800 text-sm tracking-tight">{title}</h4>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-0.5">{description}</p>
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col gap-5">
        <div className="flex-1 min-h-[120px] bg-slate-50 rounded-2xl p-4 relative group/inner">
          {result ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest mb-3">
                <CheckCircle2 size={14} /> AI 运行成功
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{result}</p>
              <button 
                onClick={() => {setResult(null); setInput('');}}
                className="mt-6 text-[10px] font-black text-brand uppercase tracking-widest hover:underline"
              >
                再次运行分析
              </button>
            </div>
          ) : (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={type === 'generation' ? "输入章节名称，如：牛顿力学..." : "输入题目或批改内容..."}
              className="w-full h-full bg-transparent border-none focus:ring-0 text-sm text-slate-600 resize-none placeholder:text-slate-200 font-medium"
            />
          )}
          {isLoading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] flex items-center justify-center rounded-2xl animate-in fade-in duration-300">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <Loader2 size={32} className="text-brand animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-[10px]">🦖</div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">AI 正在深度思考中...</p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleAction}
          disabled={isLoading || !input.trim() || !!result}
          className={clsx(
            "w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg",
            isLoading || !input.trim() || !!result
              ? "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
              : "bg-brand-dark text-white hover:bg-brand shadow-brand/20 active:scale-[0.98] hover:scale-[1.02]"
          )}
        >
          {isLoading ? "处理中..." : (
            <>
              <Sparkles size={16} />
              立即运行 AI {type === 'generation' ? '生成' : type === 'correction' ? '批改' : '分析'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AIModule;
