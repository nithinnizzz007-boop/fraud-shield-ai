import React, { useState } from 'react';
import { X, Upload, FileText, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { Claim } from '../types';
import { CSV_SAMPLE_TEMPLATE } from '../data/mockClaims';
import { generateSHAPFactors } from '../utils/scoring';

interface BulkUploadModalProps {
  onClose: () => void;
  onImportClaims: (newClaims: Claim[]) => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ onClose, onImportClaims }) => {
  const [csvContent, setCsvContent] = useState('');
  const [parsedClaims, setParsedClaims] = useState<Claim[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleLoadSample = () => {
    setCsvContent(CSV_SAMPLE_TEMPLATE);
    parseCSV(CSV_SAMPLE_TEMPLATE);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_SAMPLE_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'fraud_shield_claims_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        setCsvContent(text);
        parseCSV(text);
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    setParseError(null);
    try {
      const lines = text.trim().split('\n').filter(l => l.trim().length > 0);
      if (lines.length < 2) {
        setParseError('CSV must have a header row and at least one data row.');
        setParsedClaims([]);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const records: Claim[] = [];
      const today = new Date().toISOString().split('T')[0];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        if (parts.length < 5) continue;

        const row: Record<string, string> = {};
        headers.forEach((h, index) => {
          row[h] = parts[index] || '';
        });

        const claimantName = row['claimantname'] || `Claimant ${i}`;
        const age = Number(row['age']) || 35;
        const policyNumber = row['policynumber'] || `POL-${Math.floor(10000 + Math.random() * 90000)}`;
        const premiumAmount = Number(row['premiumamount']) || 1200;
        const claimAmount = Number(row['claimamount']) || 5000;
        const claimType = (row['claimtype'] as 'auto' | 'health' | 'property') || 'health';
        const incidentDate = row['incidentdate'] || today;
        const policeReport = row['policereport'] === 'true' || row['policereport'] === '1';
        const providerId = row['providerid'] ? row['providerid'] : null;
        const city = row['city'] || 'Bangalore';
        const area = row['area'] || (city === 'Bangalore' ? 'Koramangala' : 'Central');
        const region = (row['region'] as 'North' | 'South' | 'East' | 'West') || (city === 'Bangalore' || city === 'Hyderabad' || city === 'Chennai' ? 'South' : city === 'Mumbai' || city === 'Pune' ? 'West' : city === 'Delhi NCR' ? 'North' : 'East');
        const facilityName = row['facilityname'] || row['facility'] || undefined;
        const diagnosisOrLoss = row['diagnosisorloss'] || row['diagnosis'] || row['loss'] || undefined;
        const coverageType = row['coveragetype'] || (claimType === 'health' ? 'Cashless Mediclaim' : claimType === 'property' ? 'Property Multi-Peril' : 'Comprehensive Auto');

        const id = `CLM-${Math.floor(2000 + Math.random() * 8000)}`;
        const ratio = claimAmount / (premiumAmount || 1);
        const isOutlier = ratio > 6 || claimAmount > 10000;

        const partial: Partial<Claim> = {
          claimantName,
          claimAmount,
          premiumAmount,
          policeReport,
          providerId
        };

        records.push({
          id,
          claimantName,
          age,
          policyNumber,
          premiumAmount,
          coverageType,
          claimAmount,
          claimType,
          incidentDate,
          reportDate: today,
          policeReport,
          providerId,
          region,
          city,
          area,
          facilityName,
          diagnosisOrLoss,
          status: 'Pending',
          providerHistoryCount: providerId === 'GAR-402' || providerId === 'DOC-808' || providerId === 'PROV-701' ? 14 : (providerId ? 2 : 0),
          policyStartDate: '2025-06-01',
          isOutlier,
          shapFactors: generateSHAPFactors(partial),
          timeline: [
            { date: '2025-06-01', title: 'Policy Initiated', detail: `${coverageType} started in ${city}` },
            { date: incidentDate, title: 'Reported Incident', detail: diagnosisOrLoss || `${claimType} loss registered at ${area}` },
            { date: today, title: 'CSV Bulk Ingestion', detail: 'Automated ingestion into Fraud Shield queue' }
          ]
        });
      }

      if (records.length === 0) {
        setParseError('Could not parse any valid claim rows.');
      } else {
        setParsedClaims(records);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown parsing error';
      setParseError(`Failed to parse CSV: ${errorMsg}`);
    }
  };

  const handleConfirmImport = () => {
    if (parsedClaims.length > 0) {
      onImportClaims(parsedClaims);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 max-w-xl w-full p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Bulk CSV Claims Import
            </h3>
            <span className="text-xs text-slate-500">Ingest multiple claim records simultaneously for batch risk scoring</span>
          </div>
          <button 
            id="btn-close-bulk-upload"
            onClick={onClose} 
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload & Sample Buttons */}
        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs">
            <Upload className="w-3.5 h-3.5" />
            <span>Choose CSV File</span>
            <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
          </label>

          <button 
            onClick={handleLoadSample} 
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> Load Sample Data
          </button>

          <button 
            onClick={handleDownloadTemplate} 
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download Template
          </button>
        </div>

        {/* Textarea for direct paste */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Or Paste CSV Data Directly:</label>
          <textarea
            rows={4}
            value={csvContent}
            onChange={(e) => {
              setCsvContent(e.target.value);
              parseCSV(e.target.value);
            }}
            placeholder="claimantName,age,policyNumber,premiumAmount,claimAmount,claimType,incidentDate,policeReport,providerId,region..."
            className="w-full p-2.5 font-mono text-xs border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-indigo-500"
          />
        </div>

        {parseError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{parseError}</span>
          </div>
        )}

        {/* Parsed Preview */}
        {parsedClaims.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Ready to Import ({parsedClaims.length} records parsed)
              </span>
            </div>
            <div className="max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {parsedClaims.map((c) => (
                <div key={c.id} className="p-2 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{c.claimantName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-medium">
                        📍 {c.city || 'Bangalore'} {c.area ? `(${c.area})` : ''}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      {c.claimType.toUpperCase()} &bull; ${c.claimAmount.toLocaleString()} &bull; {c.coverageType || 'Policy'}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{c.id}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-import-csv"
            disabled={parsedClaims.length === 0}
            onClick={handleConfirmImport}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Import {parsedClaims.length} Claims
          </button>
        </div>
      </div>
    </div>
  );
};
