import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getUserCredits, type CreditsSnapshot } from "@/lib/credits.functions";
import { useAuth } from "@/lib/auth";

export function useCredits() {
  const { user } = useAuth();
  const fetchCredits = useServerFn(getUserCredits);
  const [credits, setCredits] = useState<CreditsSnapshot | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setCredits(null);
      return;
    }
    setLoading(true);
    try {
      const snap = await fetchCredits({});
      setCredits(snap);
    } catch (e) {
      console.error("useCredits", e);
    } finally {
      setLoading(false);
    }
  }, [user, fetchCredits]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Optimistic local update (e.g. after generation returns creditsLeft)
  const setBalance = useCallback((balance: number) => {
    setCredits((prev) => (prev ? { ...prev, balance } : prev));
  }, []);

  return { credits, loading, refresh, setBalance };
}
