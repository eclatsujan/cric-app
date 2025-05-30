import { createClient } from "@supabase/supabase-js";
import { Match, BallEvent } from "../interfaces/Match";

// You should replace these with your actual Supabase credentials
// and store them in environment variables
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const supabaseService = {
  // Match operations
  async getMatch(matchId: string): Promise<Match | null> {
    const { data, error } = await supabase.from("matches").select("*").eq("id", matchId).single();

    if (error) {
      console.error("Error fetching match:", error);
      return null;
    }

    return data as Match;
  },

  async getMatches(status?: string): Promise<Match[]> {
    let query = supabase.from("matches").select("*");

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("date", { ascending: false });

    if (error) {
      console.error("Error fetching matches:", error);
      return [];
    }

    return data as Match[];
  },

  async updateMatch(match: Match): Promise<boolean> {
    const { error } = await supabase.from("matches").update(match).eq("id", match.id);

    if (error) {
      console.error("Error updating match:", error);
      return false;
    }

    return true;
  },

  // Ball-by-ball updates
  async addBallEvent(matchId: string, ballEvent: BallEvent): Promise<boolean> {
    const { error } = await supabase.from("ball_events").insert([{ ...ballEvent, match_id: matchId }]);

    if (error) {
      console.error("Error adding ball event:", error);
      return false;
    }

    return true;
  },

  async updateBallEvent(ballEvent: BallEvent): Promise<boolean> {
    const { error } = await supabase.from("ball_events").update(ballEvent).eq("id", ballEvent.id);

    if (error) {
      console.error("Error updating ball event:", error);
      return false;
    }

    return true;
  },

  async deleteBallEvent(ballEventId: string): Promise<boolean> {
    const { error } = await supabase.from("ball_events").delete().eq("id", ballEventId);

    if (error) {
      console.error("Error deleting ball event:", error);
      return false;
    }

    return true;
  },

  // Real-time subscriptions
  subscribeToMatch(matchId: string, callback: (match: Match) => void): () => void {
    const subscription = supabase
      .channel(`match:${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "matches",
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          callback(payload.new as Match);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  },

  subscribeToBallEvents(matchId: string, callback: (ballEvent: BallEvent) => void): () => void {
    const subscription = supabase
      .channel(`ball_events:${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ball_events",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          callback(payload.new as BallEvent);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  },
};
