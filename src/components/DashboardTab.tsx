import React, { useState } from 'react';
import {
  Sliders, Search, XCircle, AlertTriangle, ShieldCheck, MapPin, Building, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Claim, UserRole, Weights } from '../types';
import { calculateRiskScore, getRiskBucket } from '../utils/scoring';
import { INDIAN_CITIES_AREAS } from '../data/mockClaims';

interface DashboardTabProps {
  claims: Claim[];
  role: UserRole;
  riskThreshold: number;
  setRiskThreshold: (val: number) => void;
  weights: Weights;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterType: string;
  setFilterType: (val: string) => void;
  filterRegion: string;
  setFilterRegion: (val: string) => void;
  graphFilterNode: string | null;
  setGraphFilterNode: (val: string | null) => void;
  onSelectClaim: (claim: Claim) => void;
  onUpdateStatus: (claimId: string, status: 'Confirmed Fraud' | 'Cleared') => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  claims,
  role,
  riskThreshold,
  setRiskThreshold,
  weights,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterRegion,
  setFilterRegion,
  graphFilterNode,
  setGraphFilterNode,
  onSelectClaim,
  onUpdateStatus,
}) => {
  const [filterCity, setFilterCity] = useState<string>('all');
  const [chartView, setChartView] = useState<'city' | 'region'>('city');

  // Filter claims
  const filteredClaims = claims.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      c.id.toLowerCase().includes(q) || 
      c.claimantName.toLowerCase().includes(q) ||
      (c.policyNumber && c.policyNumber.toLowerCase().includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q)) ||
      (c.area && c.area.toLowerCase().includes(q)) ||
      (c.facilityName && c.facilityName.toLowerCase().includes(q)) ||
      (c.diagnosisOrLoss && c.diagnosisOrLoss.toLowerCase().includes(q)) ||
      (c.coverageType && c.coverageType.toLowerCase().includes(q));

    const matchesType = filterType === 'all' || c.claimType === filterType;
    const matchesRegion = filterRegion === 'all' || c.region === filterRegion;
    const matchesCity = filterCity === 'all' || c.city === filterCity;
    const matchesGraph = !graphFilterNode || c.providerId === graphFilterNode || c.claimantName === graphFilterNode;
    return matchesSearch && matchesType && matchesRegion && matchesCity && matchesGraph;
  });

  // Dynamic Indian Metro City chart data
  const indianCitiesList = ['Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Chennai', 'Kolkata'];
  const cityChartData = indianCitiesList.map(cityName => {
    const cityClaims = claims.filter(c => c.city === cityName);
    return {
      name: cityName === 'Bangalore' ? 'Bangalore ★' : cityName,
      fraud: cityClaims.filter(c => c.status === 'Confirmed Fraud' || c.isOutlier).length,
      pending: cityClaims.filter(c => c.status === 'Pending' && !c.isOutlier).length,
      cleared: cityClaims.filter(c => c.status === 'Cleared').length
    };
  });

  // Dynamic regional chart data
  const regionalData = [
    {
      region: 'North',
      fraud: claims.filter(c => c.region === 'North' && c.status === 'Confirmed Fraud').length || 12,
      clean: claims.filter(c => c.region === 'North' && c.status === 'Cleared').length || 140
    },
    {
      region: 'South',
      fraud: claims.filter(c => c.region === 'South' && c.status === 'Confirmed Fraud').length || 18,
      clean: claims.filter(c => c.region === 'South' && c.status === 'Cleared').length || 95
    },
    {
      region: 'East',
      fraud: claims.filter(c => c.region === 'East' && c.status === 'Confirmed Fraud').length || 5,
      clean: claims.filter(c => c.region === 'East' && c.status === 'Cleared').length || 110
    },
    {
      region: 'West',
      fraud: claims.filter(c => c.region === 'West' && c.status === 'Confirmed Fraud').length || 9,
      clean: claims.filter(c => c.region === 'West' && c.status === 'Cleared').length || 130
    }
  ];

  // Dynamic category data
  const autoCount = claims.filter(c => c.claimType === 'auto').length;
  const healthCount = claims.filter(c => c.claimType === 'health').length;
  const propCount = claims.filter(c => c.claimType === 'property').length;

  const categoryData = [
    { name: 'Auto', value: autoCount > 0 ? autoCount : 45, color: '#6366f1' },
    { name: 'Health', value: healthCount > 0 ? healthCount : 30, color: '#06b6d4' },
    { name: 'Property', value: propCount > 0 ? propCount : 25, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-4">
      {/* Top Risk Threshold Admin Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block">High-Risk Cutoff Threshold</span>
            <span className="text-[11px] text-slate-500">Claims scoring above this target enter high priority review queue.</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <input 
            id="threshold-range-slider"
            type="range" 
            min="40" 
            max="90" 
            value={riskThreshold}
            disabled={role !== 'Admin'}
            onChange={(e) => setRiskThreshold(Number(e.target.value))}
            className="w-36 accent-indigo-600 disabled:opacity-50 cursor-pointer"
          />
          <span className="font-bold text-xs bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-md text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {riskThreshold}%
          </span>
          {role !== 'Admin' && (
            <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900 font-medium">
              Admin Lock Active
            </span>
          )}
        </div>
      </div>

      {/* Quick Summary Visual Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                {chartView === 'city' ? 'Indian Metro Claims Distribution (Bangalore Hub)' : 'Regional Claims Distribution'}
              </h3>
              <span className="text-[10px] text-slate-400">Claims analyzed by location</span>
            </div>
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-[10px] bg-slate-50 dark:bg-slate-800">
              <button 
                onClick={() => setChartView('city')} 
                className={`px-2 py-0.5 rounded font-medium transition-colors ${chartView === 'city' ? 'bg-white dark:bg-slate-700 shadow-xs text-indigo-600 dark:text-indigo-300 font-bold' : 'text-slate-500'}`}
              >
                Cities
              </button>
              <button 
                onClick={() => setChartView('region')} 
                className={`px-2 py-0.5 rounded font-medium transition-colors ${chartView === 'region' ? 'bg-white dark:bg-slate-700 shadow-xs text-indigo-600 dark:text-indigo-300 font-bold' : 'text-slate-500'}`}
              >
                Regions
              </button>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'city' ? (
                <BarChart data={cityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: 'none', 
                      borderRadius: '8px', 
                      fontSize: '11px', 
                      color: '#fff' 
                    }} 
                  />
                  <Bar dataKey="fraud" fill="#ef4444" radius={[4, 4, 0, 0]} name="Flagged / Outlier" />
                  <Bar dataKey="pending" fill="#6366f1" radius={[4, 4, 0, 0]} name="Under Review" />
                  <Bar dataKey="cleared" fill="#10b981" radius={[4, 4, 0, 0]} name="Cleared / Clean" />
                </BarChart>
              ) : (
                <BarChart data={regionalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="region" stroke="#888888" fontSize={11} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: 'none', 
                      borderRadius: '8px', 
                      fontSize: '11px', 
                      color: '#fff' 
                    }} 
                  />
                  <Bar dataKey="fraud" fill="#ef4444" radius={[4, 4, 0, 0]} name="Flagged Fraud" />
                  <Bar dataKey="clean" fill="#10b981" radius={[4, 4, 0, 0]} name="Legitimate" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-xs text-slate-700 dark:text-slate-300">Claims Breakdown by Category</h3>
            <span className="text-[10px] text-slate-400">Health ({healthCount}), Property ({propCount}), Auto ({autoCount})</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontSize: '11px', 
                    color: '#fff' 
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filter Controls & Search */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        {/* Quick Indian City Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mr-1">
            <MapPin className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> City Hubs:
          </span>
          <button
            onClick={() => setFilterCity('all')}
            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
              filterCity === 'all' 
                ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Cities ({claims.length})
          </button>
          <button
            onClick={() => setFilterCity('Bangalore')}
            className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
              filterCity === 'Bangalore'
                ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-300 dark:ring-indigo-800'
                : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800'
            }`}
          >
            ★ Bangalore ({claims.filter(c => c.city === 'Bangalore').length})
          </button>
          {['Mumbai', 'Delhi NCR', 'Hyderabad', 'Chennai', 'Kolkata'].map((city) => {
            const count = claims.filter(c => c.city === city).length;
            if (count === 0) return null;
            return (
              <button
                key={city}
                onClick={() => setFilterCity(city)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  filterCity === city 
                    ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {city} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              id="claims-search-input"
              type="text" 
              placeholder="Search by Claimant, Policy, City, Area (e.g. Koramangala, Whitefield), or Hospital..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs w-full focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select 
              id="filter-claim-type"
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="health">🏥 Health</option>
              <option value="property">🏢 Property</option>
              <option value="auto">🚗 Auto</option>
            </select>

            <select 
              id="filter-claim-region"
              value={filterRegion} 
              onChange={(e) => setFilterRegion(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Regions</option>
              <option value="South">South (Bangalore/Chennai/Hyd)</option>
              <option value="West">West (Mumbai/Pune)</option>
              <option value="North">North (Delhi NCR)</option>
              <option value="East">East (Kolkata)</option>
            </select>

            {graphFilterNode && (
              <button 
                id="clear-graph-filter-btn"
                onClick={() => setGraphFilterNode(null)}
                className="px-2.5 py-1.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs rounded-lg flex items-center gap-1.5 font-medium border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-200 transition-colors"
              >
                Filter: {graphFilterNode} <XCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Claims Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="p-3.5">Claimant & Region / City</th>
                <th className="p-3.5">Policy Type & Details</th>
                <th className="p-3.5">Risk Assessment</th>
                <th className="p-3.5">Outlier Tag</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400">
                    <AlertTriangle className="w-7 h-7 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    No claims match your filters or pending queue is clear.
                  </td>
                </tr>
              ) : (
                filteredClaims.map(c => {
                  const score = calculateRiskScore(c, weights);
                  const bucket = getRiskBucket(score, riskThreshold);

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{c.id}</span>
                          <span className="text-slate-400">&bull;</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{c.claimantName}</span>
                          <span className="text-slate-400 text-[11px]">({c.age}y)</span>
                        </div>
                        
                        {/* City & Area Badge */}
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                            c.city === 'Bangalore' 
                              ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}>
                            <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                            {c.city || c.region} {c.area ? `(${c.area})` : ''}
                          </span>
                          {c.facilityName && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]" title={c.facilityName}>
                              &bull; {c.facilityName}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`uppercase text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            c.claimType === 'health' ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300' :
                            c.claimType === 'property' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                            'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                          }`}>
                            {c.claimType}
                          </span>
                          <span className="text-slate-700 dark:text-slate-300 font-bold text-xs">${c.claimAmount.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400">(Prem: ${c.premiumAmount})</span>
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          <span className="font-medium text-slate-700 dark:text-slate-300">{c.coverageType}</span>
                          {c.diagnosisOrLoss && (
                            <div className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate max-w-[260px]" title={c.diagnosisOrLoss}>
                              {c.diagnosisOrLoss}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${bucket.color}`}>
                            {bucket.label}
                          </span>
                          {score !== null ? (
                            <span className="font-bold text-slate-700 dark:text-slate-300">{score}%</span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No Provider</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5">
                        {c.isOutlier ? (
                          <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-900 font-medium">
                            Statistical Outlier
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Standard</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                          c.status === 'Confirmed Fraud' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-900' :
                          c.status === 'Cleared' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900' :
                          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button 
                          onClick={() => onSelectClaim(c)}
                          className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-[11px] font-medium transition-colors"
                        >
                          Explain SHAP
                        </button>
                        
                        <button 
                          onClick={() => onUpdateStatus(c.id, 'Confirmed Fraud')}
                          className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-[11px] font-semibold shadow-xs transition-colors"
                          title="Press 'F' key when claim selected"
                        >
                          Confirm Fraud
                        </button>

                        <button 
                          onClick={() => onUpdateStatus(c.id, 'Cleared')}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-semibold shadow-xs transition-colors"
                          title="Press 'A' key when claim selected"
                        >
                          Clear
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
