import { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2, XCircle, ChevronDown, ChevronUp,
  ArrowLeft, ArrowRight, Info, MapPin
} from 'lucide-react';
import type { AnalysisResult } from '../lib/scoring';
import { scoreLabel } from '../lib/scoring';
import { LevelBadge, WeightTag } from '../components/Badges';

type Props = {
  analysis: AnalysisResult;
  onBack: () => void;
  onContinue: () => void;
};

export function ResultsScreen({ analysis, onBack, onContinue }: Props) {
  const [whyOpen, setWhyOpen] = useState(false);
  const { company, results, matchScore } = analysis;
  const matched = results.filter((r) => r.matched);
  const missing = results.filter((r) => !r.matched);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 animate-fade-in">
      {/* Nav */}
      <div className="mb-8 flex items-center gap-3">
        <button onClick={onBack} className="btn-ghost text-sm px-3 py-2">
          <ArrowLeft size={16} />
          All rankings
        </button>
        <div className="h-4 w-px bg-ink-300" />
        <span className="text-cream font-medium">{company.name}</span>
        <span className="text-muted text-sm">· {company.role}</span>
      </div>

      <h2 className="font-display text-3xl sm:text-4xl text-cream mb-1">{company.name} — detailed breakdown</h2>
      <p className="text-muted mb-10">Here's how your resume stacks up against this role's requirements.</p>

      {/* Score hero */}
      <div className="card p-8 mb-6 flex flex-col sm:flex-row items-center gap-8">
        <RadialScore score={matchScore} />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-muted text-sm uppercase tracking-widest mb-1">Match score</p>
          <p className="font-display text-5xl text-cream mb-2">{matchScore}<span className="text-2xl text-muted">%</span></p>
          <ScoreLabel score={matchScore} />
          <p className="mt-4 text-sm text-muted leading-relaxed max-w-xs">
            {matched.length} of {results.length} skills detected in your resume.{' '}
            {missing.length > 0
              ? `${missing.length} gap${missing.length > 1 ? 's' : ''} to close.`
              : 'All skills accounted for!'}
          </p>
        </div>
      </div>

      {/* Why this score */}
      <div className="card mb-6 overflow-hidden">
        <button
          onClick={() => setWhyOpen((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-ink-200/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-1 focus-visible:ring-offset-ink-100"
        >
          <div className="flex items-center gap-2 text-cream font-medium">
            <Info size={16} className="text-brass" />
            Why this score?
          </div>
          {whyOpen ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
        </button>
        {whyOpen && <ScoringBreakdown analysis={analysis} />}
      </div>

      {/* Skill lists */}
      <div className="grid gap-6 sm:grid-cols-2">
        <SkillList
          title="Matched skills"
          icon={<CheckCircle2 size={18} className="text-brass" />}
          skills={matched}
          emptyMsg="No skills detected in your resume yet."
          variant="matched"
        />
        <SkillList
          title="Missing skills"
          icon={<XCircle size={18} className="text-red-400" />}
          skills={missing}
          emptyMsg="No gaps — great work!"
          variant="missing"
        />
      </div>

      {/* Continue */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 card p-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <MapPin size={15} className="text-brass flex-shrink-0" />
          {missing.length > 0
            ? `Ready to close ${missing.length} skill gap${missing.length > 1 ? 's' : ''}? Your personalized roadmap is next.`
            : `Perfect score! Your roadmap will confirm you're fully prepared.`}
        </div>
        <button onClick={onContinue} className="btn-primary whitespace-nowrap">
          Build my roadmap
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Radial score ring                                                    */
/* ------------------------------------------------------------------ */
function RadialScore({ score }: { score: number }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const duration = 1100;
    const start = performance.now();
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(eased * score));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [score]);

  const offset = C - (displayed / 100) * C;

  return (
    <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" className="-rotate-90" aria-hidden="true">
        {/* track */}
        <circle cx="70" cy="70" r={R} fill="none" stroke="#262832" strokeWidth="10" />
        {/* progress */}
        <circle
          cx="70" cy="70" r={R}
          fill="none"
          stroke="#D89B4A"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
      </svg>
      <span className="absolute font-display text-2xl text-cream" aria-label={`${score}% match`}>
        {displayed}%
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Score label pill                                                     */
/* ------------------------------------------------------------------ */
function ScoreLabel({ score }: { score: number }) {
  const label = scoreLabel(score);
  const styles =
    score >= 80
      ? 'bg-brass/20 text-brass-100'
      : score >= 50
      ? 'bg-amber-500/15 text-amber-300'
      : 'bg-ink-300 text-muted-light';
  return <span className={`badge text-sm px-3 py-1 ${styles}`}>{label}</span>;
}

/* ------------------------------------------------------------------ */
/* Scoring breakdown table                                              */
/* ------------------------------------------------------------------ */
const CORE_W = 2;
const SEC_W = 1;

function ScoringBreakdown({ analysis }: { analysis: AnalysisResult }) {
  const { results } = analysis;
  const totalWeight = results.reduce(
    (s, r) => s + (r.skill.weight === 'core' ? CORE_W : SEC_W), 0
  );

  return (
    <div className="border-t border-ink-300 px-6 py-5 animate-fade-in">
      <p className="text-sm text-muted mb-4 leading-relaxed">
        Core skills are weighted <span className="text-cream font-medium">2×</span> and secondary skills <span className="text-cream font-medium">1×</span>.
        The score is <code className="text-xs bg-ink-300 rounded px-1 py-0.5">earned&nbsp;weight&nbsp;/&nbsp;total&nbsp;weight</code>.
      </p>

      <div className="overflow-x-auto rounded-xl border border-ink-300">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-300 text-muted text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3">Skill</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Points</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => {
              const w = r.skill.weight === 'core' ? CORE_W : SEC_W;
              const earned = r.matched ? w : 0;
              return (
                <tr
                  key={r.skill.name}
                  className={`border-b border-ink-300/50 last:border-0 transition-colors ${
                    i % 2 === 0 ? '' : 'bg-ink-200/30'
                  }`}
                >
                  <td className="px-4 py-3 text-cream">{r.skill.name}</td>
                  <td className="px-4 py-3 text-center">
                    <WeightTag weight={r.skill.weight} />
                  </td>
                  <td className="px-4 py-3 text-center text-muted">{w}×</td>
                  <td className="px-4 py-3 text-center">
                    {r.matched
                      ? <span className="badge bg-brass/15 text-brass-100">Matched</span>
                      : <span className="badge bg-red-500/15 text-red-400">Missing</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    <span className={r.matched ? 'text-brass' : 'text-muted-dark'}>
                      {earned}/{w}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-ink-300 bg-ink-200/50">
              <td colSpan={4} className="px-4 py-3 text-sm text-muted">Total</td>
              <td className="px-4 py-3 text-right font-medium text-brass">
                {results.reduce((s, r) => r.matched ? s + (r.skill.weight === 'core' ? CORE_W : SEC_W) : s, 0)}
                /{totalWeight}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skill lists                                                          */
/* ------------------------------------------------------------------ */
type SkillListProps = {
  title: string;
  icon: React.ReactNode;
  skills: AnalysisResult['results'];
  emptyMsg: string;
  variant: 'matched' | 'missing';
};

function SkillList({ title, icon, skills, emptyMsg, variant }: SkillListProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-medium text-cream">{title}</h3>
        <span className="ml-auto badge bg-ink-300 text-muted text-xs">{skills.length}</span>
      </div>

      {skills.length === 0 ? (
        <p className="text-sm text-muted-dark py-4 text-center">{emptyMsg}</p>
      ) : (
        <ul className="space-y-2">
          {skills.map((r) => (
            <li key={r.skill.name}>
              <button
                onClick={() => setExpanded(expanded === r.skill.name ? null : r.skill.name)}
                className="w-full rounded-xl bg-ink-200 px-4 py-3 text-left hover:bg-ink-300/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-1 focus-visible:ring-offset-ink-100"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`h-2 w-2 rounded-full flex-shrink-0 ${
                      variant === 'matched' ? 'bg-brass' : 'bg-red-400/70'
                    }`}
                  />
                  <span className="text-sm text-cream flex-1 min-w-0 truncate">{r.skill.name}</span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <LevelBadge level={r.skill.level} />
                    <WeightTag weight={r.skill.weight} />
                    {expanded === r.skill.name
                      ? <ChevronUp size={14} className="text-muted" />
                      : <ChevronDown size={14} className="text-muted" />}
                  </div>
                </div>
                {expanded === r.skill.name && (
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    {r.skill.description}
                  </p>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
