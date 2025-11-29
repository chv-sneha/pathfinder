import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Play, RotateCcw, MapPin, Truck } from "lucide-react";

interface Location {
  id: number;
  name: string;
  x: number;
  y: number;
  type: 'hospital' | 'emergency' | 'intersection';
}

const cityLocations: Location[] = [
  { id: 0, name: "City Hospital", x: 500, y: 400, type: 'hospital' },
  { id: 1, name: "Car Accident", x: 100, y: 100, type: 'emergency' },
  { id: 2, name: "Heart Attack", x: 150, y: 350, type: 'emergency' },
  { id: 3, name: "Fire Emergency", x: 400, y: 150, type: 'emergency' },
  { id: 4, name: "Main Junction", x: 250, y: 200, type: 'intersection' },
  { id: 5, name: "City Center", x: 350, y: 300, type: 'intersection' },
];

const roadNetwork = [
  [0, 8, 0, 0, 6, 0],
  [8, 0, 12, 0, 0, 10],
  [0, 12, 0, 15, 0, 4],
  [0, 0, 15, 0, 9, 0],
  [6, 0, 0, 9, 0, 7],
  [0, 10, 4, 0, 7, 0],
];

export const MapSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ambulancePos, setAmbulancePos] = useState({ x: 100, y: 100 });
  const [emergencyLocation, setEmergencyLocation] = useState(1);
  const [isMoving, setIsMoving] = useState(false);
  const [shortestPath, setShortestPath] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const drawMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw city background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw roads
    for (let i = 0; i < roadNetwork.length; i++) {
      for (let j = i + 1; j < roadNetwork[i].length; j++) {
        if (roadNetwork[i][j] > 0) {
          const from = cityLocations[i];
          const to = cityLocations[j];
          
          const isInPath = shortestPath.includes(i) && shortestPath.includes(j) &&
            Math.abs(shortestPath.indexOf(i) - shortestPath.indexOf(j)) === 1;

          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = isInPath ? "#00d4ff" : "#444";
          ctx.lineWidth = isInPath ? 6 : 3;
          ctx.stroke();

          // Draw travel time
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          ctx.fillStyle = "#fff";
          ctx.font = "12px Arial";
          ctx.fillText(`${roadNetwork[i][j]}min`, midX, midY);
        }
      }
    }

    // Draw locations
    cityLocations.forEach((location) => {
      ctx.beginPath();
      ctx.arc(location.x, location.y, 20, 0, 2 * Math.PI);
      
      if (location.type === 'hospital') {
        ctx.fillStyle = "#ff4757";
      } else if (location.type === 'emergency') {
        ctx.fillStyle = "#ffa502";
      } else {
        ctx.fillStyle = "#747d8c";
      }
      
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw location icon
      ctx.fillStyle = "#fff";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(location.id.toString(), location.x, location.y);
    });

    // Draw ambulance
    ctx.beginPath();
    ctx.arc(ambulancePos.x, ambulancePos.y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "#ff3838";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw ambulance cross
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ambulancePos.x - 8, ambulancePos.y);
    ctx.lineTo(ambulancePos.x + 8, ambulancePos.y);
    ctx.moveTo(ambulancePos.x, ambulancePos.y - 8);
    ctx.lineTo(ambulancePos.x, ambulancePos.y + 8);
    ctx.stroke();
  };

  useEffect(() => {
    drawMap();
  }, [ambulancePos, shortestPath, currentStep]);

  const dijkstra = (start: number, end: number) => {
    const dist = Array(cityLocations.length).fill(Infinity);
    const visited = Array(cityLocations.length).fill(false);
    const parent = Array(cityLocations.length).fill(-1);
    
    dist[start] = 0;

    for (let count = 0; count < cityLocations.length - 1; count++) {
      let minDist = Infinity;
      let minNode = -1;
      
      for (let v = 0; v < cityLocations.length; v++) {
        if (!visited[v] && dist[v] < minDist) {
          minDist = dist[v];
          minNode = v;
        }
      }

      if (minNode === -1) break;
      visited[minNode] = true;

      for (let v = 0; v < cityLocations.length; v++) {
        if (!visited[v] && roadNetwork[minNode][v] > 0 && 
            dist[minNode] + roadNetwork[minNode][v] < dist[v]) {
          dist[v] = dist[minNode] + roadNetwork[minNode][v];
          parent[v] = minNode;
        }
      }
    }

    // Build path
    const path = [];
    let current = end;
    while (current !== -1) {
      path.unshift(current);
      current = parent[current];
    }
    
    return { path, distance: dist[end] };
  };

  const startEmergencyResponse = async () => {
    setIsMoving(true);
    const result = dijkstra(emergencyLocation, 0); // From emergency TO hospital
    setShortestPath(result.path);
    
    // Start ambulance at emergency location
    const startLocation = cityLocations[emergencyLocation];
    setAmbulancePos({ x: startLocation.x, y: startLocation.y });
    
    // Animate ambulance movement
    for (let i = 1; i < result.path.length; i++) {
      const from = cityLocations[result.path[i - 1]];
      const to = cityLocations[result.path[i]];
      
      const steps = 30;
      for (let step = 0; step <= steps; step++) {
        const progress = step / steps;
        const x = from.x + (to.x - from.x) * progress;
        const y = from.y + (to.y - from.y) * progress;
        
        setAmbulancePos({ x, y });
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      setCurrentStep(i);
    }
    
    setIsMoving(false);
  };

  const resetSimulation = () => {
    const startLocation = cityLocations[emergencyLocation];
    setAmbulancePos({ x: startLocation.x, y: startLocation.y });
    setShortestPath([]);
    setCurrentStep(0);
    setIsMoving(false);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex gap-4 items-center justify-center flex-wrap">
        <Button
          onClick={startEmergencyResponse}
          disabled={isMoving}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold"
        >
          <Truck className="mr-2 h-4 w-4" />
          Rush to Hospital
        </Button>
        <Button
          onClick={resetSimulation}
          variant="outline"
          className="border-border hover:bg-muted"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">Emergency Location:</span>
          <select
            value={emergencyLocation}
            onChange={(e) => {
              setEmergencyLocation(Number(e.target.value));
              const newLocation = cityLocations[Number(e.target.value)];
              setAmbulancePos({ x: newLocation.x, y: newLocation.y });
            }}
            disabled={isMoving}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {cityLocations.filter(loc => loc.type === 'emergency').map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
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
          className="w-full max-w-[600px] mx-auto border border-border rounded-lg"
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-card border-border">
          <h3 className="text-lg font-semibold mb-3 text-red-500 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Hospital
          </h3>
          <p className="text-sm text-muted-foreground">Destination - Emergency treatment facility</p>
        </Card>

        <Card className="p-4 bg-card border-border">
          <h3 className="text-lg font-semibold mb-3 text-orange-500 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Emergency Sites
          </h3>
          <p className="text-sm text-muted-foreground">Patient pickup locations - ambulance starts here</p>
        </Card>

        <Card className="p-4 bg-card border-border">
          <h3 className="text-lg font-semibold mb-3 text-gray-500 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Intersections
          </h3>
          <p className="text-sm text-muted-foreground">Traffic intersections and route waypoints</p>
        </Card>
      </div>
    </div>
  );
};