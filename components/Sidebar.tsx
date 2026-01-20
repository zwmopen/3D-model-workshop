
import React, { useState } from 'react';
import { ModelConfig, Category } from '../types';
import { LayoutGrid, Trees, Dog, Box, Search, Shapes, ChevronRight } from 'lucide-react';

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

  const neumorphicOut = "shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff]";
  const neumorphicIn = "shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff]";

  return (
    <aside className="w-80 h-full bg-[#e0e5ec] rounded-r-[4rem] shadow-[25px_0_60px_rgba(0,0,0,0.08)] flex flex-col z-20 border-r border-white/60 relative overflow-hidden">
      <div className="p-10 flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full bg-[#e0e5ec] ${neumorphicOut} flex items-center justify-center border border-white/80`}>
            <Box className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tighter leading-tight">3D 设计云工坊</h1>
            <p className="text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase">高精数字资产库</p>
          </div>
        </div>
        
        <div className={`relative rounded-full bg-[#e0e5ec] ${neumorphicIn} px-5 py-3.5 flex items-center gap-3 group transition-all duration-300`}>
          <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text"
            placeholder="搜寻高精模型..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-[12px] focus:outline-none text-slate-600 placeholder:text-slate-400 w-full font-bold"
          />
        </div>
      </div>

      {/* 分类切换：极致圆角 */}
      <div className="flex p-2 gap-2 bg-[#e0e5ec] mx-8 mb-8 rounded-full shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff]">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`flex-1 flex flex-col items-center py-3 rounded-full transition-all duration-500 ${
              filter === cat.id ? `bg-[#e0e5ec] text-indigo-600 ${neumorphicOut}` : 'text-slate-400 hover:text-slate-500'
            }`}
          >
            <cat.icon className="w-4 h-4 mb-1" />
            <span className="text-[9px] font-black uppercase tracking-wider">{cat.label}</span>
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto px-8 pb-12 space-y-4 custom-scrollbar">
        {filteredModels.map((model) => {
          const isActive = activeId === model.id;
          return (
            <button
              key={model.id}
              onClick={() => onSelect(model)}
              className={`w-full group flex items-center gap-4 p-3 rounded-full transition-all duration-300 border border-transparent ${
                isActive 
                  ? `bg-indigo-50/50 ${neumorphicIn} border-indigo-200/40` 
                  : `bg-[#e0e5ec] hover:translate-x-2 ${neumorphicOut}`
              }`}
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl transition-all duration-500 ${isActive ? 'scale-110 shadow-xl' : 'group-hover:rotate-12'}`} style={{ backgroundColor: `${model.color}20` }}>
                {model.emoji}
              </div>

              <div className="flex-1 text-left min-w-0">
                <h3 className={`text-[12px] font-black truncate tracking-tight ${isActive ? 'text-indigo-600' : 'text-slate-700'}`}>
                  {model.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: model.color }} />
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{model.category === 'animal' ? '动物' : model.category === 'tree' ? '植物' : '几何'}</span>
                </div>
              </div>

              {isActive ? (
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
                   <ChevronRight className="w-3.5 h-3.5 text-white" />
                </div>
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
