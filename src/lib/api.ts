import { supabase } from "@/integrations/supabase/client";

const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL + "/functions/v1";

async function callFunction(name: string, body: Record<string, unknown>) {
  const res = await fetch(`${FUNCTIONS_URL}/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function queryFunction(name: string, params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${FUNCTIONS_URL}/${name}?${qs}`, {
    method: "GET",
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });
  return res.json();
}

export async function submitLead(data: {
  session_id: string;
  email?: string;
  whatsapp?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  variant?: string;
  referrer?: string;
  landing_path?: string;
  user_agent?: string;
}) {
  return callFunction("lead", data);
}

export async function submitQuiz(session_id: string, answers: Record<string, number>) {
  return callFunction("submit-quiz", { session_id, answers });
}

export async function trackEvent(session_id: string, event_name: string, payload?: unknown) {
  return callFunction("track", { session_id, event_name, payload });
}

export async function verifyOrder(orderId: string) {
  return queryFunction("verify-order", { order_id: orderId });
}

export async function verifyToken(token: string) {
  return queryFunction("verify-token", { token });
}
