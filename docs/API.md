# BetaDrop API Documentation

**Version**: 1.0.0  
**Base URL**: `https://your-domain.com` or `http://localhost:3001`  
**Last Updated**: January 21, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Standard Response Format](#standard-response-format)
4. [Authentication APIs](#authentication-apis)
5. [Build Management APIs](#build-management-apis)
6. [Download & Install APIs](#download--install-apis)
7. [Guest Upload APIs](#guest-upload-apis)
8. [Analytics & Feedback APIs](#analytics--feedback-apis)
9. [Statistics APIs](#statistics-apis)
10. [Configuration APIs](#configuration-apis)
11. [Cron/Scheduled Tasks](#cronscheduled-tasks)
12. [Error Codes](#error-codes)
13. [Rate Limiting](#rate-limiting)
14. [Data Types](#data-types)

---

## Overview

BetaDrop provides a RESTful API for managing iOS (.ipa) and Android (.apk) beta app distribution. The API supports:

- 📱 **Magic Link Authentication** - Passwordless login via email
- 🔐 **Google OAuth** - Sign in with Google
- 🔑 **Passkey/WebAuthn** - Passwordless authentication using device biometrics
- 📤 **Build Upload** - Upload and manage iOS/Android builds
- 🔗 **Share Links** - Create trackable distribution links
- 📊 **Analytics** - Track downloads and installs
- 💬 **Feedback Collection** - Collect tester feedback
- 🎁 **Guest Uploads** - Quick uploads without account

---

## Authentication

BetaDrop uses JWT-based authentication stored in HttpOnly cookies.

### Authentication Methods

| Method | Endpoint | Description |
|--------|----------|-------------|
| Magic Link | `POST /api/auth/login` | Send login link to email |
| Google OAuth | `GET /api/auth/google` | Initiate Google sign-in |
| Passkey | `POST /api/auth/passkey/login` | Authenticate with passkey |

### Protected Endpoints

Most endpoints require authentication. Include the session cookie automatically set after login.

**Protected endpoints return:**
```json
{
  "success": false,
  "error": "Authentication required"
}
```
**Status**: `401 Unauthorized`

---

## Standard Response Format

All API responses follow this structure:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description"
}
```

---

## Authentication APIs

### 1. Send Magic Link

Sends a magic link to the user's email for passwordless login.

**Endpoint**: `POST /api/auth/login`  
**Auth Required**: No

#### Request Body
```json
{
  "email": "user@example.com"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Check your email for a login link"
}
```

#### Error Responses
| Status | Error |
|--------|-------|
| 400 | Valid email address is required |
| 500 | Failed to send login email. Please try again. |

---

### 2. Verify Magic Token

Verifies the magic link token and creates a session.

**Endpoint**: `POST /api/auth/verify`  
**Auth Required**: No

#### Request Body
```json
{
  "token": "magic-link-token"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Successfully signed in",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "admin"
    }
  }
}
```

#### GET Method (Direct Link Click)
**Endpoint**: `GET /api/auth/verify?token=magic-link-token`

Redirects to:
- Success: `/dashboard`
- Missing token: `/login?error=missing_token`
- Invalid token: `/login?error=invalid_token`

---

### 3. Get Current Session

Returns the currently authenticated user.

**Endpoint**: `GET /api/auth/session`  
**Auth Required**: No (returns null user if not authenticated)

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "admin"
    }
  }
}
```

#### Not Authenticated
```json
{
  "success": true,
  "data": {
    "user": null
  }
}
```

---

### 4. Logout

Clears the authentication session.

**Endpoint**: `POST /api/auth/logout`  
**Auth Required**: No

#### Success Response (200)
```json
{
  "success": true,
  "message": "Successfully signed out"
}
```

#### GET Method
**Endpoint**: `GET /api/auth/logout`

Redirects to `/login`

---

### 5. Google OAuth - Initiate

Initiates the Google OAuth flow.

**Endpoint**: `GET /api/auth/google`  
**Auth Required**: No

#### Behavior
- If Google OAuth is configured: Redirects to Google authorization page
- If not configured: Returns 503 error

#### Error Responses
| Status | Error |
|--------|-------|
| 503 | Google Sign-In is not configured |
| 500 | Failed to initiate Google Sign-In |

---

### 6. Google OAuth - Callback

Handles the Google OAuth callback.

**Endpoint**: `GET /api/auth/google/callback`  
**Auth Required**: No

#### Query Parameters
| Parameter | Description |
|-----------|-------------|
| code | Authorization code from Google |
| state | CSRF state token |
| error | Error from Google (if any) |

#### Behavior
- Success: Redirects to `/dashboard`
- Error: Redirects to `/login?error=<error_code>`

---

### 7. Passkey - Generate Login Options

Generates WebAuthn authentication options for passkey login.

**Endpoint**: `GET /api/auth/passkey/login`  
**Auth Required**: No

#### Query Parameters
| Parameter | Description |
|-----------|-------------|
| email | (Optional) Email to filter passkeys |

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "options": { /* WebAuthn AuthenticationOptions */ },
    "challenge": "base64-challenge"
  }
}
```

---

### 8. Passkey - Verify Authentication

Verifies passkey authentication response.

**Endpoint**: `POST /api/auth/passkey/login`  
**Auth Required**: No

#### Request Body
```json
{
  "response": { /* AuthenticationResponseJSON */ },
  "challenge": "base64-challenge"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": { /* User object */ }
  }
}
```

---

### 9. Passkey - Register (List/Generate Options)

Get registration options or list existing passkeys.

**Endpoint**: `GET /api/auth/passkey/register`  
**Auth Required**: Yes

#### Query Parameters
| Parameter | Value | Description |
|-----------|-------|-------------|
| action | list | Returns list of user's passkeys |
| (none) | - | Returns registration options |

#### List Passkeys Response
```json
{
  "success": true,
  "data": {
    "passkeys": [
      {
        "id": "credential-id",
        "deviceType": "platform",
        "createdAt": "2026-01-20T10:00:00Z",
        "lastUsedAt": "2026-01-21T08:00:00Z"
      }
    ]
  }
}
```

---

### 10. Passkey - Register (Verify)

Verifies and saves a new passkey.

**Endpoint**: `POST /api/auth/passkey/register`  
**Auth Required**: Yes

#### Request Body
```json
{
  "response": { /* RegistrationResponseJSON */ }
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Passkey registered successfully"
}
```

---

### 11. Passkey - Delete

Removes a passkey.

**Endpoint**: `DELETE /api/auth/passkey/register?id=<credential-id>`  
**Auth Required**: Yes

#### Query Parameters
| Parameter | Description |
|-----------|-------------|
| id | Credential ID to delete |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Passkey deleted successfully"
}
```

---

## Build Management APIs

### 1. List All Builds

Returns all builds for the authenticated user.

**Endpoint**: `GET /api/builds`  
**Auth Required**: Yes

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "builds": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "name": "My App",
        "version": "1.0.0",
        "build_number": "1",
        "platform": "ios",
        "bundle_id": "com.example.myapp",
        "file_path": "/storage/ios/file.ipa",
        "file_name": "MyApp.ipa",
        "file_size": 52428800,
        "icon_path": "/storage/icons/icon.png",
        "notes": "Initial release",
        "is_enabled": true,
        "is_public": false,
        "download_count": 42,
        "expiry_type": "time",
        "expiry_time_days": 30,
        "expires_at": "2026-02-20T10:00:00Z",
        "created_at": "2026-01-21T10:00:00Z",
        "updated_at": "2026-01-21T10:00:00Z"
      }
    ]
  }
}
```

---

### 2. Get Single Build

Returns details for a specific build.

**Endpoint**: `GET /api/builds/{id}`  
**Auth Required**: No (for public builds)

#### Path Parameters
| Parameter | Description |
|-----------|-------------|
| id | Build UUID |

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "build": { /* Build object */ }
  }
}
```

#### Error Responses
| Status | Error |
|--------|-------|
| 404 | Build not found |

---

### 3. Upload Build

Uploads a new iOS or Android build.

**Endpoint**: `POST /api/upload`  
**Auth Required**: Yes  
**Content-Type**: `multipart/form-data`

#### Form Data Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | File | Yes | .ipa or .apk file |
| name | String | No | App name (auto-detected from file) |
| version | String | No | Version (auto-detected) |
| buildNumber | String | No | Build number (auto-detected) |
| bundleId | String | No | Bundle ID (auto-detected) |
| notes | String | No | Release notes |
| expiry_type | Enum | No | `none`, `time`, `downloads`, `devices`, `combined` |
| expiry_time_days | Number | No | Days until expiry (max 30) |
| expiry_download_limit | Number | No | Max downloads |
| expiry_device_limit | Number | No | Max unique devices |
| custom_accent_color | String | No | Hex color for install page |
| custom_message | String | No | Custom message on install page |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Build uploaded successfully",
  "data": {
    "id": "uuid",
    "platform": "ios",
    "fileSize": 52428800
  }
}
```

#### Error Responses
| Status | Error |
|--------|-------|
| 400 | File is required |
| 400 | Invalid file type |
| 401 | Please sign in to upload builds |
| 403 | Admin access required to upload builds |
| 500 | Failed to upload build |

---

### 4. Update Build

Updates build settings.

**Endpoint**: `PATCH /api/builds/{id}`  
**Auth Required**: Yes (must own build)

#### Request Body
```json
{
  "name": "Updated App Name",
  "notes": "Updated release notes",
  "is_enabled": true,
  "is_public": false,
  "is_latest": true,
  "is_deprecated": false,
  "expiry_type": "time",
  "expiry_time_days": 14,
  "expiry_download_limit": 100,
  "expiry_device_limit": 50,
  "custom_accent_color": "#FF5733",
  "custom_message": "Welcome to beta testing!",
  "custom_brand_name": "My Company",
  "custom_theme_mode": "dark",
  "custom_background_color": "#1a1a1a",
  "hide_platform_branding": false
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Build updated successfully",
  "data": { /* Updated build object */ }
}
```

---

### 5. Delete Build

Deletes a build and its associated file.

**Endpoint**: `DELETE /api/builds/{id}`  
**Auth Required**: Yes (must own build)

#### Success Response (200)
```json
{
  "success": true,
  "message": "Build deleted successfully"
}
```

---

### 6. Create Share Link

Creates a trackable share link for a build.

**Endpoint**: `POST /api/builds/{id}/share-links`  
**Auth Required**: Yes (must own build)

#### Request Body
```json
{
  "link_type": "qa",
  "label": "QA Team Link",
  "max_uses": 50,
  "expires_at": "2026-02-01T00:00:00Z"
}
```

#### Link Types
| Type | Description |
|------|-------------|
| qa | QA testers |
| stakeholder | Stakeholders/executives |
| beta_tester | External beta testers |
| reviewer | App reviewers |

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "build_id": "uuid",
    "link_type": "qa",
    "token": "abcd1234efgh5678",
    "label": "QA Team Link",
    "max_uses": 50,
    "current_uses": 0,
    "expires_at": "2026-02-01T00:00:00Z",
    "is_active": true,
    "created_at": "2026-01-21T10:00:00Z"
  }
}
```

---

### 7. List Share Links

Returns all share links for a build.

**Endpoint**: `GET /api/builds/{id}/share-links`  
**Auth Required**: Yes (must own build)

#### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "build_id": "uuid",
      "link_type": "qa",
      "token": "abcd1234efgh5678",
      "label": "QA Team Link",
      "max_uses": 50,
      "current_uses": 12,
      "expires_at": "2026-02-01T00:00:00Z",
      "is_active": true,
      "unique_devices": 8,
      "last_used_at": "2026-01-21T09:30:00Z",
      "created_at": "2026-01-20T10:00:00Z"
    }
  ]
}
```

---

## Download & Install APIs

### 1. Download Build

Downloads the build file (IPA or APK).

**Endpoint**: `GET /api/download/{id}`  
**Auth Required**: No (for enabled builds)

#### Path Parameters
| Parameter | Description |
|-----------|-------------|
| id | Build UUID |

#### Query Parameters
| Parameter | Description |
|-----------|-------------|
| token | (Optional) Share link token for tracking |

#### Response
- **Success**: Binary file stream with appropriate headers
- **iOS**: `Content-Type: application/octet-stream`
- **Android**: `Content-Type: application/vnd.android.package-archive`

#### Headers Returned
```
Content-Type: application/octet-stream
Content-Length: 52428800
Accept-Ranges: bytes
Access-Control-Allow-Origin: *
```

#### Error Responses
| Status | Error |
|--------|-------|
| 403 | Link is disabled |
| 403 | Download limit reached for this link |
| 404 | Build not found |
| 410 | Link expired |

---

### 2. iOS Manifest (OTA Install)

Returns the manifest.plist for iOS Over-The-Air installation.

**Endpoint**: `GET /api/manifest/{id}`  
**Auth Required**: No

#### Response
- **Content-Type**: `text/xml; charset=utf-8`
- Returns Apple-compatible iTunes Services manifest

#### Usage
iOS devices use this via the `itms-services://` protocol:
```
itms-services://?action=download-manifest&url=https://your-domain.com/api/manifest/{id}
```

