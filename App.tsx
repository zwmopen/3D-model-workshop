
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
    { name: '灰色', color: '#e0e5ec', icon: Monitor },
    { name: '深夜', color: '#0f172a', icon: Moon },
    { name: '纯白', color: '#f8fafc', icon: Sun },
    { name: '森林', color: '#064e3b', icon: Trees },
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
    return `// 3D 资产组件 - ${model.name}\nexport const ${model.name.replace(/\s/g, '')}Asset = () => {\n  return (\n    <mesh>\n      <meshStandardMaterial color="${params.color}" metalness={${params.metalness}} roughness={${params.roughness}} />\n    </mesh>\n  );\n};`;
  };

  const nOut = "shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff]";
  const nIn = "shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff]";

  return (
    <div className="flex h-screen w-screen bg-[#e0e5ec] text-slate-700 overflow-hidden font-sans transition-all duration-700 select-none p-3" style={{ backgroundColor: customParams.bgColor }}>
      <div className="flex flex-1 bg-transparent rounded-[3rem] overflow-hidden gap-3">
        <Sidebar 
          models={MODELS} 
          activeId={selectedModel.id} 
          onSelect={handleSelectModel} 
        />

        <main className="flex-1 relative flex flex-col bg-white/10 backdrop-blur-sm rounded-[3rem] border border-white/40 shadow-xl overflow-hidden">
          {/* 顶部操作区 - 紧凑化 */}
          <header className="absolute top-6 right-6 z-20 flex gap-3 pointer-events-auto">
            <button onClick={() => setShowCode(true)} className={`flex items-center gap-2 bg-[#e0e5ec]/80 backdrop-blur-md ${nOut} px-5 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all text-[11px] font-black tracking-widest text-slate-700`}>
              <Terminal className="w-4 h-4 text-indigo-500" />
              <span>源码</span>
            </button>
            <button onClick={handleCopyCode} className={`flex items-center gap-2 bg-[#e0e5ec]/80 backdrop-blur-md ${copied ? nIn : nOut} px-5 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all text-[11px] font-black tracking-widest ${copied ? 'text-emerald-600' : 'text-indigo-600'}`}>
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '已复制' : '复制代码'}</span>
            </button>
          </header>

          {/* 状态指示器 - 紧凑化 */}
          <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 pointer-events-none">
              <div className={`px-4 py-2 bg-white/30 backdrop-blur-xl border border-white/50 rounded-full flex items-center gap-2 ${nOut}`}>
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-black text-slate-600 tracking-wider">Engine v2.8 </span>
              </div>
              {isPending && (
                <div className="px-4 py-2 bg-indigo-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-full flex items-center gap-2 animate-pulse">
                   <Zap className="w-3.5 h-3.5 text-indigo-600" />
                   <span className="text-[10px] font-black text-indigo-700 tracking-wider">Loading...</span>
                </div>
              )}
          </div>

          {/* 极简调节面板 - 尺寸缩小 */}
          <div className={`absolute bottom-6 right-6 z-20 w-48 p-6 bg-[#e0e5ec]/90 backdrop-blur-3xl rounded-[3rem] ${nOut} border border-white/60 flex flex-col gap-5 transition-all duration-500`}>
             <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
                <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">材质</span>
                <Settings2 className="w-4 h-4 text-indigo-500" />
             </div>

             <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase">
                    <span>主色</span>
                  </div>
                  <div className={`p-1 rounded-full ${nIn}`}>
                    <input type="color" value={customParams.color} onChange={(e) => setCustomParams({...customParams, color: e.target.value})} className="w-full h-7 cursor-pointer rounded-full bg-transparent border-none block" />
                  </div>
                </div>

                <div className="space-y-3">
                   <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">环境</div>
                   <div className="grid grid-cols-4 gap-2">
                      {backgrounds.map(bg => (
                        <button 
                          key={bg.color}
                          onClick={() => setCustomParams({...customParams, bgColor: bg.color})}
                          className={`aspect-square rounded-full flex items-center justify-center transition-all ${customParams.bgColor === bg.color ? nIn + ' text-indigo-600' : nOut + ' text-slate-400 hover:text-slate-700'}`}
                        >
                          <bg.icon className="w-3.5 h-3.5" />
                        </button>
                      ))}
                   </div>
                </div>

                <button onClick={() => setSelectedModel({...selectedModel})} className={`w-full py-3 rounded-full ${nOut} active:${nIn} flex items-center justify-center gap-2 group transition-all`}>
                   <RotateCcw className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-700" />
                   <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase">重置视角</span>
                </button>
             </div>
          </div>

          {/* 增加的模型展示区 */}
          <div className="flex-1 w-full h-full">
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden">
              <Viewer model={selectedModel} params={customParams} />
            </div>
          </div>
        </main>
      </div>

      {showCode && <CodeModal code={generateCode(selectedModel, customParams)} onClose={() => setShowCode(false)} />}
    </div>
  );
};

export default App;
