export type PersonaType = string;

export interface Location {
  name: string;
  state?: string;
  country?: string;
  lat: number;
  lon: number;
  timezone?: string;
  timezone_abbreviation?: string;
  elevation?: number;
}

interface CurrentWeather {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  wind_gust?: number;
  precipitation: number;
  precipitation_probability: number;
  uv_index: number;
  aqi: number;
  aqi_category: string;
  pm2_5?: number;
  pm10?: number;
  visibility: number;
  visibility_category?: string;
  visibility_available?: boolean;
  pressure: number;
  condition_code: number;
  condition_text: string;
  is_day: boolean;
  observation_time: string;
  sunrise: string;
  sunset: string;
  daylight_duration?: string;
}

export interface HourlyForecast {
  time: string;
  hour: number;
  temperature: number;
  feels_like: number;
  precipitation_probability: number;
  precipitation: number;
  humidity: number;
  wind_speed: number;
  uv_index: number;
  aqi: number;
  visibility?: number;
  condition_code: number;
  condition_text: string;
  is_day: boolean;
}

export interface DailyForecast {
  date: string;
  day_name: string;
  temp_max: number;
  temp_min: number;
  precipitation_probability: number;
  precipitation_sum: number;
  condition_code: number;
  condition_text: string;
  uv_index_max: number;
  sunrise: string;
  sunset: string;
  daylight_duration_seconds?: number;
  daylight_duration?: string;
}

export interface SevereWeatherAlert {
  id: string;
  severity: "advisory" | "watch" | "warning" | "emergency";
  title: string;
  description: string;
  impact_level: string;
  affected_area: string;
  effective_from: string;
  effective_to: string;
  source: string;
}

export interface MarineData {
  is_coastal: boolean;
  wave_height_meters?: number;
  tide_type?: string;
  tide_height_meters?: number;
  next_tide_time?: string;
  sea_surface_temp?: number;
  sea_condition?: string;
  fishermen_warning: boolean;
  coastal_advisory?: string;
}

export interface WeatherResponse {
  location: Location;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts: SevereWeatherAlert[];
  marine?: MarineData | null;
  provider: string;
  cached?: boolean;
  simulated_scenario?: string | null;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date?: string;
  start_hour: number;
  end_hour: number;
  is_outdoor: boolean;
  location_name?: string;
  notes?: string;
}

export interface UserRoleDetails {
  running?: any;
  travel?: any;
  family?: any;
  gardening?: any;
  beach?: any;
  health?: any;
  event_planning?: any;
}

export interface UserContext {
  name: string;
  is_personalized: boolean;
  interests: string[];
  priorities: string[];
  sensitivities?: string[];
  calendar_events?: CalendarEvent[];
  role_details?: UserRoleDetails;
}

export interface KrishiIntelligence {
  spray_conditions: string;
  spray_score: number;
  soil_moisture_estimate: string;
  irrigation_needed: boolean;
  irrigation_advice: string;
  pest_disease_risk: string;
  harvesting_window: string;
  storage_warning?: string | null;
  recommended_crops?: string[];
  crop_reasoning?: string | null;
}

export interface EmergencyContact {
  service: string;
  number: string;
  badge: string;
  description: string;
  icon: string;
  priority: string;
}

export interface HelplineItem {
  title: string;
  number: string;
  hours: string;
}

export interface HelplineCategory {
  category: string;
  contacts: HelplineItem[];
}

export interface FeedbackSubmission {
  user_id?: string;
  name?: string;
  email?: string;
  category: string;
  rating: number;
  comment: string;
  location?: string;
}

export interface FeedbackSubmissionResponse {
  status: string;
  id: number;
  message: string;
  points_awarded?: number;
  total_points?: number;
  national_rank?: number;
  created_at: string;
}

export interface IssueReportSubmission {
  category: string;
  description: string;
  location_name?: string;
  lat?: number;
  lon?: number;
  app_version?: string;
  timestamp?: string;
}

export interface IntelligenceSummary {
  is_personalized: boolean;
  top_recommendations: string[];
  critical_alerts: string[];
  krishi?: KrishiIntelligence | null;
}
