
import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { MODELS } from './constants';
import { ModelConfig } from './types';
import Sidebar from './components/Sidebar';
import Viewer from './components/Viewer';
import { Copy, CheckCircle2, Terminal, Settings2, RotateCcw, Monitor, Moon, Sun, Trees, Zap } from 'lucide-react';
import CodeModal from './components/CodeModal';

const App: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(MODELS[0]);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const [customParams, setCustomParams] = useState({
    color: selectedModel.color,
    metalness: selectedModel.metalness,
    roughness: selectedModel.roughness,
    bgColor: '#e0e5ec'
  });

  const backgrounds = [
    { name: '工业灰', color: '#e0e5ec', icon: Monitor },
    { name: '极夜黑', color: '#0f172a', icon: Moon },
    { name: '纯净白', color: '#f8fafc', icon: Sun },
    { name: '森林绿', color: '#064e3b', icon: Trees },
  ];

  const handleSelectModel = (model: ModelConfig) => {
    startTransition(() => {
      setSelectedModel(model);
    });
  };

  const handleCopyCode = useCallback(() => {
    const code = generateCode(selectedModel, customParams);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [selectedModel, customParams]);

  useEffect(() => {
    setCustomParams(prev => ({
      ...prev,
      color: selectedModel.color,
      metalness: selectedModel.metalness,
      roughness: selectedModel.roughness,
    }));
  }, [selectedModel]);

  const generateCode = (model: ModelConfig, params: any) => {
    return `// 3D 高精资产渲染组件 - ${model.name}\n// 基于 React Three Fiber 构建\nexport const ${model.name.replace(/\s/g, '')}Asset = () => {\n  return (\n    <mesh>\n      <meshStandardMaterial color="${params.color}" metalness={${params.metalness}} roughness={${params.roughness}} />\n    </mesh>\n  );\n};`;
  };

  const nOut = "shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff]";
  const nIn = "shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff]";

  return (
    <div className="flex h-screen w-screen bg-[#e0e5ec] text-slate-700 overflow-hidden font-sans transition-all duration-700 select-none" style={{ backgroundColor: customParams.bgColor }}>
      <Sidebar 
        models={MODELS} 
        activeId={selectedModel.id} 
        onSelect={handleSelectModel} 
      />

      <main className="flex-1 relative flex flex-col min-w-0">
        {/* 顶部操作区 */}
        <header className="absolute top-10 right-10 z-20 flex gap-6 pointer-events-auto">
          <button onClick={() => setShowCode(true)} className={`flex items-center gap-3 bg-[#e0e5ec]/70 backdrop-blur-xl ${nOut} px-8 py-4 rounded-2xl hover:scale-105 transition-all text-[11px] font-black uppercase tracking-[0.2em] text-slate-600`}>
            <Terminal className="w-5 h-5 text-indigo-500" />
            <span>查看源代码</span>
          </button>
          <button onClick={handleCopyCode} className={`flex items-center gap-3 bg-[#e0e5ec]/70 backdrop-blur-xl ${copied ? nIn : nOut} px-8 py-4 rounded-2xl hover:scale-105 transition-all text-[11px] font-black uppercase tracking-[0.2em] ${copied ? 'text-emerald-600' : 'text-indigo-600'}`}>
            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            <span>{copied ? '已复制' : '复制 React 代码'}</span>
          </button>
        </header>

        {/* 模型状态浮窗 */}
        <div className="absolute top-10 left-10 z-20 flex flex-col gap-2">
            <div className={`px-4 py-2 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center gap-2 ${nOut}`}>
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">渲染引擎: WebGL2.0 Active</span>
            </div>
            {isPending && (
              <div className="px-4 py-2 bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 rounded-full flex items-center gap-2">
                 <Zap className="w-3 h-3 text-indigo-500 animate-bounce" />
                 <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">正在重建几何拓扑...</span>
              </div>
            )}
        </div>

        {/* 右下角控制台 */}
        <div className={`absolute bottom-10 right-10 z-20 w-64 p-8 bg-[#e0e5ec]/80 backdrop-blur-2xl rounded-[3rem] ${nOut} border border-white/60 flex flex-col gap-6 scale-90 hover:scale-100 transition-all duration-500`}>
           <div className="flex items-center justify-between border-b border-slate-300/30 pb-4">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">材质与环境面板</span>
              <Settings2 className="w-4 h-4 text-indigo-400" />
           </div>

           <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  <span>表面漫反射颜色</span>
                  <span className="bg-white/50 px-2 py-0.5 rounded-full text-slate-600">{customParams.color}</span>
                </div>
                <div className={`p-1 rounded-full ${nIn}`}>
                  <input type="color" value={customParams.color} onChange={(e) => setCustomParams({...customParams, color: e.target.value})} className="w-full h-8 cursor-pointer rounded-full bg-transparent border-none" />
                </div>
              </div>

              <div className="space-y-3">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">背景环境预设</div>
                 <div className="flex gap-3">
                    {backgrounds.map(bg => (
                      <button 
                        key={bg.color}
                        onClick={() => setCustomParams({...customParams, bgColor: bg.color})}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${customParams.bgColor === bg.color ? nIn + ' text-indigo-500' : nOut + ' text-slate-400 hover:text-slate-600'}`}
                        title={bg.name}
                      >
                        <bg.icon className="w-5 h-5" />
                      </button>
                    ))}
                 </div>
              </div>

              <button onClick={() => setSelectedModel({...selectedModel})} className={`w-full py-4 rounded-2xl ${nOut} active:${nIn} flex items-center justify-center gap-3 group transition-all`}>
                 <RotateCcw className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">重塑并重置视角</span>
              </button>
           </div>
        </div>

        <div className="flex-1 w-full h-full">
          <Viewer model={selectedModel} params={customParams} />
        </div>
      </main>

      {showCode && <CodeModal code={generateCode(selectedModel, customParams)} onClose={() => setShowCode(false)} />}
    </div>
  );
};

export default App;