---

### 3. Get Build Icon

Returns the app icon for a build.

**Endpoint**: `GET /api/icon/{id}`  
**Auth Required**: No

#### Response
- **Content-Type**: `image/png`
- Returns PNG icon or 404 if not available

---

## Guest Upload APIs

Guest uploads allow quick sharing without an account.

### 1. Guest Upload

Upload a file without authentication.

**Endpoint**: `POST /api/guest/upload`  
**Auth Required**: No  
**Content-Type**: `multipart/form-data`

#### Form Data
| Field | Type | Required |
|-------|------|----------|
| file | File | Yes |

#### Rate Limiting
- Default: 50 uploads per hour per IP
- Configurable via `GUEST_UPLOAD_RATE_LIMIT` env var
- Disabled in development mode

#### Success Response (200)
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "token": "64-char-hex-token",
    "expiresAt": "2026-01-24T10:00:00Z",
    "url": "https://your-domain.com/app/64-char-hex-token"
  }
}
```

#### Error Responses
| Status | Error |
|--------|-------|
| 400 | File is required |
| 400 | Invalid file type |
| 429 | Rate limit exceeded. Try again later. |
| 500 | Failed to upload file |

---

### 2. Get Guest App Info

Returns metadata for a guest upload.

**Endpoint**: `GET /api/guest/app/{token}`  
**Auth Required**: No

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "appName": "My App",
    "packageName": "com.example.myapp",
    "version": "1.0.0",
    "fileType": "ipa",
    "fileSize": 52428800,
    "createdAt": "2026-01-21T10:00:00Z",
    "expiresAt": "2026-01-24T10:00:00Z",
    "provisionedDevices": ["UDID1", "UDID2"]
  }
}
```

