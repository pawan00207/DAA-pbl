# SMART ROUTE OPTIMIZATION SYSTEM USING GRAPH ALGORITHMS

### Bachelor of Technology (B.Tech) in Computer Science & Engineering
**Course:** Design and Analysis of Algorithms (DAA - CS301)  
**Semester:** V  
**Institution:** Delhi Technical Campus  

---

## 1. Project Purpose & Academic Context
The **Smart Route Optimization System** is a Design and Analysis of Algorithms (DAA) laboratory project developed for B.Tech Computer Science & Engineering, Semester V. The application demonstrates fundamental graph theory algorithms through interactive step-by-step visualizers and empirical asymptotic complexity benchmarks.

---

## 2. Core Implemented Algorithms

| Algorithm | Paradigm | Data Structure | Time Complexity (Best / Avg / Worst) | Space Complexity | Optimality Criterion |
|---|---|---|---|---|---|
| **Dijkstra's Shortest Path** | Greedy | Min-Priority Queue | $O(|V|\log |V| + |E|) \dots O((|V|+|E|)\log |V|)$ | $O(|V| + |E|)$ | Minimum total weighted path $\sum w(e)$ |
| **Bellman-Ford Algorithm** | Dynamic Programming | Edge List Relaxation | $O(|E|) \dots O(|V| \cdot |E|)$ | $O(|V|)$ | Negative weight handling & negative cycle detection |
| **A\* Heuristic Search** | Informed Heuristic Search | Min-Priority Queue ($f = g + h$) | $O(1) \dots O(|E|\log |V|)$ | $O(|V|)$ | Euclidean admissible heuristic targeted shortest path |
| **Breadth First Search (BFS)** | Level-Order | FIFO Queue | $O(1) \dots O(|V| + |E|)$ | $O(|V|)$ | Minimum edge hop count |
| **Depth First Search (DFS)** | Backtracking | LIFO Stack / Recursion | $O(1) \dots O(|V| + |E|)$ | $O(|V|)$ | Deep branch exploration |
| **Prim's Algorithm** | Greedy (Cut Property) | Min-Priority Queue | $O(|E|\log |V|)$ | $O(|V| + |E|)$ | Minimum Spanning Tree / Forest |
| **Kruskal's Algorithm** | Greedy (Cycle Check) | Disjoint Set Union (DSU) | $O(|E|\log |E|)$ | $O(|V| + |E|)$ | Minimum Spanning Tree / Forest |
| **Floyd-Warshall (APSP)** | Dynamic Programming | $n \times n$ Distance Matrix | $\Theta(|V|^3)$ | $\Theta(|V|^2)$ | All-Pairs Shortest Path matrix & negative cycles |

---

## 3. Application Modules

1. **Dashboard:**
   - Real-time graph telemetry ($|V|, |E|$, graph density).
   - 6 Curated sample graph presets (Delhi Transit, CLRS Textbook Fig 24.6, Disconnected Islands, Data Center WAN, Complete $K_5$).
   - Quick Adjacency List inspector.
   - Simulation run statistics.

2. **Interactive Graph Editor:**
   - Add, move, and remove vertices.
   - Connect edges with custom weights.
   - Toggle Directed (Digraph) vs. Undirected.
   - Random Graph Generator with configurable density.
   - Adjacency List and Adjacency Matrix tabbed inspectors.
   - Import & Export Graph JSON.

3. **Algorithm Visualizer:**
   - Step-by-step playback: Play, Pause, Next Step, Previous Step, Restart, Scrubber.
   - Playback speed slider (0.5x, 1x, 2x).
   - Visual node states: Active (pulsing), Visited, Frontier/Queue, Path.
   - Visual edge states: Relaxing, Path/Tree edge, Rejected cycle edge.
   - Live Data Structure Inspector: Min-Priority Queue, FIFO Queue, LIFO Stack, Kruskal DSU partition sets.
   - Real-time Distance & Predecessor relaxation table ($d[v], \pi[v]$).

