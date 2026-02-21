import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { buildProfile, QuizProfile } from "@/data/quizProfile";

export function useQuizProfile() {
  const [profile, setProfile] = useState<QuizProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("not_authenticated");
          setLoading(false);
          return;
        }

        const { data, error: dbError } = await supabase
          .from("quiz_submissions")
          .select("answers_json")
          .eq("user_id", user.id)
          .order("completed_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (cancelled) return;

        if (dbError) {
          setError(dbError.message);
          setLoading(false);
          return;
        }

        if (!data || !data.answers_json) {
          setError("no_data");
          setLoading(false);
          return;
        }

        const answers = data.answers_json as Record<string, number>;
        setProfile(buildProfile(answers));
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "unexpected");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, []);

  return { profile, loading, error };
}
