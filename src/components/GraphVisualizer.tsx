import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Play, RotateCcw, Pause, Languages, Code } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface Node {
  id: number;
  x: number;
  y: number;
  distance: number;
  visited: boolean;
  parent: number | null;
}

interface Edge {
  from: number;
  to: number;
  weight: number;
}

const initialGraph = [
  [0, 10, 0, 0, 15, 0],
  [10, 0, 12, 0, 0, 15],
  [0, 12, 0, 22, 0, 1],
  [0, 0, 22, 0, 2, 0],
  [15, 0, 0, 2, 0, 5],
  [0, 15, 1, 0, 5, 0],
];

const nodePositions = [
  { x: 150, y: 100 },
  { x: 400, y: 80 },
  { x: 450, y: 280 },
  { x: 300, y: 400 },
  { x: 150, y: 300 },
  { x: 300, y: 250 },
];

const cCode = `#include <stdio.h>
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
}`;

const translations = {
  en: {
    runAlgorithm: "Run Algorithm",
    reset: "Reset",
    sourceNode: "Source Node",
    node: "Node",
    nodeDistances: "Node Distances",
    shortestPaths: "Shortest Paths",
    runToSee: "Run the algorithm to see shortest paths",
    cCode: "C Implementation",
  },
  es: {
    runAlgorithm: "Ejecutar Algoritmo",
    reset: "Reiniciar",
    sourceNode: "Nodo Origen",
    node: "Nodo",
    nodeDistances: "Distancias de Nodos",
    shortestPaths: "Rutas Más Cortas",
    runToSee: "Ejecute el algoritmo para ver las rutas más cortas",
    cCode: "Implementación en C",
  },
  fr: {
    runAlgorithm: "Exécuter l'Algorithme",
    reset: "Réinitialiser",
    sourceNode: "Nœud Source",
    node: "Nœud",
    nodeDistances: "Distances des Nœuds",
    shortestPaths: "Plus Courts Chemins",
    runToSee: "Exécutez l'algorithme pour voir les chemins les plus courts",
    cCode: "Implémentation C",
  },
  de: {
    runAlgorithm: "Algorithmus Ausführen",
    reset: "Zurücksetzen",
    sourceNode: "Quellknoten",
    node: "Knoten",
    nodeDistances: "Knotenabstände",
    shortestPaths: "Kürzeste Wege",
    runToSee: "Führen Sie den Algorithmus aus, um die kürzesten Wege zu sehen",
    cCode: "C-Implementierung",
  },
  hi: {
    runAlgorithm: "एल्गोरिथम चलाएं",
    reset: "रीसेट करें",
    sourceNode: "स्रोत नोड",
    node: "नोड",
    nodeDistances: "नोड दूरियां",
    shortestPaths: "सबसे छोटे रास्ते",
    runToSee: "सबसे छोटे रास्ते देखने के लिए एल्गोरिथम चलाएं",
    cCode: "C कार्यान्वयन",
  },
};

