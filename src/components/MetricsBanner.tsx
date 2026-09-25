import React from 'react';
import { Info, ChevronRight, TrendingUp } from 'lucide-react';

interface MetricsBannerProps {
  onOpenMetricsModal: () => void;
}

export const MetricsBanner: React.FC<MetricsBannerProps> = ({ onOpenMetricsModal }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
        <span className="text-xs font-medium text-slate-500 flex items-center justify-between">
          Precision
          <button 
            onClick={onOpenMetricsModal}
            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Learn why precision matters"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </span>
        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">91.4%</span>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> +2.1% from last retrain
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
        <span className="text-xs font-medium text-slate-500">Recall</span>
        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">88.7%</span>
        <span className="text-[10px] text-slate-400">High detection rate</span>
      </div>

      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
        <span className="text-xs font-medium text-slate-500">F1 Score</span>
        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">90.0%</span>
        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">Balanced performance</span>
      </div>

      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
        <span className="text-xs font-medium text-slate-500">ROC-AUC</span>
        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">0.94</span>
        <span className="text-[10px] text-slate-400">XGBoost Classifier</span>
      </div>

      <div className="col-span-2 md:col-span-1 bg-indigo-50 dark:bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex flex-col justify-between">
        <span className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">Class Imbalance Notice</span>
        <p className="text-[11px] text-indigo-800 dark:text-indigo-300 leading-snug mt-1">
          Fraud (~2.4%) is rare. Accuracy alone is misleading; metrics emphasize Precision/Recall trade-offs.
        </p>
        <button 
          id="btn-why-accuracy-fails"
          onClick={onOpenMetricsModal}
          className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-2 hover:underline text-left flex items-center gap-1"
        >
          Why accuracy fails <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
