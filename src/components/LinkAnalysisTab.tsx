import React from 'react';
import { Network, ArrowRight, ShieldAlert, CheckCircle2, User } from 'lucide-react';

interface LinkAnalysisTabProps {
  graphFilterNode: string | null;
  setGraphFilterNode: (node: string | null) => void;
  onNavigateToDashboard: () => void;
}

export const LinkAnalysisTab: React.FC<LinkAnalysisTabProps> = ({
  graphFilterNode,
  setGraphFilterNode,
  onNavigateToDashboard
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Network className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Interactive Fraud Ring Topology
          </h3>
          <p className="text-xs text-slate-500">Click on nodes (Garages, Doctors, or Claimants) to inspect or filter claims tied to organized syndicates.</p>
        </div>

        {graphFilterNode && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Selected: <strong className="text-indigo-600 dark:text-indigo-400">{graphFilterNode}</strong>
            </span>
            <button 
              onClick={() => setGraphFilterNode(null)}
              className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-slate-600 dark:text-slate-300"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* SVG Visual Network Node Graph */}
      <div className="h-88 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 relative flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 800 360" className="w-full h-full select-none">
          <defs>
            <linearGradient id="fraudGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="cleanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Background grid lines */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-200/50 dark:text-slate-800/40" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connector Lines */}
          {/* Rahul to DOC-109 (Clean connection) */}
          <line 
            x1="220" y1="180" x2="400" y2="90" 
            stroke="#10b981" 
            strokeWidth="2" 
            strokeDasharray="4 4" 
            opacity={graphFilterNode && graphFilterNode !== 'Rahul Sharma' && graphFilterNode !== 'DOC-109' ? 0.2 : 0.8}
          />
          {/* Rahul to GAR-402 (High risk link) */}
          <line 
            x1="220" y1="180" x2="400" y2="240" 
            stroke="#ef4444" 
            strokeWidth="3" 
            opacity={graphFilterNode && graphFilterNode !== 'Rahul Sharma' && graphFilterNode !== 'GAR-402' ? 0.2 : 0.9}
          />
          {/* Vikram to GAR-402 (High risk link) */}
          <line 
            x1="580" y1="180" x2="400" y2="240" 
            stroke="#ef4444" 
            strokeWidth="3" 
            opacity={graphFilterNode && graphFilterNode !== 'Vikram Singh' && graphFilterNode !== 'GAR-402' ? 0.2 : 0.9}
          />
          {/* Aarav to GAR-402 (High risk link) */}
          <line 
            x1="400" y1="320" x2="400" y2="240" 
            stroke="#ef4444" 
            strokeWidth="2" 
            strokeDasharray="2 2"
            opacity={graphFilterNode && graphFilterNode !== 'Aarav Mehta' && graphFilterNode !== 'GAR-402' ? 0.2 : 0.7}
          />

          {/* Link labels */}
          <text x="300" y="130" fill="#10b981" fontSize="10" fontWeight="600" opacity="0.8">Legitimate Claim</text>
          <text x="290" y="225" fill="#ef4444" fontSize="10" fontWeight="700">Flagged Collision Ring (7.1x)</text>
          <text x="490" y="225" fill="#ef4444" fontSize="10" fontWeight="700">Shared Provider Link</text>

          {/* NODES */}
          {/* Central Hub Node: GAR-402 */}
          <g 
            id="node-gar-402"
            className="cursor-pointer transition-transform hover:scale-105" 
            onClick={() => setGraphFilterNode('GAR-402')}
          >
            <circle cx="400" cy="240" r="38" fill="url(#fraudGlow)" />
            <circle cx="400" cy="240" r="26" fill="#ef4444" stroke={graphFilterNode === 'GAR-402' ? '#ffffff' : '#f87171'} strokeWidth={graphFilterNode === 'GAR-402' ? 4 : 2} />
            <text x="400" y="244" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">GAR-402</text>
            <text x="400" y="284" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">Auto Repair Syndicate Hub</text>
          </g>

          {/* Node: DOC-109 (Medical Provider) */}
          <g 
            id="node-doc-109"
            className="cursor-pointer transition-transform hover:scale-105" 
            onClick={() => setGraphFilterNode('DOC-109')}
          >
            <circle cx="400" cy="90" r="32" fill="url(#cleanGlow)" />
            <circle cx="400" cy="90" r="22" fill="#10b981" stroke={graphFilterNode === 'DOC-109' ? '#ffffff' : '#34d399'} strokeWidth={graphFilterNode === 'DOC-109' ? 4 : 2} />
            <text x="400" y="94" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">DOC-109</text>
            <text x="400" y="60" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="600">Verified Physician</text>
          </g>

          {/* Claimant Node: Rahul Sharma */}
          <g 
            id="node-rahul-sharma"
            className="cursor-pointer transition-transform hover:scale-105" 
            onClick={() => setGraphFilterNode('Rahul Sharma')}
          >
            <circle cx="220" cy="180" r="24" fill="#6366f1" stroke={graphFilterNode === 'Rahul Sharma' ? '#ffffff' : '#818cf8'} strokeWidth={graphFilterNode === 'Rahul Sharma' ? 4 : 2} />
            <text x="220" y="184" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Rahul S.</text>
            <text x="220" y="214" textAnchor="middle" fill="currentColor" className="text-slate-600 dark:text-slate-400" fontSize="10">CLM-1092</text>
          </g>

          {/* Claimant Node: Vikram Singh */}
          <g 
            id="node-vikram-singh"
            className="cursor-pointer transition-transform hover:scale-105" 
            onClick={() => setGraphFilterNode('Vikram Singh')}
          >
            <circle cx="580" cy="180" r="24" fill="#6366f1" stroke={graphFilterNode === 'Vikram Singh' ? '#ffffff' : '#818cf8'} strokeWidth={graphFilterNode === 'Vikram Singh' ? 4 : 2} />
            <text x="580" y="184" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Vikram S.</text>
            <text x="580" y="214" textAnchor="middle" fill="currentColor" className="text-slate-600 dark:text-slate-400" fontSize="10">CLM-1094</text>
          </g>

          {/* Claimant Node: Aarav Mehta */}
          <g 
            id="node-aarav-mehta"
            className="cursor-pointer transition-transform hover:scale-105" 
            onClick={() => setGraphFilterNode('GAR-402')}
          >
            <circle cx="400" cy="320" r="18" fill="#8b5cf6" stroke="#c084fc" strokeWidth="2" />
            <text x="400" y="324" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">Aarav M.</text>
          </g>
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-lg text-[11px] border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <span className="w-3 h-3 rounded-full bg-red-500 shrink-0"></span>
            <span>Flagged Provider / Syndicate Hub (GAR-402)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <span className="w-3 h-3 rounded-full bg-indigo-500 shrink-0"></span>
            <span>Associated Claimants</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
            <span>Verified Legitimate Provider (DOC-109)</span>
          </div>
        </div>
      </div>

      {graphFilterNode && (
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900 flex flex-wrap justify-between items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-indigo-950 dark:text-indigo-200">
              Filtered dashboard queue for network entity: <strong>{graphFilterNode}</strong>
            </span>
          </div>
          <button 
            id="jump-to-filtered-claims-btn"
            onClick={onNavigateToDashboard}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            Jump to Filtered Claims <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
