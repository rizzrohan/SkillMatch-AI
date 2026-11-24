export const skillSynonyms: Record<string, string[]> = {
  "Python": ["python", "py", "pandas", "numpy", "django", "flask", "python3"],
  "C++": ["c++", "cpp", "c plus plus", "stl", "boost"],
  "Data Structures & Algorithms": [
    "data structures", "algorithms", "dsa", "leetcode", "complexity", "big o", "sorting", "graphs", "trees", "dynamic programming", "binary search",
  ],
  "Problem Solving / Communication": [
    "problem solving", "communication", "collaboration", "stakeholder", "explaining", "tradeoff", "tradeoffs",
  ],
  "System Design": [
    "system design", "scalability", "distributed systems", "load balancing", "architecture", "scalable",
  ],
  "Git": ["git", "github", "gitlab", "version control", "pull request", "pr", "commit", "branching"],
  "SQL": ["sql", "postgres", "postgresql", "mysql", "query", "joins", "database", "sqlite", "querying"],
  "Excel": ["excel", "spreadsheet", "pivot table", "vlookup", "formulas", "xlsx"],
  "Data Visualization (Power BI/Tableau)": [
    "data visualization", "power bi", "powerbi", "tableau", "dashboard", "dashboards", "chart",
  ],
  "Statistics": ["statistics", "stats", "hypothesis", "p-value", "distribution", "mean", "median", "regression"],
  "Communication": ["communication", "presentation", "writing", "stakeholder", "reporting"],
  "JavaScript": ["javascript", "js", "ecmascript", "es6", "node", "nodejs", "node.js", "dom", "async"],
  "React": ["react", "react.js", "reactjs", "jsx", "hooks", "usestate", "useeffect", "redux"],
  "HTML/CSS": ["html", "css", "tailwind", "scss", "sass", "markup", "responsive", "flexbox", "grid"],
  "REST APIs": ["rest", "api", "apis", "restful", "endpoint", "http", "requests", "fetch", "axios"],
  "Testing (Jest/RTL)": ["jest", "testing", "test", "tests", "rtl", "react testing library", "unit test", "ci test"],
  "Linux Fundamentals": ["linux", "bash", "shell", "unix", "command line", "cli", "terminal", "ubuntu"],
  "Cloud Basics (Azure/AWS)": ["aws", "azure", "cloud", "ec2", "s3", "lambda", "gcp", "iaas", "paas"],
  "Python or Bash Scripting": ["python", "bash", "scripting", "script", "automation", "shell script"],
  "Networking Fundamentals": ["networking", "dns", "tcp", "udp", "load balanc", "http", "ip address", "subnet"],
  "CI/CD Concepts": ["ci/cd", "ci", "cd", "pipeline", "jenkins", "github actions", "deployment", "deploy", "continuous"],
};

export function normalizeText(text: string): string {
  return text.toLowerCase();
}

export function isSkillMatched(skillName: string, normalizedText: string): boolean {
  const synonyms = skillSynonyms[skillName];
  if (synonyms) {
    return synonyms.some((syn) => normalizedText.includes(syn));
  }
  // Fallback: match on significant tokens of the skill name.
  const tokens = skillName
    .toLowerCase()
    .replace(/[^a-z0-9\s/]/g, " ")
    .split(/[\s/]+/)
    .filter((t) => t.length >= 3);
  return tokens.some((t) => normalizedText.includes(t));
}
