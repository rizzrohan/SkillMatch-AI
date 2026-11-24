import type { SkillLevel } from '../data/companies';

export function LevelBadge({ level, className = '' }: { level: SkillLevel; className?: string }) {
  const styles: Record<SkillLevel, string> = {
    Beginner: 'bg-ink-300 text-muted-light',
    Intermediate: 'bg-brass/15 text-brass-100',
    Advanced: 'bg-brass/25 text-brass-100',
  };
  return <span className={`badge ${styles[level]} ${className}`}>{level}</span>;
}

export function WeightTag({ weight }: { weight: 'core' | 'secondary' }) {
  const isCore = weight === 'core';
  return (
    <span
      className={`badge ${
        isCore ? 'bg-brass/20 text-brass-100' : 'bg-ink-300 text-muted'
      }`}
    >
      {isCore ? 'Core' : 'Secondary'}
    </span>
  );
}

export function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified) return null;
  return (
    <span className="badge bg-emerald-500/15 text-emerald-300">
      Verified
    </span>
  );
}
