
import React, { useState, useRef, useEffect } from 'react';
import { ModelConfig, Category } from '../types';
import { LayoutGrid, Trees, Dog, Box, Search, Shapes, HelpCircle, X, ChevronRight, Zap } from 'lucide-react';

interface SidebarProps {
  models: ModelConfig[];
  activeId: string;
  onSelect: (model: ModelConfig) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ models, activeId, onSelect }) => {
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const [activeInfoId, setActiveInfoId] = useState<string | null>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const filteredModels = models.filter(m => 
    (filter === 'all' || m.category === filter) &&
    (m.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Close info card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setActiveInfoId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories: { id: Category | 'all', label: string, icon: any }[] = [
    { id: 'all', label: '全部', icon: LayoutGrid },
    { id: 'primitive', label: '几何', icon: Shapes },
    { id: 'tree', label: '植物', icon: Trees },
    { id: 'animal', label: '动物', icon: Dog },
  ];

  const nOut = "shadow-[4px_4px_10px_#b8b9be,-4px_-4px_10px_#ffffff]";
  const nIn = "shadow-[inset_3px_3px_8px_#b8b9be,inset_-3px_-3px_8px_#ffffff]";

  const toggleInfo = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveInfoId(activeInfoId === id ? null : id);
  };

  return (
    <aside className="w-[280px] h-full bg-[#e0e5ec] rounded-r-[3.5rem] shadow-[25px_0_50px_rgba(0,0,0,0.08)] flex flex-col z-40 border-r border-white/80 shrink-0 relative overflow-visible">
      <div className="p-8 pb-4 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-[#e0e5ec] ${nOut} flex items-center justify-center border border-white/80 transition-transform active:scale-95`}>
            <Box className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none">ASSET PRO</h1>
            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">工业级 3D 资产库</p>
          </div>
        </div>
        
        <div className={`relative rounded-2xl bg-[#e0e5ec] ${nIn} px-5 py-4 flex items-center gap-3 group transition-all`}>
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="搜索 60 款写实资产..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-sm focus:outline-none text-slate-600 placeholder:text-slate-400 w-full font-bold"
          />
        </div>
      </div>

      <div className="flex p-2 gap-2 bg-[#e0e5ec] mx-6 my-4 rounded-2xl shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff]">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all ${
              filter === cat.id ? `bg-[#e0e5ec] text-indigo-600 ${nOut}` : 'text-slate-400 hover:text-slate-500'
            }`}
          >
            <cat.icon className="w-4 h-4 mb-1" />
            <span className="text-[9px] font-black uppercase tracking-wider">{cat.label}</span>
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4 custom-scrollbar overflow-x-visible">
        {filteredModels.map((model) => {
          const isActive = activeId === model.id;
          const isInfoOpen = activeInfoId === model.id;
          return (
            <div key={model.id} className="relative group/item overflow-visible">
              <div
                onClick={() => onSelect(model)}
                className={`w-full flex items-center gap-4 p-2 rounded-2xl transition-all border border-transparent cursor-pointer ${
                  isActive ? `bg-indigo-50/60 ${nIn} border-indigo-100/40` : `bg-[#e0e5ec] hover:translate-x-1 ${nOut}`
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all bg-white/30 shadow-inner group-hover/item:scale-110 duration-300`}>
                  {model.emoji}
                </div>
                <h3 className={`text-sm font-black truncate tracking-tight flex-1 text-left ${isActive ? 'text-indigo-600' : 'text-slate-600'}`}>
                  {model.name}
                </h3>
                
                {/* 问号介绍按钮 - 更改为点击触发 */}
                <button 
                  onClick={(e) => toggleInfo(e, model.id)}
                  className={`p-2 rounded-full transition-all duration-300 ${isInfoOpen ? nIn + ' text-indigo-600 scale-90' : 'hover:bg-white/50 text-slate-300 hover:text-indigo-500 hover:rotate-12'}`}
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
                
                {/* 写实级百科介绍浮窗 - 弹出式设计 */}
                {isInfoOpen && (
                  <div 
                    ref={infoRef}
                    className="absolute left-[calc(100%+24px)] top-1/2 -translate-y-1/2 w-[340px] p-8 bg-[#e0e5ec] backdrop-blur-3xl rounded-[3rem] shadow-[50px_0_100px_rgba(0,0,0,0.15)] border border-white/90 z-[1000] animate-in fade-in zoom-in-95 slide-in-from-left-4 duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button 
                      onClick={() => setActiveInfoId(null)}
                      className="absolute top-6 right-8 p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-3xl">{model.emoji}</div>
                      <div>
                        <h4 className="text-xl font-black text-slate-800 leading-none">{model.name}</h4>
                        <div className="flex gap-2 mt-3">
                           <span className="text-[10px] font-black text-white bg-indigo-500 px-3 py-1 rounded-full uppercase tracking-tighter">Biological Pro</span>
                           <span className="text-[10px] font-black text-indigo-500 bg-white px-3 py-1 rounded-full uppercase border border-indigo-100 shadow-sm">HQ_LOD0</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-5">
                       <div className="bg-white/40 p-6 rounded-3xl border border-white/70 shadow-inner">
                         <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-3 h-3 text-indigo-500" />
                            <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em]">建模方案 & 解剖细节</h5>
                         </div>
                         <p className="text-[12px] text-slate-600 leading-relaxed font-bold">
                           {model.description}
                         </p>
                       </div>
                       
                       <div className="flex justify-between items-center bg-[#e0e5ec] p-4 rounded-2xl shadow-inner border border-white/30">
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Rendering Engine</span>
                             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">Low-Poly Realistic</span>
                          </div>
                          <div className="flex gap-1.5">
                             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse delay-100 shadow-[0_0_8px_#10b981]" />
                             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse delay-200 shadow-[0_0_8px_#10b981]" />
                          </div>
                       </div>

                       <div className="flex items-center justify-center gap-2 text-[10px] font-black text-indigo-400 uppercase mt-2">
                          <ChevronRight className="w-3 h-3" />
                          <span>点击空白区域或关闭按钮退出介绍</span>
                       </div>
                    </div>
                    
                    {/* 装饰性提示 */}
                    <div className="absolute -bottom-4 right-8 bg-indigo-600 text-white text-[8px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                       Verified Asset v4.1
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
