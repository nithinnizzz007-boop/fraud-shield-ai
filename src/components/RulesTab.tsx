import React from 'react';
import { Sliders, RotateCcw, ShieldCheck } from 'lucide-react';
import { Weights } from '../types';

interface RulesTabProps {
  weights: Weights;
  setWeights: React.Dispatch<React.SetStateAction<Weights>>;
}

const DEFAULT_WEIGHTS: Weights = {
  policyAge: 35,
  ratioMultiplier: 25,
  providerHistory: 30,
  noPoliceReport: 10
};

export const RulesTab: React.FC<RulesTabProps> = ({ weights, setWeights }) => {
  const handleReset = () => {
    setWeights(DEFAULT_WEIGHTS);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Dynamic Risk Rule Weight Adjuster
          </h3>
          <p className="text-xs text-slate-500">Customize penalty weights used by the scoring engine to evaluate incoming claims in real-time.</p>
        </div>

        <button 
          id="btn-reset-weights"
          onClick={handleReset}
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-slate-800 dark:text-slate-200 block">
              Policy Age Penalty (&lt;30 days)
            </label>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/60">
              +{weights.policyAge} Points
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Penalizes claims initiated shortly after policy inception, a hallmark of premeditated fraud.
          </p>
          <input 
            id="slider-policy-age"
            type="range" 
            min="0" 
            max="50" 
            value={weights.policyAge} 
            onChange={(e) => setWeights({ ...weights, policyAge: Number(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer" 
          />
        </div>

        <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-slate-800 dark:text-slate-200 block">
              Claim-to-Premium Ratio Multiplier
            </label>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/60">
              {weights.ratioMultiplier}x Factor
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Scales risk score when claimed payout significantly surpasses historical customer premium payments.
          </p>
          <input 
            id="slider-ratio-multiplier"
            type="range" 
            min="10" 
            max="50" 
            value={weights.ratioMultiplier} 
            onChange={(e) => setWeights({ ...weights, ratioMultiplier: Number(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer" 
          />
        </div>

        <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-slate-800 dark:text-slate-200 block">
              Flagged Provider History Penalty
            </label>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/60">
              +{weights.providerHistory} Points
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Adds penalty points when the repair shop, medical provider, or inspector has &gt;5 flagged cases on record.
          </p>
          <input 
            id="slider-provider-history"
            type="range" 
            min="0" 
            max="50" 
            value={weights.providerHistory} 
            onChange={(e) => setWeights({ ...weights, providerHistory: Number(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer" 
          />
        </div>

        <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-slate-800 dark:text-slate-200 block">
              Missing Police Report Penalty (&gt;$5k)
            </label>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/60">
              +{weights.noPoliceReport} Points
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            High-severity claims (&gt;$5,000) that lack official incident police filing are heavily scrutinized.
          </p>
          <input 
            id="slider-police-report"
            type="range" 
            min="0" 
            max="30" 
            value={weights.noPoliceReport} 
            onChange={(e) => setWeights({ ...weights, noPoliceReport: Number(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer" 
          />
        </div>
      </div>
    </div>
  );
};
