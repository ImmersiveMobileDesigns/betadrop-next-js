// Core types for BetaDrop

export type UserRole = "admin" | "viewer";
export type Platform = "ios" | "android";
export type ExpiryType = "none" | "time" | "downloads" | "devices" | "combined";
export type LinkType = "qa" | "stakeholder" | "beta_tester" | "reviewer";
export type FeedbackType = "bug" | "suggestion" | "question" | "other";
export type FeedbackSeverity = "low" | "medium" | "high" | "critical";
export type FeedbackStatus = "new" | "acknowledged" | "resolved" | "wont_fix";
export type InstallStatus = "success" | "failure" | "pending";

// Database Models
export interface User {
  id: string;
  email: string;
  role: UserRole;
  accepted_tos_at: string | null;
  tos_version: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Build {
  id: string;
  user_id: string;
  name: string;
  version: string;
  build_number: string | null;
  platform: Platform;
  bundle_id: string | null;
  file_path: string;
  file_name: string;
  file_size: number;
  icon_path: string | null;
  notes: string | null;
  is_enabled: boolean;
  is_public: boolean;
  download_count: number;
  created_at: Date;
  updated_at: Date;

  // Advanced features
  expiry_type: ExpiryType;
  expiry_time_days: number | null;
  expiry_download_limit: number | null;
  expiry_device_limit: number | null;
  expires_at: Date | null;
  custom_logo_path: string | null;
  custom_accent_color: string | null;
  custom_message: string | null;

  is_latest: boolean;
  is_deprecated: boolean;
  unique_devices_count: number;
  install_success_count: number;
  install_failure_count: number;

  // Custom Branding
  custom_brand_name: string | null;
  custom_theme_mode: "dark" | "light" | "system";
  custom_background_color: string | null;
  hide_platform_branding: boolean;
  provisioned_devices?: string[];
  permissions?: string[];
  device_families?: string[];
  min_os_version?: string | null;

  // Relations
  share_links?: ShareLink[];
  analytics?: BuildAnalytics[];

  // Derived columns (not in DB table)
  default_short_id?: string;
  icon_url?: string | null;
  dominant_color?: string | null;
}

export interface BuildAnalytics {
  id: string;
  build_id: string;
  share_link_id: string | null;
  device_type: DeviceType | null;
  device_model: string | null;
  os_version: string | null;
  screen_size: string | null;
  ip_address: string | null;
  country: string | null;
  city: string | null;
  install_status: InstallStatus;
  error_message: string | null;
  user_agent: string | null;
  installed_at: Date;
}

export interface ShareLink {
  id: string;
  build_id: string;
  link_type: LinkType;
  token: string;
  short_id: string | null;
  label: string | null;
  max_uses: number | null;
  current_uses: number;
  expires_at: Date | null;
  is_active: boolean;
  unique_devices: number;
  last_used_at: Date | null;
  created_at: Date;
}

export interface BuildFeedback {
  id: string;
  build_id: string;
  share_link_id: string | null;
  feedback_type: FeedbackType;
  title: string;
  description: string;
  severity: FeedbackSeverity;
  status: FeedbackStatus;
  reporter_email: string | null;
  reporter_name: string | null;
  device_info: string | null;
  screenshot_path: string | null;
  rating?: number;
  created_at: Date;
  updated_at: Date;
}

export interface BuildVersion {
  id: string;
  user_id: string;
  app_name: string;
  bundle_id: string;
  platform: Platform;
  version: string;
  build_number: string;
  build_id: string;
  is_current: boolean;
  created_at: Date;
}

export interface GuestUploadClaim {
  id: string;
  guest_upload_id: string;
  user_id: string;
  claimed_at: Date;
}

export interface AIGeneration {
  id: string;
  build_id: string;
  user_id: string;
  input_text: string;
  generated_text: string;
  model: string;
  tokens_used: number;
  created_at: Date;
}

export interface InstallToken {
  id: string;
  build_id: string;
  token: string;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
}

export interface MagicToken {
  id: string;
  email: string;
  token: string;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
}

export interface Session {
  id: string;
  user_id: string;
  token_hash: string;
  user_agent: string | null;
  ip_address: string | null;
  expires_at: Date;
  created_at: Date;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
}

export interface VerifyRequest {
  token: string;
}

export interface CreateBuildRequest {
  name: string;
  version: string;
  build_number?: string;
  notes?: string;
  expiry_type?: ExpiryType;
  expiry_time_days?: number;
  expiry_download_limit?: number;
  expiry_device_limit?: number;
  custom_logo?: File;
  custom_accent_color?: string;
  custom_message?: string;
}

export interface UpdateBuildRequest {
  name?: string;
  notes?: string;
  is_enabled?: boolean;
  is_public?: boolean;
  expiry_type?: ExpiryType;
  expiry_time_days?: number;
  expiry_download_limit?: number;
  expiry_device_limit?: number;
  custom_accent_color?: string;
  custom_message?: string;
  custom_logo_path?: string | null;
  custom_brand_name?: string | null;
  custom_theme_mode?: "dark" | "light" | "system";
  custom_background_color?: string | null;
  hide_platform_branding?: boolean;
  is_deprecated?: boolean;
}

export interface CreateShareLinkRequest {
  build_id: string;
  link_type: LinkType;
  label?: string;
  max_uses?: number;
  expires_at?: Date;
}

export interface CreateFeedbackRequest {
  build_id: string;
  share_link_token?: string;
  feedback_type: FeedbackType;
  title: string;
  description: string;
  severity?: FeedbackSeverity;
  reporter_email?: string;
  reporter_name?: string;
  device_info?: string;
  rating?: number;
}

export interface ClaimGuestUploadRequest {
  guest_upload_id: string;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Device Detection
export type DeviceType = "mobile" | "tablet" | "desktop";

export interface DeviceInfo {
  type: DeviceType;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  userAgent: string;
}

// Build with user info for display
export interface BuildWithUser extends Build {
  user_email?: string;
}

// Build with analytics
export interface BuildWithAnalytics extends Build {
  analytics?: BuildAnalytics[];
  share_links?: ShareLink[];
  feedback?: BuildFeedback[];
  versions?: BuildVersion[];
}

// Analytics summary
export interface BuildAnalyticsSummary {
  total_downloads: number;
  unique_devices: number;
  install_success_rate: number;
  device_breakdown: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  platform_breakdown: {
    ios: number;
    android: number;
    other: number;
  };
  top_devices: Array<{
    model: string;
    count: number;
  }>;
  geographic_distribution: Array<{
    country: string;
    count: number;
  }>;
}
