import type { Company, RequiredSkill } from "../data/companies";
import { isSkillMatched, normalizeText } from "./skillMatching";

export type SkillMatchState = "matched" | "missing" | "practiced";

export type SkillMatchResult = {
  skill: RequiredSkill;
  matched: boolean;
  state: SkillMatchState;
  verified: boolean;
};

export type AnalysisResult = {
  company: Company;
  results: SkillMatchResult[];
  matchScore: number;
  matchedCount: number;
  missingCount: number;
};

const CORE_WEIGHT = 2;
const SECONDARY_WEIGHT = 1;

export function analyzeCompany(
  company: Company,
  resumeText: string,
  practicedSkills: Record<string, boolean> = {},
  verifiedSkills: Record<string, boolean> = {}
): AnalysisResult {
  const normalized = normalizeText(resumeText);

  const results: SkillMatchResult[] = company.requiredSkills.map((skill) => {
    const fromResume = isSkillMatched(skill.name, normalized);
    const practiced = !!practicedSkills[skill.name];
    const verified = !!verifiedSkills[skill.name];
    return {
      skill,
      matched: fromResume || practiced,
      state: practiced ? "practiced" : fromResume ? "matched" : "missing",
      verified,
    };
  });

  const totalWeight = company.requiredSkills.reduce(
    (sum, s) => sum + (s.weight === "core" ? CORE_WEIGHT : SECONDARY_WEIGHT),
    0
  );
  const earnedWeight = results.reduce(
    (sum, r) => (r.matched ? sum + (r.skill.weight === "core" ? CORE_WEIGHT : SECONDARY_WEIGHT) : sum),
    0
  );
  const matchScore = totalWeight === 0 ? 0 : Math.round((earnedWeight / totalWeight) * 100);
  const matchedCount = results.filter((r) => r.matched).length;

  return {
    company,
    results,
    matchScore,
    matchedCount,
    missingCount: results.length - matchedCount,
  };
}

export function scoreLabel(score: number): string {
  if (score >= 80) return "Job-ready";
  if (score >= 50) return "On your way";
  return "Just getting started";
}
