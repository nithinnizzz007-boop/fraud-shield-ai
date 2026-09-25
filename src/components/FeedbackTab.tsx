import React from 'react';
import { Database, RefreshCw, History, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Claim, AuditLogItem, UserRole } from '../types';

interface FeedbackTabProps {
  trainingData: Claim[];
  auditLog: AuditLogItem[];
  role: UserRole;
  onStartRetrain: () => void;
}

export const FeedbackTab: React.FC<FeedbackTabProps> = ({
  trainingData,
  auditLog,
  role,
  onStartRetrain
}) => {
  return (
    <div className="space-y-4">
      {/* Header & Retrain Action */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-3 shadow-xs">
        <div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Active Feedback Loop & Model Retraining
          </h3>
          <p className="text-xs text-slate-500">
            Every human adjuster decision creates ground-truth training records for periodic gradient boosting retraining.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {role !== 'Admin' && (
            <span className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900">
              Admin Role Required to Retrain
            </span>
          )}
          <button 
            id="btn-retrain-model-now"
            onClick={onStartRetrain}
            disabled={role !== 'Admin'}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retrain Model Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Labeled Records Queue */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Recently Logged Ground-Truth Labels ({trainingData.length})
            </h4>
            <span className="text-[10px] text-slate-400">Queue for batch retraining</span>
          </div>

          {trainingData.length === 0 ? (
            <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              <Database className="w-6 h-6 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-xs">No human decisions logged in this session yet.</p>
              <p className="text-[11px] text-slate-500 mt-1">Resolve claims on the dashboard (Confirm Fraud / Clear) to populate ground-truth data.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {trainingData.map((item, idx) => (
                <div key={idx} className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg flex justify-between items-center text-xs bg-slate-50/50 dark:bg-slate-800/30">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.id}</span>
                    <span className="text-slate-500 text-[11px]"> &bull; {item.claimantName} (${item.claimAmount.toLocaleString()})</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                    item.status === 'Confirmed Fraud' 
                      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-900' 
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Trail Log */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-indigo-600" /> Adjuster Action Audit Trail ({auditLog.length})
            </h4>
            <span className="text-[10px] text-slate-400">Compliance & Governance</span>
          </div>

          {auditLog.length === 0 ? (
            <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              <History className="w-6 h-6 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-xs">No audit logs recorded yet.</p>
              <p className="text-[11px] text-slate-500 mt-1">Status changes and claim decisions will appear here with author and time.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {auditLog.map((log) => (
                <div key={log.id} className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg flex justify-between items-center text-xs bg-slate-50/50 dark:bg-slate-800/30">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{log.claimId}</span>
                    <span className="text-slate-600 dark:text-slate-400"> - {log.action}</span>
                    <div className="text-[10px] text-slate-400">by {log.user}</div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
