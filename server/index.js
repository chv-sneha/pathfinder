import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Dijkstra's algorithm implementation
function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const queue = [];

  // Initialize distances
  for (let node in graph) {
    distances[node] = node === start ? 0 : Infinity;
    previous[node] = null;
    queue.push(node);
  }

  while (queue.length > 0) {
    // Find unvisited node with minimum distance
    queue.sort((a, b) => distances[a] - distances[b]);
    const current = queue.shift();

    if (visited.has(current)) continue;
    visited.add(current);

    if (current === end) break;

    // Update distances to neighbors
    for (let neighbor in graph[current]) {
      if (!visited.has(neighbor)) {
        const newDistance = distances[current] + graph[current][neighbor];
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = current;
        }
      }
    }
  }

  // Reconstruct path
  const path = [];
  let current = end;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    distance: distances[end],
    path: distances[end] === Infinity ? [] : path,
    allDistances: distances
  };
}

// Sample graph data for emergency routing
const cityGraph = {
  'A': { 'B': 4, 'C': 2 },
  'B': { 'A': 4, 'C': 1, 'D': 5 },
  'C': { 'A': 2, 'B': 1, 'D': 8, 'E': 10 },
  'D': { 'B': 5, 'C': 8, 'E': 2, 'F': 6 },
  'E': { 'C': 10, 'D': 2, 'F': 3 },
  'F': { 'D': 6, 'E': 3 }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pathfinder Pro Backend is running!' });
});

app.get('/api/graph', (req, res) => {
  res.json({ graph: cityGraph });
});

app.post('/api/shortest-path', (req, res) => {
  const { start, end } = req.body;
  
  if (!start || !end) {
    return res.status(400).json({ error: 'Start and end nodes are required' });
  }

  if (!cityGraph[start] || !cityGraph[end]) {
    return res.status(400).json({ error: 'Invalid start or end node' });
  }

  const result = dijkstra(cityGraph, start, end);
  res.json(result);
});

app.get('/api/nodes', (req, res) => {
  const nodes = Object.keys(cityGraph).map(node => ({
    id: node,
    label: `Station ${node}`,
    connections: Object.keys(cityGraph[node]).length
  }));
  res.json({ nodes });
});

app.listen(PORT, () => {
  console.log(`🚀 Pathfinder Pro Backend running on port ${PORT}`);
});