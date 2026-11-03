import React from 'react';

const TONE_CLASSES = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
  rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
  slate: 'bg-slate-50 text-slate-700 border-slate-200/80',
};

export function StatusBadge({ tone = 'slate', label, icon: Icon }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${TONE_CLASSES[tone]}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </span>
  );
}