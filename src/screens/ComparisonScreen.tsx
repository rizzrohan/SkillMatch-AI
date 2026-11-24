import { useMemo } from 'react';
import { ArrowLeft, ArrowRight, Trophy, TrendingUp } from 'lucide-react';
import { mockCompanies } from '../data/companies';
import { analyzeCompany, scoreLabel } from '../lib/scoring';
import type { AnalysisResult } from '../lib/scoring';

type Props = {
  resumeText: string;
  fileName: string;
  onSelect: (analysis: AnalysisResult) => void;
  onBack: () => void;
};

export function ComparisonScreen({ resumeText, fileName, onSelect, onBack }: Props) {
  const ranked = useMemo<AnalysisResult[]>(() => {
    return mockCompanies
      .map((c) => analyzeCompany(c, resumeText))
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [resumeText]);

  const best = ranked[0];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 animate-fade-in">
      {/* Nav */}
      <div className="mb-8 flex items-center gap-3">
        <button onClick={onBack} className="btn-ghost text-sm px-3 py-2">
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="h-4 w-px bg-ink-300" />
        <span className="text-muted text-sm truncate max-w-[200px]">{fileName}</span>
      </div>

      <h2 className="font-display text-3xl sm:text-4xl text-cream mb-1">Your match ranking</h2>
      <p className="text-muted mb-8">
        Your resume was scored against all four roles. Pick one to see the detailed breakdown and roadmap.
      </p>

      {/* Best match callout */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-brass/30 bg-brass/5 px-5 py-4">
        <Trophy size={20} className="text-brass flex-shrink-0" />
        <p className="text-sm text-cream">
          You're a <span className="text-brass font-medium">stronger match</span> for{' '}
          <span className="font-medium">{best.company.name}</span>{' '}
          ({best.matchScore}%) than any other role in this set.
        </p>
      </div>

      {/* Ranked cards */}
      <ol className="space-y-4">
        {ranked.map((analysis, idx) => (
          <RankCard
            key={analysis.company.id}
            analysis={analysis}
            rank={idx + 1}
            isTop={idx === 0}
            onSelect={() => onSelect(analysis)}
          />
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Individual ranked company card                                       */
/* ------------------------------------------------------------------ */
function RankCard({
  analysis,
  rank,
  isTop,
  onSelect,
}: {
  analysis: AnalysisResult;
  rank: number;
  isTop: boolean;
  onSelect: () => void;
}) {
  const { company, matchScore, matchedCount, results } = analysis;
  const total = results.length;
  const missingCore = results.filter((r) => !r.matched && r.skill.weight === 'core').length;

  return (
    <li>
      <button
        onClick={onSelect}
        style={{ animationDelay: `${rank * 70}ms` }}
        className={[
          'group w-full text-left card p-5 sm:p-6 animate-scale-in transition-all',
          'hover:border-brass/60 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brass/5',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
          isTop ? 'border-brass/40' : '',
        ].join(' ')}
      >
        <div className="flex items-start gap-4">
          {/* Rank number */}
          <div className={[
            'flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl font-display text-lg font-medium',
            isTop ? 'bg-brass text-ink' : 'bg-ink-300 text-muted',
          ].join(' ')}>
            {rank}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-xl text-cream">{company.name}</h3>
                  {isTop && (
                    <span className="badge bg-brass/20 text-brass-100 text-xs">
                      Best match
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted mt-0.5">{company.role}</p>
              </div>
              <ArrowRight
                size={18}
                className="text-muted group-hover:text-brass group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1"
              />
            </div>

            {/* Score bar */}
            <ScoreBar score={matchScore} />

            {/* Stats row */}
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brass" />
                {matchedCount}/{total} skills matched
              </span>
              {missingCore > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-400/70" />
                  {missingCore} core gap{missingCore > 1 ? 's' : ''}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <TrendingUp size={12} className={matchScore >= 80 ? 'text-brass' : matchScore >= 50 ? 'text-amber-400' : 'text-muted-dark'} />
                <ScoreLabelInline score={matchScore} />
              </span>
            </div>
          </div>
        </div>
      </button>
    </li>
  );
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="relative h-2 rounded-full bg-ink-300 overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full rounded-full bg-brass transition-all"
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

function ScoreLabelInline({ score }: { score: number }) {
  const label = scoreLabel(score);
  const color =
    score >= 80 ? 'text-brass' : score >= 50 ? 'text-amber-400' : 'text-muted-dark';
  return <span className={color}>{label}</span>;
}
