import { GraphVisualizer } from "@/components/GraphVisualizer";
import { GoogleMapsSimulation } from "@/components/GoogleMapsSimulation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Navigation, AlertCircle, Play, Map } from "lucide-react";
import { useState, useEffect } from "react";
import { apiService } from "@/services/api";

const Index = () => {
  const [backendStatus, setBackendStatus] = useState<string>('checking');
  const [apiData, setApiData] = useState<any>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const health = await apiService.checkHealth();
        setBackendStatus('connected');
        const graph = await apiService.getGraph();
        const nodes = await apiService.getNodes();
        setApiData({ graph, nodes });
      } catch (error) {
        setBackendStatus('disconnected');
      }
    };
    checkBackend();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-border h-screen">
        <video 
          className="absolute inset-0 w-full h-full object-cover" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center space-y-8 animate-slide-in px-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-mono glow-primary backdrop-blur-sm">
              <Zap className="h-4 w-4" />
              <span>Smart City Emergency Routing</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
              <span className="text-white">Dijkstra's</span>
              <br />
              <span className="text-blue-400" style={{textShadow: '0 0 8px #60a5fa, 1px 1px 0 #1e40af, -1px -1px 0 #1e40af, 1px -1px 0 #1e40af, -1px 1px 0 #1e40af'}}>
                Shortest Path
              </span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Real-time optimal route calculation for emergency vehicles using advanced graph algorithms
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Algorithm Explanation */}
        <Card className="p-8 bg-card border-border">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Dijkstra's Algorithm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Algorithm Concept</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dijkstra's algorithm finds the shortest path between nodes in a weighted graph. It works by maintaining a set of unvisited nodes and continuously selecting the node with the minimum distance, then updating distances to its neighbors.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The algorithm guarantees optimal solutions for graphs with non-negative edge weights, making it perfect for routing applications like GPS navigation and emergency response systems.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary">Efficiency & Complexity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 rounded bg-muted/30">
                  <span className="text-foreground font-medium">Time Complexity:</span>
                  <span className="text-primary font-mono">O((V + E) log V)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-muted/30">
                  <span className="text-foreground font-medium">Space Complexity:</span>
                  <span className="text-primary font-mono">O(V)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-muted/30">
                  <span className="text-foreground font-medium">Best for:</span>
                  <span className="text-secondary">Dense graphs</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                V = vertices (nodes), E = edges (connections)
              </p>
            </div>
          </div>
        </Card>

        {/* Interactive Visualizations */}
        <section className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-foreground">Emergency Response Simulation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how Dijkstra's algorithm finds the fastest route for ambulances rushing patients to the hospital
            </p>
          </div>
          
          <Tabs defaultValue="algorithm" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="algorithm" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Algorithm
              </TabsTrigger>
              <TabsTrigger value="simulation" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                Ambulance Route
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="algorithm" className="mt-6">
              <GraphVisualizer />
            </TabsContent>
            
            <TabsContent value="simulation" className="mt-6">
              <GoogleMapsSimulation />
            </TabsContent>
          </Tabs>
        </section>

        {/* Algorithm Info */}
        <Card className="p-8 bg-card border-border">
          <h2 className="text-2xl font-bold mb-6 text-foreground">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Algorithm Steps</h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-mono text-xs">1</span>
                  <span>Initialize all distances to infinity except source node (set to 0)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-mono text-xs">2</span>
                  <span>Select unvisited node with minimum distance</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-mono text-xs">3</span>
                  <span>Update distances of neighboring nodes if a shorter path is found</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-mono text-xs">4</span>
                  <span>Mark current node as visited and repeat until all nodes are processed</span>
                </li>
              </ol>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary">Legend</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emergency border-2 border-emergency" />
                  <span className="text-muted-foreground">Source Node (Emergency Station)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary border-2 border-primary" />
                  <span className="text-muted-foreground">Visited Node</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent border-2 border-accent" />
                  <span className="text-muted-foreground">Current Processing Node</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-1 bg-primary rounded" />
                  <span className="text-muted-foreground">Shortest Path</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          <p className="font-mono">Design and Analysis of Algorithms Project</p>
          <p className="mt-2">Built with React, TypeScript & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
