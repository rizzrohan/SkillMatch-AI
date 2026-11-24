import { useMemo, useState } from 'react';
import {
  ArrowLeft, CheckCircle2, Circle, ExternalLink,
  Clock, ChevronDown, ChevronUp, ShieldCheck, Zap, Download
} from 'lucide-react';
import type { AnalysisResult } from '../lib/scoring';
import { analyzeCompany, scoreLabel } from '../lib/scoring';
import { getRoadmapStep } from '../lib/roadmapData';
import { useRoadmapState } from '../lib/useRoadmapState';
import { WeightTag, LevelBadge, VerifiedBadge } from '../components/Badges';
import type { QuizQuestion } from '../data/quizBank';
import { getQuizForSkill } from '../data/quizBank';

type Props = {
  baseAnalysis: AnalysisResult;
  resumeText: string;
  onBack: () => void;
  onExportPdf: (practicedSkills: Record<string, boolean>, verifiedSkills: Record<string, boolean>) => void;
};

export function RoadmapScreen({ baseAnalysis, resumeText, onBack, onExportPdf }: Props) {
  const { company } = baseAnalysis;
  const { practicedSkills, verifiedSkills, togglePracticed, setVerified } = useRoadmapState(company.id);
  const [quizSkill, setQuizSkill] = useState<string | null>(null);

  const liveAnalysis = useMemo(
    () => analyzeCompany(company, resumeText, practicedSkills, verifiedSkills),
    [company, resumeText, practicedSkills, verifiedSkills]
  );

  const missingSteps = baseAnalysis.results
    .filter((r) => !r.matched)
    .map((r) => ({ result: r, step: getRoadmapStep(r.skill.name) }));

  const completedCount = missingSteps.filter((s) => practicedSkills[s.result.skill.name]).length;

  const quizQuestions: QuizQuestion[] | null = quizSkill
    ? getQuizForSkill(baseAnalysis.results.find((r) => r.skill.name === quizSkill)!.skill)
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 animate-fade-in">
      {/* Nav */}
      <div className="mb-8 flex items-center gap-3 flex-wrap">
        <button onClick={onBack} className="btn-ghost text-sm px-3 py-2">
          <ArrowLeft size={16} />
          Skill breakdown
        </button>
        <div className="h-4 w-px bg-ink-300" />
        <span className="text-cream font-medium">{company.name}</span>
        <span className="text-muted text-sm">· {company.role}</span>
        <button
          onClick={() => onExportPdf(practicedSkills, verifiedSkills)}
          className="ml-auto btn-ghost text-sm px-3 py-2"
        >
          <Download size={15} />
          Export PDF
        </button>
      </div>

      {/* Live score header */}
      <LiveScoreHeader analysis={liveAnalysis} completedCount={completedCount} total={missingSteps.length} />

      {/* Roadmap trail */}
      {missingSteps.length === 0 ? (
        <div className="mt-10 card p-8 text-center">
          <Zap size={32} className="text-brass mx-auto mb-3" />
          <p className="font-display text-xl text-cream mb-1">You're already there!</p>
          <p className="text-sm text-muted">All skills from your resume matched this role. Keep your skills sharp.</p>
        </div>
      ) : (
        <ol className="mt-10 space-y-0">
          {missingSteps.map(({ result, step }, idx) => {
            const done = !!practicedSkills[result.skill.name];
            const verified = !!verifiedSkills[result.skill.name];
            const hasQuiz = getQuizForSkill(result.skill).length > 0;
            const isLast = idx === missingSteps.length - 1;

            return (
              <TrailStep
                key={result.skill.name}
                idx={idx}
                skillName={result.skill.name}
                step={step}
                result={result}
                done={done}
                verified={verified}
                hasQuiz={hasQuiz}
                isLast={isLast}
                onToggle={() => togglePracticed(result.skill.name)}
                onVerify={() => setQuizSkill(result.skill.name)}
              />
            );
          })}
        </ol>
      )}

      {/* Already-matched skills summary */}
      {baseAnalysis.results.filter((r) => r.matched).length > 0 && (
        <MatchedSummary
          matched={baseAnalysis.results.filter((r) => r.matched)}
          verifiedSkills={verifiedSkills}
          onVerify={(name) => setQuizSkill(name)}
        />
      )}

      {/* Quiz modal */}
      {quizSkill && quizQuestions && (
        <QuizModal
          skillName={quizSkill}
          questions={quizQuestions}
          alreadyVerified={!!verifiedSkills[quizSkill]}
          onPass={() => { setVerified(quizSkill); setQuizSkill(null); }}
          onClose={() => setQuizSkill(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Live score header                                                    */
/* ------------------------------------------------------------------ */
function LiveScoreHeader({
  analysis,
  completedCount,
  total,
}: {
  analysis: AnalysisResult;
  completedCount: number;
  total: number;
}) {
  const { matchScore } = analysis;
  const label = scoreLabel(matchScore);
  const labelColor =
    matchScore >= 80 ? 'text-brass' : matchScore >= 50 ? 'text-amber-400' : 'text-muted';

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs text-muted uppercase tracking-widest mb-1">Live match score</p>
          <div className="flex items-end gap-2">
            <span className="font-display text-5xl text-cream transition-all duration-500">{matchScore}</span>
            <span className="text-xl text-muted mb-1">%</span>
            <span className={`mb-1.5 ml-1 text-sm font-medium ${labelColor}`}>{label}</span>
          </div>
        </div>
        {total > 0 && (
          <div className="text-right">
            <p className="text-xs text-muted uppercase tracking-widest mb-1">Roadmap progress</p>
            <p className="font-display text-3xl text-cream">{completedCount}<span className="text-base text-muted">/{total}</span></p>
            <p className="text-xs text-muted mt-0.5">steps marked done</p>
          </div>
        )}
      </div>
      {/* Progress bar */}
      <div className="mt-4 h-2 rounded-full bg-ink-300 overflow-hidden">
        <div
          className="h-full rounded-full bg-brass transition-all duration-700"
          style={{ width: `${matchScore}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-dark">
        Check off steps below as you complete them — your score updates in real time.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Trail step card                                                      */
/* ------------------------------------------------------------------ */
type TrailStepProps = {
  idx: number;
  skillName: string;
  step: ReturnType<typeof getRoadmapStep>;
  result: AnalysisResult['results'][number];
  done: boolean;
  verified: boolean;
  hasQuiz: boolean;
  isLast: boolean;
  onToggle: () => void;
  onVerify: () => void;
};

function TrailStep({
  idx, skillName, step, result, done, verified, hasQuiz, isLast, onToggle, onVerify
}: TrailStepProps) {
  const [open, setOpen] = useState(false);

  return (
    <li className="relative flex gap-4">
      {/* Trail line + node */}
      <div className="flex flex-col items-center flex-shrink-0 w-8">
        <button
          onClick={onToggle}
          aria-label={done ? `Mark ${skillName} incomplete` : `Mark ${skillName} complete`}
          className="relative z-10 flex-shrink-0 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          {done
            ? <CheckCircle2 size={28} className="text-brass" />
            : <Circle size={28} className="text-ink-300 hover:text-muted transition-colors" />}
        </button>
        {!isLast && (
          <div
            className={`w-0.5 flex-1 mt-1 mb-0 min-h-[2rem] transition-colors duration-500 ${done ? 'bg-brass/50' : 'bg-ink-300'}`}
          />
        )}
      </div>

      {/* Card */}
      <div
        className={[
          'flex-1 mb-6 card transition-all',
          done ? 'border-brass/40 bg-brass/5' : '',
        ].join(' ')}
        style={{ animationDelay: `${idx * 80}ms` }}
      >
        {/* Card header */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs text-muted-dark font-mono">Step {idx + 1}</span>
                <WeightTag weight={result.skill.weight} />
                <LevelBadge level={result.skill.level} />
                {verified && <VerifiedBadge verified />}
              </div>
              <h3 className={`font-display text-lg leading-tight ${done ? 'text-brass line-through decoration-brass/50' : 'text-cream'}`}>
                {step?.title ?? skillName}
              </h3>
              {step && (
                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted">
                  <Clock size={12} />
                  {step.timeRange}
                </div>
              )}
            </div>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex-shrink-0 rounded-lg p-1.5 text-muted hover:text-cream hover:bg-ink-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-1 focus-visible:ring-offset-ink-100"
              aria-label={open ? 'Collapse step' : 'Expand step'}
            >
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Expanded content */}
        {open && step && (
          <div className="border-t border-ink-300 px-5 pb-5 pt-4 animate-fade-in">
            {/* Subtasks */}
            <ul className="space-y-2 mb-5">
              {step.subtasks.map((task, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted leading-relaxed">
                  <span className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full bg-ink-300 text-muted-light text-xs flex items-center justify-center font-medium">
                    {i + 1}
                  </span>
                  {task}
                </li>
              ))}
            </ul>

            {/* Resources */}
            <div className="mb-4">
              <p className="text-xs text-muted-dark uppercase tracking-widest mb-2">Resources</p>
              <ul className="space-y-1.5">
                {step.resources.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-brass-100 hover:text-brass underline underline-offset-2 transition-colors"
                    >
                      <ExternalLink size={12} className="flex-shrink-0" />
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-ink-300/50">
              <button
                onClick={onToggle}
                className={`btn-ghost text-sm px-4 py-2 ${done ? 'text-brass border-brass/40' : ''}`}
              >
                {done ? <CheckCircle2 size={15} className="text-brass" /> : <Circle size={15} />}
                {done ? 'Mark incomplete' : 'Mark as done'}
              </button>
              {hasQuiz && !verified && (
                <button
                  onClick={onVerify}
                  className="btn-ghost text-sm px-4 py-2 border-emerald-500/40 text-emerald-400 hover:border-emerald-400"
                >
                  <ShieldCheck size={15} />
                  Verify skill
                </button>
              )}
              {verified && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                  <ShieldCheck size={15} />
                  Skill verified
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Already-matched skills panel                                         */
/* ------------------------------------------------------------------ */
function MatchedSummary({
  matched,
  verifiedSkills,
  onVerify,
}: {
  matched: AnalysisResult['results'];
  verifiedSkills: Record<string, boolean>;
  onVerify: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6 card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-ink-200/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-1 focus-visible:ring-offset-ink-100"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-brass" />
          <span className="font-medium text-cream text-sm">Matched skills</span>
          <span className="badge bg-brass/15 text-brass-100">{matched.length}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
      </button>
      {open && (
        <div className="border-t border-ink-300 px-5 pb-5 pt-4 animate-fade-in">
          <p className="text-xs text-muted mb-3">
            These skills were detected in your resume. Verify them with a quick quiz to get a Verified badge.
          </p>
          <ul className="space-y-2">
            {matched.map((r) => {
              const isVerified = !!verifiedSkills[r.skill.name];
              const hasQuiz = getQuizForSkill(r.skill).length > 0;
              return (
                <li key={r.skill.name} className="flex items-center justify-between gap-3 rounded-xl bg-ink-200 px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="h-2 w-2 rounded-full bg-brass flex-shrink-0" />
                    <span className="text-sm text-cream">{r.skill.name}</span>
                    <LevelBadge level={r.skill.level} />
                    {isVerified && <VerifiedBadge verified />}
                  </div>
                  {hasQuiz && !isVerified && (
                    <button
                      onClick={() => onVerify(r.skill.name)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 flex-shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded"
                    >
                      <ShieldCheck size={13} />
                      Verify
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Quiz modal                                                           */
/* ------------------------------------------------------------------ */
type QuizModalProps = {
  skillName: string;
  questions: QuizQuestion[];
  alreadyVerified: boolean;
  onPass: () => void;
  onClose: () => void;
};

const PASS_THRESHOLD = 3;

function QuizModal({ skillName, questions, alreadyVerified, onPass, onClose }: QuizModalProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(alreadyVerified);

  const q = questions[current];
  const passed = alreadyVerified || answers.filter(Boolean).length >= PASS_THRESHOLD;

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
  }

  function handleNext() {
    if (selected === null) return;
    const correct = selected === q.correctIndex;
    const newAnswers = [...answers, correct];
    setAnswers(newAnswers);

    if (current + 1 >= questions.length || newAnswers.length >= PASS_THRESHOLD) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Verify skill: ${skillName}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg card p-6 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-muted uppercase tracking-widest">Skill verification</p>
            <h3 className="font-display text-xl text-cream mt-0.5">{skillName}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-cream transition-colors rounded-lg p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            aria-label="Close quiz"
          >
            ✕
          </button>
        </div>

        {done ? (
          <QuizResult
            passed={passed || alreadyVerified}
            correct={answers.filter(Boolean).length}
            total={answers.length || questions.length}
            onClose={onClose}
            onConfirm={onPass}
            alreadyVerified={alreadyVerified}
          />
        ) : (
          <>
            {/* Progress */}
            <div className="flex items-center gap-2 mb-5">
              {questions.slice(0, Math.min(questions.length, 3)).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i < answers.length ? (answers[i] ? 'bg-brass' : 'bg-red-500') :
                    i === current ? 'bg-muted' : 'bg-ink-300'
                  }`}
                />
              ))}
            </div>

            {/* Question */}
            <p className="text-sm text-muted mb-1">Question {current + 1} of {Math.min(questions.length, 3)}</p>
            <p className="text-cream font-medium leading-relaxed mb-5">{q.question}</p>

            {/* Options */}
            <ul className="space-y-2 mb-6">
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = i === q.correctIndex;
                const revealed = selected !== null;

                let style = 'border-ink-300 bg-ink-200 text-cream hover:border-brass/50';
                if (revealed) {
                  if (isCorrect) style = 'border-brass bg-brass/10 text-brass-100';
                  else if (isSelected && !isCorrect) style = 'border-red-500/50 bg-red-500/10 text-red-400';
                  else style = 'border-ink-300 bg-ink-200 text-muted opacity-60';
                }

                return (
                  <li key={i}>
                    <button
                      onClick={() => handleSelect(i)}
                      disabled={revealed}
                      className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-1 focus-visible:ring-offset-ink disabled:cursor-default ${style}`}
                    >
                      {opt}
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              onClick={handleNext}
              disabled={selected === null}
              className="btn-primary w-full disabled:opacity-40"
            >
              {current + 1 >= Math.min(questions.length, 3) ? 'Finish' : 'Next'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function QuizResult({
  passed, correct, total, onClose, onConfirm, alreadyVerified,
}: {
  passed: boolean;
  correct: number;
  total: number;
  onClose: () => void;
  onConfirm: () => void;
  alreadyVerified: boolean;
}) {
  if (alreadyVerified) {
    return (
      <div className="text-center py-4">
        <ShieldCheck size={40} className="text-emerald-400 mx-auto mb-3" />
        <p className="font-display text-xl text-cream mb-1">Already verified!</p>
        <p className="text-sm text-muted mb-5">This skill has a Verified badge on your roadmap.</p>
        <button onClick={onClose} className="btn-primary w-full">Close</button>
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      {passed ? (
        <>
          <ShieldCheck size={40} className="text-emerald-400 mx-auto mb-3" />
          <p className="font-display text-xl text-cream mb-1">Verified!</p>
          <p className="text-sm text-muted mb-1">You got {correct}/{total} correct.</p>
          <p className="text-sm text-muted mb-5">Your skill badge is now marked Verified.</p>
          <button onClick={onConfirm} className="btn-primary w-full">Confirm verification</button>
        </>
      ) : (
        <>
          <XCircleIcon />
          <p className="font-display text-xl text-cream mb-1">Not quite</p>
          <p className="text-sm text-muted mb-1">You got {correct}/{total} correct.</p>
          <p className="text-sm text-muted mb-5">Keep studying and try again!</p>
          <button onClick={onClose} className="btn-ghost w-full">Close</button>
        </>
      )}
    </div>
  );
}

function XCircleIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" className="text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}
