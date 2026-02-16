import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook that manages journal text for a given day, backed by Supabase.
 * On mount it fetches from DB; if DB is empty but localStorage has data,
 * it migrates once. Exposes `saveJournal()` for explicit upsert.
 */
export function useJournal(userId: string | undefined, dayNumber: number) {
  const [journalText, setJournalText] = useState("");
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();

  // Fetch from DB on mount, migrate from localStorage if needed
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("journal_entries")
          .select("content")
          .eq("user_id", userId)
          .eq("day_number", dayNumber)
          .maybeSingle();

        if (error) throw error;

        if (!cancelled) {
          if (data?.content) {
            setJournalText(data.content);
          } else {
            // Migrate from localStorage if present
            const lsKey = `astra_day${dayNumber}_journal_${userId}`;
            const local = localStorage.getItem(lsKey);
            if (local) {
              setJournalText(local);
              // Persist to DB in background
              await supabase.from("journal_entries").upsert(
                { user_id: userId, day_number: dayNumber, content: local },
                { onConflict: "user_id,day_number" }
              );
              localStorage.removeItem(lsKey);
            }
          }
          setLoaded(true);
        }
      } catch {
        // Fallback to localStorage
        if (!cancelled) {
          const lsKey = `astra_day${dayNumber}_journal_${userId}`;
          const local = localStorage.getItem(lsKey);
          if (local) setJournalText(local);
          setLoaded(true);
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [userId, dayNumber]);

  const saveJournal = useCallback(async () => {
    if (!userId || !journalText) return;
    try {
      const { error } = await supabase.from("journal_entries").upsert(
        { user_id: userId, day_number: dayNumber, content: journalText },
        { onConflict: "user_id,day_number" }
      );
      if (error) throw error;
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível salvar. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [userId, dayNumber, journalText, toast]);

  return { journalText, setJournalText, saveJournal, loaded };
}
