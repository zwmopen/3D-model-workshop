
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
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, ContactShadows } from '@react-three/drei';

/**
 * 3D 模型组件: ${model.name} (${model.emoji})
 * 自动生成于：3D 设计云工坊
 */
export const ModelScene = () => {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#e0e5ec' }}>
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 35 }}>
        <Suspense fallback={null}>
          <Stage intensity={1} environment="city" adjustCamera={1.2}>
             <mesh castShadow>
                <meshStandardMaterial color="${model.color}" metalness={${model.metalness}} roughness={${model.roughness}} />
             </mesh>
          </Stage>
          <OrbitControls makeDefault autoRotate />
          <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2.5} />
        </Suspense>
      </Canvas>
    </div>
  );
};`.trim();
  };

  const neumorphicOut = "shadow-[8px_8px_16px_#b8b9be,-8px_-8px_16px_#ffffff]";
  const neumorphicIn = "shadow-[inset_6px_6px_12px_#b8b9be,inset_-6px_-6px_12px_#ffffff]";

  return (
    <div className="flex h-screen w-screen bg-[#e0e5ec] text-slate-700 overflow-hidden font-sans">
      {/* 侧边栏：极致圆角边缘 */}
      <Sidebar 
        models={MODELS} 
        activeId={selectedModel.id} 
        onSelect={setSelectedModel} 
      />

      <main className="flex-1 relative flex flex-col min-w-0">
        {/* 右上角：极致圆角拟态按钮 */}
        <header className="absolute top-10 right-10 z-10 flex gap-8 pointer-events-auto">
          <button
            onClick={() => setShowCode(true)}
            className={`flex items-center gap-4 bg-[#e0e5ec] ${neumorphicOut} active:${neumorphicIn} px-8 py-4 rounded-full transition-all hover:scale-105 group border border-white/50 text-slate-600`}
          >
            <Terminal className="w-5 h-5 text-indigo-500 group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-[13px] tracking-widest">查看源码</span>
          </button>
          
          <button
            onClick={handleCopyCode}
            className={`flex items-center gap-4 bg-[#e0e5ec] ${copied ? neumorphicIn : neumorphicOut} active:${neumorphicIn} px-10 py-4 rounded-full transition-all hover:scale-105 border border-white/50 ${copied ? 'text-emerald-600' : 'text-indigo-600'}`}
          >
            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            <span className="font-bold text-[13px] tracking-widest">{copied ? '复制成功' : '复制代码'}</span>
          </button>
        </header>

        {/* 纯净 3D 视图 */}
        <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing">
          <Viewer model={selectedModel} />
        </div>
      </main>

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
