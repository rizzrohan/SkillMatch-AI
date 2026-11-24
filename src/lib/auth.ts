const STUDENT_KEY = 'skillmatch:student';
const PLACEMENT_KEY = 'skillmatch:placement_session';
const COMPANY_KEY = 'skillmatch:company_session';
const PLACEMENT_PASSWORD = 'placement123';
const COMPANY_PASSWORD = 'company123';

export type StudentIdentity = {
  name: string;
  rollNumber: string;
};

export type CompanySession = {
  companyId: string;
};

// ---------- Student ----------
export function saveStudent(identity: StudentIdentity): void {
  localStorage.setItem(STUDENT_KEY, JSON.stringify(identity));
}
export function loadStudent(): StudentIdentity | null {
  try {
    const raw = localStorage.getItem(STUDENT_KEY);
    if (raw) return JSON.parse(raw) as StudentIdentity;
  } catch { /* ignore */ }
  return null;
}
export function clearStudent(): void {
  localStorage.removeItem(STUDENT_KEY);
}

// ---------- Placement cell ----------
export function checkPlacementPassword(pw: string): boolean {
  return pw === PLACEMENT_PASSWORD;
}
export function savePlacementSession(): void {
  localStorage.setItem(PLACEMENT_KEY, '1');
}
export function loadPlacementSession(): boolean {
  return localStorage.getItem(PLACEMENT_KEY) === '1';
}
export function clearPlacementSession(): void {
  localStorage.removeItem(PLACEMENT_KEY);
}

// ---------- Company ----------
export function checkCompanyPassword(pw: string): boolean {
  return pw === COMPANY_PASSWORD;
}
export function saveCompanySession(companyId: string): void {
  localStorage.setItem(COMPANY_KEY, JSON.stringify({ companyId }));
}
export function loadCompanySession(): CompanySession | null {
  try {
    const raw = localStorage.getItem(COMPANY_KEY);
    if (raw) return JSON.parse(raw) as CompanySession;
  } catch { /* ignore */ }
  return null;
}
export function clearCompanySession(): void {
  localStorage.removeItem(COMPANY_KEY);
}
