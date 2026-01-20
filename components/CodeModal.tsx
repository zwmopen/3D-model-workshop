
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

  const neumorphicOut = "shadow-[15px_15px_30px_#b8b9be,-15px_-15px_30px_#ffffff]";
  const neumorphicIn = "shadow-[inset_8px_8px_16px_#b8b9be,inset_-8px_-8px_16px_#ffffff]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-slate-200/40 backdrop-blur-xl animate-in fade-in duration-300">
      <div 
        className={`relative bg-[#e0e5ec] ${neumorphicOut} w-full max-w-4xl rounded-[3rem] flex flex-col max-h-[90vh] overflow-hidden border border-white/50`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-10 border-b border-slate-300/20 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-100">
                <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-700 tracking-tighter">React 组件源码</h2>
              <p className="text-[11px] text-slate-400 mt-1.5 uppercase font-bold tracking-[0.2em]">High Performance 3D Export</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-4 bg-[#e0e5ec] ${neumorphicOut} hover:scale-110 rounded-full transition-all text-slate-400 hover:text-red-500 border-none active:shadow-inner`}
          >
            <X className="w-6 h-6" />
          </button>
        </header>
        
        <div className={`p-10 flex-1 overflow-auto bg-[#e0e5ec] ${neumorphicIn} m-10 rounded-[2.5rem] relative`}>
          <pre className="text-sm font-mono text-slate-600 leading-relaxed whitespace-pre-wrap">
            {code}
          </pre>
        </div>
        
        <footer className="p-10 flex justify-end gap-8 bg-[#e0e5ec]/50">
          <button
            onClick={onClose}
            className="px-10 py-4 rounded-full text-slate-400 hover:text-slate-600 transition-all font-bold text-sm active:scale-95"
          >
            取消返回
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-3 px-12 py-4 rounded-full font-black text-sm transition-all active:scale-95 ${
              copied 
                ? 'bg-green-500 text-white shadow-none scale-105' 
                : `bg-[#e0e5ec] text-indigo-600 ${neumorphicOut} hover:text-indigo-700`
            }`}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? '复制成功' : '立即复制代码'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CodeModal;
