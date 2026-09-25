import React from 'react';
import { X, CheckCircle, AlertTriangle, Clock, Calendar, ShieldCheck, ShieldAlert, MapPin, Building, Activity, FileCheck } from 'lucide-react';
import { Claim } from '../types';

interface SHAPDrawerProps {
  claim: Claim;
  onClose: () => void;
  onUpdateStatus: (claimId: string, status: 'Confirmed Fraud' | 'Cleared') => void;
}

export const SHAPDrawer: React.FC<SHAPDrawerProps> = ({ claim, onClose, onUpdateStatus }) => {
  const ratio = (claim.claimAmount / (claim.premiumAmount || 1)).toFixed(1);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end transition-opacity">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full p-5 overflow-y-auto space-y-4 shadow-2xl border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> SHAP Risk Attribution
            </h3>
            <span className="text-xs text-slate-500">Explainable AI feature breakdown & regional context</span>
          </div>
          <button 
            id="btn-close-shap-drawer"
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Claim Summary Box */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{claim.id}</div>
              <div className="font-bold text-base text-slate-900 dark:text-slate-100">{claim.claimantName}</div>
              <div className="text-[11px] text-slate-500">{claim.policyNumber} &bull; {claim.coverageType}</div>
            </div>
            <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded ${
              claim.claimType === 'health' ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300' :
              claim.claimType === 'property' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
              'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
            }`}>
              {claim.claimType}
            </span>
          </div>

          {/* Regional Location Tag */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">{claim.city || claim.region}</span>
            {claim.area && <span className="text-slate-500 dark:text-slate-400">&bull; {claim.area}</span>}
            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300 ml-auto font-medium">
              {claim.region} Region
            </span>
          </div>

          {/* Facility & Diagnosis if available */}
          {(claim.facilityName || claim.diagnosisOrLoss) && (
            <div className="space-y-1.5 text-xs bg-slate-100/70 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/50">
              {claim.facilityName && (
                <div className="flex items-start gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {claim.claimType === 'health' ? 'Hospital / Clinic' : claim.claimType === 'property' ? 'Premises / Property' : 'Garage'}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{claim.facilityName}</span>
                  </div>
                </div>
              )}
              {claim.diagnosisOrLoss && (
                <div className="flex items-start gap-1.5 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                  <Activity className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {claim.claimType === 'health' ? 'Diagnosis & Procedure' : claim.claimType === 'property' ? 'Loss Peril & Damaged Stock' : 'Damage Particulars'}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">{claim.diagnosisOrLoss}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Claim Amount</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">${claim.claimAmount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Annual Premium</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">${claim.premiumAmount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Claim/Prem Ratio</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{ratio}x</span>
            </div>
          </div>
        </div>

        {/* Feature Impact Horizontal Bars */}
        <div className="space-y-3">
          <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span>Top Risk Drivers (Feature Importance)</span>
            <span className="text-[10px] text-slate-400 font-normal">Positive = Fraud Risk</span>
          </h4>

          {claim.shapFactors.length === 0 ? (
            <p className="text-xs text-slate-400">No SHAP factors computed for this claim.</p>
          ) : (
            <div className="space-y-2.5">
              {claim.shapFactors.map((f, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{f.factor}</span>
                    <span className={`font-bold ${f.impact === 'positive' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {f.impact === 'positive' ? `+${f.weight}%` : `-${f.weight}%`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${f.impact === 'positive' ? 'bg-red-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${Math.min(100, f.weight * 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step Timeline */}
        <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" /> Incident & Report Timeline
          </h4>
          <div className="space-y-3 pl-2 border-l-2 border-indigo-500 dark:border-indigo-400 ml-1.5 py-1">
            {claim.timeline.map((t, idx) => (
              <div key={idx} className="text-xs relative pl-3.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500 absolute -left-[19px] top-1.5 ring-4 ring-white dark:ring-slate-900" />
                <div className="font-semibold text-slate-800 dark:text-slate-200">{t.title}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" /> {t.date}
                </div>
                <div className="text-slate-600 dark:text-slate-400 mt-0.5">{t.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Decision Buttons */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => {
                onUpdateStatus(claim.id, 'Confirmed Fraud');
                onClose();
              }}
              className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              Confirm Fraud (F)
            </button>
            <button
              onClick={() => {
                onUpdateStatus(claim.id, 'Cleared');
                onClose();
              }}
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              Clear Claim (A)
            </button>
          </div>

          {/* Keyboard Hotkey Tip */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1 border border-slate-200/80 dark:border-slate-700/60">
            <div className="font-semibold text-indigo-600 dark:text-indigo-400">Quick Hotkeys</div>
            <p className="text-[11px] text-slate-500">
              Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 font-mono text-slate-700 dark:text-slate-200">F</kbd> to Confirm Fraud or <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 font-mono text-slate-700 dark:text-slate-200">A</kbd> to Clear Claim instantly while inspecting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
