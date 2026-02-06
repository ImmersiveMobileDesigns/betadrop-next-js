'use client';

import { useState } from 'react';
import type { Build } from '@/types';
import { 
  Palette, 
  MessageSquare, 
  Save, 
  Check,
  AlertCircle,
  Type,
  Image,
  Moon,
  Sun,
  Monitor,
  EyeOff,
  Paintbrush
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useUpdateBuild } from '@/hooks/queries';

interface BuildBrandingProps {
  build: Build;
  onUpdate: (build: Build) => void;
}

export default function BuildBranding({ build, onUpdate }: BuildBrandingProps) {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Branding settings
  const [customAccentColor, setCustomAccentColor] = useState(build.custom_accent_color || '#3b82f6');
  const [customMessage, setCustomMessage] = useState(build.custom_message || '');
  const [customBrandName, setCustomBrandName] = useState(build.custom_brand_name || '');
  const [customLogoPath, setCustomLogoPath] = useState(build.custom_logo_path || '');
  const [customThemeMode, setCustomThemeMode] = useState<Build['custom_theme_mode']>(build.custom_theme_mode || 'dark');
  const [customBackgroundColor, setCustomBackgroundColor] = useState(build.custom_background_color || '#0f172a');
  const [hidePlatformBranding, setHidePlatformBranding] = useState(build.hide_platform_branding || false);

  const updateBuild = useUpdateBuild();

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    const updates: any = {
      custom_accent_color: customAccentColor !== '#3b82f6' ? customAccentColor : null,
      custom_message: customMessage || null,
      custom_brand_name: customBrandName || null,
      custom_logo_path: customLogoPath || null,
      custom_theme_mode: customThemeMode,
      custom_background_color: customBackgroundColor !== '#0f172a' ? customBackgroundColor : null,
      hide_platform_branding: hidePlatformBranding,
    };

    updateBuild.mutate(
      { id: build.id, updates },
      {
        onSuccess: (updatedBuild) => {
          onUpdate(updatedBuild);
          setSaveSuccess(true);
          toast.success('Branding settings saved successfully');
          setTimeout(() => setSaveSuccess(false), 3000);
          setIsSaving(false);
        },
        onError: (err) => {
          console.error('Error saving branding settings:', err);
          setError(err instanceof Error ? err.message : 'Failed to save branding settings');
          setIsSaving(false);
        }
      }
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Palette className="w-5 h-5 mr-2 text-primary-400" />
          Custom Branding
        </h3>
        <p className="text-white/60 text-sm mb-6">
          Customize the appearance of the install page for this build.
        </p>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center">
                <Type className="w-4 h-4 mr-2" />
                Brand Name (Optional)
              </label>
              <input
                type="text"
                value={customBrandName}
                onChange={(e) => setCustomBrandName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center">
                <Image className="w-4 h-4 mr-2" />
                Custom Logo URL (Optional)
              </label>
              <input
                type="text"
                value={customLogoPath}
                onChange={(e) => setCustomLogoPath(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customAccentColor}
                  onChange={(e) => setCustomAccentColor(e.target.value)}
                  className="w-16 h-12 rounded-lg cursor-pointer bg-white/5 border border-white/10"
                />
                <input
                  type="text"
                  value={customAccentColor}
                  onChange={(e) => setCustomAccentColor(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50 transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center">
                <Paintbrush className="w-4 h-4 mr-2" />
                Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customBackgroundColor}
                  onChange={(e) => setCustomBackgroundColor(e.target.value)}
                  className="w-16 h-12 rounded-lg cursor-pointer bg-white/5 border border-white/10"
                />
                <input
                  type="text"
                  value={customBackgroundColor}
                  onChange={(e) => setCustomBackgroundColor(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50 transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center">
              <Monitor className="w-4 h-4 mr-2" />
              Page Theme
            </label>
            <div className="flex gap-2">
              {[
                { id: 'dark', name: 'Dark', icon: Moon },
                { id: 'light', name: 'Light', icon: Sun },
                { id: 'system', name: 'System', icon: Monitor },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setCustomThemeMode(theme.id as any);
                    if (theme.id === 'light') {
                      setCustomBackgroundColor('#f8fafc');
                    } else {
                      setCustomBackgroundColor('#0f172a');
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border transition-all ${
                    customThemeMode === theme.id
                      ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <theme.icon className="w-4 h-4" />
                  <span className="text-sm">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Custom Message (Optional)
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a custom message for testers..."
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary-500/50 transition-colors resize-none"
            />
          </div>

          {/* <label className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
            <input
              type="checkbox"
              checked={hidePlatformBranding}
              onChange={(e) => setHidePlatformBranding(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
            />
            <div className="flex-1">
              <div className="text-white font-medium text-sm flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-white/60" />
                Hide BetaDrop Branding
              </div>
              <div className="text-white/40 text-xs mt-1">
                Removes "Powered by BetaDrop" footer from the install page
              </div>
            </div>
          </label> */}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-red-300 font-medium mb-1">Error</div>
            <div className="text-red-400/80 text-sm">{error}</div>
          </div>
        </div>
      )}

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
