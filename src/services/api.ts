import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ShortestPathResult {
  distance: number;
  path: string[];
  allDistances: Record<string, number>;
}

export interface Node {
  id: string;
  label: string;
  connections: number;
}

export const apiService = {
  // Health check
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Get graph data
  getGraph: async () => {
    const response = await api.get('/graph');
    return response.data;
  },

  // Calculate shortest path
  getShortestPath: async (start: string, end: string): Promise<ShortestPathResult> => {
    const response = await api.post('/shortest-path', { start, end });
    return response.data;
  },

  // Get all nodes
  getNodes: async (): Promise<{ nodes: Node[] }> => {
    const response = await api.get('/nodes');
    return response.data;
  },
};

export default apiService;