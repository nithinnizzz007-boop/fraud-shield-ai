import React, { useState } from 'react';
import { Upload, ShieldAlert, CheckCircle2, AlertCircle, MapPin, Building, Activity } from 'lucide-react';
import { Claim } from '../types';
import { generateSHAPFactors } from '../utils/scoring';
import { INDIAN_CITIES_AREAS } from '../data/mockClaims';

interface IntakeTabProps {
  onAddClaim: (claim: Claim) => void;
  onOpenBulkUpload: () => void;
}

export const IntakeTab: React.FC<IntakeTabProps> = ({ onAddClaim, onOpenBulkUpload }) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('Bangalore');
  const [selectedClaimType, setSelectedClaimType] = useState<'auto' | 'health' | 'property'>('health');
  const [selectedArea, setSelectedArea] = useState<string>(INDIAN_CITIES_AREAS['Bangalore'].areas[0]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    if (INDIAN_CITIES_AREAS[city]) {
      setSelectedArea(INDIAN_CITIES_AREAS[city].areas[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const claimantName = formData.get('claimantName') as string;
    const age = Number(formData.get('age'));
    const policyNumber = formData.get('policyNumber') as string;
    const premiumAmount = Number(formData.get('premiumAmount'));
    const claimAmount = Number(formData.get('claimAmount'));
    const claimType = (formData.get('claimType') as 'auto' | 'health' | 'property') || selectedClaimType;
    const incidentDate = formData.get('incidentDate') as string;
    const policeReport = formData.get('policeReport') === 'true';
    const providerIdRaw = (formData.get('providerId') as string)?.trim();
    const providerId = providerIdRaw && providerIdRaw.length > 0 ? providerIdRaw : null;
    const city = (formData.get('city') as string) || selectedCity;
    const area = (formData.get('area') as string) || selectedArea;
    const region = (INDIAN_CITIES_AREAS[city]?.region as 'North' | 'South' | 'East' | 'West') || 
                   ((formData.get('region') as 'North' | 'South' | 'East' | 'West') || 'South');
    const facilityName = (formData.get('facilityName') as string)?.trim() || undefined;
    const diagnosisOrLoss = (formData.get('diagnosisOrLoss') as string)?.trim() || undefined;
    const coverageType = (formData.get('coverageType') as string)?.trim() || 'Standard Coverage';

    // Guardrail: Incident date cannot be in the future
    const today = new Date().toISOString().split('T')[0];
    if (incidentDate > today) {
      setErrorMessage('Validation Error: Incident date cannot be in the future.');
      return;
    }

    const newClaimId = `CLM-${Math.floor(1000 + Math.random() * 9000)}`;
    const ratio = claimAmount / (premiumAmount || 1);
    const isOutlier = ratio > 6 || claimAmount > 12000;

    const partialClaim: Partial<Claim> = {
      claimantName,
      claimAmount,
      premiumAmount,
      policeReport,
      providerId
    };

    const newClaim: Claim = {
      id: newClaimId,
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
      providerHistoryCount: providerId ? (providerId.includes('808') || providerId.includes('701') || providerId.includes('402') ? 14 : 2) : 0,
      policyStartDate: '2026-01-01',
      isOutlier,
      shapFactors: generateSHAPFactors(partialClaim),
      timeline: [
        { date: '2026-01-01', title: 'Policy Initiated', detail: `${coverageType} active in ${city}` },
        { date: incidentDate, title: 'Reported Incident', detail: diagnosisOrLoss || `${claimType.toUpperCase()} loss occurred at ${area}, ${city}` },
        { date: today, title: 'Claim Intake', detail: 'Submitted via adjuster portal' }
      ]
    };

    onAddClaim(newClaim);
    form.reset();
    setSelectedCity('Bangalore');
    setSelectedArea(INDIAN_CITIES_AREAS['Bangalore'].areas[0]);
    setSuccessMessage(`Claim ${newClaimId} for ${claimantName} in ${city} (${area}) successfully processed and scored!`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const getCoverageOptions = () => {
    if (selectedClaimType === 'health') {
      return [
        'Cashless Mediclaim Gold',
        'Critical Illness Suraksha Cover',
        'Senior Citizen Health Floater',
        'Super Top-Up Family Health',
        'Comprehensive Surgical & Hospital Shield',
        'Daycare & Oncology Care Plan'
      ];
    }
    if (selectedClaimType === 'property') {
      return [
        'Industrial Warehouse All-Risk Perils',
        'Commercial Property Fire & Perils',
        'Tech Park Commercial Tenant Shield',
        'Residential Luxury Apartment & Structural',
        'Monsoon Flooding & Inundation Cover',
        'High-Value Heritage Bungalow & Art Peril',
        'Retail Showroom Fixtures & Stock Cover'
      ];
    }
    return [
      'Comprehensive Auto Shield',
      'Collision & Commercial Auto',
      'Third-Party Bodily Injury & Property Liability'
    ];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Manual Submission Form */}
      <div className="md:col-span-2 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Manual Claim Submission</h3>
            <p className="text-xs text-slate-500">Enter policy, regional Indian city/area particulars, and loss details for immediate automated scoring.</p>
          </div>
          <button 
            id="btn-open-bulk-csv"
            type="button"
            onClick={onOpenBulkUpload}
            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Bulk CSV Import
          </button>
        </div>

        {successMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Claimant Full Name *</label>
            <input 
              required 
              name="claimantName" 
              type="text" 
              placeholder="e.g. Ananya Deshmukh" 
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Claimant Age *</label>
            <input 
              required 
              name="age" 
              type="number" 
              min="18" 
              max="100" 
              placeholder="34" 
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Policy Number *</label>
            <input 
              required 
              name="policyNumber" 
              type="text" 
              placeholder="POL-HLT-55401" 
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Claim Type *</label>
            <select 
              name="claimType" 
              value={selectedClaimType}
              onChange={(e) => setSelectedClaimType(e.target.value as 'auto' | 'health' | 'property')}
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-indigo-500 font-semibold"
            >
              <option value="health">🏥 Health Insurance</option>
              <option value="property">🏢 Property & Perils Insurance</option>
              <option value="auto">🚗 Auto & Vehicle Insurance</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Policy Coverage Plan *</label>
            <select 
              name="coverageType" 
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-indigo-500"
            >
              {getCoverageOptions().map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Annual Premium ($) *</label>
            <input 
              required 
              name="premiumAmount" 
              type="number" 
              min="1" 
              placeholder="1800" 
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Requested Claim Amount ($) *</label>
            <input 
              required 
              name="claimAmount" 
              type="number" 
              min="1" 
              placeholder="25000" 
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-indigo-500" 
            />
          </div>

          {/* City Selection (Bangalore prominent) */}
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Indian City (Hub) *
            </label>
            <select 
              name="city" 
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-indigo-500 font-medium"
            >
              {Object.keys(INDIAN_CITIES_AREAS).map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName} {cityName === 'Bangalore' ? '★ (Primary Hub)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Area Selection for City */}
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Area / Locality ({selectedCity}) *
            </label>
            <select 
              name="area" 
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-indigo-500"
            >
              {(INDIAN_CITIES_AREAS[selectedCity]?.areas || []).map((areaName) => (
                <option key={areaName} value={areaName}>{areaName}</option>
              ))}
              <option value="Other Area">Other / Central Area</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Incident Date *</label>
            <input 
              required 
              name="incidentDate" 
              type="date" 
              max={new Date().toISOString().split('T')[0]} 
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-indigo-500" 
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Police FIR / Official Report Filed?</label>
            <select 
              name="policeReport" 
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-indigo-500"
            >
              <option value="false">No Official Report</option>
              <option value="true">Yes, Police FIR / Fire Dept Certificate Filed</option>
            </select>
          </div>

          {/* Facility Name (Hospital / Tech Park / Body shop) */}
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
              {selectedClaimType === 'health' 
                ? 'Hospital / Clinic / Daycare Centre' 
                : selectedClaimType === 'property' 
                ? 'Building / Complex / Tech Park Name' 
                : 'Garage / Service Center Name'}
            </label>
            <input 
              name="facilityName" 
              type="text" 
              placeholder={
                selectedClaimType === 'health' 
                  ? 'e.g. Manipal Hospital Whitefield' 
                  : selectedClaimType === 'property' 
                  ? 'e.g. Silicon Logistics Hub Phase 2' 
                  : 'e.g. Metro Automotive Body Works'
              }
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-indigo-500" 
            />
          </div>

          {/* Provider / Doctor / Surveyor ID */}
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
              Provider / Attending Physician / Surveyor ID
            </label>
            <input 
              name="providerId" 
              type="text" 
              placeholder={
                selectedClaimType === 'health' 
                  ? 'e.g. DOC-808 (Flagged) or DOC-109' 
                  : selectedClaimType === 'property' 
                  ? 'e.g. PROV-701 (Flagged) or PROV-201' 
                  : 'e.g. GAR-402 (Flagged)'
              }
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-indigo-500" 
            />
          </div>

          {/* Medical Diagnosis / Property Damage description */}
          <div className="sm:col-span-2">
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              {selectedClaimType === 'health' 
                ? 'Medical Diagnosis & Surgical Procedure' 
                : selectedClaimType === 'property' 
                ? 'Loss Peril & Damaged Property Inventory' 
                : 'Collision Particulars & Damaged Parts'}
            </label>
            <input 
              name="diagnosisOrLoss" 
              type="text" 
              placeholder={
                selectedClaimType === 'health' 
                  ? 'e.g. Bilateral Laparoscopic Knee Arthroscopy with Titanium Implants' 
                  : selectedClaimType === 'property' 
                  ? 'e.g. Monsoon Inundation & Micro-Controller Inventory Water Damage' 
                  : 'e.g. Frontal Bumper & Radiator Collision Damage'
              }
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-indigo-500" 
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <button 
              id="submit-claim-form-btn"
              type="submit" 
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow-xs"
            >
              Submit & Evaluate Risk Score for {selectedCity} ({selectedArea})
            </button>
          </div>
        </form>
      </div>

      {/* Validation Rules & Guidelines */}
      <div className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <h4 className="font-semibold text-xs flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Validation & Regional Guardrails
        </h4>
        <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400 list-disc pl-4 leading-relaxed">
          <li><strong>Bangalore Core Hub:</strong> Pre-mapped with 10 major commercial & residential areas (Koramangala, Indiranagar, Whitefield, HSR Layout, Electronic City, Jayanagar, etc.).</li>
          <li><strong>Health Policy Scrutiny:</strong> Short policy tenure prior to high-claim surgical procedures in clinics (e.g. <code>DOC-808</code>) triggers automated SHAP fraud alerts.</li>
          <li><strong>Property Perils Monitoring:</strong> Catastrophic warehouse inundation or fire claims filed immediately after policy upgrades trigger cross-entity linkage detection.</li>
          <li><strong>Provider Graph Linkage:</strong> Claims matching flagged providers (<code>DOC-808</code>, <code>PROV-701</code>, <code>GAR-402</code>) automatically map into the interactive topology.</li>
        </ul>

        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
          <div className="font-semibold text-indigo-600 dark:text-indigo-400 text-[11px]">Primary Bangalore Localities Monitored:</div>
          <div className="flex flex-wrap gap-1 pt-1">
            {INDIAN_CITIES_AREAS['Bangalore'].areas.slice(0, 6).map(area => (
              <span key={area} className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] rounded font-medium">
                {area}
              </span>
            ))}
            <span className="text-[10px] text-slate-400 self-center">+4 more</span>
          </div>
        </div>
      </div>
    </div>
  );
};

