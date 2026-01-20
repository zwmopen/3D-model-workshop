
import React from 'react';
import { X, Check, Copy, Code2 } from 'lucide-react';

interface CodeModalProps {
  code: string;
  onClose: () => void;
}

const CodeModal: React.FC<CodeModalProps> = ({ code, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const neumorphicOut = "shadow-[20px_20px_40px_#b8b9be,-20px_-20px_40px_#ffffff]";
  const neumorphicIn = "shadow-[inset_10px_10px_20px_#b8b9be,inset_-10px_-10px_20px_#ffffff]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-10 bg-slate-300/50 backdrop-blur-2xl animate-in fade-in duration-300">
      <div 
        className={`relative bg-[#e0e5ec] ${neumorphicOut} w-full max-w-5xl rounded-[4rem] flex flex-col max-h-[85vh] overflow-hidden border border-white/60`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-12 border-b border-slate-300/30 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="bg-indigo-600 p-4 rounded-full shadow-2xl shadow-indigo-200">
                <Code2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-700 tracking-tighter">组件源代码</h2>
              <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-[0.3em]">React 工业级渲染单元</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-5 bg-[#e0e5ec] ${neumorphicOut} hover:scale-110 rounded-full transition-all text-slate-400 hover:text-red-500 border-none active:shadow-inner`}
          >
            <X className="w-7 h-7" />
          </button>
        </header>
        
        <div className={`p-12 flex-1 overflow-auto bg-[#e0e5ec] ${neumorphicIn} m-12 rounded-[3rem] relative`}>
          <pre className="text-sm font-mono text-slate-600 leading-relaxed whitespace-pre-wrap selection:bg-indigo-100">
            {code}
          </pre>
        </div>
        
        <footer className="p-12 flex justify-end gap-10 bg-[#e0e5ec]/60">
          <button
            onClick={onClose}
            className="px-10 py-5 rounded-full text-slate-400 hover:text-slate-700 transition-all font-black text-sm"
          >
            关闭窗口
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-4 px-16 py-5 rounded-full font-black text-sm transition-all active:scale-95 ${
              copied 
                ? 'bg-green-500 text-white shadow-none' 
                : `bg-[#e0e5ec] text-indigo-600 ${neumorphicOut} hover:text-indigo-700`
            }`}
          >
            {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
            {copied ? '代码已复制' : '复制代码组件'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CodeModal;
