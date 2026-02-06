export interface User {
  id: string;
  email: string;
  plan: string;
  api_keys: string[];
  created_at: string;
}

export interface Domain {
  id: string;
  user_id: string;
  domain: string;
  verified: boolean;
  settings: DomainSettings;
  created_at: string;
  updated_at: string;
}

export interface DomainSettings {
  anonymize_ip: boolean;
  rate_limit: number;
  track_query_params: boolean;
  session_timeout: number;
  timezone: string;
}

export interface APIKey {
  id: string;
  user_id: string;
  key: string;
  domain_ids: string[];
  revoked: boolean;
  created_at: string;
}

export interface RealtimeStats {
  active_visitors: number;
  hits_per_minute: HitsPerMinute[];
  top_pages: PageStats[];
  top_referrers: ReferrerStats[];
  countries: Record<string, number>;
  devices: Record<string, number>;
  browsers: Record<string, number>;
}

export interface HitsPerMinute {
  minute: string;
  hits: number;
}

export interface PageStats {
  path: string;
  hits: number;
}

export interface ReferrerStats {
  referrer: string;
  hits: number;
}

export interface OverviewStats {
  total_hits: number;
  unique_visitors: number;
  avg_session_time: number;
  bounce_rate: number;
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: User;
}

export interface TrackEventRequest {
  path: string;
  referrer?: string;
  user_agent?: string;
  visitor_id: string;
}

export interface TrackEventResponse {
  status: string;
}
