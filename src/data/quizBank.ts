import type { RequiredSkill } from "./companies";

export type QuizQuestion = {
  skillName: string;
  question: string;
  options: string[];
  correctIndex: number;
};

// Shared skill-name lookups so the same bank applies regardless of company.
export const quizBank: Record<string, QuizQuestion[]> = {
  "Python": [
    {
      skillName: "Python",
      question: "Which data structure does Python use to store key-value pairs?",
      options: ["list", "tuple", "dict", "set"],
      correctIndex: 2,
    },
    {
      skillName: "Python",
      question: "What does the `len()` function return for a list of 5 elements?",
      options: ["4", "5", "6", "undefined"],
      correctIndex: 1,
    },
    {
      skillName: "Python",
      question: "Which keyword defines a function in Python?",
      options: ["function", "def", "func", "fn"],
      correctIndex: 1,
    },
  ],
  "C++": [
    {
      skillName: "C++",
      question: "Which operator is used to access members of an object via a pointer?",
      options: [".", "->", "::", ":"],
      correctIndex: 1,
    },
    {
      skillName: "C++",
      question: "Which header is required for `std::cout`?",
      options: ["<stdio.h>", "<iostream>", "<vector>", "<string>"],
      correctIndex: 1,
    },
    {
      skillName: "C++",
      question: "What does `new` do in C++?",
      options: ["Declares a variable", "Allocates memory on the heap", "Calls a constructor only", "Imports a library"],
      correctIndex: 1,
    },
  ],
  "SQL": [
    {
      skillName: "SQL",
      question: "Which clause filters rows in a query?",
      options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"],
      correctIndex: 2,
    },
    {
      skillName: "SQL",
      question: "Which keyword combines rows from two tables based on a related column?",
      options: ["MERGE", "JOIN", "UNION", "COMBINE"],
      correctIndex: 1,
    },
    {
      skillName: "SQL",
      question: "Which aggregate function counts non-null rows?",
      options: ["TOTAL", "COUNT", "SUM", "LENGTH"],
      correctIndex: 1,
    },
  ],
  "JavaScript": [
    {
      skillName: "JavaScript",
      question: "What does `===` check in JavaScript?",
      options: ["Value only", "Type only", "Value and type", "Reference only"],
      correctIndex: 2,
    },
    {
      skillName: "JavaScript",
      question: "Which method adds an element to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      correctIndex: 0,
    },
    {
      skillName: "JavaScript",
      question: "What is the result of `typeof null`?",
      options: ["'null'", "'undefined'", "'object'", "'number'"],
      correctIndex: 2,
    },
  ],
  "React": [
    {
      skillName: "React",
      question: "Which hook manages state in a function component?",
      options: ["useEffect", "useState", "useMemo", "useRef"],
      correctIndex: 1,
    },
    {
      skillName: "React",
      question: "What does the `key` prop help React do?",
      options: ["Style elements", "Identify list items in reconciliation", "Fetch data", "Define routes"],
      correctIndex: 1,
    },
    {
      skillName: "React",
      question: "Which hook runs side effects after render?",
      options: ["useState", "useEffect", "useReducer", "useContext"],
      correctIndex: 1,
    },
  ],
  "Git": [
    {
      skillName: "Git",
      question: "Which command stages a file for commit?",
      options: ["git push", "git add", "git pull", "git init"],
      correctIndex: 1,
    },
    {
      skillName: "Git",
      question: "What does `git commit -m` do?",
      options: ["Pushes to remote", "Creates a commit with a message", "Merges branches", "Clones a repo"],
      correctIndex: 1,
    },
    {
      skillName: "Git",
      question: "Which command creates a new branch and switches to it?",
      options: ["git branch new", "git checkout -b new", "git switch new", "git merge new"],
      correctIndex: 1,
    },
  ],
  "Statistics": [
    {
      skillName: "Statistics",
      question: "Which measure is most affected by outliers?",
      options: ["Median", "Mode", "Mean", "Range"],
      correctIndex: 2,
    },
    {
      skillName: "Statistics",
      question: "A p-value below 0.05 typically indicates what?",
      options: ["Accept the null", "Statistically significant result", "More data needed", "No effect"],
      correctIndex: 1,
    },
    {
      skillName: "Statistics",
      question: "Which distribution is symmetric and bell-shaped?",
      options: ["Uniform", "Normal", "Exponential", "Binomial"],
      correctIndex: 1,
    },
  ],
  "Communication": [
    {
      skillName: "Communication",
      question: "When presenting data findings, the best first step is to:",
      options: ["Show all technical details", "State the key takeaway", "Read every chart label", "List every method"],
      correctIndex: 1,
    },
    {
      skillName: "Communication",
      question: "Which is an example of plain-language business insight?",
      options: ["The p-value was 0.03", "Revenue rose 12% due to Q3 promo", "Std dev = 4.2", "n=1024 samples"],
      correctIndex: 1,
    },
    {
      skillName: "Communication",
      question: "Active listening involves:",
      options: ["Waiting to talk", "Interrupting often", "Reflecting back what you heard", "Avoiding eye contact"],
      correctIndex: 2,
    },
  ],
  "Data Structures & Algorithms": [
    {
      skillName: "Data Structures & Algorithms",
      question: "What is the time complexity of binary search on a sorted array?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      correctIndex: 1,
    },
    {
      skillName: "Data Structures & Algorithms",
      question: "Which data structure uses LIFO ordering?",
      options: ["Queue", "Stack", "Heap", "Tree"],
      correctIndex: 1,
    },
    {
      skillName: "Data Structures & Algorithms",
      question: "Inserting at the head of a singly linked list is:",
      options: ["O(n)", "O(n log n)", "O(1)", "O(log n)"],
      correctIndex: 2,
    },
  ],
  "Problem Solving / Communication": [
    {
      skillName: "Problem Solving / Communication",
      question: "In a technical interview, the best approach to an unfamiliar problem is to:",
      options: ["Stay silent", "Talk through your thinking out loud", "Guess the answer", "Refuse to attempt"],
      correctIndex: 1,
    },
    {
      skillName: "Problem Solving / Communication",
      question: "Explaining a tradeoff means describing:",
      options: ["Only the benefits", "Only the drawbacks", "Pros and cons of an approach", "Nothing about the decision"],
      correctIndex: 2,
    },
    {
      skillName: "Problem Solving / Communication",
      question: "When stuck, a productive step is to:",
      options: ["Give up immediately", "Clarify the problem and constraints", "Type random code", "Refuse hints"],
      correctIndex: 1,
    },
  ],
  "System Design": [
    {
      skillName: "System Design",
      question: "Which is a common strategy to scale a web app for more users?",
      options: ["Remove all caching", "Add load balancing", "Use a single server", "Disable logging"],
      correctIndex: 1,
    },
    {
      skillName: "System Design",
      question: "What is horizontal scaling?",
      options: ["Upgrading one server's hardware", "Adding more servers", "Reducing features", "Using less memory"],
      correctIndex: 1,
    },
    {
      skillName: "System Design",
      question: "A cache primarily helps with:",
      options: ["Permanent storage", "Reducing repeated expensive reads", "Backups", "Security"],
      correctIndex: 1,
    },
  ],
  "Excel": [
    {
      skillName: "Excel",
      question: "Which feature summarizes large datasets by categories?",
      options: ["Pivot Table", "Cell border", "Font color", "Print area"],
      correctIndex: 0,
    },
    {
      skillName: "Excel",
      question: "Which symbol starts a formula in Excel?",
      options: ["#", "@", "=", "+", "+", "+"],
      correctIndex: 2,
    },
    {
      skillName: "Excel",
      question: "VLOOKUP does what?",
      options: ["Sorts data", "Looks up a value in the first column of a range", "Creates charts", "Saves files"],
      correctIndex: 1,
    },
  ],
  "Data Visualization (Power BI/Tableau)": [
    {
      skillName: "Data Visualization (Power BI/Tableau)",
      question: "A dashboard is best used to:",
      options: ["Replace a database", "Communicate key metrics at a glance", "Store raw files", "Send emails"],
      correctIndex: 1,
    },
    {
      skillName: "Data Visualization (Power BI/Tableau)",
      question: "Which chart best shows a trend over time?",
      options: ["Pie chart", "Line chart", "Treemap", "Donut chart"],
      correctIndex: 1,
    },
    {
      skillName: "Data Visualization (Power BI/Tableau)",
      question: "Which is a principle of clean visualization?",
      options: ["Maximize clutter", "Remove labels", "Minimize chartjunk", "Use many colors"],
      correctIndex: 2,
    },
  ],
  "HTML/CSS": [
    {
      skillName: "HTML/CSS",
      question: "Which HTML tag represents the largest heading?",
      options: ["<h6>", "<head>", "<h1>", "<header>"],
      correctIndex: 2,
    },
    {
      skillName: "HTML/CSS",
      question: "Which CSS property controls spacing inside an element's border?",
      options: ["margin", "padding", "border", "gap"],
      correctIndex: 1,
    },
    {
      skillName: "HTML/CSS",
      question: "Which CSS layout module is best for responsive one-dimensional layouts?",
      options: ["float", "flexbox", "table", "position"],
      correctIndex: 1,
    },
  ],
  "REST APIs": [
    {
      skillName: "REST APIs",
      question: "Which HTTP method is used to create a resource?",
      options: ["GET", "POST", "DELETE", "HEAD"],
      correctIndex: 1,
    },
    {
      skillName: "REST APIs",
      question: "Which status code indicates 'Not Found'?",
      options: ["200", "301", "404", "500"],
      correctIndex: 2,
    },
    {
      skillName: "REST APIs",
      question: "REST typically uses which data format?",
      options: ["XML only", "JSON", "Binary", "CSV only"],
      correctIndex: 1,
    },
  ],
  "Testing (Jest/RTL)": [
    {
      skillName: "Testing (Jest/RTL)",
      question: "A unit test verifies:",
      options: ["The whole app", "A single small piece of logic in isolation", "Only the UI", "Network speed"],
      correctIndex: 1,
    },
    {
      skillName: "Testing (Jest/RTL)",
      question: "RTL (React Testing Library) encourages testing:",
      options: ["Internal state", "Component implementation details", "Behavior visible to users", "CSS classes"],
      correctIndex: 2,
    },
    {
      skillName: "Testing (Jest/RTL)",
      question: "What does a failing assertion do?",
      options: ["Pass silently", "Marks the test as failed", "Logs only", "Nothing"],
      correctIndex: 1,
    },
  ],
  "Linux Fundamentals": [
    {
      skillName: "Linux Fundamentals",
      question: "Which command lists files in the current directory?",
      options: ["cd", "ls", "pwd", "rm"],
      correctIndex: 1,
    },
    {
      skillName: "Linux Fundamentals",
      question: "Which command changes file permissions?",
      options: ["chmod", "chown", "mkdir", "cat"],
      correctIndex: 0,
    },
    {
      skillName: "Linux Fundamentals",
      question: "What does `cd ..` do?",
      options: ["Goes to root", "Moves up one directory", "Lists files", "Creates a directory"],
      correctIndex: 1,
    },
  ],
  "Cloud Basics (Azure/AWS)": [
    {
      skillName: "Cloud Basics (Azure/AWS)",
      question: "Which AWS service provides virtual servers?",
      options: ["S3", "EC2", "Lambda", "RDS"],
      correctIndex: 1,
    },
    {
      skillName: "Cloud Basics (Azure/AWS)",
      question: "IaaS means the cloud provider manages:",
      options: ["Your application code", "Infrastructure hardware", "Your data analysis", "Nothing"],
      correctIndex: 1,
    },
    {
      skillName: "Cloud Basics (Azure/AWS)",
      question: "Object storage (e.g. S3) is best for:",
      options: ["Running VMs", "Storing files/objects at scale", "Relational queries", "DNS routing"],
      correctIndex: 1,
    },
  ],
  "Python or Bash Scripting": [
    {
      skillName: "Python or Bash Scripting",
      question: "Which is a valid bash loop?",
      options: ["for i in 1 2 3; do", "foreach(i)", "loop(i)", "iterate(i)"],
      correctIndex: 0,
    },
    {
      skillName: "Python or Bash Scripting",
      question: "Scripting is most useful for:",
      options: ["Manual repetitive clicks", "Automating repetitive tasks", "Drawing UI", "Writing documentation"],
      correctIndex: 1,
    },
    {
      skillName: "Python or Bash Scripting",
      question: "Which gives a script executable permission in bash?",
      options: ["chmod +x", "chmod -x", "chown", "sudo run"],
      correctIndex: 0,
    },
  ],
  "Networking Fundamentals": [
    {
      skillName: "Networking Fundamentals",
      question: "What does DNS translate?",
      options: ["IPs to MACs", "Domain names to IP addresses", "Bytes to bits", "HTTP to HTTPS"],
      correctIndex: 1,
    },
    {
      skillName: "Networking Fundamentals",
      question: "A load balancer distributes traffic to:",
      options: ["One server", "Multiple servers", "A database only", "A single client"],
      correctIndex: 1,
    },
    {
      skillName: "Networking Fundamentals",
      question: "Which protocol is connectionless and often used for DNS queries?",
      options: ["TCP", "UDP", "FTP", "SSH"],
      correctIndex: 1,
    },
  ],
  "CI/CD Concepts": [
    {
      skillName: "CI/CD Concepts",
      question: "CI stands for:",
      options: ["Continuous Integration", "Code Inspection", "Central Interface", "Common Infrastructure"],
      correctIndex: 0,
    },
    {
      skillName: "CI/CD Concepts",
      question: "A pipeline typically automates:",
      options: ["Build, test, and deploy", "Only writing docs", "Hiring", "Designing logos"],
      correctIndex: 0,
    },
    {
      skillName: "CI/CD Concepts",
      question: "CD can stand for:",
      options: ["Code Deployment only", "Continuous Delivery/Deployment", "Central Data", "Client Device"],
      correctIndex: 1,
    },
  ],
};

export function getQuizForSkill(skill: RequiredSkill): QuizQuestion[] {
  // Try exact name, then fall back to a keyword-based partial match.
  if (quizBank[skill.name]) return quizBank[skill.name];
  const key = Object.keys(quizBank).find((k) =>
    skill.name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(skill.name.toLowerCase())
  );
  return key ? quizBank[key] : [];
}