#### Error Responses
| Status | Error |
|--------|-------|
| 404 | App not found |
| 410 | Link expired |

---

### 3. Guest Download

Downloads a guest-uploaded file.

**Endpoint**: `GET /api/guest/download/{token}`  
**Auth Required**: No

#### Response
- Binary file stream
- Increments download counter

---

### 4. Guest iOS Manifest

Returns manifest for iOS OTA install of guest upload.

**Endpoint**: `GET /api/guest/manifest/{token}`  
**Auth Required**: No

#### Response
- **Content-Type**: `application/x-plist`
- iTunes Services compatible manifest

---

### 5. Claim Guest Uploads

Converts guest uploads to full builds.

**Endpoint**: `GET /api/guest/claim`  
**Auth Required**: Yes

#### Query Parameters
| Parameter | Description |
|-----------|-------------|
| claimToken | (Optional) Specific upload token to claim |

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "available": [
      {
        "id": "uuid",
        "token": "64-char-token",
        "app_name": "My App",
        "version": "1.0.0",
        "file_type": "ipa",
        "created_at": "2026-01-21T10:00:00Z"
      }
    ],
    "claimed": []
  }
}
```

---

### 6. Claim a Guest Upload

Claims a specific guest upload and converts it to a build.

**Endpoint**: `POST /api/guest/claim`  
**Auth Required**: Yes

#### Request Body
```json
{
  "guestUploadId": "uuid"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Upload claimed successfully! It has been added to your builds.",
  "data": {
    "claimId": "uuid",
    "buildId": "uuid",
    "appName": "My App",
    "version": "1.0.0"
  }
}
```

---

## Analytics & Feedback APIs

### 1. Get Build Analytics

Returns analytics data for a build.

**Endpoint**: `GET /api/builds/{id}/analytics`  
**Auth Required**: Yes (must own build)

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_downloads": 142,
      "unique_devices": 87,
      "install_success_rate": 94.5,
      "device_breakdown": {
        "mobile": 120,
        "tablet": 18,
        "desktop": 4
      },
      "platform_breakdown": {
        "ios": 85,
        "android": 52,
        "other": 5
      },
      "top_devices": [
        { "model": "iPhone 15 Pro", "count": 23 },
        { "model": "Galaxy S24", "count": 18 }
      ],
      "geographic_distribution": [
        { "country": "United States", "count": 45 },
        { "country": "United Kingdom", "count": 23 }
      ]
    },
    "recent_installs": [
      {
        "id": "uuid",
        "device_type": "mobile",
        "device_model": "iPhone 15 Pro",
        "os_version": "iOS 17.2",
        "ip_address": "192.168.1.1",
        "install_status": "success",
        "installed_at": "2026-01-21T10:30:00Z"
      }
    ]
  }
}
```

