export interface LoftyLead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  pipeline_stage: string;
  assigned_agent_id: string;
  source: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface LoftyActivity {
  id: string;
  lead_id: string;
  type: 'email' | 'sms' | 'call' | 'note' | 'task';
  content: string;
  timestamp: string;
  direction: 'inbound' | 'outbound';
  [key: string]: any;
}

export interface LoftyApiResponse<T> {
  data: T;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
