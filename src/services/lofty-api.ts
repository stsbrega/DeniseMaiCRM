import { RateLimiter } from '@/lib/rate-limiter';
import { LoftyLead, LoftyActivity, LoftyApiResponse } from '@/types/lofty';

const LOFTY_API_BASE_URL = process.env.LOFTY_API_BASE_URL || 'https://api.lofty.com';
const LOFTY_API_KEY = process.env.LOFTY_API_KEY;

// Dev limit: 100/min, Prod limit: 500/min
const REQUESTS_PER_MINUTE = process.env.NODE_ENV === 'production' ? 500 : 100;
const rateLimiter = new RateLimiter(REQUESTS_PER_MINUTE);

export class LoftyApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!LOFTY_API_KEY) {
      throw new Error('LOFTY_API_KEY is not configured');
    }

    await rateLimiter.wait();

    const response = await fetch(`${LOFTY_API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${LOFTY_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Lofty API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    return response.json();
  }

  async getLeads(params: Record<string, any> = {}): Promise<LoftyApiResponse<LoftyLead[]>> {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/v1.0/leads${queryString ? `?${queryString}` : ''}`;
    return this.request<LoftyApiResponse<LoftyLead[]>>(endpoint);
  }

  async getLeadById(id: string): Promise<LoftyLead> {
    return this.request<LoftyLead>(`/v1.0/leads/${id}`);
  }

  async getLeadActivities(id: string): Promise<LoftyActivity[]> {
    return this.request<LoftyActivity[]>(`/v2.0/leads/${id}/activities`);
  }

  async updateLead(id: string, data: Partial<LoftyLead>): Promise<LoftyLead> {
    return this.request<LoftyLead>(`/v1.0/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const loftyApiService = new LoftyApiService();
