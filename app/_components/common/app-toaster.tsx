"use client";

import { Toaster } from "sonner";

/** Mounted once in the root layout so navigation does not duplicate toasts. */
export function AppToaster() {
  return <Toaster position="top-right" richColors closeButton duration={5000} visibleToasts={3} />;
}
