import { useState } from 'react';
import { Compass, LogOut } from 'lucide-react';
import type { AnalysisResult } from './lib/scoring';
import { exportRoadmapPdf } from './lib/exportPdf';
import {
  loadStudent, clearStudent,
  loadPlacementSession, clearPlacementSession,
  loadCompanySession, clearCompanySession,
} from './lib/auth';
import type { StudentIdentity } from './lib/auth';
import { EntryScreen } from './screens/EntryScreen';
import { LandingScreen } from './screens/LandingScreen';
import { ComparisonScreen } from './screens/ComparisonScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { RoadmapScreen } from './screens/RoadmapScreen';
import { PlacementCellScreen } from './screens/PlacementCellScreen';
import { ShortlistScreen } from './screens/ShortlistScreen';

type AppMode = 'entry' | 'student' | 'placement' | 'company';
type StudentStage = 'landing' | 'comparison' | 'results' | 'roadmap';

function initMode(): AppMode {
  if (loadPlacementSession()) return 'placement';
  if (loadCompanySession()) return 'company';
  if (loadStudent()) return 'student';
  return 'entry';
}

export default function App() {
  const [mode, setMode] = useState<AppMode>(initMode);
  const [student, setStudent] = useState<StudentIdentity | null>(loadStudent);
  const [companyId, setCompanyId] = useState<string | null>(() => loadCompanySession()?.companyId ?? null);

  // Student flow state
  const [studentStage, setStudentStage] = useState<StudentStage>('landing');
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);

  function handleStudentLogin(identity: StudentIdentity) {
    setStudent(identity);
    setMode('student');
    setStudentStage('landing');
  }

  function handlePlacementLogin() {
    setMode('placement');
  }

  function handleCompanyLogin(id: string) {
    setCompanyId(id);
    setMode('company');
  }

  function handleStudentLogout() {
    clearStudent();
    setStudent(null);
    setMode('entry');
    setStudentStage('landing');
    setResumeText('');
    setFileName('');
    setSelectedAnalysis(null);
  }

  function handlePlacementLogout() {
    clearPlacementSession();
    setMode('entry');
  }

  function handleCompanyLogout() {
    clearCompanySession();
    setCompanyId(null);
    setMode('entry');
  }

  function handleAnalyzed(text: string, name: string) {
    setResumeText(text);
    setFileName(name);
    setStudentStage('comparison');
  }

  function handleSelectCompany(analysis: AnalysisResult) {
    setSelectedAnalysis(analysis);
    setStudentStage('results');
  }

  function handleExportPdf(practiced: Record<string, boolean>, verified: Record<string, boolean>) {
    if (!selectedAnalysis) return;
    exportRoadmapPdf(selectedAnalysis, practiced, verified);
  }

  // ── Entry ──────────────────────────────────────────────────────────
  if (mode === 'entry') {
    return (
      <div className="min-h-screen flex flex-col">
        <EntryScreen
          onStudentLogin={handleStudentLogin}
          onPlacementLogin={handlePlacementLogin}
          onCompanyLogin={handleCompanyLogin}
        />
        <Footer />
      </div>
    );
  }

  // ── Placement Cell ─────────────────────────────────────────────────
  if (mode === 'placement') {
    return <PlacementCellScreen onLogout={handlePlacementLogout} />;
  }

  // ── Company Shortlist ──────────────────────────────────────────────
  if (mode === 'company' && companyId) {
    return <ShortlistScreen companyId={companyId} onLogout={handleCompanyLogout} />;
  }

  // ── Student flow ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <StudentHeader student={student} onLogout={handleStudentLogout} />
      <main className="flex-1">
        {studentStage === 'landing' && (
          <LandingScreen onAnalyzed={handleAnalyzed} />
        )}
        {studentStage === 'comparison' && (
          <ComparisonScreen
            resumeText={resumeText}
            fileName={fileName}
            onSelect={handleSelectCompany}
            onBack={() => setStudentStage('landing')}
          />
        )}
        {studentStage === 'results' && selectedAnalysis && (
          <ResultsScreen
            analysis={selectedAnalysis}
            onBack={() => setStudentStage('comparison')}
            onContinue={() => setStudentStage('roadmap')}
          />
        )}
        {studentStage === 'roadmap' && selectedAnalysis && (
          <RoadmapScreen
            baseAnalysis={selectedAnalysis}
            resumeText={resumeText}
            onBack={() => setStudentStage('results')}
            onExportPdf={handleExportPdf}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Student header                                                       */
/* ------------------------------------------------------------------ */
function StudentHeader({
  student,
  onLogout,
}: {
  student: StudentIdentity | null;
  onLogout: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-300/60 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brass text-ink">
            <Compass size={18} />
          </span>
          <span className="font-display text-lg text-cream">SkillMatch AI</span>
        </div>

        <div className="flex items-center gap-3">
          {student && (
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 rounded-full bg-brass/20 flex items-center justify-center text-xs font-medium text-brass flex-shrink-0">
                {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </span>
              <div className="hidden sm:block text-right leading-tight">
                <p className="text-xs text-muted">Hi,</p>
                <p className="text-sm text-cream font-medium">{student.name}</p>
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-xl border border-ink-300 px-3 py-2 text-sm text-muted hover:border-red-500/50 hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            aria-label="Log out"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="border-t border-ink-300/60 py-6 mt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <p className="text-xs text-muted-dark">
          Company profiles are illustrative examples for demo purposes, not official job listings.
        </p>
      </div>
    </footer>
  );
}
