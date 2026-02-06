"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Smartphone, 
  Calendar, 
  Link as LinkIcon,
  Globe,
  Clock
} from "lucide-react";
import { ShareLink, BuildAnalytics } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

interface ShareLinkDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareLink: ShareLink;
  buildId: string;
  analytics?: BuildAnalytics[];
}

export default function ShareLinkDetailsModal({
  isOpen,
  onClose,
  shareLink,
  buildId,
  analytics
}: ShareLinkDetailsModalProps) {
  const [copied, setCopied] = useState(false);
  const [appUrl, setAppUrl] = useState("");

  useEffect(() => {
    setAppUrl(window.location.origin);
  }, []);

  // Use clean URL format: /install/?i=<token> instead of /install/<buildId>
  const fullLink = appUrl ? `${appUrl}/install/?i=${shareLink.short_id || shareLink.token}` : "";

  // Filter analytics for this share link if available
  const linkAnalytics = analytics?.filter(a => a.share_link_id === shareLink.id) || [];
  
  // Combine stats from ShareLink object (real-time counters) with detailed analytics if available
  const totalDownloads = shareLink.current_uses;
  const uniqueDevices = shareLink.unique_devices;
  const lastUsed = shareLink.last_used_at;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const getLinkTypeLabel = (type: string) => {
    switch (type) {
      case 'qa': return 'QA Team';
      case 'stakeholder': return 'Stakeholder';
      case 'beta_tester': return 'Beta Tester';
      case 'reviewer': return 'Reviewer';
      default: return type;
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/10 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-xl font-bold text-white flex items-center gap-3">
                    <LinkIcon className="w-6 h-6 text-primary-400" />
                    Share Link Details
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Info Card */}
                <div className="bg-white/5 rounded-xl p-5 mb-6 border border-white/10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-400 border border-primary-500/30">
                          {getLinkTypeLabel(shareLink.link_type)}
                        </span>
                        {shareLink.label && (
                          <span className="text-white font-medium">{shareLink.label}</span>
                        )}
                      </div>
                      <div className="text-sm text-white/50 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Created {formatRelativeTime(shareLink.created_at)}
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium border text-center ${
                      shareLink.is_active 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {shareLink.is_active ? 'Active' : 'Disabled'}
                    </div>
                  </div>

                  {/* Link Box */}
                  <div className="bg-black/40 rounded-lg p-1 flex items-center gap-2 border border-white/5">
                    <div className="flex-1 px-3 py-2 font-mono text-sm text-gray-300 truncate">
                      {fullLink}
                    </div>
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-medium text-sm ${
                        copied
                          ? "bg-green-500 text-white"
                          : "bg-white text-black hover:bg-gray-200"
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Link
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-sm">Downloads</span>
                      <Download className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {totalDownloads}
                      {shareLink.max_uses && (
                        <span className="text-sm font-normal text-white/40 ml-1">
                          / {shareLink.max_uses}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-sm">Unique Devices</span>
                      <Smartphone className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">{uniqueDevices}</div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-sm">Last Used</span>
                      <Clock className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="text-lg font-medium text-white truncate">
                      {lastUsed ? formatRelativeTime(lastUsed) : 'Never'}
                    </div>
                  </div>
                </div>

                {/* Recent Activity (if analytics provided) */}
                {linkAnalytics.length > 0 && (
                  <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/10">
                      <h4 className="font-semibold text-white">Recent Activity</h4>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-xs text-white/40 bg-white/5">
                            <th className="px-5 py-3 font-medium">Device</th>
                            <th className="px-5 py-3 font-medium">Location</th>
                            <th className="px-5 py-3 font-medium">Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {linkAnalytics.slice(0, 10).map((record) => (
                            <tr key={record.id} className="text-sm text-white/80 hover:bg-white/5 transition-colors">
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-2">
                                  {record.device_type === 'mobile' ? <Smartphone className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                                  <span className="truncate max-w-[150px]">{record.device_model || 'Unknown Device'}</span>
                                </div>
                              </td>
                              <td className="px-5 py-3">
                                {record.city ? `${record.city}, ${record.country}` : (record.country || 'Unknown')}
                              </td>
                              <td className="px-5 py-3 text-white/50">
                                {formatRelativeTime(record.installed_at)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {(!linkAnalytics || linkAnalytics.length === 0) && totalDownloads > 0 && (
                   <div className="text-center py-6 text-white/40 text-sm">
                     Detailed analytics list not available for this link yet.
                   </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
