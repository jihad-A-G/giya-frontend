// API client utility for making requests to the Express backend

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchFromBackend(endpoint: string, options?: RequestInit) {
  const url = `${API_URL}${endpoint}`;
  
  // Get token from localStorage if available (for client-side requests)
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token exists
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  };

  const response = await fetch(url, config);
  return response;
}

// Helper function to make authenticated requests
export async function fetchWithAuth(endpoint: string, options?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  return fetchFromBackend(endpoint, {
    ...options,
    headers: {
      ...options?.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
}

// Helper function to get auth headers for frontend requests
export function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
    };
  }
  
  return {};
}
