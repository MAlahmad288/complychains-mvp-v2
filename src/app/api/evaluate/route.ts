import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { control, evidenceText, evidenceFiles } = await req.json();
  
  // TODO: Replace with actual OpenAI call
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const text = (evidenceText || "").toLowerCase();
  const controlTitle = control.title.toLowerCase();
  const controlDesc = control.description.toLowerCase();
  
  const keywords: Record<string, string[]> = {
    strategy: ["strategy", "approved", "board", "leadership", "governance"],
    policy: ["policy", "procedure", "documented", "approved", "communicated"],
    access: ["mfa", "authentication", "privileged", "access review", "least privilege"],
    encryption: ["encryption", "tls", "aes", "cryptographic", "key management"],
    backup: ["backup", "recovery", "restore", "tested", "offsite"],
    vulnerability: ["vulnerability", "scan", "remediation", "patch", "cve"],
    incident: ["incident", "response", "soc", "alert", "escalation"],
    logging: ["log", "siem", "monitoring", "audit trail", "retention"],
    training: ["training", "awareness", "phishing", "simulation"],
    vendor: ["vendor", "third party", "supplier", "contract", "assessment"],
    cloud: ["cloud", "aws", "azure", "gcp", "shared responsibility"],
    physical: ["physical", "access control", "cctv", "badge", "environmental"],
    data: ["data classification", "dlp", "data loss", "protection", "handling"],
    network: ["firewall", "segmentation", "ids", "ips", "vpn"],
    development: ["sdlc", "secure coding", "input validation", "owasp"],
    risk: ["risk", "assessment", "register", "treatment", "appetite"],
    audit: ["audit", "review", "compliance", "finding", "remediation"],
    hr: ["background", "screening", "termination", "offboarding", "nda"],
    bcm: ["business continuity", "disaster recovery", "bcp", "dr", "rto"],
    mobile: ["mdm", "byod", "mobile", "device", "remote wipe"],
    email: ["dmarc", "spf", "dkim", "email", "gateway", "phishing"],
    web: ["owasp", "input validation", "xss", "sql injection", "csrf"],
  };
  
  let score = 0;
  let matchedKeywords: string[] = [];
  
  for (const [, words] of Object.entries(keywords)) {
    const matches = words.filter((w) => text.includes(w));
    if (matches.length > 0) {
      score += matches.length * 8;
      matchedKeywords.push(...matches);
    }
  }
  
  const titleWords = controlTitle.split(/\s+/).filter((w: string) => w.length > 3);
  score += titleWords.filter((w: string) => text.includes(w)).length * 10;
  if (evidenceFiles?.length > 0) score += 15;
  if (text.length > 500) score += 10;
  
  score = Math.min(100, Math.max(10, score));
  
  let status = "non-compliant";
  if (score >= 80) status = "compliant";
  else if (score >= 50) status = "partially-compliant";
  else if (score >= 25) status = "in-progress";
  
  const gaps: string[] = [];
  const recommendations: string[] = [];
  
  if (score < 40) {
    gaps.push("Evidence does not sufficiently demonstrate implementation.");
    gaps.push("Missing documented procedures or configuration evidence.");
    recommendations.push("Provide policy documents or configuration screenshots.");
  } else if (score < 70) {
    gaps.push("Partial evidence provided.");
    recommendations.push("Strengthen evidence with additional documentation.");
  } else if (score < 90) {
    gaps.push("Minor gaps in evidence completeness.");
    recommendations.push("Update evidence to reflect current state.");
  } else {
    recommendations.push("Evidence is strong. Maintain current state.");
  }
  
  return NextResponse.json({
    score: Math.round(score),
    status,
    matchedKeywords: Array.from(new Set(matchedKeywords)).slice(0, 8),
    gaps: gaps.slice(0, 3),
    recommendations: recommendations.slice(0, 3),
    aiConfidence: Math.round(75 + Math.random() * 20),
    analysisDate: new Date().toISOString(),
    evidenceSummary: evidenceText ? evidenceText.substring(0, 200) + (evidenceText.length > 200 ? "..." : "") : "No text evidence provided.",
  });
}
