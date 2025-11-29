import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Code, Copy, Check } from "lucide-react";

const codeExamples: Record<string, string> = {
  c: `#include <stdio.h>
#include <limits.h>

#define V 6  // Number of nodes

// Function to find the vertex with minimum distance value
int minDistance(int dist[], int sptSet[]) {
    int min = INT_MAX, min_index;
    for (int v = 0; v < V; v++)
        if (!sptSet[v] && dist[v] <= min)
            min = dist[v], min_index = v;
    return min_index;
}

// Function to print the shortest distance and paths
void printSolution(int dist[], int parent[], int src) {
    printf("\\nNode\\tDistance\\tPath\\n");
    for (int i = 0; i < V; i++) {
        printf("%d\\t%d\\t\\t%d", i, dist[i], src);
        int j = i;
        while (parent[j] != -1) {
            printf(" -> %d", j);
            j = parent[j];
        }
        if (i != src) printf("\\n");
        else printf("\\n");
    }
}

// Dijkstra's algorithm with path tracking
void dijkstra(int graph[V][V], int src, int parent[]) {
    int dist[V];
    int sptSet[V];

    for (int i = 0; i < V; i++) {
        dist[i] = INT_MAX;
        sptSet[i] = 0;
        parent[i] = -1;
    }

    dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, sptSet);
        sptSet[u] = 1;

        for (int v = 0; v < V; v++) {
            if (!sptSet[v] && graph[u][v] && dist[u] != INT_MAX &&
                dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
                parent[v] = u;  // track the path
            }
        }
    }

    printSolution(dist, parent, src);
}

int main() {
    int graph[V][V] = {
        {0, 10, 0, 0, 15, 0},
        {10, 0, 12, 0, 0, 15},
        {0, 12, 0, 22, 0, 1},
        {0, 0, 22, 0, 2, 0},
        {15, 0, 0, 2, 0, 5},
        {0, 15, 1, 0, 5, 0}
    };

    int source;
    printf("Enter the source node (0 to %d): ", V-1);
    scanf("%d", &source);

    int parent[V];
    dijkstra(graph, source, parent);

    return 0;
}`,
  python: `import heapq
import sys

def dijkstra(graph, start):
    # Initialize distances and previous nodes
    distances = {node: float('infinity') for node in graph}
    previous = {node: None for node in graph}
    distances[start] = 0
    
    # Priority queue: (distance, node)
    pq = [(0, start)]
    visited = set()
    
    while pq:
        current_distance, current = heapq.heappop(pq)
        
        if current in visited:
            continue
            
        visited.add(current)
        
        # Check neighbors
        for neighbor, weight in graph[current].items():
            distance = current_distance + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous[neighbor] = current
                heapq.heappush(pq, (distance, neighbor))
    
    return distances, previous

def print_path(previous, start, end):
    path = []
    current = end
    while current is not None:
        path.append(current)
        current = previous[current]
    path.reverse()
    return ' -> '.join(map(str, path))

# Example graph
graph = {
    0: {1: 10, 4: 15},
    1: {0: 10, 2: 12, 5: 15},
    2: {1: 12, 3: 22, 5: 1},
    3: {2: 22, 4: 2},
    4: {0: 15, 3: 2, 5: 5},
    5: {1: 15, 2: 1, 4: 5}
}

source = int(input("Enter source node (0-5): "))
distances, previous = dijkstra(graph, source)

print("\\nNode\\tDistance\\tPath")
for node in sorted(graph.keys()):
    path = print_path(previous, source, node)
    print(f"{node}\\t{distances[node]}\\t\\t{path}")`,
  java: `import java.util.*;

public class DijkstraAlgorithm {
    private static final int INF = Integer.MAX_VALUE;
    
    public static void dijkstra(int[][] graph, int src) {
        int V = graph.length;
        int[] dist = new int[V];
        boolean[] visited = new boolean[V];
        int[] parent = new int[V];
        
        // Initialize distances and parent array
        Arrays.fill(dist, INF);
        Arrays.fill(parent, -1);
        dist[src] = 0;
        
        for (int count = 0; count < V - 1; count++) {
            int u = minDistance(dist, visited);
            visited[u] = true;
            
            for (int v = 0; v < V; v++) {
                if (!visited[v] && graph[u][v] != 0 && 
                    dist[u] != INF && dist[u] + graph[u][v] < dist[v]) {
                    dist[v] = dist[u] + graph[u][v];
                    parent[v] = u;
                }
            }
        }
        
        printSolution(dist, parent, src);
    }
    
    private static int minDistance(int[] dist, boolean[] visited) {
        int min = INF, minIndex = -1;
        for (int v = 0; v < dist.length; v++) {
            if (!visited[v] && dist[v] <= min) {
                min = dist[v];
                minIndex = v;
            }
        }
        return minIndex;
    }
    
    private static void printSolution(int[] dist, int[] parent, int src) {
        System.out.println("Node\\tDistance\\tPath");
        for (int i = 0; i < dist.length; i++) {
            System.out.print(i + "\\t" + dist[i] + "\\t\\t");
            printPath(parent, i, src);
            System.out.println();
        }
    }
    
    private static void printPath(int[] parent, int j, int src) {
        if (parent[j] == -1) {
            System.out.print(src);
            return;
        }
        printPath(parent, parent[j], src);
        System.out.print(" -> " + j);
    }
    
    public static void main(String[] args) {
        int[][] graph = {
            {0, 10, 0, 0, 15, 0},
            {10, 0, 12, 0, 0, 15},
            {0, 12, 0, 22, 0, 1},
            {0, 0, 22, 0, 2, 0},
            {15, 0, 0, 2, 0, 5},
            {0, 15, 1, 0, 5, 0}
        };
        
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter source node (0-5): ");
        int source = sc.nextInt();
        
        dijkstra(graph, source);
    }
}`,
  javascript: `class DijkstraAlgorithm {
    constructor(graph) {
        this.graph = graph;
    }
    
    dijkstra(start) {
        const distances = {};
        const previous = {};
        const visited = new Set();
        const nodes = Object.keys(this.graph);
        
        // Initialize distances
        nodes.forEach(node => {
            distances[node] = node === start ? 0 : Infinity;
            previous[node] = null;
        });
        
        while (visited.size < nodes.length) {
            // Find unvisited node with minimum distance
            const current = nodes
                .filter(node => !visited.has(node))
                .reduce((min, node) => 
                    distances[node] < distances[min] ? node : min
                );
            
            visited.add(current);
            
            // Update distances to neighbors
            Object.entries(this.graph[current] || {}).forEach(([neighbor, weight]) => {
                if (!visited.has(neighbor)) {
                    const newDistance = distances[current] + weight;
                    if (newDistance < distances[neighbor]) {
                        distances[neighbor] = newDistance;
                        previous[neighbor] = current;
                    }
                }
            });
        }
        
        return { distances, previous };
    }
    
    getPath(previous, start, end) {
        const path = [];
        let current = end;
        while (current !== null) {
            path.unshift(current);
            current = previous[current];
        }
        return path.join(' -> ');
    }
    
    printResults(start) {
        const { distances, previous } = this.dijkstra(start);
        
        console.log('Node\\tDistance\\tPath');
        Object.keys(this.graph).forEach(node => {
            const path = this.getPath(previous, start, node);
            console.log(\`\${node}\\t\${distances[node]}\\t\\t\${path}\`);
        });
    }
}

// Example usage
const graph = {
    '0': { '1': 10, '4': 15 },
    '1': { '0': 10, '2': 12, '5': 15 },
    '2': { '1': 12, '3': 22, '5': 1 },
    '3': { '2': 22, '4': 2 },
    '4': { '0': 15, '3': 2, '5': 5 },
    '5': { '1': 15, '2': 1, '4': 5 }
};

const dijkstra = new DijkstraAlgorithm(graph);
const source = prompt("Enter source node (0-5):");
dijkstra.printResults(source);`
};

export const CodeViewer = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('c');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeExamples[selectedLanguage]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Dijkstra's Algorithm Code</h3>
          </div>
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        
        <div className="flex gap-2 mb-4 flex-wrap">
          {Object.keys(codeExamples).map((lang) => (
            <Button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              variant={selectedLanguage === lang ? "default" : "outline"}
              size="sm"
              className="capitalize"
            >
              {lang === 'javascript' ? 'JS' : lang.toUpperCase()}
            </Button>
          ))}
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto">
          <pre className="text-sm text-green-400 whitespace-pre font-mono">
            <code>{codeExamples[selectedLanguage]}</code>
          </pre>
        </div>
      </Card>
    </div>
  );
};