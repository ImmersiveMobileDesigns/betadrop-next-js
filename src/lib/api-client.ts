// Client-side API client for static export
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchFromLaravel<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  // Always use absolute URL since we are in static export mode (no rewrites)
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // If path already contains http, use it as is, otherwise append to API_BASE_URL
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${cleanPath}`;

  const headers = new Headers(options.headers);

  // Default headers
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Ensure we accept JSON
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      // Important: include credentials (cookies) for CORS requests to backend
      credentials: 'include',
      cache: options.cache || 'no-store',
    });

    if (!response.ok) {
       // Log error details for debugging
       console.error(`Status: ${response.status} for ${url}`);
       try {
         const errorBody = await response.text();
         console.error('Error body:', errorBody);
       } catch {}
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch from Laravel (${url}):`, error);
    throw error;
  }
}
