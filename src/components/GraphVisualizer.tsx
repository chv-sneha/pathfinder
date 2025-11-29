import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Play, RotateCcw, Pause, Code } from "lucide-react";
import { CodeViewer } from "./CodeViewer";

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

export const GraphVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [sourceNode, setSourceNode] = useState(0);
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [shortestPaths, setShortestPaths] = useState<number[][]>([]);
  const [showCode, setShowCode] = useState(false);
  const [showCustomGraph, setShowCustomGraph] = useState(false);
  const [targetNode, setTargetNode] = useState(5);
  const animationRef = useRef<number>();

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

    // Build path to target node only
    const path: number[] = [];
    let current = targetNode;
    while (current !== -1) {
      path.unshift(current);
      current = parent[current];
    }

    setShortestPaths([path]);
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

  const addCustomNode = (nodeId: number) => {
    const x = 150 + (nodeId % 3) * 200;
    const y = 100 + Math.floor(nodeId / 3) * 150;
    
    setNodes(prev => [...prev, {
      id: nodeId,
      x,
      y,
      distance: nodeId === sourceNode ? 0 : Infinity,
      visited: false,
      parent: null
    }]);
  };

  const addCustomEdge = (from: number, to: number, weight: number) => {
    const fromExists = nodes.find(n => n.id === from);
    const toExists = nodes.find(n => n.id === to);
    
    if (fromExists && toExists) {
      setEdges(prev => [...prev, { from, to, weight }]);
    }
  };

  const clearCustomGraph = () => {
    setNodes([]);
    setEdges([]);
    setShortestPaths([]);
    setCurrentNode(null);
  };

  return (
    <div className="w-full space-y-6">
      {showCustomGraph && (
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-bold mb-4 text-foreground">Create Your Own Graph</h3>
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">How to use:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. First add nodes: Type 0, click Add, type 1, click Add, etc.</li>
                <li>2. Then connect them: From=0, To=1, Distance=5, click Add</li>
                <li>3. Choose Source and Target nodes below</li>
                <li>4. Click "Run Algorithm" to find shortest path</li>
              </ol>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-primary">Step 1: Add Nodes</h4>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="0"
                    className="bg-card border border-border rounded px-3 py-2 text-sm w-16"
                    id="nodeInput"
                  />
                  <Button
                    onClick={() => {
                      const input = document.getElementById('nodeInput') as HTMLInputElement;
                      const nodeId = parseInt(input.value);
                      if (!isNaN(nodeId) && !nodes.find(n => n.id === nodeId)) {
                        addCustomNode(nodeId);
                        input.value = '';
                      }
                    }}
                    size="sm"
                  >
                    Add Node
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Example: Type 0, click Add, then 1, click Add, etc.</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-secondary">Step 2: Connect Nodes</h4>
                <div className="flex gap-2 items-center flex-wrap">
                  <input
                    type="number"
                    placeholder="From"
                    className="bg-card border border-border rounded px-3 py-2 text-sm w-16"
                    id="fromNode"
                  />
                  <span className="text-xs">→</span>
                  <input
                    type="number"
                    placeholder="To"
                    className="bg-card border border-border rounded px-3 py-2 text-sm w-16"
                    id="toNode"
                  />
                  <input
                    type="number"
                    placeholder="Distance"
                    className="bg-card border border-border rounded px-3 py-2 text-sm w-20"
                    id="weight"
                  />
                  <Button
                    onClick={() => {
                      const from = parseInt((document.getElementById('fromNode') as HTMLInputElement).value);
                      const to = parseInt((document.getElementById('toNode') as HTMLInputElement).value);
                      const weight = parseInt((document.getElementById('weight') as HTMLInputElement).value);
                      if (!isNaN(from) && !isNaN(to) && !isNaN(weight)) {
                        addCustomEdge(from, to, weight);
                        (document.getElementById('fromNode') as HTMLInputElement).value = '';
                        (document.getElementById('toNode') as HTMLInputElement).value = '';
                        (document.getElementById('weight') as HTMLInputElement).value = '';
                      }
                    }}
                    size="sm"
                  >
                    Add Edge
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Example: From=0, To=1, Distance=5, click Add</p>
                <Button
                  onClick={clearCustomGraph}
                  variant="outline"
                  size="sm"
                  className="text-xs mt-2"
                >
                  Start Over
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="flex gap-4 items-center justify-center flex-wrap">
        <Button
          onClick={runDijkstra}
          disabled={isAnimating}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary"
        >
          <Play className="mr-2 h-4 w-4" />
          Run Algorithm
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-border hover:bg-muted"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button
          onClick={() => setShowCode(!showCode)}
          variant="outline"
          className="border-border hover:bg-muted"
        >
          <Code className="mr-2 h-4 w-4" />
          {showCode ? 'Hide Code' : 'View Code'}
        </Button>
        <Button
          onClick={() => setShowCustomGraph(!showCustomGraph)}
          variant="outline"
          className="border-border hover:bg-muted"
        >
          <Play className="mr-2 h-4 w-4" />
          {showCustomGraph ? 'Hide Builder' : 'Custom Graph'}
        </Button>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">Source:</span>
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
                {node.id}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">Target:</span>
          <select
            value={targetNode}
            onChange={(e) => setTargetNode(Number(e.target.value))}
            disabled={isAnimating}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.id}
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
            Node Distances
          </h3>
          <div className="space-y-2 font-mono text-sm">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="flex justify-between items-center p-2 rounded bg-muted/30"
              >
                <span className="text-foreground">Node {node.id}:</span>
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
            Shortest Paths
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
                Run the algorithm to see shortest paths
              </p>
            )}
          </div>
        </Card>
      </div>
      
      {showCode && (
        <div className="mt-6 w-full">
          <CodeViewer />
        </div>
      )}
      

    </div>
  );
};
