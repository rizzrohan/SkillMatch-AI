import { useMemo, useState } from 'react';
import {
  LogOut, Calendar, TrendingUp, Users, Building2,
  CheckCircle2, AlertTriangle, ChevronDown, ChevronUp,
  ShieldCheck, SlidersHorizontal,
} from 'lucide-react';
import { mockCompanies, mockStudents } from '../data/companies';
import { analyzeCompany, scoreLabel } from '../lib/scoring';
import { VerifiedBadge } from '../components/Badges';

function weeksUntilDate(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7)));
}

type Props = {
  companyId: string;
  onLogout: () => void;
};

export function ShortlistScreen({ companyId, onLogout }: Props) {
  const [threshold, setThreshold] = useState(70);
  const [showFilter, setShowFilter] = useState(false);

  const company = mockCompanies.find((c) => c.id === companyId)!;

  const allResults = useMemo(
    () =>
      mockStudents
        .map((student) => ({
          student,
          analysis: analyzeCompany(company, student.resumeText),
        }))
        .sort((a, b) => b.analysis.matchScore - a.analysis.matchScore),
    [company]
  );

  const filtered = allResults.filter((r) => r.analysis.matchScore >= threshold);
  const weeksUntil = weeksUntilDate(company.drivedate);

  return (
    <div className="min-h-screen flex flex-col bg-ink">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-ink-300/60 bg-ink/90 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brass text-ink flex-shrink-0">
              <Building2 size={18} />
            </span>
            <div className="min-w-0">
              <p className="font-display text-base text-cream leading-tight truncate">{company.name} Shortlist</p>
              <p className="text-xs text-muted leading-tight truncate">{company.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-xl border border-ink-300 px-3 py-2 text-sm text-muted hover:border-red-500/50 hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink flex-shrink-0"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-10 flex-1 animate-fade-in">
        {/* Top pitch line */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-cream mb-2">
            {company.name} — Candidate Shortlist
          </h1>
          <p className="text-muted max-w-xl leading-relaxed">
            Pre-filtered, pre-scored candidates — ready before you arrive on campus.
          </p>
        </div>

        {/* Stats bar */}
        <StatsBar
          company={company}
          total={allResults.length}
          readyCount={allResults.filter((r) => r.analysis.matchScore >= 70).length}
          weeksUntil={weeksUntil}
          avgScore={Math.round(allResults.reduce((s, r) => s + r.analysis.matchScore, 0) / allResults.length)}
        />

        {/* Filter control */}
        <div className="mt-8 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-2 text-sm text-cream font-medium">
              <Users size={16} className="text-brass" />
              {filtered.length} of {allResults.length} candidates shown
            </span>
            <span className="badge bg-brass/15 text-brass-100">≥{threshold}% match</span>
          </div>
          <button
            onClick={() => setShowFilter((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-ink-300 px-3 py-2 text-sm text-muted hover:border-brass hover:text-brass transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          >
            <SlidersHorizontal size={15} />
            Filter by readiness
            {showFilter ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Threshold slider */}
        {showFilter && (
          <div className="mt-4 card p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="threshold-slider" className="text-sm text-cream font-medium">
                Minimum match score
              </label>
              <span className="font-display text-xl text-brass">{threshold}%</span>
            </div>
            <input
              id="threshold-slider"
              type="range"
              min={0}
              max={100}
              step={5}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-brass cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-dark mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
            <p className="text-xs text-muted mt-3">
              Showing <span className="text-cream font-medium">{filtered.length}</span> candidate{filtered.length !== 1 ? 's' : ''} at or above {threshold}% match.
            </p>
          </div>
        )}

        {/* Candidate list */}
        <div className="mt-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="card p-10 text-center">
              <AlertTriangle size={28} className="text-amber-400 mx-auto mb-3" />
              <p className="text-cream font-medium mb-1">No candidates meet this threshold</p>
              <p className="text-sm text-muted">Lower the filter to see more candidates.</p>
            </div>
          ) : (
            filtered.map((r, idx) => (
              <CandidateCard
                key={r.student.id}
                student={r.student}
                analysis={r.analysis}
                rank={idx + 1}
                isTop={idx === 0}
              />
            ))
          )}
        </div>

        {/* Candidates below threshold (collapsed) */}
        {allResults.length - filtered.length > 0 && (
          <BelowThreshold
            count={allResults.length - filtered.length}
            threshold={threshold}
          />
        )}

        <p className="mt-12 text-xs text-muted-dark text-center">
          Candidate data is illustrative mock data for demonstration purposes. Not a real recruitment platform.
        </p>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stats bar                                                            */
/* ------------------------------------------------------------------ */
function StatsBar({
  company, total, readyCount, weeksUntil, avgScore,
}: {
  company: ReturnType<typeof mockCompanies.find>;
  total: number;
  readyCount: number;
  weeksUntil: number;
  avgScore: number;
}) {
  if (!company) return null;
  const urgency = weeksUntil <= 2 ? 'text-amber-400' : weeksUntil <= 4 ? 'text-brass' : 'text-muted';
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard icon={<Users size={18} className="text-brass" />} label="Total candidates" value={total} />
      <StatCard icon={<CheckCircle2 size={18} className="text-brass" />} label="Ready (≥70%)" value={readyCount} />
      <StatCard icon={<TrendingUp size={18} className="text-brass" />} label="Avg match score" value={`${avgScore}%`} />
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-1">
          <Calendar size={18} className={urgency} />
          <p className="text-xs text-muted">Campus drive</p>
        </div>
        <p className={`font-display text-2xl ${urgency}`}>
          {weeksUntil === 0 ? 'This week' : `${weeksUntil}w`}
        </p>
        <p className="text-xs text-muted-dark mt-0.5">
          {new Date(company.drivedate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-1">{icon}<p className="text-xs text-muted">{label}</p></div>
      <p className="font-display text-2xl text-cream">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Candidate card                                                       */
/* ------------------------------------------------------------------ */
function CandidateCard({
  student, analysis, rank, isTop,
}: {
  student: typeof mockStudents[number];
  analysis: ReturnType<typeof analyzeCompany>;
  rank: number;
  isTop: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { matchScore, results } = analysis;
  const verifiedCount = results.filter((r) => r.verified).length;
  const coreGaps = results.filter((r) => !r.matched && r.skill.weight === 'core').length;
  const label = scoreLabel(matchScore);
  const scoreColor = matchScore >= 70 ? 'text-brass' : matchScore >= 50 ? 'text-amber-400' : 'text-red-400';
  const badgeStyle = matchScore >= 80 ? 'bg-brass/20 text-brass-100'
    : matchScore >= 50 ? 'bg-amber-500/15 text-amber-300'
    : 'bg-ink-300 text-muted';

  return (
    <div
      className={`card overflow-hidden transition-all ${isTop ? 'border-brass/40' : ''}`}
      style={{ animationDelay: `${rank * 40}ms` }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left p-5 hover:bg-ink-200/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-1 focus-visible:ring-offset-ink-100"
      >
        <div className="flex items-center gap-4">
          {/* Rank + avatar */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-medium font-display ${isTop ? 'bg-brass text-ink' : 'bg-ink-300 text-muted'}`}>
              {rank}
            </span>
            <span className="h-9 w-9 rounded-full bg-ink-300 flex items-center justify-center text-xs font-medium text-muted-light">
              {student.name.split(' ').map((n) => n[0]).join('')}
            </span>
          </div>

          {/* Name + branch */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-cream">{student.name}</p>
              {isTop && <span className="badge bg-brass/20 text-brass-100 text-xs">Top candidate</span>}
            </div>
            <p className="text-xs text-muted-dark">{student.branch}</p>
          </div>

          {/* Score + badge */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <p className={`font-display text-xl font-medium ${scoreColor}`}>{matchScore}%</p>
              <p className="text-xs text-muted">{analysis.matchedCount}/{results.length} skills</p>
            </div>
            <span className={`badge ${badgeStyle} hidden sm:inline-flex`}>{label}</span>
            {open ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="mt-3 h-1.5 rounded-full bg-ink-300 overflow-hidden">
          <div className="h-full rounded-full bg-brass transition-all duration-500" style={{ width: `${matchScore}%` }} />
        </div>
      </button>

      {/* Expanded details */}
      {open && (
        <div className="border-t border-ink-300 px-5 pb-5 pt-4 animate-fade-in">
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <DetailStat label="Match score" value={`${matchScore}%`} color={scoreColor} />
            <DetailStat label="Skills matched" value={`${analysis.matchedCount} / ${results.length}`} />
            <DetailStat
              label="Core gaps"
              value={coreGaps === 0 ? 'None' : String(coreGaps)}
              color={coreGaps === 0 ? 'text-brass' : 'text-amber-400'}
            />
          </div>

          {/* Skill pills */}
          <div className="space-y-3">
            <SkillPillGroup
              label="Matched"
              skills={results.filter((r) => r.matched)}
              dotColor="bg-brass"
            />
            {results.filter((r) => !r.matched).length > 0 && (
              <SkillPillGroup
                label="Missing"
                skills={results.filter((r) => !r.matched)}
                dotColor="bg-red-400/70"
              />
            )}
          </div>

          {verifiedCount > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-xs text-emerald-400">{verifiedCount} skill{verifiedCount > 1 ? 's' : ''} verified via quiz</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailStat({ label, value, color = 'text-cream' }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-xl bg-ink-200 px-4 py-3">
      <p className="text-xs text-muted mb-0.5">{label}</p>
      <p className={`font-medium text-sm ${color}`}>{value}</p>
    </div>
  );
}

function SkillPillGroup({
  label, skills, dotColor,
}: {
  label: string;
  skills: ReturnType<typeof analyzeCompany>['results'];
  dotColor: string;
}) {
  return (
    <div>
      <p className="text-xs text-muted-dark uppercase tracking-wider mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-2">
        {skills.map((r) => (
          <span
            key={r.skill.name}
            className="flex items-center gap-1.5 rounded-full border border-ink-300 bg-ink-200 px-3 py-1 text-xs text-cream"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${dotColor} flex-shrink-0`} />
            {r.skill.name}
            {r.verified && <VerifiedBadge verified />}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Below-threshold summary                                              */
/* ------------------------------------------------------------------ */
function BelowThreshold({ count, threshold }: { count: number; threshold: number }) {
  return (
    <div className="mt-4 rounded-xl border border-dashed border-ink-300 px-5 py-4 text-sm text-muted text-center">
      {count} candidate{count !== 1 ? 's' : ''} below {threshold}% threshold — lower the filter to include them.
    </div>
  );
}