---

### 2. Track Install Analytics

Records an install event (called from install page).

**Endpoint**: `POST /api/builds/{id}/analytics`  
**Auth Required**: No

#### Request Body
```json
{
  "device_type": "mobile",
  "device_model": "iPhone 15 Pro",
  "os_version": "iOS 17.2",
  "screen_size": "393x852",
  "install_status": "success",
  "error_message": null
}
```

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "analytics_id": "uuid"
  }
}
```

---

### 3. Get Build Feedback

Returns all feedback for a build.

**Endpoint**: `GET /api/builds/{id}/feedback`  
**Auth Required**: Yes (must own build)

#### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "build_id": "uuid",
      "feedback_type": "bug",
      "title": "App crashes on launch",
      "description": "The app crashes immediately after splash screen...",
      "severity": "high",
      "status": "new",
      "reporter_name": "John Doe",
      "reporter_email": "john@example.com",
      "device_info": "iPhone 15 Pro, iOS 17.2",
      "created_at": "2026-01-21T10:00:00Z"
    }
  ]
}
```

---

### 4. Submit Feedback

Submits feedback for a build (public endpoint).

**Endpoint**: `POST /api/builds/{id}/feedback`  
**Auth Required**: No

#### Request Body
```json
{
  "feedback_type": "bug",
  "title": "App crashes on launch",
  "description": "The app crashes immediately after the splash screen when I tap anywhere.",
  "severity": "high",
  "reporter_name": "John Doe",
  "reporter_email": "john@example.com",
  "device_info": "iPhone 15 Pro, iOS 17.2",
  "share_link_token": "optional-share-link-token"
}
```

