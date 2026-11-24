import { useState, useEffect, useCallback } from 'react';

type StoredState = {
  practicedSkills: Record<string, boolean>;
  verifiedSkills: Record<string, boolean>;
};

function storageKey(companyId: string): string {
  return `skillmatch:${companyId}`;
}

function load(companyId: string): StoredState {
  try {
    const raw = localStorage.getItem(storageKey(companyId));
    if (raw) return JSON.parse(raw) as StoredState;
  } catch {
    // ignore parse errors
  }
  return { practicedSkills: {}, verifiedSkills: {} };
}

function save(companyId: string, state: StoredState): void {
  try {
    localStorage.setItem(storageKey(companyId), JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export function useRoadmapState(companyId: string) {
  const [state, setState] = useState<StoredState>(() => load(companyId));

  useEffect(() => {
    setState(load(companyId));
  }, [companyId]);

  useEffect(() => {
    save(companyId, state);
  }, [companyId, state]);

  const togglePracticed = useCallback((skillName: string) => {
    setState((prev) => ({
      ...prev,
      practicedSkills: {
        ...prev.practicedSkills,
        [skillName]: !prev.practicedSkills[skillName],
      },
    }));
  }, []);

  const setVerified = useCallback((skillName: string) => {
    setState((prev) => ({
      ...prev,
      verifiedSkills: { ...prev.verifiedSkills, [skillName]: true },
    }));
  }, []);

  return { practicedSkills: state.practicedSkills, verifiedSkills: state.verifiedSkills, togglePracticed, setVerified };
}
