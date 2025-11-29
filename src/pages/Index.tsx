import { GraphVisualizer } from "@/components/GraphVisualizer";
import { Card } from "@/components/ui/card";
import { Zap, Navigation, AlertCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="text-center space-y-6 animate-slide-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-mono glow-primary">
              <Zap className="h-4 w-4" />
              <span>Smart City Emergency Routing</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
              <span className="text-foreground">Dijkstra's</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-tech-blue to-secondary bg-clip-text text-transparent">
                Shortest Path
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Real-time optimal route calculation for emergency vehicles using advanced graph algorithms
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 group">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-emergency/20 border border-emergency/30 group-hover:glow-emergency transition-all">
                <AlertCircle className="h-6 w-6 text-emergency" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Emergency Response</h3>
                <p className="text-sm text-muted-foreground">
                  Minimize response time for ambulances, fire engines, and police vehicles
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 group">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/20 border border-primary/30 group-hover:glow-primary transition-all">
                <Navigation className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Optimal Routing</h3>
                <p className="text-sm text-muted-foreground">
                  Calculate shortest paths dynamically based on real-time traffic conditions
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 group">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/20 border border-accent/30 group-hover:glow-accent transition-all">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Efficient Algorithm</h3>
                <p className="text-sm text-muted-foreground">
                  O(E log V) time complexity with priority queue implementation
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Graph Visualizer */}
        <section className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-foreground">Interactive Visualization</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Watch the algorithm in action as it explores the graph and finds optimal paths
            </p>
          </div>
          <GraphVisualizer />
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
