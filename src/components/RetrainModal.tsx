import React from 'react';
import { X, RefreshCw, CheckCircle2, Cpu } from 'lucide-react';

interface RetrainModalProps {
  progress: number;
  isComplete: boolean;
  trainingCount: number;
  onClose: () => void;
}

export const RetrainModal: React.FC<RetrainModalProps> = ({
  progress,
  isComplete,
  trainingCount,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 max-w-md w-full p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="text-left">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Retraining ML Pipeline
            </h3>
            <span className="text-xs text-slate-400">Gradient boosted trees & SHAP kernel weights</span>
          </div>
          {isComplete && (
            <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="text-xs text-slate-500">
          Ingesting {trainingCount > 0 ? trainingCount : 'historical'} newly labeled adjuster feedback records into the retraining pipeline...
        </p>

        {/* Progress Bar */}
        <div className="space-y-1.5 text-left">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Optimization Progress</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-300 shadow-xs" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        {isComplete ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl space-y-3">
            <div className="flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Retraining Complete!
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              New model version <strong>v2.4.1</strong> deployed. Validation F1-score improved from 90.0% to <strong>91.2% (+1.2%)</strong> with lower false positive rate on auto claims.
            </p>
            <button 
              id="btn-retrain-done"
              onClick={onClose} 
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              Apply Model & Close
            </button>
          </div>
        ) : (
          <div className="text-xs text-slate-400 flex items-center justify-center gap-2 py-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            <span>Running 5-fold cross validation & Bayesian hyperparameter search...</span>
          </div>
        )}
      </div>
    </div>
  );
};
