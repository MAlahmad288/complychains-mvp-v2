"use client";

import { EvidenceState } from "@/types";

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key: string, value: unknown) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },
};

export function getAllAssessments(): EvidenceState[] {
  const states = storage.get<Record<string, EvidenceState>>("cc_control_states", {});
  return Object.values(states).filter((s) => s.aiResult);
}

export function getControlState(controlId: string): EvidenceState | undefined {
  const states = storage.get<Record<string, EvidenceState>>("cc_control_states", {});
  return states[controlId];
}

export function saveControlState(controlId: string, state: EvidenceState) {
  const states = storage.get<Record<string, EvidenceState>>("cc_control_states", {});
  states[controlId] = state;
  storage.set("cc_control_states", states);
  // Sync assessments list
  const assessments = Object.values(states).filter((s) => s.aiResult);
  storage.set("cc_assessments", assessments);
}
