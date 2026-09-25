import { Claim } from '../types';

export const INDIAN_CITIES_AREAS: Record<string, { region: string; areas: string[] }> = {
  'Bangalore': {
    region: 'South',
    areas: [
      'Koramangala',
      'Indiranagar',
      'Whitefield',
      'HSR Layout',
      'Electronic City',
      'Jayanagar',
      'Sadashivanagar',
      'Bellandur',
      'Marathahalli',
      'Malleshwaram'
    ]
  },
  'Mumbai': {
    region: 'West',
    areas: [
      'Bandra Kurla Complex (BKC)',
      'Andheri West',
      'Powai',
      'Lower Parel',
      'Dadar',
      'Juhu'
    ]
  },
  'Delhi NCR': {
    region: 'North',
    areas: [
      'Connaught Place',
      'Cyber City (Gurugram)',
      'Sector 62 (Noida)',
      'Okhla Industrial Phase 3',
      'Saket',
      'Vasant Kunj'
    ]
  },
  'Hyderabad': {
    region: 'South',
    areas: [
      'HITEC City',
      'Banjara Hills',
      'Gachibowli',
      'Jubilee Hills',
      'Madhapur',
      'Secunderabad'
    ]
  },
  'Chennai': {
    region: 'South',
    areas: [
      'T. Nagar',
      'OMR IT Corridor',
      'Guindy',
      'Adyar',
      'Anna Nagar',
      'Velachery'
    ]
  },
  'Pune': {
    region: 'West',
    areas: [
      'Hinjawadi Tech Zone',
      'Koregaon Park',
      'Kothrud',
      'Viman Nagar',
      'Baner'
    ]
  },
  'Kolkata': {
    region: 'East',
    areas: [
      'Salt Lake Sector V',
      'Park Street',
      'New Town',
      'Ballygunge',
      'Rajarhat'
    ]
  }
};

