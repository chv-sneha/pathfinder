import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { RotateCcw, MapPin, Truck, Navigation } from "lucide-react";

interface Location {
  id: number;
  name: string;
  x: number;
  y: number;
  type: 'hospital' | 'emergency' | 'intersection';
}

interface Road {
  from: number;
  to: number;
  name: string;
  distance: number;
  traffic: 'low' | 'medium' | 'high';
  actualTime: number;
}

const cityLocations: Location[] = [
  { id: 0, name: "General Hospital", x: 480, y: 380, type: 'hospital' },
  { id: 1, name: "Highway Accident", x: 80, y: 120, type: 'emergency' },
  { id: 2, name: "Downtown Emergency", x: 180, y: 320, type: 'emergency' },
  { id: 3, name: "Mall Incident", x: 420, y: 180, type: 'emergency' },
  { id: 4, name: "Main St & 5th Ave", x: 200, y: 200, type: 'intersection' },
  { id: 5, name: "Central Plaza", x: 320, y: 280, type: 'intersection' },
  { id: 6, name: "Bridge Junction", x: 380, y: 120, type: 'intersection' },
  { id: 7, name: "Park Avenue", x: 280, y: 380, type: 'intersection' },
];

const cityRoads: Road[] = [
  { from: 0, to: 5, name: "Hospital Rd", distance: 3.2, traffic: 'low', actualTime: 4 },
  { from: 0, to: 7, name: "Medical Ave", distance: 2.8, traffic: 'medium', actualTime: 6 },
  { from: 1, to: 4, name: "Highway 101", distance: 4.1, traffic: 'high', actualTime: 12 },
  { from: 1, to: 6, name: "Express Way", distance: 5.2, traffic: 'medium', actualTime: 8 },
  { from: 2, to: 4, name: "Main Street", distance: 1.8, traffic: 'high', actualTime: 8 },
  { from: 2, to: 7, name: "Downtown Blvd", distance: 2.1, traffic: 'medium', actualTime: 5 },
  { from: 3, to: 5, name: "Mall Drive", distance: 2.4, traffic: 'low', actualTime: 3 },
  { from: 3, to: 6, name: "Commerce St", distance: 1.2, traffic: 'low', actualTime: 2 },
  { from: 4, to: 5, name: "5th Avenue", distance: 2.8, traffic: 'medium', actualTime: 6 },
  { from: 4, to: 6, name: "Cross Town", distance: 3.5, traffic: 'high', actualTime: 10 },
  { from: 5, to: 6, name: "Central Way", distance: 1.8, traffic: 'low', actualTime: 3 },
  { from: 5, to: 7, name: "Plaza Street", distance: 1.5, traffic: 'medium', actualTime: 4 },
  { from: 6, to: 7, name: "Bridge Road", distance: 2.9, traffic: 'medium', actualTime: 5 },
];

