const SESSION_KEY = "quiz_session_id";
const UTM_KEY = "quiz_utms";
const VARIANT_KEY = "quiz_variant";
const ANSWERS_KEY = "quiz_answers";

export function getOrCreateSessionId(): string {
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export function getSessionId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_path?: string;
}

export function captureUtms(): UtmParams {
  const existing = localStorage.getItem(UTM_KEY);
  if (existing) return JSON.parse(existing);

  const params = new URLSearchParams(window.location.search);
  const utms: UtmParams = {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
    utm_content: params.get("utm_content") || undefined,
    utm_term: params.get("utm_term") || undefined,
    referrer: document.referrer || undefined,
    landing_path: window.location.pathname,
  };
  localStorage.setItem(UTM_KEY, JSON.stringify(utms));
  return utms;
}

export function getUtms(): UtmParams {
  const raw = localStorage.getItem(UTM_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function setVariant(variant: string) {
  localStorage.setItem(VARIANT_KEY, variant);
}

export function getVariant(): string | null {
  return localStorage.getItem(VARIANT_KEY);
}

export function storeAnswer(index: number, answerIndex: number) {
  const raw = localStorage.getItem(ANSWERS_KEY);
  const answers: Record<string, number> = raw ? JSON.parse(raw) : {};
  answers[index.toString()] = answerIndex;
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
}

export function getAnswers(): Record<string, number> {
  const raw = localStorage.getItem(ANSWERS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function clearAnswers() {
  localStorage.removeItem(ANSWERS_KEY);
}
