'use client';

import { useState } from 'react';
import type { Build, ExpiryType } from '@/types';
import { 
  Clock, 
  Download, 
  Smartphone, 
  Save, 
  Check,
  AlertCircle,
  Star,
  Archive
} from 'lucide-react';
import Select from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { useUpdateBuild } from '@/hooks/queries';

interface BuildSettingsProps {
  build: Build;
  onUpdate: (build: Build) => void;
}

export default function BuildSettings({ build, onUpdate }: BuildSettingsProps) {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate max allowed expiry days from now based on 30-day limit from creation
  const maxExpiryDays = (() => {
    if (build.created_at) {
      const createdDate = new Date(build.created_at);
      if (!isNaN(createdDate.getTime())) {
        const daysSinceCreation = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        const remaining = 30 - daysSinceCreation;
        return remaining > 0 ? remaining : 1; // At least 1 day
      }
    }
    return 30;
  })();

  // Expiry settings
  const [expiryType, setExpiryType] = useState<ExpiryType>(
    !build.expiry_type || build.expiry_type === 'none' ? 'time' : build.expiry_type
  );
  const [expiryDays, setExpiryDays] = useState(() => {
    if (build.expires_at) {
      const expiresDate = new Date(build.expires_at);
      // Check if date is valid
      if (!isNaN(expiresDate.getTime())) {
        const daysRemaining = Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        // Return at least 1 day if positive, cap at maxExpiryDays
        if (daysRemaining > 0) {
          return Math.min(daysRemaining, maxExpiryDays);
        }
      }
    }
    return Math.min(30, maxExpiryDays);
  });
  const [downloadLimit, setDownloadLimit] = useState(build.expiry_download_limit || 100);
  const [deviceLimit, setDeviceLimit] = useState(build.expiry_device_limit || 25);

  // Version management
  const [isLatest, setIsLatest] = useState(build.is_latest || false);
  const [isDeprecated, setIsDeprecated] = useState(build.is_deprecated || false);

  // Update build mutation
  const updateBuild = useUpdateBuild();

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    const updates: any = {
      expiry_type: expiryType,
      is_latest: isLatest,
      is_deprecated: isDeprecated,
    };

    // Add expiry-specific fields
    if (expiryType === 'time' || expiryType === 'combined') {
      updates.expiry_time_days = expiryDays;
    }
    if (expiryType === 'downloads' || expiryType === 'combined') {
      updates.expiry_download_limit = downloadLimit;
    }
    if (expiryType === 'devices' || expiryType === 'combined') {
      updates.expiry_device_limit = deviceLimit;
    }

    updateBuild.mutate(
      { id: build.id, updates },
      {
        onSuccess: (data) => {
          onUpdate(data);
          setSaveSuccess(true);
          toast.success('Settings saved successfully');
          setTimeout(() => setSaveSuccess(false), 3000);
          setIsSaving(false);
        },
        onError: (err) => {
          console.error('Error saving settings:', err);
          setError(err instanceof Error ? err.message : 'Failed to save settings');
          toast.error('Failed to save settings');
          setIsSaving(false);
        }
      }
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Expiry Rules */}
      <div className="card relative z-20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-primary-400" />
          Expiry Rules
        </h3>
        <p className="text-white/60 text-sm mb-6">
          Control when and how this build expires. Expired builds cannot be downloaded.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Expiry Type
            </label>
            <Select
              value={expiryType}
              onChange={(value) => setExpiryType(value as ExpiryType)}
              options={[
                { value: 'time', label: 'Time-Based Expiry' },
                { value: 'downloads', label: 'Download Limit' },
                { value: 'devices', label: 'Device Limit' },
                { value: 'combined', label: 'Combined Rules' },
              ]}
            />
          </div>

          {(expiryType === 'time' || expiryType === 'combined') && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Expires After (Days)
              </label>
              <input
                type="number"
                value={expiryDays}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) {
                    setExpiryDays(1);
                  } else if (val > maxExpiryDays) {
                    setExpiryDays(maxExpiryDays);
                  } else {
                    setExpiryDays(val);
                  }
                }}
                min="1"
                max={maxExpiryDays}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50 transition-colors"
              />
              <p className="text-xs text-white/40 mt-1">
                Build will expire {expiryDays || 1} {expiryDays === 1 ? 'day' : 'days'} from now
                {maxExpiryDays < 30 && (
                  <span className="text-yellow-400/80"> (max {maxExpiryDays} days remaining from 30-day limit)</span>
                )}
              </p>
            </div>
          )}

          {(expiryType === 'downloads' || expiryType === 'combined') && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Maximum Downloads
              </label>
              <input
                type="number"
                value={downloadLimit}
                onChange={(e) => setDownloadLimit(parseInt(e.target.value))}
                min="1"
                max="10000"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50 transition-colors"
              />
              <p className="text-xs text-white/40 mt-1">
                Current downloads: {build.download_count} / {downloadLimit}
              </p>
            </div>
          )}

          {(expiryType === 'devices' || expiryType === 'combined') && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center">
                <Smartphone className="w-4 h-4 mr-2" />
                Maximum Unique Devices
              </label>
              <input
                type="number"
                value={deviceLimit}
                onChange={(e) => setDeviceLimit(parseInt(e.target.value))}
                min="1"
                max="1000"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50 transition-colors"
              />
              <p className="text-xs text-white/40 mt-1">
                Current unique devices: {build.unique_devices_count} / {deviceLimit}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Build Version Management */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-primary-400" />
          Build Version Management
        </h3>
        <p className="text-white/60 text-sm mb-6">
          Manage the version status of this build.
        </p>

        <div className="space-y-4">
          <label className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
            <input
              type="checkbox"
              checked={isLatest}
              onChange={(e) => setIsLatest(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
            />
            <div className="flex-1">
              <div className="text-white font-medium mb-1 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                Mark as Latest Build
              </div>
              <div className="text-white/60 text-sm">
                This will mark this build as the latest version. Only one build per app can be marked as latest.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
            <input
              type="checkbox"
              checked={isDeprecated}
              onChange={(e) => setIsDeprecated(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-red-500 focus:ring-red-500 focus:ring-offset-0"
            />
            <div className="flex-1">
              <div className="text-white font-medium mb-1 flex items-center gap-2">
                <Archive className="w-4 h-4 text-red-400" />
                Mark as Deprecated
              </div>
              <div className="text-white/60 text-sm">
                Deprecated builds will show a warning on the install page, encouraging users to upgrade.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-red-300 font-medium mb-1">Error</div>
            <div className="text-red-400/80 text-sm">{error}</div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex items-center justify-between p-6 rounded-lg bg-white/5 border border-white/10">
        <div className="text-sm text-white/60">
          Changes will take effect immediately after saving
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary-500/30"
        >
          {isSaving ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              Saving...
            </>
          ) : saveSuccess ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
