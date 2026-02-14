const SESSION_KEY = "quiz_session_id";
const UTM_KEY = "quiz_utms";
const VARIANT_KEY = "quiz_variant";

export function getSessionId(): string {
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export function captureUtms(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const val = params.get(key);
    if (val) utms[key] = val;
  }
  if (Object.keys(utms).length > 0) {
    localStorage.setItem(UTM_KEY, JSON.stringify(utms));
  }
  return { ...JSON.parse(localStorage.getItem(UTM_KEY) || "{}"), ...utms };
}

export function getVariant(): string {
  let v = localStorage.getItem(VARIANT_KEY);
  if (!v) {
    v = Math.random() < 0.5 ? "A" : "B";
    localStorage.setItem(VARIANT_KEY, v);
  }
  return v;
}

export function getSessionPayload() {
  const utms = captureUtms();
  return {
    session_id: getSessionId(),
    variant: getVariant(),
    utm_source: utms.utm_source || null,
    utm_medium: utms.utm_medium || null,
    utm_campaign: utms.utm_campaign || null,
    utm_content: utms.utm_content || null,
    utm_term: utms.utm_term || null,
    referrer: document.referrer || null,
    landing_path: window.location.pathname || null,
    user_agent: navigator.userAgent || null,
  };
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export async function callEdge(fnName: string, method: "GET" | "POST", body?: any, params?: Record<string, string>) {
  let url = `${SUPABASE_URL}/functions/v1/${fnName}`;
  if (params) {
    url += "?" + new URLSearchParams(params).toString();
  }
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return res.json();
}

export async function trackEvent(event_name: string, payload?: any) {
  try {
    await callEdge("track", "POST", { session_id: getSessionId(), event_name, payload });
  } catch (e) {
    console.warn("track error:", e);
  }
}

export async function submitLead(email?: string, whatsapp?: string) {
  const sp = getSessionPayload();
  return callEdge("lead", "POST", { ...sp, email, whatsapp });
}

export async function submitQuizAnswers(answers: any) {
  return callEdge("submit-quiz", "POST", { session_id: getSessionId(), answers });
}

export async function verifyOrder(order_id: string) {
  return callEdge("verify-order", "GET", undefined, { order_id });
}

export async function verifyToken(token: string) {
  return callEdge("verify-token", "GET", undefined, { token });
}
