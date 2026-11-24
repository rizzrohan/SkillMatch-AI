import { useState } from 'react';
import {
  GraduationCap, BarChart2, Building2,
  ArrowRight, Eye, EyeOff, Compass, ChevronDown,
} from 'lucide-react';
import {
  saveStudent, savePlacementSession, saveCompanySession,
  checkPlacementPassword, checkCompanyPassword,
} from '../lib/auth';
import type { StudentIdentity } from '../lib/auth';
import { mockCompanies } from '../data/companies';

type Panel = 'none' | 'student' | 'placement' | 'company';

type Props = {
  onStudentLogin: (identity: StudentIdentity) => void;
  onPlacementLogin: () => void;
  onCompanyLogin: (companyId: string) => void;
};

export function EntryScreen({ onStudentLogin, onPlacementLogin, onCompanyLogin }: Props) {
  const [panel, setPanel] = useState<Panel>('none');

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-12">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-3 animate-fade-in">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brass text-ink">
          <Compass size={22} />
        </span>
        <span className="font-display text-2xl text-cream">SkillMatch AI</span>
      </div>
      <p className="text-muted text-sm mb-12 animate-fade-in">Resume skill-gap analyzer — campus placement edition</p>

      {panel === 'none' && (
        <div className="w-full max-w-3xl animate-fade-in">
          <h1 className="font-display text-3xl sm:text-4xl text-cream text-center mb-2">
            Who are you here as?
          </h1>
          <p className="text-center text-muted mb-10">Choose your role to get started.</p>

          <div className="grid sm:grid-cols-3 gap-4">
            <OptionCard
              icon={<GraduationCap size={30} className="text-brass" />}
              title="Student"
              description="Upload your resume, see how you match against top roles, and get a personalized roadmap."
              cta="Student login"
              delay="0ms"
              onClick={() => setPanel('student')}
            />
            <OptionCard
              icon={<BarChart2 size={30} className="text-brass" />}
              title="Placement Cell"
              description="Monitor campus drive readiness across all students and share ranked shortlists with recruiters."
              cta="Placement Cell login"
              delay="60ms"
              onClick={() => setPanel('placement')}
            />
            <OptionCard
              icon={<Building2 size={30} className="text-brass" />}
              title="Company"
              description="View pre-screened, scored candidates shortlisted specifically for your open internship role."
              cta="Company login"
              delay="120ms"
              onClick={() => setPanel('company')}
            />
          </div>
        </div>
      )}

      {panel === 'student' && (
        <StudentForm
          onBack={() => setPanel('none')}
          onSubmit={(identity) => {
            saveStudent(identity);
            onStudentLogin(identity);
          }}
        />
      )}

      {panel === 'placement' && (
        <PlacementForm
          onBack={() => setPanel('none')}
          onSubmit={() => {
            savePlacementSession();
            onPlacementLogin();
          }}
        />
      )}

      {panel === 'company' && (
        <CompanyForm
          onBack={() => setPanel('none')}
          onSubmit={(companyId) => {
            saveCompanySession(companyId);
            onCompanyLogin(companyId);
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Option card                                                          */
/* ------------------------------------------------------------------ */
function OptionCard({
  icon, title, description, cta, delay, onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  delay: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: delay }}
      className="group text-left card p-6 hover:border-brass/60 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brass/5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink animate-scale-in"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brass/10 border border-brass/20">
        {icon}
      </div>
      <h2 className="font-display text-xl text-cream mb-2">{title}</h2>
      <p className="text-sm text-muted leading-relaxed mb-5">{description}</p>
      <div className="flex items-center gap-1.5 text-sm text-brass font-medium group-hover:gap-2.5 transition-all">
        {cta}
        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Shared: back link + card wrapper                                     */
/* ------------------------------------------------------------------ */
function FormShell({
  onBack,
  icon,
  title,
  subtitle,
  children,
}: {
  onBack: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-sm animate-fade-in">
      <button
        onClick={onBack}
        className="text-sm text-muted hover:text-cream transition-colors mb-6 flex items-center gap-1.5 focus:outline-none focus-visible:underline"
      >
        ← Back
      </button>
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brass/15 text-brass flex-shrink-0">
            {icon}
          </span>
          <div>
            <h2 className="font-display text-xl text-cream">{title}</h2>
            <p className="text-xs text-muted">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Password field (shared)                                              */
/* ------------------------------------------------------------------ */
function PasswordField({
  id,
  value,
  onChange,
  onKeyDown,
  error,
  hint,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  error: string;
  hint: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-muted uppercase tracking-wider mb-1.5">
        Password
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Enter password"
          autoFocus
          className={`w-full rounded-xl border bg-ink-200 px-4 py-3 pr-11 text-cream placeholder-muted-dark text-sm focus:outline-none transition-colors ${
            error ? 'border-red-500/60 focus:border-red-500' : 'border-ink-300 focus:border-brass'
          }`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-cream transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400 animate-fade-in">{error}</p>}
      <p className="mt-2 text-xs text-muted-dark">{hint}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Student login                                                        */
/* ------------------------------------------------------------------ */
function StudentForm({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (identity: StudentIdentity) => void;
}) {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const canSubmit = name.trim().length > 0 && rollNumber.trim().length > 0;

  return (
    <FormShell onBack={onBack} icon={<GraduationCap size={20} />} title="Student login" subtitle="No password needed">
      <div className="space-y-4">
        <div>
          <label htmlFor="s-name" className="block text-xs text-muted uppercase tracking-wider mb-1.5">Full name</label>
          <input
            id="s-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Arjun Mehta"
            autoFocus
            className="w-full rounded-xl border border-ink-300 bg-ink-200 px-4 py-3 text-cream placeholder-muted-dark text-sm focus:outline-none focus:border-brass transition-colors"
          />
        </div>
        <div>
          <label htmlFor="s-roll" className="block text-xs text-muted uppercase tracking-wider mb-1.5">Roll number</label>
          <input
            id="s-roll"
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            placeholder="e.g. CS21B042"
            onKeyDown={(e) => { if (e.key === 'Enter' && canSubmit) onSubmit({ name: name.trim(), rollNumber: rollNumber.trim() }); }}
            className="w-full rounded-xl border border-ink-300 bg-ink-200 px-4 py-3 text-cream placeholder-muted-dark text-sm focus:outline-none focus:border-brass transition-colors"
          />
        </div>
      </div>
      <button
        onClick={() => onSubmit({ name: name.trim(), rollNumber: rollNumber.trim() })}
        disabled={!canSubmit}
        className="btn-primary w-full mt-6 disabled:opacity-40"
      >
        Continue <ArrowRight size={16} />
      </button>
    </FormShell>
  );
}

/* ------------------------------------------------------------------ */
/* Placement Cell login                                                 */
/* ------------------------------------------------------------------ */
function PlacementForm({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  function submit() {
    if (checkPlacementPassword(pw)) { setError(''); onSubmit(); }
    else setError('Incorrect password. Try again.');
  }

  return (
    <FormShell onBack={onBack} icon={<BarChart2 size={20} />} title="Placement Cell login" subtitle="Staff access">
      <PasswordField
        id="p-pw"
        value={pw}
        onChange={(v) => { setPw(v); setError(''); }}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        error={error}
        hint={`Demo password: placement123`}
      />
      <button onClick={submit} disabled={pw.length === 0} className="btn-primary w-full mt-6 disabled:opacity-40">
        Log in <ArrowRight size={16} />
      </button>
    </FormShell>
  );
}

/* ------------------------------------------------------------------ */
/* Company login                                                        */
/* ------------------------------------------------------------------ */
function CompanyForm({ onBack, onSubmit }: { onBack: () => void; onSubmit: (companyId: string) => void }) {
  const [companyId, setCompanyId] = useState(mockCompanies[0].id);
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  function submit() {
    if (checkCompanyPassword(pw)) { setError(''); onSubmit(companyId); }
    else setError('Incorrect password. Try again.');
  }

  return (
    <FormShell onBack={onBack} icon={<Building2 size={20} />} title="Company login" subtitle="Recruiter access">
      <div className="space-y-4">
        <div>
          <label htmlFor="c-company" className="block text-xs text-muted uppercase tracking-wider mb-1.5">
            Your company
          </label>
          <div className="relative">
            <select
              id="c-company"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-ink-300 bg-ink-200 px-4 py-3 pr-10 text-cream text-sm focus:outline-none focus:border-brass transition-colors cursor-pointer"
            >
              {mockCompanies.map((c) => (
                <option key={c.id} value={c.id} className="bg-ink-200 text-cream">
                  {c.name} — {c.role}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
        </div>
        <PasswordField
          id="c-pw"
          value={pw}
          onChange={(v) => { setPw(v); setError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          error={error}
          hint={`Demo password: company123`}
        />
      </div>
      <button onClick={submit} disabled={pw.length === 0} className="btn-primary w-full mt-6 disabled:opacity-40">
        Log in <ArrowRight size={16} />
      </button>
    </FormShell>
  );
}
