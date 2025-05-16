import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface CADGenerationResponse {
  model: any; // TODO: Define proper type for CAD model
  metadata: {
    format: string;
    size: number;
    createdAt: string;
  };
}

export const cadService = {
  async generateModel(prompt: string): Promise<CADGenerationResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate`, { prompt });
      return response.data;
    } catch (error) {
      console.error('Error generating CAD model:', error);
      throw error;
    }
  },

  async downloadModel(modelId: string): Promise<Blob> {
    try {
      const response = await axios.get(`${API_BASE_URL}/download/${modelId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading CAD model:', error);
      throw error;
    }
  }
}; 