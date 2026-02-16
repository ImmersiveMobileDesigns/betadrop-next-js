"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useExportUserData, useDeleteAccount } from "@/hooks/queries";
import {
  Download,
  Trash2,
  AlertTriangle,
  FileJson,
  CheckCircle,
} from "lucide-react";
import type { User } from "@/types";

interface DataPrivacySectionProps {
  user: User;
}

export function DataPrivacySection({ user }: DataPrivacySectionProps) {
  const router = useRouter();
  const exportData = useExportUserData();
  const deleteAccount = useDeleteAccount();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = async () => {
    try {
      const data = await exportData.mutateAsync();
      // Download the JSON data
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `betadrop-data-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch {
      // Error handled by mutation
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmEmail !== user.email) return;
    try {
      await deleteAccount.mutateAsync(confirmEmail);
      router.push("/");
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <>
      {/* Data Export Section */}
      <div className="glass rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <FileJson className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">Export Your Data</h3>
            <p className="text-sm text-white/50">
              Download all your personal data (GDPR Article 15)
            </p>
          </div>
        </div>
        <p className="text-sm text-white/60 mb-4">
          Get a complete copy of your data including account info, builds,
          passkeys, and sessions.
        </p>
        <Button
          onClick={handleExport}
          isLoading={exportData.isPending}
          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/20"
        >
          {exportSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Downloaded!
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export My Data
            </>
          )}
        </Button>
        {exportData.isError && (
          <p className="mt-2 text-sm text-red-400">
            Failed to export data. Please try again.
          </p>
        )}
      </div>

      {/* Delete Account Section */}
      <div className="glass rounded-2xl border border-red-500/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">Delete Account</h3>
            <p className="text-sm text-white/50">
              Permanently erase your account and data (GDPR Article 17)
            </p>
          </div>
        </div>
        <p className="text-sm text-white/60 mb-4">
          This action is irreversible. All your builds, files, passkeys, and
          personal data will be permanently deleted.
        </p>
        <Button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete My Account
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setConfirmEmail("");
        }}
        title="Delete Account Permanently"
        width="md"
        footer={
          <>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setConfirmEmail("");
              }}
              disabled={deleteAccount.isPending}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <Button
              onClick={handleDeleteAccount}
              isLoading={deleteAccount.isPending}
              disabled={confirmEmail !== user.email}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete My Account
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-white/70">
              <p className="text-white font-medium mb-1">
                This action cannot be undone
              </p>
              <p>All your data will be permanently deleted, including:</p>
              <ul className="mt-1 space-y-0.5 text-white/50">
                <li>• All uploaded builds and associated files</li>
                <li>• Share links and analytics data</li>
                <li>• Passkeys and session data</li>
                <li>• Your account and profile information</li>
              </ul>
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">
              Type <span className="text-white font-medium">{user.email}</span>{" "}
              to confirm:
            </label>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder={user.email}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50"
            />
          </div>

          {deleteAccount.isError && (
            <p className="text-sm text-red-400">
              {deleteAccount.error instanceof Error
                ? deleteAccount.error.message
                : "Failed to delete account"}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
