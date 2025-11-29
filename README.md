# Pathfinder Pro - Dijkstra's Algorithm Visualizer

A modern, interactive web application that visualizes Dijkstra's shortest path algorithm with real-world emergency response scenarios.

## 🚀 Features

### Interactive Visualizations
- **Algorithm Visualization**: Watch Dijkstra's algorithm find shortest paths step-by-step
- **Emergency Response Simulation**: See ambulances navigate city streets using optimal routing
- **Custom Graph Builder**: Create your own graphs and test the algorithm

### Code Examples
- **Multiple Languages**: View implementation in C, Python, Java, and JavaScript
- **Copy to Clipboard**: Easy code sharing and learning
- **Syntax Highlighting**: Clean, readable code display

### Educational Content
- **Algorithm Explanation**: Comprehensive breakdown of how Dijkstra's algorithm works
- **Complexity Analysis**: Time and space complexity with clear notation
- **Real-world Applications**: GPS navigation, emergency response, network routing

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Node.js, Express.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom animations

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pathfinder-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Frontend: `http://localhost:8080`
   - Backend API: `http://localhost:3001`

## 🎯 How to Use

### Algorithm Visualization
1. Click the **Algorithm** tab
2. Select source and target nodes
3. Click **Run Algorithm** to see the visualization
4. Use **Custom Graph** to build your own network

### Emergency Response Simulation
1. Click the **Ambulance Route** tab
2. Select an emergency location
3. Click **Start Navigation** to see optimal routing
4. Watch the ambulance navigate through traffic

### Custom Graph Builder
1. Click **Custom Graph** button
2. Add nodes: Type number, click "Add Node"
3. Connect nodes: Enter From, To, Distance, click "Add Edge"
4. Select source and target nodes
5. Run the algorithm on your custom graph

## 📚 Algorithm Details

**Dijkstra's Algorithm** finds the shortest path between nodes in a weighted graph with non-negative edge weights.

### Complexity
- **Time Complexity**: O((V + E) log V) with priority queue
- **Space Complexity**: O(V)
- **Best for**: Dense graphs, single-source shortest path

### Applications
- GPS Navigation Systems
- Network Routing Protocols
- Emergency Response Planning
- Social Network Analysis
- Game AI Pathfinding

## 🏗️ Project Structure

```
pathfinder-pro/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── GraphVisualizer.tsx # Algorithm visualization
│   │   ├── GoogleMapsSimulation.tsx # Emergency routing
│   │   └── CodeViewer.tsx      # Multi-language code display
│   ├── pages/
│   │   └── Index.tsx           # Main application page
│   ├── services/
│   │   └── api.ts              # Backend API integration
│   └── main.tsx                # Application entry point
├── server/
│   └── index.js                # Express backend server
├── public/
│   └── video.mp4               # Demo video
└── package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run client` - Start only frontend (Vite)
- `npm run server` - Start only backend (Express)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 Customization

### Adding New Algorithms
1. Create a new component in `src/components/`
2. Implement the algorithm logic
3. Add visualization using HTML5 Canvas
4. Include in the main tabs interface

### Styling
- Uses Tailwind CSS for styling
- Custom animations and effects
- Dark/light theme support via shadcn/ui
- Responsive design for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern React and TypeScript
- UI components from shadcn/ui
- Icons from Lucide React
- Inspired by educational algorithm visualization tools

---

**Pathfinder Pro** - Making algorithms visual, interactive, and educational! 🎓✨