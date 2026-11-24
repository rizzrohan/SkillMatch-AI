export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

export type RequiredSkill = {
  name: string;
  level: SkillLevel;
  weight: "core" | "secondary";
  description: string;
};

export type Company = {
  id: string;
  name: string;
  role: string;
  description: string;
  drivedate: string; // ISO date string
  requiredSkills: RequiredSkill[];
};

export const mockCompanies: Company[] = [
  {
    id: "google-swe-intern",
    name: "Google",
    role: "Software Engineer Intern",
    description:
      "Example profile for a typical entry-level software engineering internship — strong emphasis on algorithmic problem solving and core CS fundamentals.",
    drivedate: "2026-08-04",
    requiredSkills: [
      { name: "Data Structures & Algorithms", level: "Advanced", weight: "core", description: "Arrays, trees, graphs, and algorithmic problem solving under time constraints." },
      { name: "Python", level: "Intermediate", weight: "core", description: "General-purpose scripting and backend logic." },
      { name: "C++", level: "Intermediate", weight: "secondary", description: "Performance-critical systems and low-level programming." },
      { name: "System Design", level: "Beginner", weight: "secondary", description: "Basic understanding of scalable system architecture." },
      { name: "Git", level: "Beginner", weight: "secondary", description: "Version control and collaborative development workflows." },
      { name: "Problem Solving / Communication", level: "Intermediate", weight: "core", description: "Explaining technical tradeoffs clearly during reviews and interviews." },
    ],
  },
  {
    id: "ibm-data-analyst",
    name: "IBM",
    role: "Data Analyst Intern",
    description:
      "Example profile for an entry-level data analytics role — focus on querying, visualization, and statistical reasoning.",
    drivedate: "2026-07-21",
    requiredSkills: [
      { name: "SQL", level: "Intermediate", weight: "core", description: "Querying, joins, and aggregations across relational databases." },
      { name: "Python", level: "Intermediate", weight: "core", description: "Data cleaning and analysis using pandas/numpy." },
      { name: "Excel", level: "Beginner", weight: "secondary", description: "Pivot tables, formulas, and quick ad-hoc analysis." },
      { name: "Data Visualization (Power BI/Tableau)", level: "Beginner", weight: "core", description: "Building dashboards to communicate findings to stakeholders." },
      { name: "Statistics", level: "Intermediate", weight: "core", description: "Descriptive statistics, hypothesis testing, and distributions." },
      { name: "Communication", level: "Intermediate", weight: "secondary", description: "Translating data findings into plain-language business insights." },
    ],
  },
  {
    id: "amazon-frontend-intern",
    name: "Amazon",
    role: "Frontend Developer Intern",
    description:
      "Example profile for an entry-level frontend role — focus on modern JS frameworks and shipping production UI.",
    drivedate: "2026-07-14",
    requiredSkills: [
      { name: "JavaScript", level: "Intermediate", weight: "core", description: "Core language fundamentals, async patterns, and DOM manipulation." },
      { name: "React", level: "Intermediate", weight: "core", description: "Component architecture, hooks, and state management." },
      { name: "HTML/CSS", level: "Intermediate", weight: "core", description: "Semantic markup and responsive layout techniques." },
      { name: "Git", level: "Beginner", weight: "secondary", description: "Version control and PR-based collaboration." },
      { name: "REST APIs", level: "Beginner", weight: "secondary", description: "Consuming backend services from a frontend client." },
      { name: "Testing (Jest/RTL)", level: "Beginner", weight: "secondary", description: "Writing unit and component tests for UI reliability." },
    ],
  },
  {
    id: "microsoft-cloud-intern",
    name: "Microsoft",
    role: "Cloud Engineering Intern",
    description:
      "Example profile for an entry-level cloud/DevOps-adjacent role — focus on infrastructure basics and automation.",
    drivedate: "2026-08-18",
    requiredSkills: [
      { name: "Linux Fundamentals", level: "Intermediate", weight: "core", description: "Command line proficiency and basic system administration." },
      { name: "Cloud Basics (Azure/AWS)", level: "Beginner", weight: "core", description: "Understanding core compute, storage, and networking concepts." },
      { name: "Python or Bash Scripting", level: "Intermediate", weight: "core", description: "Automating repetitive infrastructure tasks." },
      { name: "Git", level: "Beginner", weight: "secondary", description: "Version control for infrastructure-as-code workflows." },
      { name: "Networking Fundamentals", level: "Beginner", weight: "secondary", description: "DNS, load balancing, and basic security concepts." },
      { name: "CI/CD Concepts", level: "Beginner", weight: "secondary", description: "Understanding build/deploy pipelines, even without hands-on tooling experience." },
    ],
  },
];

// ---------------------------------------------------------------------------
// Mock student data for Placement Cell View
// Each student has a name + a resume-like text blob with skill keywords.
// ---------------------------------------------------------------------------
export type MockStudent = {
  id: string;
  name: string;
  branch: string;
  resumeText: string;
};

export const mockStudents: MockStudent[] = [
  {
    id: "s1",
    name: "Arjun Mehta",
    branch: "Computer Science",
    resumeText:
      "Proficient in Python and SQL. Worked on data cleaning projects using pandas and numpy. Built dashboards in Tableau. Familiar with statistics and hypothesis testing. Good communication skills. Used Git for version control.",
  },
  {
    id: "s2",
    name: "Priya Sharma",
    branch: "Information Technology",
    resumeText:
      "JavaScript, React, HTML, CSS developer. Built responsive UIs and consumed REST APIs. Familiar with Jest for testing. Used Git and GitHub. Some exposure to Node.js backend.",
  },
  {
    id: "s3",
    name: "Rohan Das",
    branch: "Computer Science",
    resumeText:
      "Strong in Data Structures & Algorithms — LeetCode 300+ problems solved. Python and C++ programming. Familiar with system design basics. Git user. Good problem solving and communication in mock interviews.",
  },
  {
    id: "s4",
    name: "Sneha Patel",
    branch: "Electronics & CS",
    resumeText:
      "Linux user with strong command-line skills. Experience with AWS EC2 and S3. Python scripting for automation. Basic CI/CD using GitHub Actions. Git daily. Some networking fundamentals knowledge.",
  },
  {
    id: "s5",
    name: "Vikram Nair",
    branch: "Business Analytics",
    resumeText:
      "Excel power user, pivot tables, VLOOKUP. Some SQL queries. Basic data visualization using Power BI. Statistics course completed. Communication skills from presentations.",
  },
  {
    id: "s6",
    name: "Ananya Iyer",
    branch: "Information Technology",
    resumeText:
      "React and JavaScript developer. REST API integration. Some HTML/CSS. Beginning Git usage. Interested in frontend development. No testing experience yet.",
  },
  {
    id: "s7",
    name: "Kiran Reddy",
    branch: "Computer Science",
    resumeText:
      "Python developer with ML exposure. Data Structures & Algorithms practice. Git version control. Some Linux fundamentals. Cloud basics — AWS free tier experimentation. Problem solving focused.",
  },
  {
    id: "s8",
    name: "Meera Joshi",
    branch: "Data Science",
    resumeText:
      "SQL expert — complex joins, window functions, stored procedures. Python pandas for data wrangling. Statistics: regression, A/B testing. Excel and Tableau. Strong written communication.",
  },
];
