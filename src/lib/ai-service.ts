"use client";

import { Control, AIResult } from "@/types";

const keywords: Record<string, string[]> = {
  strategy: ["strategy", "approved", "board", "leadership", "governance", "roadmap", "vision"],
  policy: ["policy", "procedure", "documented", "approved", "communicated", "enforced", "review"],
  access: ["mfa", "multi-factor", "authentication", "privileged", "access review", "least privilege", "unique id", "shared account"],
  encryption: ["encryption", "tls", "aes", "cryptographic", "key management", "ssl", "cipher"],
  backup: ["backup", "recovery", "restore", "tested", "offsite", "offline", "retention"],
  vulnerability: ["vulnerability", "scan", "remediation", "patch", "cve", "penetration", "pentest"],
  incident: ["incident", "response", "soc", "alert", "escalation", "breach", "reporting"],
  logging: ["log", "siem", "monitoring", "audit trail", "retention", "alerting", "centralized"],
  training: ["training", "awareness", "phishing", "simulation", "education", "certification"],
  vendor: ["vendor", "third party", "supplier", "contract", "assessment", "due diligence"],
  cloud: ["cloud", "aws", "azure", "gcp", "shared responsibility", "ccc", "saas", "iaas"],
  physical: ["physical", "access control", "cctv", "badge", "environmental", "fire", "flood"],
  data: ["data classification", "dlp", "data loss", "protection", "handling", "retention", "disposal"],
  network: ["firewall", "segmentation", "ids", "ips", "vpn", "wireless", "dmz", "subnet"],
  development: ["sdlc", "secure coding", "input validation", "owasp", "testing", "devsecops"],
  risk: ["risk", "assessment", "register", "treatment", "appetite", "mitigation", "acceptance"],
  audit: ["audit", "review", "compliance", "finding", "remediation", "internal audit"],
  hr: ["background", "screening", "termination", "offboarding", "nda", "employment"],
  bcm: ["business continuity", "disaster recovery", "bcp", "dr", "rto", "rpo", "resilience"],
  mobile: ["mdm", "byod", "mobile", "device", "remote wipe", "emmm"],
  email: ["dmarc", "spf", "dkim", "email", "gateway", "phishing", "spam"],
  web: ["owasp", "input validation", "xss", "sql injection", "csrf", "session", "cookie"],
};

export async function evaluateEvidence(
  control: Control,
  evidenceText: string,
  evidenceFiles: { name: string; size: number }[]
): Promise<AIResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1500));

  const text = evidenceText.toLowerCase();
  const controlTitle = control.title.toLowerCase();
  const controlDesc = control.description.toLowerCase();

  let score = 0;
  let matchedKeywords: string[] = [];

  for (const [, words] of Object.entries(keywords)) {
    const matches = words.filter((w) => text.includes(w));
    if (matches.length > 0) {
      score += matches.length * 8;
      matchedKeywords.push(...matches);
    }
  }

  const titleWords = controlTitle.split(/\s+/).filter((w) => w.length > 3);
  const descWords = controlDesc.split(/\s+/).filter((w) => w.length > 4);
  const titleMatches = titleWords.filter((w) => text.includes(w)).length;
  const descMatches = descWords.filter((w) => text.includes(w)).length;

  score += titleMatches * 10 + descMatches * 5;
  if (evidenceFiles.length > 0) score += 15;
  if (text.length > 500) score += 10;
  if (text.length > 1000) score += 10;

  score = Math.min(100, Math.max(10, score));

  const gaps: string[] = [];
  const recommendations: string[] = [];

  if (score < 40) {
    gaps.push("Evidence does not sufficiently demonstrate implementation of this control.");
    gaps.push("Missing documented procedures or configuration evidence.");
    recommendations.push("Provide policy documents, configuration screenshots, or audit reports.");
    recommendations.push("Include evidence showing active implementation, not just planning.");
  } else if (score < 70) {
    gaps.push("Partial evidence provided; some control elements may not be fully addressed.");
    recommendations.push("Strengthen evidence with additional documentation or configuration proof.");
    recommendations.push("Ensure evidence covers all aspects of the control requirement.");
  } else if (score < 90) {
    gaps.push("Minor gaps in evidence completeness or currency.");
    recommendations.push("Update evidence to reflect current state and add missing documentation.");
  } else {
    recommendations.push("Evidence is strong. Maintain current state and schedule periodic review.");
  }

  let status = "non-compliant";
  if (score >= 80) status = "compliant";
  else if (score >= 50) status = "partially-compliant";
  else if (score >= 25) status = "in-progress";

  return {
    score: Math.round(score),
    status,
    matchedKeywords: Array.from(new Set(matchedKeywords)).slice(0, 8),
    gaps: gaps.slice(0, 3),
    recommendations: recommendations.slice(0, 3),
    aiConfidence: Math.round(75 + Math.random() * 20),
    analysisDate: new Date().toISOString(),
    evidenceSummary: evidenceText
      ? evidenceText.substring(0, 200) + (evidenceText.length > 200 ? "..." : "")
      : "No text evidence provided.",
  };
}
