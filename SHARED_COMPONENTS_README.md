# Shared Components Refactoring

## Overview
This document outlines the refactoring work done to create reusable components for upload and view functionality that can be shared between guest and authenticated user flows.

## Created Components

### 1. FileUploadZone (`src/components/shared/FileUploadZone.tsx`)
**Purpose:** Reusable file upload component with drag-and-drop functionality

**Features:**
- Drag-and-drop file upload
- File validation (.ipa and .apk only)
- Upload progress display
- Error handling
- Platform icons (iOS/Android)
- Modern UI with animations

**Usage:**
```tsx
<FileUploadZone
  file={file}
  onFileSelect={handleFileSelect}
  onFileRemove={handleFileRemove}
  isUploading={isUploading}
  uploadProgress={uploadProgress}
  error={error}
/>
```

### 2. UploadSuccess (`src/components/shared/UploadSuccess.tsx`)
**Purpose:** Reusable success state component after file upload

**Features:**
- Success animation
- URL display with copy/visit buttons
- QR code generation
- Upload another button
- Customizable title and description

**Usage:**
```tsx
<UploadSuccess
  url={uploadResult.url}
  expiresAt={uploadResult.expiresAt}
  onUploadAnother={handleUploadAnother}
  showQRCode={true}
  title="Build Uploaded!"
  description="Your secure install link is ready..."
/>
```

### 3. AppInstallView (`src/components/shared/AppInstallView.tsx`)
**Purpose:** Comprehensive app installation page view

**Features:**
- App overview section
- App details section
- Features and permissions
- FAQ section
- Share with QR code
- Rate & feedback form
- Installation guide for iOS
- Responsive design
- Platform-specific styling

**Usage:**
```tsx
<AppInstallView
  data={appData}
  installPageUrl={installPageUrl}
  downloadUrl={downloadUrl}
  manifestUrl={manifestUrl}
  iosInstallUrl={iosInstallUrl}
  deviceType={device?.type}
  isMobile={device?.isMobile}
/>
```

## Updated Files

### 1. GuestUpload Component (`src/components/guest/GuestUpload.tsx`)
**Changes:**
- Removed duplicate upload zone UI code
- Now uses `FileUploadZone` component
- Now uses `UploadSuccess` component
- Reduced from ~330 lines to ~150 lines
- Cleaner, more maintainable code

### 2. Guest Install Page (`src/app/app/[token]/page.tsx`)
**Changes:**
- Removed all UI component definitions (SectionHeader, DataRow, ExpandableRow, FAQItem, StarRating)
- Now uses `AppInstallView` component
- Reduced from ~585 lines to ~120 lines
- Focuses only on data fetching and state management

## Benefits

### 1. **Code Reusability**
- Same UI components can be used in both guest and authenticated flows
- Reduces code duplication by ~70%

### 2. **Maintainability**
- Single source of truth for UI components
- Bug fixes and improvements apply to all uses
- Easier to update styling and functionality

### 3. **Consistency**
- Ensures identical UI/UX across different parts of the application
- Reduces design drift

### 4. **Scalability**
- Easy to add new features to shared components
- Can be extended for authenticated user upload/view pages

## Next Steps

### For Authenticated Users
You can now easily add the same UI to authenticated user pages:

1. **Upload Page** (`src/app/(dashboard)/upload/page.tsx`):
   - Replace the current upload form with `FileUploadZone`
   - Add `UploadSuccess` for post-upload state

2. **Build View Page** (create new or update existing):
   - Use `AppInstallView` to display build details
   - Provide same rich experience as guest users

### Example Implementation for Authenticated Upload

```tsx
// In src/app/(dashboard)/upload/page.tsx
import FileUploadZone from '@/components/shared/FileUploadZone';
import UploadSuccess from '@/components/shared/UploadSuccess';

// Replace the existing drag-and-drop zone with:
<FileUploadZone
  file={file}
  onFileSelect={handleFileSelect}
  onFileRemove={() => setFile(null)}
  isUploading={isUploading}
  uploadProgress={uploadProgress}
  error={error}
  showMetadata={true}
/>

// After successful upload, show:
{uploadResult && (
  <UploadSuccess
    url={uploadResult.url}
    expiresAt={uploadResult.expiresAt}
    onUploadAnother={() => {
      setFile(null);
      setUploadResult(null);
    }}
    showQRCode={true}
    title="Build Uploaded Successfully!"
    description="Your build is now available for distribution."
  />
)}
```

## File Structure

```
src/
├── components/
│   ├── shared/              # New shared components
│   │   ├── FileUploadZone.tsx
│   │   ├── UploadSuccess.tsx
│   │   └── AppInstallView.tsx
│   ├── guest/
│   │   └── GuestUpload.tsx  # Updated to use shared components
│   └── ui/
│       ├── Button.tsx
│       ├── QRCode.tsx
│       └── InstallButton.tsx
└── app/
    ├── app/
    │   └── [token]/
    │       └── page.tsx     # Updated to use AppInstallView
    └── (dashboard)/
        ├── upload/
        │   └── page.tsx     # Can now use shared components
        └── builds/
            └── [id]/
                └── page.tsx # Can now use AppInstallView
```

## Testing Checklist

- [ ] Guest upload flow works correctly
- [ ] Guest install page displays properly
- [ ] File validation works (only .ipa and .apk)
- [ ] Upload progress displays correctly
- [ ] QR codes generate properly
- [ ] Copy/Visit buttons work
- [ ] Responsive design on mobile/tablet/desktop
- [ ] All animations work smoothly
- [ ] Error states display correctly