4. **Route Comparison:**
   - Concurrent side-by-side execution of Dijkstra vs BFS vs DFS.
   - Compares path sequence, total weight, hop count, and nodes visited.
   - Explains the mathematical reason why unweighted shortest path (BFS) differs from weighted shortest path (Dijkstra).

5. **Complexity Analyzer:**
   - Formal theoretical asymptotic Big-O breakdown.
   - Clarifies theoretical complexity vs empirical clock-time measurements.
   - Interactive benchmark runner measuring execution times on graphs from $|V|=10$ to $|V|=200$.
   - Interactive line charts rendered via Recharts.

6. **Learning Center:**
   - In-depth textbook curriculum with historical origin, loop invariants, formal CLRS pseudocode, and real-world engineering applications.

7. **Simulation History:**
   - Stored in browser `localStorage`.
   - Replay simulation runs directly into the Visualizer.
   - JSON export and log deletion.

8. **About Project:**
   - Academic syllabus specifications, system architecture, test suite instructions.

---

## 4. Test Cases & Verification Scenarios

### Test Case 1: Negative Edge Weights (Dijkstra Rejection)
- **Input:** Connect an edge with negative weight (e.g. $w = -4$).
- **Expected Result:** Dijkstra detects $w(u,v) < 0$ and halts with an academic error message explaining why greedy relaxation fails and advising Bellman-Ford. BFS and Prim/Kruskal remain functional.

### Test Case 2: Disconnected Graph (Minimum Spanning Forest & Unreachable)
- **Input:** Load "Disconnected Islands" preset.
- **Expected Result:** 
  - Prim and Kruskal report a **Minimum Spanning Forest (MSF)** across both subgraphs.
  - Dijkstra and BFS report "Destination Unreachable" if source and target lie on separate components.

### Test Case 3: Weighted vs Unweighted Divergence
- **Input:** Load "Delhi NCR Transit Network", Source: `KG` (Kashmere Gate), Target: `NOI` (Noida Sec 18).
- **Result:**
  - BFS chooses minimum hop path: `KG → ANV → NOI` (2 hops, weight 21).
  - Demonstrates how hop minimization differs from weight minimization.

---

## 5. Local Setup & Installation

```bash
# Clone the repository
git clone https://github.com/your-username/smart-route-optimization-system.git
cd smart-route-optimization-system

# Install dependencies
npm install

# Start Vite development server
npm run dev

# Run Vitest algorithm test suite (14 automated unit tests)
npm test
```

Open `http://localhost:3000` in your browser.

---

## 6. Deployment Instructions

### Deploy to Vercel
1. Push your repository to GitHub.
2. In the Vercel dashboard, click **Add New Project** and select this repository.
3. Keep default settings (Framework: Vite, Build command: `npm run build`, Output directory: `dist`).
4. Click **Deploy**.

---

## 7. About Me
**Pawan Singh**  
Full Stack Developer | Java Programmer | AI Builder  

I am a B.Tech Computer Science student passionate about building modern web applications, AI-powered solutions, and real-world projects. I enjoy problem-solving, learning new technologies, and participating in hackathons.

**Connect With Me:**
- GitHub: [github.com/pawan00207](https://github.com/pawan00207)
- LinkedIn: [linkedin.com/in/pawan-singh-555423322/](https://linkedin.com/in/pawan-singh-555423322/)
- LeetCode: [leetcode.com/u/pawansingh2005/](https://leetcode.com/u/pawansingh2005/)
- HackerRank: [hackerrank.com/profile/pawan_cse24](https://www.hackerrank.com/profile/pawan_cse24)
- X (Twitter): [x.com/pawansi84184129](https://x.com/pawansi84184129)

---

## 8. License & Academic Attribution
Developed as an educational submission for B.Tech Computer Science & Engineering, Semester V Design and Analysis of Algorithms course. Under Apache-2.0 License.
