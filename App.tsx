
import React, { useState } from 'react';
import { MODELS } from './constants';
import { ModelConfig } from './types';
import Sidebar from './components/Sidebar';
import Viewer from './components/Viewer';
import { Copy, CheckCircle2, Terminal } from 'lucide-react';
import CodeModal from './components/CodeModal';

const App: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(MODELS[0]);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    const code = generateCode(selectedModel);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCode = (model: ModelConfig) => {
    return `
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';

/**
 * 3D模型组件: ${model.name}
 * 风格: 极简写实
 */
export const ModelScene = () => {
  return (
    <div style={{ width: '100%', height: '500px', borderRadius: '40px', overflow: 'hidden' }}>
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 40 }}>
        <Stage intensity={0.6} environment="apartment" adjustCamera={1.2}>
          <mesh castShadow receiveShadow>
             <meshStandardMaterial color="${model.color}" metalness={${model.metalness}} roughness={${model.roughness}} />
          </mesh>
        </Stage>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};`.trim();
  };

  const neumorphicOut = "shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff]";

  return (
    <div className="flex h-screen w-full bg-[#e0e5ec] text-slate-700 overflow-hidden font-sans p-4">
      <div className={`flex w-full h-full bg-[#e0e5ec] ${neumorphicOut} rounded-[3rem] overflow-hidden border border-white/40`}>
        <Sidebar 
          models={MODELS} 
          activeId={selectedModel.id} 
          onSelect={setSelectedModel} 
        />

        <main className="flex-1 relative flex flex-col bg-[#e0e5ec]">
          <header className="absolute top-0 right-0 z-10 p-10 flex justify-end pointer-events-none">
            <div className="flex gap-8 pointer-events-auto">
              <button
                onClick={() => setShowCode(true)}
                className={`flex items-center gap-3 bg-[#e0e5ec] text-slate-600 px-8 py-4 rounded-full transition-all active:scale-95 ${neumorphicOut} hover:text-indigo-600 group border-none`}
              >
                <Terminal className="w-5 h-5 text-indigo-500" />
                <span className="font-bold text-sm">生成组件源码</span>
              </button>
              <button
                onClick={handleCopyCode}
                className={`flex items-center gap-3 px-8 py-4 rounded-full transition-all active:scale-95 ${
                  copied 
                    ? 'bg-green-500 text-white shadow-none' 
                    : `bg-[#e0e5ec] text-slate-600 ${neumorphicOut} hover:text-indigo-600 group border-none`
                }`}
              >
                {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5 text-indigo-500" />}
                <span className="font-bold text-sm">{copied ? '代码已复制' : '复制 HTML/JSX'}</span>
              </button>
            </div>
          </header>

          <div className="flex-1 w-full h-full">
            <Viewer model={selectedModel} />
          </div>
        </main>
      </div>

      {showCode && (
        <CodeModal 
          code={generateCode(selectedModel)} 
          onClose={() => setShowCode(false)} 
        />
      )}
    </div>
  );
};

export default App;
