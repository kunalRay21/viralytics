const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options?.headers || {})
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      let errorCode = 'API_ERROR';
      let errorMessage = 'An error occurred during communication';
      
      try {
        const errorData = await response.json();
        if (errorData?.error) {
          errorCode = errorData.error.code || errorCode;
          errorMessage = errorData.error.message || errorMessage;
        }
      } catch {
        // Fallback for non-JSON error payloads
      }
      
      throw new ApiError(errorMessage, errorCode, response.status);
    }
    
    return (await response.json()) as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || 'Network connectivity issue', 'NETWORK_FAILURE', 0);
  }
}

export const apiService = {
  async getDashboard(): Promise<any> {
    return request<any>('/dashboard');
  },

  async analyzeVideo(filename: string, sizeBytes: number, durationSeconds?: number): Promise<any> {
    return request<any>('/analyze', {
      method: 'POST',
      body: JSON.stringify({ filename, sizeBytes, durationSeconds })
    });
  },

  async getAnalysis(id: string): Promise<any> {
    return request<any>(`/analysis/${id}`);
  },

  async simulateAnalysis(analysisId: string, adjustments: any): Promise<any> {
    return request<any>('/simulate', {
      method: 'POST',
      body: JSON.stringify({ analysisId, adjustments })
    });
  },

  async analyzeCaption(caption: string): Promise<any> {
    return request<any>('/caption/analyze', {
      method: 'POST',
      body: JSON.stringify({ caption })
    });
  },

  async generateCaptions(category: string): Promise<any> {
    return request<any>('/caption/generate', {
      method: 'POST',
      body: JSON.stringify({ category })
    });
  },

  async getTrends(): Promise<any> {
    return request<any>('/trends');
  }
};
