
import React, { useState, useRef, useEffect } from 'react';
import { ModelConfig, Category } from '../types';
import { LayoutGrid, Trees, Dog, Box, Search, Shapes, HelpCircle, X } from 'lucide-react';

interface SidebarProps {
  models: ModelConfig[];
  activeId: string;
  onSelect: (model: ModelConfig) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ models, activeId, onSelect }) => {
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const [activeInfoId, setActiveInfoId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const filteredModels = models.filter(m => 
    (filter === 'all' || m.category === filter) &&
    (m.name.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setActiveInfoId(null);
      }
    };
    if (activeInfoId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeInfoId]);

  const categories: { id: Category | 'all', label: string, icon: any }[] = [
    { id: 'all', label: '全部', icon: LayoutGrid },
    { id: 'primitive', label: '几何', icon: Shapes },
    { id: 'tree', label: '植物', icon: Trees },
    { id: 'animal', label: '动物', icon: Dog },
  ];

  const nOut = "shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff]";
  const nIn = "shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff]";

  const activeModel = models.find(m => m.id === activeInfoId);

  return (
    <aside className="w-[260px] h-full bg-[#e0e5ec] rounded-r-[4rem] shadow-[15px_0_30px_rgba(0,0,0,0.05)] flex flex-col z-40 border-r border-white/60 shrink-0 relative">
      <div className="p-6 pb-3 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-[#e0e5ec] ${nOut} flex items-center justify-center border border-white/80 transition-transform active:scale-90`}>
            <Box className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tighter leading-none">3D 工坊</h1>
            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Pro Studio</p>
          </div>
        </div>
        
        <div className={`relative rounded-full bg-[#e0e5ec] ${nIn} px-4 py-2 flex items-center gap-2 group transition-all`}>
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="搜索资产..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-[11px] focus:outline-none text-slate-600 placeholder:text-slate-400 w-full font-bold"
          />
        </div>
      </div>

      <div className="flex p-1 gap-1 bg-[#e0e5ec] mx-6 my-2 rounded-full shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff]">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`flex-1 flex flex-col items-center py-2 rounded-full transition-all ${
              filter === cat.id ? `bg-[#e0e5ec] text-indigo-600 ${nOut}` : 'text-slate-400 hover:text-slate-500'
            }`}
          >
            <cat.icon className="w-3.5 h-3.5 mb-0.5" />
            <span className="text-[9px] font-black tracking-wider">{cat.label}</span>
          </button>
        ))}
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-20 space-y-3 custom-scrollbar mt-2">
        {filteredModels.map((model, index) => {
          const isActive = activeId === model.id;
          const sequenceNumber = models.length - index;
          
          return (
            <div key={model.id} className="relative group/item">
              <div
                onClick={() => onSelect(model)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-full transition-all border border-transparent cursor-pointer ${
                  isActive ? `bg-indigo-50/60 ${nIn} border-indigo-200/30` : `bg-[#e0e5ec] hover:translate-x-1.5 ${nOut}`
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[8px] font-black transition-all bg-white/50 shadow-inner shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {sequenceNumber.toString().padStart(2, '0')}
                </div>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all bg-white/30 shadow-sm shrink-0 group-hover/item:scale-110 duration-300`}>
                  {model.emoji}
                </div>
                
                <h3 className={`text-[11px] font-black truncate tracking-tight flex-1 text-left ${isActive ? 'text-indigo-600' : 'text-slate-700'}`}>
                  {model.name}
                </h3>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveInfoId(activeInfoId === model.id ? null : model.id);
                  }}
                  className={`p-1.5 rounded-full transition-all duration-300 flex items-center justify-center shrink-0 ${activeInfoId === model.id ? 'bg-indigo-500 text-white shadow-md' : 'bg-white/40 text-slate-400 hover:bg-white hover:text-indigo-500'}`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {activeInfoId && activeModel && (
        <div 
          ref={infoRef}
          className="absolute left-[calc(100%+20px)] top-1/2 -translate-y-1/2 w-[340px] p-8 bg-[#e0e5ec] rounded-[3rem] shadow-[40px_0_80px_rgba(0,0,0,0.1)] border border-white/90 z-[100] animate-in fade-in zoom-in-95 slide-in-from-left-4 duration-300 flex flex-col gap-5"
        >
          <button 
            onClick={() => setActiveInfoId(null)}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 transition-colors bg-white/20 rounded-full hover:bg-white/50 shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>

          <h4 className="text-lg font-black text-slate-800 border-b border-slate-300/30 pb-4 flex items-center gap-3">
            <span className="text-3xl drop-shadow-sm">{activeModel.emoji}</span>
            <div className="flex flex-col">
              <span className="leading-tight">{activeModel.name}</span>
              <span className="text-[8px] text-slate-400 uppercase tracking-widest">Design Card</span>
            </div>
          </h4>
          
          <div className="bg-white/30 p-6 rounded-[2rem] border border-white/50 shadow-inner overflow-y-auto max-h-[50vh] custom-scrollbar">
            <div className="text-[12px] text-slate-600 leading-relaxed font-bold whitespace-pre-wrap">
              {activeModel.description}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