export const INITIAL_CLAIMS: Claim[] = [
  // --- HEALTH CLAIMS (Bangalore & India) ---
  {
    id: 'CLM-2011',
    claimantName: 'Ananya Deshmukh',
    age: 32,
    policyNumber: 'POL-HLT-55401',
    premiumAmount: 1800,
    coverageType: 'Cashless Mediclaim Gold',
    claimAmount: 25400,
    claimType: 'health',
    incidentDate: '2026-08-28',
    reportDate: '2026-09-02',
    incidentTime: '11:20',
    policeReport: false,
    witnesses: 1,
    providerId: 'DOC-808', // Flagged syndicate clinic
    region: 'South',
    city: 'Bangalore',
    area: 'Koramangala',
    facilityName: 'Apex Surgical & Daycare Polyclinic',
    diagnosisOrLoss: 'Bilateral Laparoscopic Knee Arthroscopy with High-Grade Titanium Implants',
    status: 'Pending',
    providerHistoryCount: 16,
    policyStartDate: '2026-08-10',
    isOutlier: true,
    shapFactors: [
      { factor: 'Policy active only 18 days prior to major surgery', weight: 42, impact: 'positive' },
      { factor: 'Claim-to-premium ratio: 14.1x (Severe anomaly)', weight: 34, impact: 'positive' },
      { factor: 'Provider DOC-808 under active SIU investigation (16 cases)', weight: 26, impact: 'positive' },
      { factor: 'Duplicate surgical implant serial invoices detected', weight: 18, impact: 'positive' }
    ],
    timeline: [
      { date: '2026-08-10', title: 'Policy Bound', detail: 'Cashless Mediclaim Gold purchased online' },
      { date: '2026-08-28', title: 'Hospital Admission', detail: 'Admitted for elective knee surgery at Koramangala clinic' },
      { date: '2026-09-02', title: 'Reimbursement Claim Filed', detail: 'Submitted max limit claim with handwritten surgeon notes' }
    ]
  },
  {
    id: 'CLM-2012',
    claimantName: 'Karthik Ramanathan',
    age: 46,
    policyNumber: 'POL-HLT-88902',
    premiumAmount: 2200,
    coverageType: 'Senior Citizen & Family Floater',
    claimAmount: 19800,
    claimType: 'health',
    incidentDate: '2026-08-18',
    reportDate: '2026-08-24',
    incidentTime: '20:15',
    policeReport: false,
    witnesses: 0,
    providerId: 'DOC-412',
    region: 'South',
    city: 'Bangalore',
    area: 'Indiranagar',
    facilityName: 'Indira Mediscan & Nursing Home',
    diagnosisOrLoss: 'Dengue Hemorrhagic Fever with 6-Unit Platelet Inpatient Infusion',
    status: 'Pending',
    providerHistoryCount: 9,
    policyStartDate: '2026-07-20',
    isOutlier: true,
    shapFactors: [
      { factor: 'Claim-to-premium ratio: 9.0x', weight: 32, impact: 'positive' },
      { factor: 'Identical CBC lab report numbers shared across 3 family members', weight: 30, impact: 'positive' },
      { factor: 'Provider DOC-412 has elevated ICU billing pattern', weight: 22, impact: 'positive' },
      { factor: 'No hospital entry registers signed at facility', weight: 14, impact: 'positive' }
    ],
    timeline: [
      { date: '2026-07-20', title: 'Policy Initiated', detail: 'Family Floater Mediclaim active' },
      { date: '2026-08-18', title: 'Reported Admission', detail: 'Hospitalized for acute fever' },
      { date: '2026-08-24', title: 'Discharge & Claim Submission', detail: 'Direct claim filed via adjuster portal' }
    ]
  },
  {
    id: 'CLM-2013',
    claimantName: 'Sneha Krishnan',
    age: 38,
    policyNumber: 'POL-HLT-10294',
    premiumAmount: 4800,
    coverageType: 'Critical Illness Suraksha Cover',
    claimAmount: 6500,
    claimType: 'health',
    incidentDate: '2026-09-02',
    reportDate: '2026-09-03',
    incidentTime: '08:45',
    policeReport: false,
    witnesses: 2,
    providerId: 'DOC-109',
    region: 'South',
    city: 'Bangalore',
    area: 'Whitefield',
    facilityName: 'Manipal Multi-Specialty Hospital Whitefield',
    diagnosisOrLoss: 'Emergency Percutaneous Coronary Intervention (PCI Stent Placement)',
    status: 'Cleared',
    providerHistoryCount: 1,
    policyStartDate: '2023-05-12',
    isOutlier: false,
    shapFactors: [
      { factor: 'Established policy tenure (>3 years)', weight: 35, impact: 'negative' },
      { factor: 'Low claim-to-premium ratio (1.35x)', weight: 28, impact: 'negative' },
      { factor: 'NABH-accredited tertiary hospital with digital angiogram records', weight: 25, impact: 'negative' },
      { factor: 'Provider DOC-109 top-tier verified credentials', weight: 20, impact: 'negative' }
    ],
    timeline: [
      { date: '2023-05-12', title: 'Policy Initiated', detail: 'Corporate group executive cover' },
      { date: '2026-09-02', title: 'Emergency Angioplasty', detail: 'Admitted via cardiac emergency wing' },
      { date: '2026-09-03', title: 'Cashless Authorization', detail: 'Verified and authorized by TPA team' }
    ]
  },
  {
    id: 'CLM-2014',
    claimantName: 'Rajesh Varma',
    age: 54,
    policyNumber: 'POL-HLT-66318',
    premiumAmount: 3100,
    coverageType: 'Super Top-Up Family Health',
    claimAmount: 14200,
    claimType: 'health',
    incidentDate: '2026-08-30',
    reportDate: '2026-09-04',
    incidentTime: '17:30',
    policeReport: false,
    witnesses: 1,
    providerId: 'DOC-710',
    region: 'South',
    city: 'Bangalore',
    area: 'HSR Layout',
    facilityName: 'Greenview Multi-Specialty Polyclinic',
    diagnosisOrLoss: 'Complicated Laparoscopic Appendectomy & Peritoneal Lavage',
    status: 'Pending',
    providerHistoryCount: 4,
    policyStartDate: '2025-11-04',
    isOutlier: false,
    shapFactors: [
      { factor: 'Claim-to-premium ratio: 4.58x', weight: 24, impact: 'positive' },
      { factor: 'Room rent upgrade exceeded sub-limit policy cap', weight: 18, impact: 'positive' },
      { factor: 'Provider DOC-710 regular credential status', weight: 12, impact: 'negative' }
    ],
    timeline: [
      { date: '2025-11-04', title: 'Top-Up Activation', detail: 'Super top-up cover added' },
      { date: '2026-08-30', title: 'Emergency Inpatient Stay', detail: 'Acute abdominal pain admission' },
      { date: '2026-09-04', title: 'Claim Registered', detail: 'Adjuster inspection initiated' }
    ]
  },
  {
    id: 'CLM-2015',
    claimantName: 'Leela Venkataraman',
    age: 68,
    policyNumber: 'POL-HLT-99201',
    premiumAmount: 3600,
    coverageType: 'Senior Citizen Health Floater',
    claimAmount: 2400,
    claimType: 'health',
    incidentDate: '2026-09-06',
    reportDate: '2026-09-06',
    incidentTime: '10:00',
    policeReport: false,
    witnesses: 1,
    providerId: 'DOC-305',
    region: 'South',
    city: 'Bangalore',
    area: 'Jayanagar',
    facilityName: 'Nethra Eye Foundation & Surgical Centre',
    diagnosisOrLoss: 'Bilateral Phacoemulsification Cataract Surgery with Monofocal IOL',
    status: 'Cleared',
    providerHistoryCount: 0,
    policyStartDate: '2022-04-18',
    isOutlier: false,
    shapFactors: [
      { factor: 'Standard procedure cost within agreed benchmark tariff', weight: 32, impact: 'negative' },
      { factor: 'Tenure exceeds 4 continuous years with zero prior claims', weight: 28, impact: 'negative' },
      { factor: 'NABH certified specialty ophthalmology center', weight: 22, impact: 'negative' }
    ],
    timeline: [
      { date: '2022-04-18', title: 'Policy Initiated', detail: 'Senior Citizen Health Gold plan' },
      { date: '2026-09-06', title: 'Daycare Procedure', detail: 'Completed within 4-hour daycare schedule' },
      { date: '2026-09-06', title: 'Instant Clearance', detail: 'Standard tariff approval' }
    ]
  },
  {
    id: 'CLM-2016',
    claimantName: 'Rohan Murthy',
    age: 29,
    policyNumber: 'POL-HLT-41009',
    premiumAmount: 1400,
    coverageType: 'Comprehensive Health Suraksha',
    claimAmount: 18600,
    claimType: 'health',
    incidentDate: '2026-08-25',
    reportDate: '2026-09-01',
    incidentTime: '22:15',
    policeReport: false,
    witnesses: 0,
    providerId: 'DOC-808', // Flagged syndicate
    region: 'South',
    city: 'Bangalore',
    area: 'Electronic City',
    facilityName: 'Apex Surgical & Daycare Polyclinic',
    diagnosisOrLoss: 'Acute Gastroenteritis & Septic Dehydration (ICU stay 4 days)',
    status: 'Pending',
    providerHistoryCount: 16,
    policyStartDate: '2026-08-05',
    isOutlier: true,
    shapFactors: [
      { factor: 'Syndicate link to DOC-808 in Koramangala for Electronic City patient', weight: 38, impact: 'positive' },
      { factor: 'Policy purchased 20 days prior to ICU claim', weight: 35, impact: 'positive' },
      { factor: 'Severe disproportionate diagnostic lab testing billings', weight: 24, impact: 'positive' }
    ],
    timeline: [
      { date: '2026-08-05', title: 'Policy Bound', detail: 'Health plan purchased via web' },
      { date: '2026-08-25', title: 'Overnight Admission', detail: 'Claimed sudden dehydration' },
      { date: '2026-09-01', title: 'Reimbursement Claim', detail: 'Adjuster flagged distance to clinic' }
    ]
  },
  {
    id: 'CLM-2017',
    claimantName: 'Geeta Chandrasekhar',
    age: 42,
    policyNumber: 'POL-HLT-73319',
    premiumAmount: 3900,
    coverageType: 'Comprehensive Surgical & Hospital Shield',
    claimAmount: 5100,
    claimType: 'health',
    incidentDate: '2026-09-08',
    reportDate: '2026-09-09',
    incidentTime: '06:30',
    policeReport: false,
    witnesses: 2,
    providerId: 'DOC-220',
    region: 'South',
    city: 'Bangalore',
    area: 'Malleshwaram',
    facilityName: 'Cloudnine Specialty Hospital',
    diagnosisOrLoss: 'Emergency Cesarean Delivery with Neonatal Nursery Observation',
    status: 'Cleared',
    providerHistoryCount: 1,
    policyStartDate: '2023-09-01',
    isOutlier: false,
    shapFactors: [
      { factor: '3-year maternity waiting period fully fulfilled', weight: 34, impact: 'negative' },
      { factor: 'Verified hospital registration and live birth certificate', weight: 26, impact: 'negative' },
      { factor: 'Established provider DOC-220 accredited', weight: 20, impact: 'negative' }
    ],
    timeline: [
      { date: '2023-09-01', title: 'Policy Initiated', detail: 'Comprehensive surgical plan' },
      { date: '2026-09-08', title: 'Hospital Delivery', detail: 'Full obstetric care received' },
      { date: '2026-09-09', title: 'Cashless Clearance', detail: 'TPA package finalized' }
    ]
  },
  {
    id: 'CLM-2018',
    claimantName: 'Shalini Mehta',
    age: 35,
    policyNumber: 'POL-HLT-28491',
    premiumAmount: 4200,
    coverageType: 'Cashless Mediclaim Gold',
    claimAmount: 3800,
    claimType: 'health',
    incidentDate: '2026-09-05',
    reportDate: '2026-09-06',
    incidentTime: '15:20',
    policeReport: false,
    witnesses: 1,
    providerId: 'DOC-550',
    region: 'West',
    city: 'Mumbai',
    area: 'Andheri West',
    facilityName: 'Kokilaben Dhirubhai Ambani Hospital',
    diagnosisOrLoss: 'ACL Ligament Reconstruction with MRI Confirmation',
    status: 'Cleared',
    providerHistoryCount: 0,
    policyStartDate: '2024-06-15',
    isOutlier: false,
    shapFactors: [
      { factor: 'Pre-authorization package verified with MRI radiologist report', weight: 30, impact: 'negative' },
      { factor: 'Policy age over 2 years', weight: 22, impact: 'negative' }
    ],
    timeline: [
      { date: '2024-06-15', title: 'Policy Inception', detail: 'Individual mediclaim cover' },
      { date: '2026-09-05', title: 'Sports Injury Surgery', detail: 'Knee stabilization surgery' },
      { date: '2026-09-06', title: 'Approved', detail: 'Settled under cashless scheme' }
    ]
  },
  {
    id: 'CLM-2019',
    claimantName: 'Neha Bhatia',
    age: 33,
    policyNumber: 'POL-HLT-39011',
    premiumAmount: 3400,
    coverageType: 'Daycare & Oncology Care Plan',
    claimAmount: 4900,
    claimType: 'health',
    incidentDate: '2026-09-07',
    reportDate: '2026-09-07',
    incidentTime: '11:00',
    policeReport: false,
    witnesses: 1,
    providerId: 'DOC-912',
    region: 'North',
    city: 'Delhi NCR',
    area: 'Cyber City (Gurugram)',
    facilityName: 'Medanta The Medicity Gurugram',
    diagnosisOrLoss: 'Daycare Chemotherapy Cycle with Monoclonal Antibody Infusion',
    status: 'Cleared',
    providerHistoryCount: 0,
    policyStartDate: '2024-02-10',
    isOutlier: false,
    shapFactors: [
      { factor: 'Validated pharmaceutical purchase barcodes from Medanta pharmacy', weight: 36, impact: 'negative' },
      { factor: 'Low variance against institutional chemo protocol rates', weight: 24, impact: 'negative' }
    ],
    timeline: [
      { date: '2024-02-10', title: 'Policy Bound', detail: 'Daycare & Oncology plan active' },
      { date: '2026-09-07', title: 'Chemotherapy Administered', detail: 'Prescribed cycle completed' },
      { date: '2026-09-07', title: 'Cleared', detail: 'Direct claim settlement' }
    ]
  },
  {
    id: 'CLM-2020',
    claimantName: 'Meenakshi Sundaram',
    age: 64,
    policyNumber: 'POL-HLT-81190',
    premiumAmount: 1900,
    coverageType: 'Senior Citizen Health Floater',
    claimAmount: 17200,
    claimType: 'health',
    incidentDate: '2026-08-22',
    reportDate: '2026-08-31',
    incidentTime: '19:40',
    policeReport: false,
    witnesses: 0,
    providerId: 'DOC-808', // Inter-city syndicate connection!
    region: 'South',
    city: 'Chennai',
    area: 'T. Nagar',
    facilityName: 'Apex Surgical & Daycare Satellite Unit',
    diagnosisOrLoss: 'Spinal Decompression & Vertebroplasty Inpatient Surgery',
    status: 'Pending',
    providerHistoryCount: 16,
    policyStartDate: '2026-07-28',
    isOutlier: true,
    shapFactors: [
      { factor: 'Inter-city syndicate link: Chennai claim billed through Bangalore DOC-808', weight: 45, impact: 'positive' },
      { factor: 'Claim-to-premium ratio: 9.05x', weight: 28, impact: 'positive' },
      { factor: 'Policy active only 25 days before major neuro-spinal claim', weight: 26, impact: 'positive' }
    ],
    timeline: [
      { date: '2026-07-28', title: 'Policy Initiated', detail: 'Senior citizen plan' },
      { date: '2026-08-22', title: 'Reported Surgery', detail: 'Billed through interstate partner clinic' },
      { date: '2026-08-31', title: 'Audit Alert Triggered', detail: 'Transferred to SIU investigation unit' }
    ]
  },

  // --- PROPERTY CLAIMS (Bangalore & India) ---
  {
    id: 'CLM-3011',
    claimantName: 'Harish Kumar (Silicon Logistics Hub)',
    age: 48,
    policyNumber: 'POL-PRP-90214',
    premiumAmount: 3200,
    coverageType: 'Industrial Warehouse All-Risk Perils',
    claimAmount: 58500,
    claimType: 'property',
    incidentDate: '2026-08-29',
    reportDate: '2026-09-05',
    incidentTime: '03:15',
    policeReport: false,
    witnesses: 0,
    providerId: 'PROV-701', // Flagged surveyor syndicate
    region: 'South',
    city: 'Bangalore',
    area: 'Electronic City',
    facilityName: 'Silicon Logistics Godown Complex Phase 2',
    diagnosisOrLoss: 'Severe Monsoon Inundation & Electronic Micro-Controller Inventory Water Damage',
    status: 'Pending',
    providerHistoryCount: 12,
    policyStartDate: '2026-08-15',
    isOutlier: true,
    shapFactors: [
      { factor: 'Catastrophic property loss filed 14 days after policy renewal', weight: 44, impact: 'positive' },
      { factor: 'Claim-to-premium ratio: 18.28x (Extreme property risk)', weight: 36, impact: 'positive' },
      { factor: 'Surveyor PROV-701 flagged for inflated salvage estimations', weight: 28, impact: 'positive' },
      { factor: 'CCTV logs show warehouse inventory evacuated 24h before storm', weight: 22, impact: 'positive' }
    ],
    timeline: [
      { date: '2026-08-15', title: 'Commercial Policy Activated', detail: 'Increased flood perils coverage' },
      { date: '2026-08-29', title: 'Rainstorm Incident', detail: 'Claimed 4 feet water logging inside godown' },
      { date: '2026-09-05', title: 'Surveyor Report Submitted', detail: 'Total loss assessment filed by PROV-701' }
    ]
  },
  {
    id: 'CLM-3012',
    claimantName: 'Deepa Hegde (Alpha Tech Park Suite 402)',
    age: 37,
    policyNumber: 'POL-PRP-44019',
    premiumAmount: 6400,
    coverageType: 'Tech Park Commercial Tenant Shield',
    claimAmount: 8200,
    claimType: 'property',
    incidentDate: '2026-09-03',
    reportDate: '2026-09-04',
    incidentTime: '19:40',
    policeReport: true,
    witnesses: 3,
    providerId: 'PROV-201',
    region: 'South',
    city: 'Bangalore',
    area: 'Whitefield',
    facilityName: 'Alpha International Tech Park Tower B',
    diagnosisOrLoss: 'Server Room Electrical Short Circuit & Automatic Halon Suppression Discharge',
    status: 'Cleared',
    providerHistoryCount: 1,
    policyStartDate: '2024-01-10',
    isOutlier: false,
    shapFactors: [
      { factor: 'Verified Karnataka State Fire Services Incident Clearance Certificate', weight: 32, impact: 'negative' },
      { factor: 'Low claim-to-premium ratio (1.28x)', weight: 26, impact: 'negative' },
      { factor: 'Building BMS telemetry confirms sprinkler activation timestamps', weight: 24, impact: 'negative' },
      { factor: 'Certified loss surveyor PROV-201 clean audit rating', weight: 18, impact: 'negative' }
    ],
    timeline: [
      { date: '2024-01-10', title: 'Tech Park Policy Inception', detail: 'Tenant multi-peril risk active' },
      { date: '2026-09-03', title: 'Electrical Arcing Incident', detail: 'Contained by automated halon suppression' },
      { date: '2026-09-04', title: 'Joint Inspection with Fire Dept', detail: 'Damage verified and approved' }
    ]
  },
  {
    id: 'CLM-3013',
    claimantName: 'Manish Kulkarni (Spice & Stone Bistro)',
    age: 44,
    policyNumber: 'POL-PRP-81204',
    premiumAmount: 2100,
    coverageType: 'Commercial Property Fire & Perils',
    claimAmount: 28900,
    claimType: 'property',
    incidentDate: '2026-09-01',
    reportDate: '2026-09-06',
    incidentTime: '01:50',
    policeReport: true,
    witnesses: 0,
    providerId: 'PROV-503',
    region: 'South',
    city: 'Bangalore',
    area: 'Koramangala',
    facilityName: 'Spice & Stone Rooftop Dining & Bar',
    diagnosisOrLoss: 'Commercial Kitchen Deep Fryer Flash Fire & Exhaust Hood Gutting',
    status: 'Pending',
    providerHistoryCount: 7,
    policyStartDate: '2026-08-25',
    isOutlier: true,
    shapFactors: [
      { factor: 'Policy coverage enhanced 7 days before overnight restaurant fire', weight: 40, impact: 'positive' },
      { factor: 'Claim-to-premium ratio: 13.76x', weight: 32, impact: 'positive' },
      { factor: 'Fire marshal noted commercial suppression valve manually turned off', weight: 26, impact: 'positive' },
      { factor: 'Surveyor PROV-503 under scrutiny for inflated kitchen asset valuations', weight: 20, impact: 'positive' }
    ],
    timeline: [
      { date: '2026-08-25', title: 'Policy Endorsement', detail: 'Added comprehensive fire & business interruption' },
      { date: '2026-09-01', title: 'Late Night Kitchen Fire', detail: 'Reported after business closing' },
      { date: '2026-09-06', title: 'Claim Lodged', detail: 'Awaiting forensic electrical analysis' }
    ]
  },
  {
    id: 'CLM-3014',
    claimantName: 'Suresh Reddy',
    age: 51,
    policyNumber: 'POL-PRP-19230',
    premiumAmount: 1600,
    coverageType: 'Residential Luxury Apartment & Structural',
    claimAmount: 4300,
    claimType: 'property',
    incidentDate: '2026-09-02',
    reportDate: '2026-09-03',
    incidentTime: '16:00',
    policeReport: false,
    witnesses: 2,
    providerId: null, // Self-survey residential
    region: 'South',
    city: 'Bangalore',
    area: 'HSR Layout',
    facilityName: 'Green Terrace Apartments Unit 5A',
    diagnosisOrLoss: 'Terrace Waterproofing Seepage Causing False Ceiling & Hardwood Floor Damage',
    status: 'Cleared',
    providerHistoryCount: 0,
    policyStartDate: '2024-03-12',
    isOutlier: false,
    shapFactors: [
      { factor: 'Longstanding residential policy (>2.5 years)', weight: 30, impact: 'negative' },
      { factor: 'Claim proportionate to localized water seepage damage (2.68x ratio)', weight: 24, impact: 'negative' },
      { factor: 'Resident Welfare Association structural maintenance report provided', weight: 20, impact: 'negative' }
    ],
    timeline: [
      { date: '2024-03-12', title: 'Home Insurance Activated', detail: 'Comprehensive residential structure cover' },
      { date: '2026-09-02', title: 'Monsoon Water Leakage', detail: 'Continuous torrential rains breached flashing' },
      { date: '2026-09-03', title: 'Claim Cleared', detail: 'Adjuster inspection approved restoration work' }
    ]
  },
  {
    id: 'CLM-3015',
    claimantName: 'Arvind Mallick',
    age: 62,
    policyNumber: 'POL-PRP-77114',
    premiumAmount: 4500,
    coverageType: 'High-Value Heritage Bungalow & Art Peril',
    claimAmount: 72000,
    claimType: 'property',
    incidentDate: '2026-08-20',
    reportDate: '2026-09-01',
    incidentTime: '03:00',
    policeReport: true,
    witnesses: 0,
    providerId: 'PROV-902',
    region: 'South',
    city: 'Bangalore',
    area: 'Sadashivanagar',
    facilityName: 'Heritage Villa Sadashivanagar 8th Main',
    diagnosisOrLoss: 'Alleged Burglary of Heritage Silver Ware, Oil Paintings & Antique Chandeliers',
    status: 'Pending',
    providerHistoryCount: 5,
    policyStartDate: '2026-07-30',
    isOutlier: true,
    shapFactors: [
      { factor: '16.0x Claim-to-premium ratio on ultra-high-net-worth scheduled items', weight: 38, impact: 'positive' },
      { factor: '11-day delay in registering police FIR after alleged break-in', weight: 32, impact: 'positive' },
      { factor: 'Police forensic squad found zero forced entry marks on doors or windows', weight: 30, impact: 'positive' },
      { factor: 'Valuation certificates issued by unverified art dealer PROV-902', weight: 24, impact: 'positive' }
    ],
    timeline: [
      { date: '2026-07-30', title: 'High-Value Rider Added', detail: 'Antique collectibles endorsed onto policy' },
      { date: '2026-08-20', title: 'Alleged Theft Incident', detail: 'Claimed burglary while family was traveling' },
      { date: '2026-09-01', title: 'Delayed Claim & FIR Submission', detail: 'SIU investigative hold placed' }
    ]
  },
  {
    id: 'CLM-3016',
    claimantName: 'Priya Sundaram (Lakeside Corporate Towers)',
    age: 39,
    policyNumber: 'POL-PRP-60912',
    premiumAmount: 5100,
    coverageType: 'Monsoon Flooding & Inundation Cover',
    claimAmount: 6800,
    claimType: 'property',
    incidentDate: '2026-09-04',
    reportDate: '2026-09-05',
    incidentTime: '21:10',
    policeReport: false,
    witnesses: 4,
    providerId: 'PROV-201',
    region: 'South',
    city: 'Bangalore',
    area: 'Bellandur',
    facilityName: 'Lakeside Commercial Hub Basement',
    diagnosisOrLoss: 'Bellandur Lake Overflow Stormwater Ingress into Basement Generator Room',
    status: 'Cleared',
    providerHistoryCount: 1,
    policyStartDate: '2023-11-01',
    isOutlier: false,
    shapFactors: [
      { factor: 'Documented civic stormwater flooding across entire Bellandur corridor', weight: 35, impact: 'negative' },
      { factor: 'Independent engineering assessment confirmed submerged diesel genset', weight: 28, impact: 'negative' },
      { factor: 'Prompt next-day reporting by facility manager', weight: 20, impact: 'negative' }
    ],
    timeline: [
      { date: '2023-11-01', title: 'Corporate Policy Start', detail: 'Standard commercial property insurance' },
      { date: '2026-09-04', title: 'Lake Drainage Breach', detail: 'Basement stormwater pumps overwhelmed' },
      { date: '2026-09-05', title: 'Immediate Survey & Repair Clearance', detail: 'Cleared by adjuster' }
    ]
  },
  {
    id: 'CLM-3017',
    claimantName: 'Vikramaditya Das (MegaTech Retail Store)',
    age: 45,
    policyNumber: 'POL-PRP-33190',
    premiumAmount: 2400,
    coverageType: 'Retail Showroom Fixtures & Stock Cover',
    claimAmount: 34200,
    claimType: 'property',
    incidentDate: '2026-08-27',
    reportDate: '2026-09-03',
    incidentTime: '04:20',
    policeReport: true,
    witnesses: 1,
    providerId: 'PROV-701', // Flagged surveyor syndicate
    region: 'South',
    city: 'Bangalore',
    area: 'Marathahalli',
    facilityName: 'MegaTech Electronics Retail Showroom',
    diagnosisOrLoss: 'Municipal Water Main Rupture Ingress & High-End Television Stock Ruin',
    status: 'Pending',
    providerHistoryCount: 12,
    policyStartDate: '2026-08-01',
    isOutlier: true,
    shapFactors: [
      { factor: 'Surveyor PROV-701 shared with Silicon Logistics (Electronic City ring)', weight: 36, impact: 'positive' },
      { factor: 'Claim-to-premium ratio: 14.25x', weight: 30, impact: 'positive' },
      { factor: 'Serial numbers on ruined electronics show prior salvage salvage markings', weight: 28, impact: 'positive' }
    ],
    timeline: [
      { date: '2026-08-01', title: 'Policy Commenced', detail: 'Retail stock & premises coverage' },
      { date: '2026-08-27', title: 'Pipe Burst Reported', detail: 'Basement display stock submerged' },
      { date: '2026-09-03', title: 'Survey Report Filed', detail: 'Flagged by automated cross-entity link algorithm' }
    ]
  },
  {
    id: 'CLM-3018',
    claimantName: 'Farhan Qureshi (BKC Financial Corp)',
    age: 50,
    policyNumber: 'POL-PRP-88120',
    premiumAmount: 5800,
    coverageType: 'Commercial Property Fire & Perils',
    claimAmount: 7500,
    claimType: 'property',
    incidentDate: '2026-09-04',
    reportDate: '2026-09-05',
    incidentTime: '13:45',
    policeReport: true,
    witnesses: 3,
    providerId: 'PROV-404',
    region: 'West',
    city: 'Mumbai',
    area: 'Bandra Kurla Complex (BKC)',
    facilityName: 'BKC Pinnacle Corporate Tower Suite 900',
    diagnosisOrLoss: 'Pantry Microwave Arc Flash Fire with Carpet & Workstation Burnout',
    status: 'Cleared',
    providerHistoryCount: 2,
    policyStartDate: '2024-04-01',
    isOutlier: false,
    shapFactors: [
      { factor: 'Minor fire loss within expected corporate property parameters', weight: 28, impact: 'negative' },
      { factor: 'Mumbai Fire Brigade incident acknowledgment log confirmed', weight: 24, impact: 'negative' }
    ],
    timeline: [
      { date: '2024-04-01', title: 'Commercial Policy Inception', detail: 'Comprehensive multi-peril package' },
      { date: '2026-09-04', title: 'Pantry Fire Incident', detail: 'Extinguished by office safety marshals' },
      { date: '2026-09-05', title: 'Inspection & Settlement', detail: 'Direct claim settlement approved' }
    ]
  },
  {
    id: 'CLM-3019',
    claimantName: 'Vikramjeet Chawla (Capital Printcraft)',
    age: 58,
    policyNumber: 'POL-PRP-51902',
    premiumAmount: 2600,
    coverageType: 'Industrial Warehouse All-Risk Perils',
    claimAmount: 39500,
    claimType: 'property',
    incidentDate: '2026-08-26',
    reportDate: '2026-09-02',
    incidentTime: '02:40',
    policeReport: true,
    witnesses: 0,
    providerId: 'PROV-602',
    region: 'North',
    city: 'Delhi NCR',
    area: 'Okhla Industrial Phase 3',
    facilityName: 'Capital Offset Printing Godown No. 14',
    diagnosisOrLoss: 'Paper Reel & Printing Machine Heavy Smoke & Water Damage',
    status: 'Pending',
    providerHistoryCount: 6,
    policyStartDate: '2026-08-10',
    isOutlier: true,
    shapFactors: [
      { factor: 'Claim filed 16 days after policy initiation', weight: 38, impact: 'positive' },
      { factor: 'Claim-to-premium ratio: 15.19x', weight: 32, impact: 'positive' },
      { factor: 'No fire alert triggered to nearest Okhla fire sub-station', weight: 22, impact: 'positive' }
    ],
    timeline: [
      { date: '2026-08-10', title: 'Policy Initiated', detail: 'Industrial warehouse all-risk plan' },
      { date: '2026-08-26', title: 'Night Shift Fire Alarm', detail: 'Heavy smoke damage to paper inventory' },
      { date: '2026-09-02', title: 'Claim Intake', detail: 'Assigned to forensic SIU inspector' }
    ]
  },
  {
    id: 'CLM-3020',
    claimantName: 'Anirban Mukherjee',
    age: 47,
    policyNumber: 'POL-PRP-90111',
    premiumAmount: 3500,
    coverageType: 'Monsoon Flooding & Inundation Cover',
    claimAmount: 4100,
    claimType: 'property',
    incidentDate: '2026-09-01',
    reportDate: '2026-09-02',
    incidentTime: '15:10',
    policeReport: false,
    witnesses: 2,
    providerId: 'PROV-112',
    region: 'East',
    city: 'Kolkata',
    area: 'Salt Lake Sector V',
    facilityName: 'Tech Park Salt Lake Commercial Hub',
    diagnosisOrLoss: 'Cyclonic Gale Wind Damage to Rooftop HVAC Ducting & Ingress',
    status: 'Cleared',
    providerHistoryCount: 0,
    policyStartDate: '2023-08-15',
    isOutlier: false,
    shapFactors: [
      { factor: 'IMD regional cyclone weather alert correlated with loss timing', weight: 32, impact: 'negative' },
      { factor: 'Low claim ratio (1.17x)', weight: 26, impact: 'negative' }
    ],
    timeline: [
      { date: '2023-08-15', title: 'Policy Bound', detail: 'Commercial building flood & storm cover' },
      { date: '2026-09-01', title: 'Gale Storm Damage', detail: 'Ductwork dislodged during squall' },
      { date: '2026-09-02', title: 'Adjuster Approval', detail: 'Prompt repair authorization' }
    ]
  },

  // --- AUTO CLAIMS (Legacy / Cross-syndicate) ---
  {
    id: 'CLM-1092',
    claimantName: 'Rahul Sharma',
    age: 34,
    policyNumber: 'POL-88219',
    premiumAmount: 1200,
    coverageType: 'Comprehensive Auto Shield',
    claimAmount: 8500,
    claimType: 'auto',
    incidentDate: '2026-08-12',
    reportDate: '2026-08-14',
    incidentTime: '23:45',
    policeReport: true,
    witnesses: 1,
    providerId: 'GAR-402',
    region: 'South',
    city: 'Bangalore',
    area: 'Koramangala',
    facilityName: 'Metro Automotive Body Works',
    diagnosisOrLoss: 'Frontal Bumper & Radiator Collision Damage',
    status: 'Pending',
    providerHistoryCount: 14,
    policyStartDate: '2026-08-01',
    isOutlier: true,
    shapFactors: [
      { factor: 'Claim filed 11 days after policy start', weight: 35, impact: 'positive' },
      { factor: 'Claim-to-premium ratio: 7.08x', weight: 28, impact: 'positive' },
      { factor: 'Provider GAR-402 flagged in 14 past fraud cases', weight: 22, impact: 'positive' },
      { factor: 'Police report filed within 48h', weight: 10, impact: 'negative' }
    ],
    timeline: [
      { date: '2026-08-01', title: 'Policy Initiated', detail: 'Comprehensive auto coverage activated' },
      { date: '2026-08-12', title: 'Incident Occurred', detail: 'Late night single-vehicle collision reported' },
      { date: '2026-08-14', title: 'Claim Submitted', detail: 'Submitted via portal after 2-day lag' }
    ]
  },
  {
    id: 'CLM-1095',
    claimantName: 'Aarav Mehta',
    age: 41,
    policyNumber: 'POL-44120',
    premiumAmount: 1800,
    coverageType: 'Collision & Commercial Auto',
    claimAmount: 6200,
    claimType: 'auto',
    incidentDate: '2026-09-10',
    reportDate: '2026-09-11',
    incidentTime: '18:30',
    policeReport: true,
    witnesses: 2,
    providerId: 'GAR-402',
    region: 'South',
    city: 'Bangalore',
    area: 'Whitefield',
    facilityName: 'Metro Automotive Body Works',
    diagnosisOrLoss: 'Rear-End Impact & Tailgate Structural Repair',
    status: 'Pending',
    providerHistoryCount: 14,
    policyStartDate: '2025-04-10',
    isOutlier: false,
    shapFactors: [
      { factor: 'Provider GAR-402 flagged in collision ring syndicate', weight: 38, impact: 'positive' },
      { factor: 'Claim-to-premium ratio: 3.44x', weight: 15, impact: 'positive' },
      { factor: 'Consistent police record and witness testimony', weight: 20, impact: 'negative' }
    ],
    timeline: [
      { date: '2025-04-10', title: 'Policy Inception', detail: 'Standard commercial auto' },
      { date: '2026-09-10', title: 'Rear-End Incident', detail: 'Reported during rush hour' },
      { date: '2026-09-11', title: 'Claim Filed', detail: 'Filed with prompt police confirmation' }
    ]
  }
];

export const CSV_SAMPLE_TEMPLATE = `claimantName,age,policyNumber,premiumAmount,claimAmount,claimType,incidentDate,policeReport,providerId,city,area,region
Sunita Rao,38,POL-HLT-99212,2400,21500,health,2026-09-02,false,DOC-808,Bangalore,Koramangala,South
Deepak Verma,45,POL-PRP-88123,3100,42000,property,2026-08-28,true,PROV-701,Bangalore,Electronic City,South
Tanvi Kulkarni,34,POL-HLT-77219,3600,4500,health,2026-09-05,false,DOC-109,Bangalore,Whitefield,South
Ramesh Patel,52,POL-PRP-11928,2800,12000,property,2026-09-04,false,PROV-404,Mumbai,Bandra Kurla Complex (BKC),West
Aditi Sharma,29,POL-HLT-33921,2100,3200,health,2026-09-07,false,DOC-912,Delhi NCR,Cyber City (Gurugram),North`;

