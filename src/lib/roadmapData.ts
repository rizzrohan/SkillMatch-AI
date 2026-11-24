export type RoadmapStep = {
  skillName: string;
  title: string;
  timeRange: string;
  subtasks: string[];
  resources: { label: string; url: string }[];
};

export const roadmapData: Record<string, RoadmapStep> = {
  "Python": {
    skillName: "Python",
    title: "Learn Python fundamentals",
    timeRange: "1–2 weeks",
    subtasks: [
      "Complete Python basics: variables, loops, functions, and file I/O",
      "Practice list comprehensions and built-in data structures (dict, set, list)",
      "Write 3 small scripts: a calculator, a word counter, and a CSV reader",
      "Solve 10 beginner problems on LeetCode using Python",
    ],
    resources: [
      { label: "Python.org — Official Tutorial", url: "https://docs.python.org/3/tutorial/" },
      { label: "Real Python — Beginner's Guide", url: "https://realpython.com/python-first-steps/" },
      { label: "freeCodeCamp — Python Full Course", url: "https://www.freecodecamp.org/news/learn-python-free-python-courses-for-beginners/" },
    ],
  },
  "C++": {
    skillName: "C++",
    title: "Build C++ fundamentals",
    timeRange: "2–3 weeks",
    subtasks: [
      "Cover syntax, pointers, references, and memory management",
      "Understand classes, constructors, and the STL (vector, map, queue)",
      "Implement a singly linked list and a basic stack from scratch",
      "Solve 10 easy C++ problems on Codeforces or LeetCode",
    ],
    resources: [
      { label: "LearnCpp.com — Free C++ Tutorial", url: "https://www.learncpp.com/" },
      { label: "cppreference — STL reference", url: "https://en.cppreference.com/w/" },
      { label: "GeeksforGeeks — C++ DSA", url: "https://www.geeksforgeeks.org/c-plus-plus/" },
    ],
  },
  "SQL": {
    skillName: "SQL",
    title: "Master SQL querying",
    timeRange: "1–2 weeks",
    subtasks: [
      "Learn SELECT, WHERE, ORDER BY, GROUP BY, HAVING",
      "Practice INNER JOIN, LEFT JOIN, and multi-table queries",
      "Write 5 analytical queries on a sample dataset (e.g. Northwind)",
      "Complete 15 SQL problems on HackerRank SQL track",
    ],
    resources: [
      { label: "SQLZoo — Interactive SQL tutorial", url: "https://sqlzoo.net/" },
      { label: "Mode Analytics — SQL Tutorial", url: "https://mode.com/sql-tutorial/" },
      { label: "HackerRank SQL challenges", url: "https://www.hackerrank.com/domains/sql" },
    ],
  },
  "JavaScript": {
    skillName: "JavaScript",
    title: "Solidify JavaScript core",
    timeRange: "1–2 weeks",
    subtasks: [
      "Cover closures, promises, async/await, and the event loop",
      "Practice array methods: map, filter, reduce, find",
      "Build a to-do app without any framework (vanilla DOM manipulation)",
      "Read and understand the MDN article on prototype chains",
    ],
    resources: [
      { label: "javascript.info — The Modern JavaScript Tutorial", url: "https://javascript.info/" },
      { label: "MDN Web Docs — JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
      { label: "Eloquent JavaScript (free online)", url: "https://eloquentjavascript.net/" },
    ],
  },
  "React": {
    skillName: "React",
    title: "Build with React",
    timeRange: "2–3 weeks",
    subtasks: [
      "Understand JSX, props, and component composition",
      "Master useState, useEffect, and useRef hooks",
      "Build a weather app that fetches from a public API",
      "Learn React Router for basic client-side navigation",
    ],
    resources: [
      { label: "react.dev — Official React Docs", url: "https://react.dev/" },
      { label: "Scrimba — Learn React for free", url: "https://scrimba.com/learn/learnreact" },
      { label: "freeCodeCamp — React Certification", url: "https://www.freecodecamp.org/learn/front-end-development-libraries/" },
    ],
  },
  "Git": {
    skillName: "Git",
    title: "Learn Git version control",
    timeRange: "3–5 days",
    subtasks: [
      "Understand commit, branch, merge, and rebase",
      "Create a GitHub repo and push a project end-to-end",
      "Practice resolving a merge conflict on a dummy branch",
      "Write a good README for an existing project",
    ],
    resources: [
      { label: "Pro Git Book (free)", url: "https://git-scm.com/book/en/v2" },
      { label: "GitHub Skills — Interactive courses", url: "https://skills.github.com/" },
      { label: "Atlassian Git Tutorial", url: "https://www.atlassian.com/git/tutorials" },
    ],
  },
  "Statistics": {
    skillName: "Statistics",
    title: "Build statistical reasoning",
    timeRange: "2–3 weeks",
    subtasks: [
      "Understand mean, median, variance, and standard deviation",
      "Study probability distributions: normal, binomial, Poisson",
      "Learn hypothesis testing: null/alternative hypothesis, p-values, t-test",
      "Apply concepts to a real dataset in Python using scipy.stats",
    ],
    resources: [
      { label: "Khan Academy — Statistics & Probability", url: "https://www.khanacademy.org/math/statistics-probability" },
      { label: "StatQuest with Josh Starmer (YouTube)", url: "https://www.youtube.com/@statquest" },
      { label: "Seeing Theory — Visual probability intro", url: "https://seeing-theory.brown.edu/" },
    ],
  },
  "Communication": {
    skillName: "Communication",
    title: "Develop professional communication",
    timeRange: "Ongoing — 1 week focused practice",
    subtasks: [
      "Practice the STAR method for behavioral interview answers",
      "Give a 5-minute technical explanation of a project to a non-technical friend",
      "Write a concise summary of a data analysis you've done (1-page max)",
      "Record yourself answering 3 mock interview questions and review",
    ],
    resources: [
      { label: "Big Interview — Behavioral Interview Guide", url: "https://biginterview.com/blog/behavioral-interview-questions/" },
      { label: "Coursera — Business Communication (free audit)", url: "https://www.coursera.org/learn/wharton-communication-skills" },
      { label: "Harvard Business Review — Communication tips", url: "https://hbr.org/topic/subject/communication" },
    ],
  },
  "Data Structures & Algorithms": {
    skillName: "Data Structures & Algorithms",
    title: "Master DSA for interviews",
    timeRange: "4–6 weeks",
    subtasks: [
      "Study arrays, strings, hashmaps, and two-pointer techniques",
      "Learn trees, graphs, DFS/BFS, and dynamic programming patterns",
      "Solve 50 medium problems on LeetCode targeting these patterns",
      "Do 3 timed mock contests on Codeforces or LeetCode",
    ],
    resources: [
      { label: "NeetCode.io — DSA roadmap + solutions", url: "https://neetcode.io/" },
      { label: "CLRS — Introduction to Algorithms (reference)", url: "https://mitpress.mit.edu/books/introduction-algorithms-fourth-edition" },
      { label: "LeetCode — Curated Top 150 problems", url: "https://leetcode.com/studyplan/top-interview-150/" },
    ],
  },
  "Problem Solving / Communication": {
    skillName: "Problem Solving / Communication",
    title: "Sharpen interview problem solving",
    timeRange: "2–3 weeks",
    subtasks: [
      "Practice thinking out loud: solve 10 problems while narrating your approach",
      "Use the UMPIRE framework (Understand, Match, Plan, Implement, Review, Evaluate)",
      "Do 5 mock interviews on Pramp or with a peer",
      "Study common tradeoff discussions: time vs. space, simple vs. scalable",
    ],
    resources: [
      { label: "Pramp — Free peer mock interviews", url: "https://www.pramp.com/" },
      { label: "Interviewing.io — Anonymous mock interviews", url: "https://interviewing.io/" },
      { label: "Tech Interview Handbook — Communication guide", url: "https://www.techinterviewhandbook.org/coding-interview-techniques/" },
    ],
  },
  "System Design": {
    skillName: "System Design",
    title: "Learn system design basics",
    timeRange: "2–3 weeks",
    subtasks: [
      "Understand scaling concepts: load balancers, caching, CDNs, databases",
      "Study 3 classic designs: URL shortener, rate limiter, news feed",
      "Watch Gaurav Sen's system design playlist on YouTube",
      "Practice explaining a design decision with tradeoffs in 5 minutes",
    ],
    resources: [
      { label: "System Design Primer (GitHub)", url: "https://github.com/donnemartin/system-design-primer" },
      { label: "Gaurav Sen — System Design YouTube", url: "https://www.youtube.com/@gkcs" },
      { label: "ByteByteGo — System Design Blog", url: "https://bytebytego.com/" },
    ],
  },
  "Excel": {
    skillName: "Excel",
    title: "Get productive with Excel",
    timeRange: "3–5 days",
    subtasks: [
      "Master VLOOKUP, INDEX/MATCH, and SUMIF formulas",
      "Build a pivot table from a 500-row dataset",
      "Create a simple dashboard with 2–3 linked charts",
      "Practice conditional formatting and data validation",
    ],
    resources: [
      { label: "Excel Jet — Formula reference", url: "https://exceljet.net/formulas" },
      { label: "Chandoo.org — Excel tutorials", url: "https://chandoo.org/wp/learn-excel/" },
      { label: "Microsoft Support — Excel training", url: "https://support.microsoft.com/en-us/office/excel-training-9bc05390-e94c-46af-a5b3-d7c22f6990bb" },
    ],
  },
  "Data Visualization (Power BI/Tableau)": {
    skillName: "Data Visualization (Power BI/Tableau)",
    title: "Build data dashboards",
    timeRange: "1–2 weeks",
    subtasks: [
      "Install Tableau Public (free) and connect to a sample dataset",
      "Build 3 chart types: bar, line, and scatter — for a single dataset",
      "Create a 2-page dashboard with filters and a summary KPI card",
      "Study the Storytelling with Data blog for chart design principles",
    ],
    resources: [
      { label: "Tableau Public — Free dashboards gallery", url: "https://public.tableau.com/" },
      { label: "Storytelling with Data — Blog & book", url: "https://www.storytellingwithdata.com/blog" },
      { label: "Power BI — Microsoft Learn path", url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi" },
    ],
  },
  "HTML/CSS": {
    skillName: "HTML/CSS",
    title: "Nail HTML & CSS fundamentals",
    timeRange: "1 week",
    subtasks: [
      "Understand the box model, display types, and positioning",
      "Build a responsive 3-page static website using flexbox/grid",
      "Implement a mobile-first design with at least one media breakpoint",
      "Pass all CSS exercises on The Odin Project curriculum",
    ],
    resources: [
      { label: "The Odin Project — HTML & CSS path", url: "https://www.theodinproject.com/paths/foundations/courses/foundations" },
      { label: "MDN — CSS Flexbox guide", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox" },
      { label: "CSS-Tricks — A Complete Guide to Grid", url: "https://css-tricks.com/snippets/css/complete-guide-grid/" },
    ],
  },
  "REST APIs": {
    skillName: "REST APIs",
    title: "Understand and use REST APIs",
    timeRange: "3–5 days",
    subtasks: [
      "Learn HTTP methods (GET, POST, PUT, DELETE) and status codes",
      "Use fetch or axios to consume a public API (e.g. OpenWeatherMap, JSONPlaceholder)",
      "Handle loading, error, and success states in a simple React component",
      "Read the MDN guide on CORS and understand why it matters",
    ],
    resources: [
      { label: "MDN — Fetching data from the server", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Fetching_data" },
      { label: "REST API Tutorial — restapitutorial.com", url: "https://restapitutorial.com/" },
      { label: "Postman Learning Center", url: "https://learning.postman.com/docs/getting-started/introduction/" },
    ],
  },
  "Testing (Jest/RTL)": {
    skillName: "Testing (Jest/RTL)",
    title: "Write reliable tests with Jest & RTL",
    timeRange: "1 week",
    subtasks: [
      "Understand the difference between unit, integration, and e2e tests",
      "Write 5 Jest unit tests for utility functions in a project you own",
      "Write 3 React Testing Library component tests checking user-visible behavior",
      "Achieve ≥80% coverage on one small module",
    ],
    resources: [
      { label: "Jest — Official docs", url: "https://jestjs.io/docs/getting-started" },
      { label: "Testing Library — React Testing Library", url: "https://testing-library.com/docs/react-testing-library/intro/" },
      { label: "Kent C. Dodds — Testing JS blog", url: "https://kentcdodds.com/blog/common-mistakes-with-react-testing-library" },
    ],
  },
  "Linux Fundamentals": {
    skillName: "Linux Fundamentals",
    title: "Get comfortable with Linux CLI",
    timeRange: "1 week",
    subtasks: [
      "Learn navigation: cd, ls, pwd, find, grep, man",
      "Understand file permissions: chmod, chown, and sudo",
      "Practice pipes, redirects, and writing a 10-line bash script",
      "Set up WSL2 (Windows) or use a cloud VM to practice daily",
    ],
    resources: [
      { label: "Linux Journey — Interactive CLI tutorial", url: "https://linuxjourney.com/" },
      { label: "OverTheWire: Bandit — Linux challenges", url: "https://overthewire.org/wargames/bandit/" },
      { label: "The Linux Command Line (free book)", url: "https://linuxcommand.org/tlcl.php" },
    ],
  },
  "Cloud Basics (Azure/AWS)": {
    skillName: "Cloud Basics (Azure/AWS)",
    title: "Learn cloud fundamentals",
    timeRange: "1–2 weeks",
    subtasks: [
      "Understand IaaS, PaaS, SaaS and the shared responsibility model",
      "Launch an EC2 instance and an S3 bucket in the AWS Free Tier",
      "Explore Azure's free sandbox via Microsoft Learn",
      "Study for and pass the AWS Cloud Practitioner practice exam",
    ],
    resources: [
      { label: "AWS Free Tier — Hands-on sandbox", url: "https://aws.amazon.com/free/" },
      { label: "Microsoft Learn — Azure Fundamentals (AZ-900)", url: "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/" },
      { label: "Cloud Guru — AWS Cloud Practitioner (free trial)", url: "https://acloudguru.com/course/aws-certified-cloud-practitioner" },
    ],
  },
  "Python or Bash Scripting": {
    skillName: "Python or Bash Scripting",
    title: "Automate with Python or Bash",
    timeRange: "1 week",
    subtasks: [
      "Write a Python script that renames files in a folder based on a pattern",
      "Write a bash script that backs up a directory with a timestamped folder",
      "Learn cron jobs — schedule a script to run at a set time",
      "Refactor one manual workflow you do weekly into a 20-line script",
    ],
    resources: [
      { label: "Automate the Boring Stuff (free online)", url: "https://automatetheboringstuff.com/" },
      { label: "Bash Scripting Tutorial — ryanstutorials.net", url: "https://ryanstutorials.net/bash-scripting-tutorial/" },
      { label: "ShellCheck — Script linter", url: "https://www.shellcheck.net/" },
    ],
  },
  "Networking Fundamentals": {
    skillName: "Networking Fundamentals",
    title: "Understand networking basics",
    timeRange: "1 week",
    subtasks: [
      "Study the OSI model: focus on layers 3 (IP), 4 (TCP/UDP), and 7 (HTTP)",
      "Understand DNS resolution — trace a request from browser to server",
      "Learn what a load balancer does and the difference between L4 and L7",
      "Use Wireshark or tcpdump to capture and inspect one HTTP/DNS packet",
    ],
    resources: [
      { label: "Julia Evans — Networking Zine (free)", url: "https://jvns.ca/networking-zine.pdf" },
      { label: "Cisco Networking Academy — Packet Tracer", url: "https://www.netacad.com/courses/packet-tracer" },
      { label: "Computer Networking: A Top-Down Approach (Kurose)", url: "https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm" },
    ],
  },
  "CI/CD Concepts": {
    skillName: "CI/CD Concepts",
    title: "Understand CI/CD pipelines",
    timeRange: "3–5 days",
    subtasks: [
      "Read what CI/CD means and why it reduces deployment risk",
      "Create a GitHub Actions workflow that runs tests on every push",
      "Add a simple lint step to an existing project's CI pipeline",
      "Study the 12-Factor App principles (especially factors 5 and 10)",
    ],
    resources: [
      { label: "GitHub Actions — Getting Started", url: "https://docs.github.com/en/actions/quickstart" },
      { label: "The 12-Factor App", url: "https://12factor.net/" },
      { label: "GitLab CI/CD concepts docs", url: "https://docs.gitlab.com/ee/ci/introduction/" },
    ],
  },
};

export function getRoadmapStep(skillName: string): RoadmapStep | null {
  if (roadmapData[skillName]) return roadmapData[skillName];
  const key = Object.keys(roadmapData).find(
    (k) =>
      skillName.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(skillName.toLowerCase())
  );
  return key ? roadmapData[key] : null;
}
