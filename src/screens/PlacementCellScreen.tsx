import { useMemo, useState } from 'react';
import {
  LogOut, Users, Calendar, TrendingUp, ChevronDown, ChevronUp,
  CheckCircle2, AlertTriangle, BarChart2, Medal, Trophy
} from 'lucide-react';
import { mockCompanies, mockStudents } from '../data/companies';
import { analyzeCompany, scoreLabel } from '../lib/scoring';
import type { AnalysisResult } from '../lib/scoring';

const READY_THRESHOLD = 70;

type StudentResult = {
  student: typeof mockStudents[number];
  analysis: AnalysisResult;
};

type CompanyBlock = {
  company: typeof mockCompanies[number];
  studentResults: StudentResult[];
  readyCount: number;
  avgScore: number;
  weeksUntil: number;
};

type LeaderboardEntry = {
  student: typeof mockStudents[number];
  bestScore: number;
  bestCompany: string;
  bestRole: string;
};

function weeksUntilDate(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7)));
}

type Tab = 'breakdown' | 'leaderboard';

type Props = { onLogout: () => void };

export function PlacementCellScreen({ onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('breakdown');

  const companies: CompanyBlock[] = useMemo(() => {
    return mockCompanies.map((company) => {
      const studentResults: StudentResult[] = mockStudents.map((student) => ({
        student,
        analysis: analyzeCompany(company, student.resumeText),
      }));
      studentResults.sort((a, b) => b.analysis.matchScore - a.analysis.matchScore);

      const readyCount = studentResults.filter((sr) => sr.analysis.matchScore >= READY_THRESHOLD).length;
      const avgScore = Math.round(
        studentResults.reduce((s, sr) => s + sr.analysis.matchScore, 0) / studentResults.length
      );
      const weeksUntil = weeksUntilDate(company.drivedate);
      return { company, studentResults, readyCount, avgScore, weeksUntil };
    });
  }, []);

  const leaderboard: LeaderboardEntry[] = useMemo(() => {
    return mockStudents
      .map((student) => {
        let bestScore = 0;
        let bestCompany = '';
        let bestRole = '';
        for (const company of mockCompanies) {
          const score = analyzeCompany(company, student.resumeText).matchScore;
          if (score > bestScore) {
            bestScore = score;
            bestCompany = company.name;
            bestRole = company.role;
          }
        }
        return { student, bestScore, bestCompany, bestRole };
      })
      .sort((a, b) => b.bestScore - a.bestScore);
  }, []);

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-ink">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-ink-300/60 bg-ink/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brass text-ink">
              <BarChart2 size={18} />
            </span>
            <div>
              <p className="font-display text-base text-cream leading-tight">Placement Cell View</p>
              <p className="text-xs text-muted leading-tight">Campus drive readiness dashboard</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-xl border border-ink-300 px-3 py-2 text-sm text-muted hover:border-red-500/50 hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 animate-fade-in">
        {/* Pitch headline */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-cream mb-2">Know before the drive.</h1>
          <p className="text-muted max-w-xl leading-relaxed">
            See how prepared your students are before each campus drive — and where to focus upskilling.
          </p>
        </div>

        {/* Summary bar */}
        <SummaryBar companies={companies} />

        {/* Tabs */}
        <div className="mt-10 flex gap-1 rounded-xl border border-ink-300 bg-ink-200 p-1 w-fit">
          <TabButton active={tab === 'breakdown'} onClick={() => setTab('breakdown')}>
            <BarChart2 size={15} />
            Company breakdown
          </TabButton>
          <TabButton active={tab === 'leaderboard'} onClick={() => setTab('leaderboard')}>
            <Trophy size={15} />
            Leaderboard
          </TabButton>
        </div>

        {/* Tab content */}
        {tab === 'breakdown' && (
          <div className="mt-8 space-y-8 animate-fade-in">
            {[...companies]
              .sort((a, b) => a.weeksUntil - b.weeksUntil)
              .map((block) => (
                <CompanyBlockCard key={block.company.id} block={block} />
              ))}
          </div>
        )}

        {tab === 'leaderboard' && (
          <LeaderboardPanel entries={leaderboard} />
        )}

        <p className="mt-12 text-xs text-muted-dark text-center">
          Student data is illustrative mock data for demonstration purposes. Company profiles are not official job listings.
        </p>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab button                                                           */
/* ------------------------------------------------------------------ */
function TabButton({
  active, onClick, children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brass',
        active
          ? 'bg-brass text-ink shadow-sm'
          : 'text-muted hover:text-cream',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Summary bar                                                          */
/* ------------------------------------------------------------------ */
function SummaryBar({ companies }: { companies: CompanyBlock[] }) {
  const totalStudents = mockStudents.length;
  const drivesThisMonth = companies.filter((c) => c.weeksUntil <= 4).length;
  const overallAvg = Math.round(companies.reduce((s, c) => s + c.avgScore, 0) / companies.length);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { label: 'Students tracked', value: totalStudents, icon: <Users size={18} className="text-brass" /> },
        { label: 'Companies', value: companies.length, icon: <BarChart2 size={18} className="text-brass" /> },
        { label: 'Drives in ≤4 weeks', value: drivesThisMonth, icon: <Calendar size={18} className="text-amber-400" /> },
        { label: 'Avg match score', value: `${overallAvg}%`, icon: <TrendingUp size={18} className="text-brass" /> },
      ].map(({ label, value, icon }) => (
        <div key={label} className="card p-4">
          <div className="flex items-center gap-2 mb-1">{icon}<p className="text-xs text-muted">{label}</p></div>
          <p className="font-display text-2xl text-cream">{value}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Company breakdown card                                               */
/* ------------------------------------------------------------------ */
function CompanyBlockCard({ block }: { block: CompanyBlock }) {
  const [open, setOpen] = useState(true);
  const { company, studentResults, readyCount, avgScore, weeksUntil } = block;
  const urgency = weeksUntil <= 2 ? 'urgent' : weeksUntil <= 4 ? 'soon' : 'upcoming';

  return (
    <div className={`card overflow-hidden ${urgency === 'urgent' ? 'border-amber-500/40' : ''}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 p-6 hover:bg-ink-200/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-1 focus-visible:ring-offset-ink-100 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h2 className="font-display text-2xl text-cream">{company.name}</h2>
            <span className="text-muted text-sm">{company.role}</span>
            <DriveBadge weeks={weeksUntil} urgency={urgency} />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted mt-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-brass" />
              <span className="text-cream font-medium">{readyCount}</span> of {studentResults.length} students ready (≥{READY_THRESHOLD}%)
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-brass" />
              Avg score: <span className="text-cream font-medium ml-1">{avgScore}%</span>
            </span>
          </div>
        </div>
        {open ? <ChevronUp size={18} className="text-muted flex-shrink-0 mt-1" /> : <ChevronDown size={18} className="text-muted flex-shrink-0 mt-1" />}
      </button>

      <div className="px-6 pb-1">
        <div className="h-1.5 rounded-full bg-ink-300 overflow-hidden">
          <div className="h-full rounded-full bg-brass transition-all duration-700" style={{ width: `${avgScore}%` }} />
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-300 mt-4 overflow-x-auto animate-fade-in">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted uppercase tracking-wider border-b border-ink-300">
                <th className="text-left px-6 py-3">Student</th>
                <th className="px-4 py-3 text-center">Match score</th>
                <th className="px-4 py-3 text-center">Skills matched</th>
                <th className="px-4 py-3 text-center">Core gaps</th>
                <th className="px-4 py-3 text-center">Readiness</th>
              </tr>
            </thead>
            <tbody>
              {studentResults.map((sr, i) => {
                const { student, analysis } = sr;
                const coreGaps = analysis.results.filter((r) => !r.matched && r.skill.weight === 'core').length;
                const ready = analysis.matchScore >= READY_THRESHOLD;
                return (
                  <tr key={student.id} className={`border-b border-ink-300/40 last:border-0 ${i % 2 === 0 ? '' : 'bg-ink-200/20'}`}>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-7 w-7 rounded-full bg-ink-300 flex items-center justify-center text-xs font-medium text-muted-light flex-shrink-0">
                          {student.name.split(' ').map((n) => n[0]).join('')}
                        </span>
                        <div>
                          <span className="text-cream font-medium">{student.name}</span>
                          <p className="text-xs text-muted-dark">{student.branch}</p>
                        </div>
                        {i === 0 && <span className="badge bg-brass/20 text-brass-100 text-xs">Top</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center"><ScoreCell score={analysis.matchScore} /></td>
                    <td className="px-4 py-3 text-center text-muted">{analysis.matchedCount}/{analysis.results.length}</td>
                    <td className="px-4 py-3 text-center">
                      {coreGaps > 0
                        ? <span className="flex items-center justify-center gap-1 text-amber-400"><AlertTriangle size={13} />{coreGaps}</span>
                        : <span className="text-brass">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {ready
                        ? <span className="badge bg-brass/20 text-brass-100">Ready</span>
                        : <span className="badge bg-ink-300 text-muted">{scoreLabel(analysis.matchScore)}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Leaderboard panel                                                    */
/* ------------------------------------------------------------------ */
function LeaderboardPanel({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="mt-8 animate-fade-in">
      <div className="mb-6">
        <p className="text-xs text-muted uppercase tracking-widest mb-1">For recruiters</p>
        <p className="text-muted leading-relaxed max-w-xl">
          Share this with recruiters — your top-ready candidates at a glance. Ranked by each student's best match score across all companies.
        </p>
      </div>

      {/* Top 3 podium */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {entries.slice(0, 3).map((entry, i) => (
          <PodiumCard key={entry.student.id} entry={entry} rank={i + 1} />
        ))}
      </div>

      {/* Full table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-ink-300">
          <h3 className="font-medium text-cream flex items-center gap-2">
            <Medal size={16} className="text-brass" />
            Full leaderboard
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted uppercase tracking-wider border-b border-ink-300 bg-ink-200/30">
                <th className="text-center px-4 py-3 w-12">Rank</th>
                <th className="text-left px-4 py-3">Student</th>
                <th className="text-left px-4 py-3">Branch</th>
                <th className="text-left px-4 py-3">Best match</th>
                <th className="text-center px-4 py-3">Score</th>
                <th className="text-center px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => {
                const isTop3 = i < 3;
                return (
                  <tr
                    key={entry.student.id}
                    className={[
                      'border-b border-ink-300/40 last:border-0 transition-colors',
                      isTop3 ? 'bg-brass/[0.03]' : i % 2 === 0 ? '' : 'bg-ink-200/20',
                    ].join(' ')}
                  >
                    <td className="px-4 py-3.5 text-center">
                      <RankBadge rank={i + 1} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${isTop3 ? 'bg-brass/20 text-brass-100' : 'bg-ink-300 text-muted-light'}`}>
                          {entry.student.name.split(' ').map((n) => n[0]).join('')}
                        </span>
                        <span className={`font-medium ${isTop3 ? 'text-cream' : 'text-cream'}`}>
                          {entry.student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-muted text-sm">{entry.student.branch}</td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-cream text-sm">{entry.bestCompany}</p>
                        <p className="text-xs text-muted-dark">{entry.bestRole}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <ScoreCell score={entry.bestScore} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <StatusBadge score={entry.bestScore} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Podium card (top 3)                                                  */
/* ------------------------------------------------------------------ */
function PodiumCard({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  const medals = ['text-yellow-400', 'text-slate-400', 'text-amber-600'];
  const borders = ['border-yellow-400/30', 'border-slate-400/20', 'border-amber-600/20'];
  const glows = ['bg-yellow-400/5', 'bg-slate-400/5', 'bg-amber-600/5'];

  return (
    <div className={`card p-5 ${borders[rank - 1]} ${glows[rank - 1]}`}>
      <div className="flex items-center justify-between mb-3">
        <Medal size={20} className={medals[rank - 1]} />
        <span className={`font-display text-2xl font-medium ${medals[rank - 1]}`}>#{rank}</span>
      </div>
      <p className="font-medium text-cream">{entry.student.name}</p>
      <p className="text-xs text-muted-dark mb-3">{entry.student.branch}</p>
      <p className="text-xs text-muted mb-0.5">Best match: <span className="text-cream">{entry.bestCompany}</span></p>
      <div className="flex items-center justify-between mt-3">
        <ScoreCell score={entry.bestScore} />
        <StatusBadge score={entry.bestScore} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared sub-components                                                */
/* ------------------------------------------------------------------ */
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="font-display text-base font-medium text-yellow-400">#1</span>;
  if (rank === 2) return <span className="font-display text-base font-medium text-slate-400">#2</span>;
  if (rank === 3) return <span className="font-display text-base font-medium text-amber-600">#3</span>;
  return <span className="text-muted text-sm font-medium">{rank}</span>;
}

function DriveBadge({ weeks, urgency }: { weeks: number; urgency: string }) {
  const styles = urgency === 'urgent'
    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    : urgency === 'soon' ? 'bg-brass/15 text-brass-100' : 'bg-ink-300 text-muted';
  const label = weeks === 0 ? 'This week' : `Drive in ${weeks} week${weeks !== 1 ? 's' : ''}`;
  return <span className={`badge ${styles} flex items-center gap-1`}><Calendar size={11} />{label}</span>;
}

function ScoreCell({ score }: { score: number }) {
  const color = score >= 70 ? 'text-brass' : score >= 50 ? 'text-amber-400' : 'text-red-400';
  return <span className={`font-medium ${color}`}>{score}%</span>;
}

function StatusBadge({ score }: { score: number }) {
  const label = scoreLabel(score);
  const style = score >= 80 ? 'bg-brass/20 text-brass-100'
    : score >= 50 ? 'bg-amber-500/15 text-amber-300'
    : 'bg-ink-300 text-muted';
  return <span className={`badge ${style}`}>{label}</span>;
}