export const GraphVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [sourceNode, setSourceNode] = useState(0);
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [shortestPaths, setShortestPaths] = useState<number[][]>([]);
  const [language, setLanguage] = useState<keyof typeof translations>("en");
  const animationRef = useRef<number>();

  const t = translations[language];

  useEffect(() => {
    initializeGraph();
  }, []);

  const initializeGraph = () => {
    const newNodes: Node[] = nodePositions.map((pos, i) => ({
      id: i,
      x: pos.x,
      y: pos.y,
      distance: i === sourceNode ? 0 : Infinity,
      visited: false,
      parent: null,
    }));

    const newEdges: Edge[] = [];
    for (let i = 0; i < initialGraph.length; i++) {
      for (let j = i + 1; j < initialGraph[i].length; j++) {
        if (initialGraph[i][j] > 0) {
          newEdges.push({ from: i, to: j, weight: initialGraph[i][j] });
        }
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
    setCurrentNode(null);
    setShortestPaths([]);
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach((edge) => {
      const fromNode = nodes[edge.from];
      const toNode = nodes[edge.to];

      const isInPath = shortestPaths.some(
        (path) =>
          (path.includes(edge.from) && path.includes(edge.to)) ||
          (path.includes(edge.to) && path.includes(edge.from))
      );

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = isInPath
        ? "hsl(185, 95%, 50%)"
        : "hsl(220, 15%, 25%)";
      ctx.lineWidth = isInPath ? 4 : 2;
      ctx.stroke();

      // Draw weight
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      ctx.fillStyle = "hsl(180, 100%, 98%)";
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.fillText(edge.weight.toString(), midX, midY);
    });

    // Draw nodes
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);

      if (node.id === sourceNode) {
        ctx.fillStyle = "hsl(0, 85%, 60%)";
      } else if (node.id === currentNode) {
        ctx.fillStyle = "hsl(45, 100%, 60%)";
      } else if (node.visited) {
        ctx.fillStyle = "hsl(185, 95%, 50%)";
      } else {
        ctx.fillStyle = "hsl(220, 20%, 12%)";
      }

      ctx.fill();
      ctx.strokeStyle = node.visited
        ? "hsl(185, 95%, 50%)"
        : "hsl(220, 15%, 25%)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw node ID
      ctx.fillStyle = "hsl(180, 100%, 98%)";
      ctx.font = "bold 16px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.id.toString(), node.x, node.y);
    });
  };

  useEffect(() => {
    drawGraph();
  }, [nodes, edges, currentNode, shortestPaths]);

  const runDijkstra = async () => {
    setIsAnimating(true);
    setIsPaused(false);
    const dist = nodes.map((n) => (n.id === sourceNode ? 0 : Infinity));
    const visited = nodes.map(() => false);
    const parent = nodes.map(() => -1);

    for (let count = 0; count < nodes.length - 1; count++) {
      if (!isAnimating) break;

      // Find minimum distance node
      let minDist = Infinity;
      let minNode = -1;
      for (let v = 0; v < nodes.length; v++) {
        if (!visited[v] && dist[v] < minDist) {
          minDist = dist[v];
          minNode = v;
        }
      }

      if (minNode === -1) break;

      setCurrentNode(minNode);
      visited[minNode] = true;

      setNodes((prev) =>
        prev.map((n) =>
          n.id === minNode
            ? { ...n, distance: dist[minNode], visited: true }
            : { ...n, distance: dist[n.id] }
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update distances
      for (let v = 0; v < nodes.length; v++) {
        const edge = edges.find(
          (e) =>
            (e.from === minNode && e.to === v) ||
            (e.to === minNode && e.from === v)
        );

        if (
          !visited[v] &&
          edge &&
          dist[minNode] !== Infinity &&
          dist[minNode] + edge.weight < dist[v]
        ) {
          dist[v] = dist[minNode] + edge.weight;
          parent[v] = minNode;

          setNodes((prev) =>
            prev.map((n) =>
              n.id === v
                ? { ...n, distance: dist[v], parent: minNode }
                : n
            )
          );
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Build paths
    const paths: number[][] = [];
    for (let i = 0; i < nodes.length; i++) {
      if (i !== sourceNode) {
        const path: number[] = [];
        let current = i;
        while (current !== -1) {
          path.unshift(current);
          current = parent[current];
        }
        paths.push(path);
      }
    }

    setShortestPaths(paths);
    setIsAnimating(false);
    setCurrentNode(null);
  };

  const handleReset = () => {
    setIsAnimating(false);
    setIsPaused(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    initializeGraph();
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex gap-4 items-center justify-center flex-wrap">
        <Button
          onClick={runDijkstra}
          disabled={isAnimating}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary"
        >
          <Play className="mr-2 h-4 w-4" />
          {t.runAlgorithm}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-border hover:bg-muted"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          {t.reset}
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              const langs: (keyof typeof translations)[] = ["en", "es", "fr", "de", "hi"];
              const currentIndex = langs.indexOf(language);
              const nextIndex = (currentIndex + 1) % langs.length;
              setLanguage(langs[nextIndex]);
            }}
            variant="outline"
            className="border-border hover:bg-muted"
            title="Switch Language"
          >
            <Languages className="mr-2 h-4 w-4" />
            {language.toUpperCase()}
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">{t.sourceNode}:</span>
          <select
            value={sourceNode}
            onChange={(e) => {
              setSourceNode(Number(e.target.value));
              handleReset();
            }}
            disabled={isAnimating}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {t.node} {node.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card className="p-8 bg-card border-border">
        <canvas
          ref={canvasRef}
          width={600}
          height={500}
          className="w-full max-w-[600px] mx-auto"
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold mb-4 text-primary">
            {t.nodeDistances}
          </h3>
          <div className="space-y-2 font-mono text-sm">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="flex justify-between items-center p-2 rounded bg-muted/30"
              >
                <span className="text-foreground">{t.node} {node.id}:</span>
                <span
                  className={
                    node.distance === Infinity
                      ? "text-muted-foreground"
                      : "text-primary font-semibold"
                  }
                >
                  {node.distance === Infinity ? "∞" : node.distance}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold mb-4 text-secondary">
            {t.shortestPaths}
          </h3>
          <div className="space-y-2 font-mono text-sm">
            {shortestPaths.length > 0 ? (
              shortestPaths.map((path, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-muted/30 text-foreground"
                >
                  {path.join(" → ")}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                {t.runToSee}
              </p>
            )}
          </div>
        </Card>
      </div>

      <Collapsible className="w-full">
        <Card className="p-6 bg-card border-border">
          <CollapsibleTrigger className="flex items-center justify-between w-full group">
            <h3 className="text-lg font-semibold text-accent flex items-center gap-2">
              <Code className="h-5 w-5" />
              {t.cCode}
            </h3>
            <span className="text-muted-foreground text-sm group-data-[state=open]:rotate-180 transition-transform">
              ▼
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <pre className="bg-background/50 p-4 rounded-lg overflow-x-auto border border-border">
              <code className="text-sm font-mono text-foreground">{cCode}</code>
            </pre>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};
