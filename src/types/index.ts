export interface Control {
  id: string;
  title: string;
  description: string;
  evidenceType: string[];
  weight: number;
}

export interface Subdomain {
  id: string;
  name: string;
  controls: Control[];
}

export interface Domain {
  id: string;
  name: string;
  number: number;
  subdomains: Subdomain[];
}

export interface Framework {
  id: string;
  name: string;
  fullName: string;
  regulator: string;
  regulatorId: string;
  version: string;
  description: string;
  domains: Domain[];
  totalControls: number;
  mappings?: Record<string, string[]>;
}

export interface Regulator {
  id: string;
  name: string;
  shortName: string;
  frameworks: string[];
}

export interface AIResult {
  score: number;
  status: string;
  matchedKeywords: string[];
  gaps: string[];
  recommendations: string[];
  aiConfidence: number;
  analysisDate: string;
  evidenceSummary: string;
}

export interface EvidenceState {
  controlId: string;
  evidenceText: string;
  files: { id: string; name: string; size: number; type: string }[];
  aiResult?: AIResult;
  date: string;
  frameworkId: string;
  frameworkName: string;
  controlTitle: string;
}

export type UserRole = "enterprise" | "regulator" | "service-provider";
