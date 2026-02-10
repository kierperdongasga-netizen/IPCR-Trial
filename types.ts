export enum Role {
  EMPLOYEE = 'EMPLOYEE',
  IMMEDIATE_SUPERVISOR = 'IMMEDIATE_SUPERVISOR',
  VP = 'VP',
  PMT = 'PMT',
  SUC_PRESIDENT = 'SUC_PRESIDENT'
}

export enum IPCRStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  REVIEWED = 'REVIEWED',
  APPROVED = 'APPROVED',
  ARCHIVED = 'ARCHIVED'
}

export enum EmployeeCategory {
  DIRECTOR_UNIT_HEAD = 'DIRECTOR_UNIT_HEAD',
  OFFICE_STAFF = 'OFFICE_STAFF',
  DRIVER = 'DRIVER'
}

export interface User {
  id: string;
  name: string;
  role: Role;
  position: string;
  office: string;
  email: string;
  avatar?: string;
  category?: EmployeeCategory;
}

export interface Evidence {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  type: string; // e.g., 'Memo', 'Report'
}

export interface Indicator {
  id: string;
  kra: string;
  target: string;
  accomplishment: string;
  sdg: string[];
  q: number | null;
  e: number | null;
  t: number | null;
  remarks: string;
  isFixedVolume: boolean;
  period: 'Jan-Jun' | 'Jul-Dec';
  evidence: Evidence[];
}

export interface IPCRData {
  id: string;
  userId: string;
  periodStart: string;
  periodEnd: string;
  category: EmployeeCategory;
  hasDesignation: boolean;
  status: IPCRStatus;
  
  coreFunctions: Indicator[];
  strategicFunctions: Indicator[];
  supportFunctions: Indicator[];
  otherFunctions: Indicator[];
  
  comments: string;
  
  // Signatures
  rateeSignedAt?: string;
  supervisorSignedAt?: string;
  approverSignedAt?: string;
}

export const SDG_OPTIONS = [
  "1. No Poverty", "2. Zero Hunger", "3. Good Health", "4. Quality Education",
  "5. Gender Equality", "6. Clean Water", "7. Clean Energy", "8. Decent Work",
  "9. Industry/Innovation", "10. Reduced Inequality", "11. Sustainable Cities",
  "12. Responsible Consumption", "13. Climate Action", "14. Life Below Water",
  "15. Life on Land", "16. Peace/Justice", "17. Partnerships"
];