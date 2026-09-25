import React from 'react';
import { X, Info, AlertTriangle, ShieldCheck, Target } from 'lucide-react';

interface MetricsModalProps {
  onClose: () => void;
}

export const MetricsModal: React.FC<MetricsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 max-w-lg w-full p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-base flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Why Accuracy Alone Fails in Fraud Detection
          </h3>
          <button 
            id="btn-close-metrics-modal"
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          In real-world insurance claim data, fraudulent incidents typically represent only <strong>1% to 3%</strong> of total volume. 
          A naive model predicting that <em>every single claim</em> is legitimate would achieve an impressive <strong>97% to 99% accuracy</strong>, despite detecting <strong>zero</strong> fraud and causing catastrophic loss.
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/50 space-y-1">
            <div className="font-semibold text-red-900 dark:text-red-200 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Precision (91.4%)
            </div>
            <p className="text-[11px] text-red-800 dark:text-red-300">
              When Fraud Shield flags a claim, what percentage is truly fraudulent? High precision minimizes costly false alarms and adjuster fatigue.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/50 space-y-1">
            <div className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-600" /> Recall (88.7%)
            </div>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
              Out of all actual fraud syndicates, what percentage did the system successfully catch? High recall prevents undetected payouts.
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900 text-xs space-y-1">
          <div className="font-semibold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Production Governance Standard
          </div>
          <p className="text-indigo-800 dark:text-indigo-300 text-[11px] leading-relaxed">
            We evaluate models using the <strong>harmonic F1-score (90.0%) and ROC-AUC (0.94)</strong> with calibrated decision boundaries, rather than unweighted top-line accuracy.
          </p>
        </div>

        <button 
          id="btn-understand-metrics-close"
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
        >
          Understood, Close
        </button>
      </div>
    </div>
  );
};
