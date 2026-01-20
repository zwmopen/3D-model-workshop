
import React, { useState } from 'react';
import { ModelConfig, Category } from '../types';
import { LayoutGrid, Trees, Dog, Box, Search, Shapes } from 'lucide-react';

interface SidebarProps {
  models: ModelConfig[];
  activeId: string;
  onSelect: (model: ModelConfig) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ models, activeId, onSelect }) => {
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredModels = models.filter(m => 
    (filter === 'all' || m.category === filter) &&
    (m.name.toLowerCase().includes(search.toLowerCase()))
  );

  const categories: { id: Category | 'all', label: string, icon: any }[] = [
    { id: 'all', label: '全部', icon: LayoutGrid },
    { id: 'primitive', label: '几何', icon: Shapes },
    { id: 'tree', label: '植物', icon: Trees },
    { id: 'animal', label: '动物', icon: Dog },
  ];

  const neumorphicOut = "shadow-[8px_8px_16px_#b8b9be,-8px_-8px_16px_#ffffff]";
  const neumorphicIn = "shadow-[inset_6px_6px_12px_#b8b9be,inset_-6px_-6px_12px_#ffffff]";

  return (
    <aside className="w-96 bg-[#e0e5ec] border-r border-white/20 flex flex-col z-20">
      <div className="p-10 flex flex-col gap-8">
        <div className={`p-6 rounded-[2.5rem] bg-[#e0e5ec] ${neumorphicOut} flex items-center gap-5 border border-white/60`}>
          <div className="bg-indigo-600 p-3.5 rounded-[1.5rem] shadow-xl shadow-indigo-200">
            <Box className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-700 block tracking-tighter leading-none">精致云库</span>
            <span className="text-[11px] text-slate-400 font-bold uppercase mt-2.5 block tracking-widest">
              ASSETS: {models.length}
            </span>
          </div>
        </div>
        
        <div className={`relative rounded-full bg-[#e0e5ec] ${neumorphicIn} p-1.5`}>
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="搜索模型..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none py-3.5 pl-12 pr-6 text-sm focus:outline-none text-slate-600 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className={`flex p-2 gap-2 bg-[#e0e5ec] mx-8 mb-6 rounded-full ${neumorphicIn}`}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`flex-1 flex flex-col items-center py-3.5 rounded-full transition-all duration-500 ${
              filter === cat.id ? `bg-[#e0e5ec] text-indigo-600 ${neumorphicOut} border border-white/50` : 'text-slate-400 hover:text-slate-500'
            }`}
          >
            <cat.icon className="w-4 h-4 mb-1" />
            <span className="text-[9px] font-black uppercase tracking-tighter">{cat.label}</span>
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto px-8 pb-10 space-y-6 custom-scrollbar">
        {filteredModels.map((model) => {
          const displayIndex = models.length - models.indexOf(model); 
          const isActive = activeId === model.id;
          
          return (
            <button
              key={model.id}
              onClick={() => onSelect(model)}
              className={`w-full group flex items-center gap-5 p-5 rounded-[2.5rem] transition-all duration-500 border border-transparent ${
                isActive ? `bg-[#e0e5ec] ${neumorphicIn} scale-95 border-white/40` : `bg-[#e0e5ec] hover:scale-[1.05] ${neumorphicOut}`
              }`}
            >
              <div className={`text-xs font-mono font-black w-8 text-right ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                {String(displayIndex).padStart(2, '0')}
              </div>

              <div className="w-14 h-14 rounded-[1.5rem] shadow-inner overflow-hidden flex-shrink-0 relative" style={{ backgroundColor: model.color }}>
                <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-white to-black" />
              </div>

              <div className="flex-1 text-left">
                <h3 className={`text-sm font-black transition-colors truncate ${isActive ? 'text-indigo-600' : 'text-slate-600'}`}>
                  {model.name}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">{model.category.toUpperCase()}</p>
              </div>

              {isActive && <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.6)] animate-pulse" />}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