#### Feedback Types
| Type | Description |
|------|-------------|
| bug | Bug report |
| suggestion | Feature suggestion |
| question | Question about the app |
| other | Other feedback |

#### Severity Levels
| Level | Description |
|-------|-------------|
| low | Minor issue |
| medium | Moderate issue |
| high | Major issue |
| critical | Blocker/critical issue |

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid"
  }
}
```

---

## Statistics APIs

### Platform Statistics

Returns aggregated platform statistics (public counters).

**Endpoint**: `GET /api/stats/counter`  
**Auth Required**: No  
**Cache**: 5 minutes

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "uploads": 1523,
    "downloads": 48729,
    "developers": 342,
    "uptime": "99.9%",
    "lastUpdated": "2026-01-21T10:46:00Z"
  }
}
```

---

## Configuration APIs

### Get App Configuration

Returns public configuration values.

**Endpoint**: `GET /api/config`  
**Auth Required**: No

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "guestLinkExpiryHours": 72,
    "guestLinkExpiryDays": 3,
    "buildDefaultExpiryDays": 30
  }
}
```

---

## Cron/Scheduled Tasks

### Cleanup Expired Uploads

Deletes expired guest uploads and associated files.

**Endpoint**: `GET /api/cron/cleanup`  
**Auth Required**: Bearer token (CRON_SECRET env var)

#### Headers
```
Authorization: Bearer <CRON_SECRET>
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Cleanup completed. Deleted 5 expired uploads.",
  "deletedCount": 5
}
```

#### Error Responses
| Status | Error |
|--------|-------|
| 401 | Unauthorized |

---

## Error Codes

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 410 | Gone - Resource expired |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable - Feature not configured |

---

## Rate Limiting

### Guest Uploads
- **Limit**: 50 uploads per hour per IP (configurable)
- **Env Variable**: `GUEST_UPLOAD_RATE_LIMIT`
- Disabled in development mode

### General
- Standard endpoints: No explicit rate limiting (implement via reverse proxy)
- Recommended: Use Nginx or similar for production rate limiting

---

## Data Types

### User
```typescript
interface User {
  id: string;           // UUID
  email: string;
  role: 'admin' | 'viewer';
  created_at: Date;
  updated_at: Date;
}
```

### Build
```typescript
interface Build {
  id: string;
  user_id: string;
  name: string;
  version: string;
  build_number: string | null;
  platform: 'ios' | 'android';
  bundle_id: string | null;
  file_path: string;
  file_name: string;
  file_size: number;
  icon_path: string | null;
  notes: string | null;
  is_enabled: boolean;
  is_public: boolean;
  download_count: number;
  expiry_type: 'none' | 'time' | 'downloads' | 'devices' | 'combined';
  expiry_time_days: number | null;
  expiry_download_limit: number | null;
  expiry_device_limit: number | null;
  expires_at: Date | null;
  custom_accent_color: string | null;
  custom_message: string | null;
  custom_brand_name: string | null;
  custom_theme_mode: 'dark' | 'light' | 'system';
  custom_background_color: string | null;
  hide_platform_branding: boolean;
  is_latest: boolean;
  is_deprecated: boolean;
  created_at: Date;
  updated_at: Date;
}
```

### ShareLink
```typescript
interface ShareLink {
  id: string;
  build_id: string;
  link_type: 'qa' | 'stakeholder' | 'beta_tester' | 'reviewer';
  token: string;
  label: string | null;
  max_uses: number | null;
  current_uses: number;
  expires_at: Date | null;
  is_active: boolean;
  unique_devices: number;
  last_used_at: Date | null;
  created_at: Date;
}
```

### BuildFeedback
```typescript
interface BuildFeedback {
  id: string;
  build_id: string;
  share_link_id: string | null;
  feedback_type: 'bug' | 'suggestion' | 'question' | 'other';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'acknowledged' | 'resolved' | 'wont_fix';
  reporter_name: string | null;
  reporter_email: string | null;
  device_info: string | null;
  created_at: Date;
  updated_at: Date;
}
```

### BuildAnalytics
```typescript
interface BuildAnalytics {
  id: string;
  build_id: string;
  share_link_id: string | null;
  device_type: 'mobile' | 'tablet' | 'desktop' | null;
  device_model: string | null;
  os_version: string | null;
  screen_size: string | null;
  ip_address: string | null;
  country: string | null;
  city: string | null;
  install_status: 'success' | 'failure' | 'pending';
  error_message: string | null;
  user_agent: string | null;
  installed_at: Date;
}
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Public URL of the application | `http://localhost:3001` |
| `JWT_SECRET` | Secret for JWT signing | Required |
| `DATABASE_URL` | MySQL connection string | Required |
| `GUEST_LINK_EXPIRY_HOURS` | Guest upload link expiry | `72` |
| `GUEST_UPLOAD_RATE_LIMIT` | Uploads per hour per IP | `50` |
| `BUILD_DEFAULT_EXPIRY_DAYS` | Default build expiry | `30` |
| `CRON_SECRET` | Auth token for cron endpoints | Required for cron |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | Optional |

---

## iOS OTA Installation Flow

1. User visits install page: `/install/{buildId}`
2. Page generates iOS install URL:
   ```
   itms-services://?action=download-manifest&url=https://your-domain.com/api/manifest/{buildId}
   ```
3. iOS fetches manifest from `/api/manifest/{buildId}`
4. iOS downloads IPA from `/api/download/{buildId}`
5. iOS installs the app

**Requirements**:
- HTTPS with valid SSL certificate
- Device UDID must be in provisioning profile (for Ad Hoc distribution)

---

## Support

For issues or questions, please open an issue on GitHub or contact support.

**License**: MIT
