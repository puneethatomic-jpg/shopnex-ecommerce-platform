import React from 'react';

export default function DashboardCard({ title, value, change, icon: Icon, changeType = 'positive' }) {
  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-violet-500/20 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">{title}</span>
        {Icon && (
          <div className="p-2.5 bg-violet-600/10 rounded-xl border border-violet-500/10 text-violet-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
        {change && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
            changeType === 'positive' 
              ? 'bg-emerald-500/10 text-emerald-400' 
              : 'bg-red-500/10 text-red-400'
          }`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
