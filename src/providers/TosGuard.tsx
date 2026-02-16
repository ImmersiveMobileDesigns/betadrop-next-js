"use client";

import React from "react";
import { useUserSession } from "@/hooks/queries";
import {
  TosAcceptanceModal,
  CURRENT_TOS_VERSION,
} from "@/components/compliance/TosAcceptanceModal";

/**
 * TosGuard — wraps the app and shows a non-dismissible modal
 * when a logged-in user hasn't accepted the current ToS version.
 */
export function TosGuard({ children }: { children: React.ReactNode }) {
  const { data: user } = useUserSession();

  const needsAcceptance = user && user.tos_version !== CURRENT_TOS_VERSION;

  return (
    <>
      {children}
      <TosAcceptanceModal
        isOpen={!!needsAcceptance}
        onAccepted={() => {
          // Session will be invalidated by the mutation → useUserSession refetches
        }}
      />
    </>
  );
}
