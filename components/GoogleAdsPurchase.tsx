"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function GoogleAdsPurchase({
  transactionId,
  value,
}: {
  transactionId: string;
  value: number;
}) {
  useEffect(() => {
    // Evita duplicar el evento si el usuario refresca la página
    const key = `gads_conv_${transactionId}`;
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem(key) === "1") return;

      if (window.gtag) {
        window.gtag("event", "conversion", {
          send_to: "AW-17965047652/GNUTCLnJ0_sbEOS-s_ZC",
          value,
          currency: "PEN",
          transaction_id: transactionId,
        });

        sessionStorage.setItem(key, "1");
      }
    }
  }, [transactionId, value]);

  return null;
}