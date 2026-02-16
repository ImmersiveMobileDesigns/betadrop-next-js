"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useAcceptTos } from "@/hooks/queries";
import { FileText, Shield, CheckCircle } from "lucide-react";

const CURRENT_TOS_VERSION = "1.0";

interface TosAcceptanceModalProps {
  isOpen: boolean;
  onAccepted: () => void;
}

export function TosAcceptanceModal({
  isOpen,
  onAccepted,
}: TosAcceptanceModalProps) {
  const acceptTos = useAcceptTos();

  const handleAccept = async () => {
    try {
      await acceptTos.mutateAsync(CURRENT_TOS_VERSION);
      onAccepted();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Cannot dismiss — must accept
      title="Terms of Service Update"
      description="Please review and accept our updated terms to continue using BetaDrop."
      showCloseButton={false}
      width="lg"
      footer={
        <Button
          onClick={handleAccept}
          isLoading={acceptTos.isPending}
          className="w-full sm:w-auto"
        >
          <CheckCircle className="w-4 h-4 mr-2" />I Accept the Terms
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
          <Shield className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-white/70">
            <p className="text-white font-medium mb-1">What&apos;s changed?</p>
            <ul className="space-y-1">
              <li>• Updated data processing and privacy terms</li>
              <li>• Added GDPR compliance provisions</li>
              <li>• Clarified data retention policies</li>
            </ul>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
          <FileText className="w-5 h-5 text-white/40 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-white/60">
            <p>
              By clicking &quot;I Accept the Terms&quot;, you agree to our{" "}
              <a
                href="/terms"
                target="_blank"
                className="text-primary-400 hover:text-primary-300 underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                target="_blank"
                className="text-primary-400 hover:text-primary-300 underline"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export { CURRENT_TOS_VERSION };
