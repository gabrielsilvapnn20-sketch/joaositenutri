type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/** Envia o evento para o Meta Pixel e o GA4, se estiverem carregados. */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  try {
    const standard: Record<string, string> = { lead_submitted: "Lead", whatsapp_click: "Contact" };
    if (window.fbq) {
      if (standard[event]) window.fbq("track", standard[event], params);
      window.fbq("trackCustom", event, params);
    }
    window.gtag?.("event", event, params);
  } catch {
    /* rastreamento nunca pode quebrar a página */
  }
}

/** Guarda UTMs da primeira visita para anexar ao lead. */
export function captureUtms() {
  try {
    const p = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    const found: Record<string, string> = {};
    keys.forEach((k) => {
      const v = p.get(k);
      if (v) found[k] = v.slice(0, 120);
    });
    if (Object.keys(found).length) sessionStorage.setItem("jv_utm", JSON.stringify(found));
  } catch {
    /* sem storage */
  }
}

export function readUtms(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem("jv_utm") || "{}");
  } catch {
    return {};
  }
}