export const GoogleMapsSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ambulancePos, setAmbulancePos] = useState({ x: 80, y: 120 });
  const [emergencyLocation, setEmergencyLocation] = useState(1);
  const [isMoving, setIsMoving] = useState(false);
  const [shortestPath, setShortestPath] = useState<number[]>([]);
  const [routeInfo, setRouteInfo] = useState({ distance: 0, time: 0 });

  const drawMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Google Maps-like background
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw city blocks
    ctx.fillStyle = "#e8e8e8";
    for (let x = 50; x < canvas.width; x += 120) {
      for (let y = 50; y < canvas.height; y += 100) {
        ctx.fillRect(x, y, 80, 60);
      }
    }

    // Draw roads with traffic
    cityRoads.forEach((road) => {
      const from = cityLocations[road.from];
      const to = cityLocations[road.to];
      
      const isInPath = shortestPath.includes(road.from) && shortestPath.includes(road.to) &&
        Math.abs(shortestPath.indexOf(road.from) - shortestPath.indexOf(road.to)) === 1;

      // Road base
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 12;
      ctx.stroke();

      // Traffic overlay
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      
      if (isInPath) {
        ctx.strokeStyle = "#1e90ff";
        ctx.lineWidth = 8;
      } else {
        switch (road.traffic) {
          case 'low': ctx.strokeStyle = "#4CAF50"; break;
          case 'medium': ctx.strokeStyle = "#FF9800"; break;
          case 'high': ctx.strokeStyle = "#F44336"; break;
        }
        ctx.lineWidth = 6;
      }
      ctx.stroke();

      // Road info
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      ctx.fillStyle = "#333";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(road.name, midX, midY - 8);
      ctx.fillText(`${road.actualTime}min`, midX, midY + 8);
    });

    // Draw locations
    cityLocations.forEach((location) => {
      if (location.type === 'hospital') {
        ctx.fillStyle = "#dc2626";
        ctx.beginPath();
        ctx.arc(location.x, location.y, 15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("H", location.x, location.y);
      } else if (location.type === 'emergency') {
        ctx.fillStyle = "#ea580c";
        ctx.beginPath();
        ctx.arc(location.x, location.y, 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("!", location.x, location.y);
      } else {
        ctx.fillStyle = "#6b7280";
        ctx.beginPath();
        ctx.arc(location.x, location.y, 8, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      ctx.fillStyle = "#000";
      ctx.font = "11px Arial";
      ctx.textAlign = "center";
      ctx.fillText(location.name, location.x, location.y + 25);
    });

    // Draw ambulance
    ctx.fillStyle = "#ff3838";
    ctx.beginPath();
    ctx.arc(ambulancePos.x, ambulancePos.y, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Ambulance cross
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
  }, [ambulancePos, shortestPath]);

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

      cityRoads.forEach(road => {
        let neighbor = -1;
        if (road.from === minNode) neighbor = road.to;
        else if (road.to === minNode) neighbor = road.from;
        
        if (neighbor !== -1 && !visited[neighbor]) {
          const newDist = dist[minNode] + road.actualTime;
          if (newDist < dist[neighbor]) {
            dist[neighbor] = newDist;
            parent[neighbor] = minNode;
          }
        }
      });
    }

    const path = [];
    let current = end;
    while (current !== -1) {
      path.unshift(current);
      current = parent[current];
    }
    
    return { path, distance: dist[end] };
  };

  const startNavigation = async () => {
    setIsMoving(true);
    const result = dijkstra(emergencyLocation, 0);
    setShortestPath(result.path);
    setRouteInfo({ distance: result.distance, time: result.distance });
    
    const startLocation = cityLocations[emergencyLocation];
    setAmbulancePos({ x: startLocation.x, y: startLocation.y });
    
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
    }
    
    setIsMoving(false);
  };

  const resetSimulation = () => {
    const startLocation = cityLocations[emergencyLocation];
    setAmbulancePos({ x: startLocation.x, y: startLocation.y });
    setShortestPath([]);
    setRouteInfo({ distance: 0, time: 0 });
    setIsMoving(false);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex gap-4 items-center justify-center flex-wrap">
        <Button
          onClick={startNavigation}
          disabled={isMoving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          <Navigation className="mr-2 h-4 w-4" />
          Start Navigation
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
          <span className="text-sm text-muted-foreground">Emergency:</span>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm font-medium">Light Traffic</span>
          </div>
          <p className="text-xs text-gray-600">Normal speed roads</p>
        </Card>

        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm font-medium">Medium Traffic</span>
          </div>
          <p className="text-xs text-gray-600">Slower than usual</p>
        </Card>

        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm font-medium">Heavy Traffic</span>
          </div>
          <p className="text-xs text-gray-600">Significant delays</p>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm font-medium">Optimal Route</span>
          </div>
          <p className="text-xs text-gray-600">{routeInfo.time}min ETA</p>
        </Card>
      </div>
    </div>
  );
};