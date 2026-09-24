import frameworksData from "../../public/data/frameworks.json";
import { Framework, Regulator } from "@/types";

export const frameworks: Framework[] = frameworksData.frameworks as Framework[];
export const regulators: Regulator[] = frameworksData.regulators as Regulator[];

export function getFrameworkById(id: string): Framework | undefined {
  return frameworks.find((f) => f.id === id);
}

export function getFrameworksByRegulator(regulatorId: string): Framework[] {
  return frameworks.filter((f) => f.regulatorId === regulatorId);
}

export function getTotalControls(): number {
  return frameworks.reduce((sum, f) => sum + f.totalControls, 0);
}
