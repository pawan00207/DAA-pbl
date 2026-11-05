/**
 * @file /src/components/AboutProject.tsx
 * @description Academic Project Specification, Course & Syllabus Alignment,
 * Architecture Overview, Interactive Test Suite Guide, and complete README & Deployment instructions.
 * B.Tech CSE Semester V - Design and Analysis of Algorithms (DAA)
 */

import React, { useState } from 'react';
import {
  FileCode2,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Code2,
  User,
} from 'lucide-react';

export const AboutProject: React.FC = () => {
  const [copiedReadme, setCopiedReadme] = useState<boolean>(false);

  const readmeMarkdown = `# SMART ROUTE OPTIMIZATION SYSTEM USING GRAPH ALGORITHMS
### Bachelor of Technology (B.Tech) in Computer Science & Engineering
**Course:** Design and Analysis of Algorithms (DAA - CS301)  
**Academic Level:** Semester V  
**Department:** Computer Science & Engineering  

---

## 1. Project Overview & Abstract
The **Smart Route Optimization System** is a software engineering and algorithmic research platform modeling transportation, telecommunications, and computer network topologies as weighted, directed or undirected graphs $G = (V, E)$. 

The platform provides genuine, step-by-step executions of fundamental graph algorithms (Dijkstra, Bellman-Ford, A* Search, BFS, DFS, Prim, Kruskal, Floyd-Warshall) with real-time inspection of internal data structures (Min-Priority Queue, FIFO Queue, LIFO Stack, Disjoint Set Union, 2D Matrix). Additionally, it features empirical benchmarking tools that contrast theoretical Big-O asymptotic limits with real CPU wall-clock execution times.

---

## 2. Implemented Algorithm Engines
1. **Dijkstra's Shortest Path:** Min-Priority Queue, $O((|V| + |E|) \\log |V|)$, strictly rejects negative edge weights with algorithmic proof.
2. **Bellman-Ford Algorithm:** Dynamic programming edge relaxation passes, $O(|V| \\cdot |E|)$, supports negative weights and detects/highlights negative-weight cycles.
3. **A* Search Algorithm:** Guided heuristic search using Euclidean coordinate distance, $f(n) = g(n) + h(n)$, optimal with admissible heuristics.
4. **Breadth-First Search (BFS):** FIFO Queue level-order traversal, $O(|V| + |E|)$, minimum-hop unweighted pathfinding.
5. **Depth-First Search (DFS):** LIFO stack backtracking exploration, $O(|V| + |E|)$, cycle detection and traversal trees.
6. **Prim's Algorithm (MST):** Cut Property theorem, grows contiguous tree from seed vertex, $O(|E| \\log |V|)$, outputs Minimum Spanning Forest on disconnected graphs.
7. **Kruskal's Algorithm (MST):** Disjoint Set Union (DSU / Union-Find) with path compression and union by rank, $O(|E| \\log |E|)$, detects and rejects cycle edges.
8. **Floyd-Warshall (APSP):** Dynamic programming triply-nested matrix recurrence, $O(|V|^3)$, computes all-pairs shortest paths and detects diagonal negative cycles.

---

## 3. Test Cases & Verification Scenarios
- **Test Case 1 (Negative Weights Rejection):** Dijkstra halts with explanation; Bellman-Ford succeeds.
- **Test Case 2 (Negative Cycle Detection):** Bellman-Ford identifies negative cycle and highlights cycle edges.
- **Test Case 3 (Disconnected MSForest):** Prim and Kruskal construct Minimum Spanning Forest on disconnected graphs.
- **Test Case 4 (Weighted vs Unweighted Divergence):** BFS minimizes hops while Dijkstra minimizes weighted cost.
- **Test Case 5 (A* Heuristic Acceleration):** A* explores fewer nodes than Dijkstra towards goal.

---

## 4. Local Installation & Setup

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/your-username/smart-route-optimization-system.git
cd smart-route-optimization-system

# 2. Install dependencies
npm install

# 3. Run unit tests
npm test

# 4. Start development server
npm run dev
\`\`\`

---

## 5. Deployment Instructions (GitHub & Vercel)
\`\`\`bash
# Build production bundle
npm run build

# Deploy to Vercel via CLI
npx vercel
\`\`\`

---

## 6. About Me
**Pawan Singh**  
Full Stack Developer | Java Programmer | AI Builder  

I am a B.Tech Computer Science student passionate about building modern web applications, AI-powered solutions, and real-world projects. I enjoy problem-solving, learning new technologies, and participating in hackathons.

**Connect With Me:**
- GitHub: https://github.com/pawan00207
- LinkedIn: https://linkedin.com/in/pawan-singh-555423322/
- LeetCode: https://leetcode.com/u/pawansingh2005/
- HackerRank: https://www.hackerrank.com/profile/pawan_cse24
- X (Twitter): https://x.com/pawansi84184129
`;

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(readmeMarkdown);
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Project Academic Header Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Smart Route Optimization System Using Graph Algorithms
              </h2>
              <p className="text-xs text-slate-500">
                Design and Analysis of Algorithms (DAA - CS301) • Semester V Laboratory Project
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyReadme}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-md border border-slate-200 transition-colors"
          >
            {copiedReadme ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedReadme ? 'Copied README' : 'Copy README.md'}</span>
          </button>
        </div>

        {/* Academic Credentials Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Programme</span>
            <span className="font-bold text-slate-900 mt-0.5 block">B.Tech CSE</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Semester</span>
            <span className="font-bold text-slate-900 mt-0.5 block">Semester V (3rd Year)</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Course</span>
            <span className="font-bold text-blue-700 mt-0.5 block">CS301: DAA</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Institution</span>
            <span className="font-bold text-slate-900 mt-0.5 block">Delhi Technical Campus</span>
          </div>
        </div>
      </div>

      {/* About Me / Developer Profile Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-base shadow-xs shrink-0">
              PS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Pawan Singh</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Lead Developer
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                Full Stack Developer | Java Programmer | AI Builder
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              About Me
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              I am a B.Tech Computer Science student passionate about building modern web applications, AI-powered solutions, and real-world projects. I enjoy problem-solving, learning new technologies, and participating in hackathons.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Connect With Me
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              {/* GitHub */}
              <a
                href="https://github.com/pawan00207"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Github className="w-4 h-4 text-slate-700 group-hover:text-black transition-colors" />
                  <span className="font-semibold text-slate-900">GitHub</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/pawan-singh-555423322/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Linkedin className="w-4 h-4 text-blue-600 group-hover:text-blue-700 transition-colors" />
                  <span className="font-semibold text-slate-900">LinkedIn</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              </a>

              {/* LeetCode */}
              <a
                href="https://leetcode.com/u/pawansingh2005/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Code2 className="w-4 h-4 text-amber-600 group-hover:text-amber-700 transition-colors" />
                  <span className="font-semibold text-slate-900">LeetCode</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              </a>

              {/* HackerRank */}
              <a
                href="https://www.hackerrank.com/profile/pawan_cse24"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                  <span className="font-semibold text-slate-900">HackerRank</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/pawansi84184129"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Twitter className="w-4 h-4 text-sky-500 group-hover:text-sky-600 transition-colors" />
                  <span className="font-semibold text-slate-900">X (Twitter)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Project Objectives & Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-3 text-xs text-slate-700">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Project Objectives & Learning Outcomes
          </h3>
          <ul className="space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>Genuine Algorithmic Engines:</strong> 8 distinct algorithms implemented from first principles using standard adjacency list structures and priority queues.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>Edge Case Robustness:</strong> Negative weight cycle detection (Bellman-Ford), Minimum Spanning Forest generation on disconnected graphs (Prim & Kruskal), and unreachable destination handling.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>Tripartite Complexity Measurement:</strong> Bridging theoretical Big-O, exact machine operation counts, and hardware wall-clock execution time.
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-3 text-xs text-slate-700">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            System Architecture & Engineering Design
          </h3>
          <div className="space-y-2 font-mono text-[11px]">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <strong className="text-blue-700">Adjacency List:</strong> Map&lt;string, Neighbor[]&gt; providing O(|V| + |E|) storage optimality.
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <strong className="text-blue-700">Disjoint Set Union:</strong> Rank-based union with path compression providing O(α(V)) amortized time.
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <strong className="text-blue-700">Deterministic Snapshots:</strong> Pure state recording of queues, parent arrays, and live pseudocode lines.
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Project README */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900">Project README.md & Deployment Guide</h3>
          </div>
          <button
            onClick={handleCopyReadme}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            {copiedReadme ? 'Copied' : 'Copy Full Markdown'}
          </button>
        </div>

        <div className="p-4">
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
            {readmeMarkdown}
          </pre>
        </div>
      </div>
    </div>
  );
};
