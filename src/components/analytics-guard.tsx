"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GA_MEASUREMENT_ID, isPrivatePath } from "@/lib/analytics";

// Keeps measurement off on owner pages after client-side navigation.
export function AnalyticsGuard() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    (window as unknown as Record<string, boolean>)[`ga-disable-${GA_MEASUREMENT_ID}`] = isPrivatePath(pathname);
  }, [pathname]);

  return null;
}
