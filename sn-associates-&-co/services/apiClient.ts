import config from './config';

/**
 * Standardized API client for SN Associates & Co.
 * Handles base URL, credentials for HttpOnly cookies, and global error handling.
 */

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

export class APIClient {
    private static baseUrl = config.apiUrl;

    private static async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { params, ...fetchOptions } = options;
        
        let url = `${this.baseUrl}${endpoint}`;
        if (params) {
            const query = new URLSearchParams(params).toString();
            url += `?${query}`;
        }

        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        const response = await fetch(url, {
            ...fetchOptions,
            headers: {
                ...defaultHeaders,
                ...fetchOptions.headers,
            },
            credentials: 'include', // Important for HttpOnly cookies
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const error = new Error(data.error || `HTTP error! status: ${response.status}`);
            (error as any).status = response.status;
            (error as any).data = data;
            throw error;
        }

        return data as T;
    }

    static get<T>(endpoint: string, params?: Record<string, string>) {
        return this.request<T>(endpoint, { method: 'GET', params });
    }

    static post<T>(endpoint: string, body?: any) {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    static put<T>(endpoint: string, body?: any) {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    static delete<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}
