import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { Match, BallEvent } from "../interfaces/Match";
import { supabaseService } from "../services/supabaseService";

interface MatchContextType {
  match: Match | null;
  loading: boolean;
  error: string | null;
  fetchMatch: (matchId: string) => Promise<void>;
  updateMatch: (updatedMatch: Match) => Promise<void>;
  addBallEvent: (matchId: string, ballEvent: BallEvent) => Promise<void>;
  undoLastBall: () => Promise<void>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsubscribe, setUnsubscribe] = useState<() => void | null>(() => null);

  useEffect(() => {
    // Clean up subscription when component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [unsubscribe]);

  const fetchMatch = async (matchId: string) => {
    try {
      setLoading(true);
      setError(null);

      const fetchedMatch = await supabaseService.getMatch(matchId);

      if (!fetchedMatch) {
        setError("Match not found");
        return;
      }

      setMatch(fetchedMatch);

      // Subscribe to real-time updates for this match
      const unsusbcribeFunc = supabaseService.subscribeToMatch(matchId, (updatedMatch) => {
        setMatch(updatedMatch);
      });

      setUnsubscribe(() => unsusbcribeFunc);
    } catch (err) {
      setError("Error fetching match data");
      console.error("Error fetching match:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateMatch = async (updatedMatch: Match) => {
    try {
      setLoading(true);
      setError(null);

      const success = await supabaseService.updateMatch(updatedMatch);

      if (!success) {
        setError("Failed to update match");
        return;
      }

      setMatch(updatedMatch);
    } catch (err) {
      setError("Error updating match data");
      console.error("Error updating match:", err);
    } finally {
      setLoading(false);
    }
  };

  const addBallEvent = async (matchId: string, ballEvent: BallEvent) => {
    try {
      setLoading(true);
      setError(null);

      const success = await supabaseService.addBallEvent(matchId, ballEvent);

      if (!success) {
        setError("Failed to add ball event");
        return;
      }

      // Update local match state with the new ball event
      if (match) {
        const updatedMatch = { ...match };
        updatedMatch.matchHistory.push(ballEvent);

        const currentInnings = updatedMatch.innings[updatedMatch.currentInningsNumber - 1];
        if (currentInnings.currentOver) {
          currentInnings.currentOver.push(ballEvent);
        } else {
          currentInnings.currentOver = [ballEvent];
        }

        setMatch(updatedMatch);
      }
    } catch (err) {
      setError("Error adding ball event");
      console.error("Error adding ball event:", err);
    } finally {
      setLoading(false);
    }
  };

  const undoLastBall = async () => {
    try {
      if (!match || match.matchHistory.length === 0) {
        return;
      }

      setLoading(true);
      setError(null);

      const lastBall = match.matchHistory[match.matchHistory.length - 1];

      const success = await supabaseService.deleteBallEvent(lastBall.id);

      if (!success) {
        setError("Failed to undo last ball");
        return;
      }

      // Update local match state by removing the last ball event
      const updatedMatch = { ...match };
      updatedMatch.matchHistory.pop();

      const currentInnings = updatedMatch.innings[updatedMatch.currentInningsNumber - 1];
      if (currentInnings.currentOver && currentInnings.currentOver.length > 0) {
        currentInnings.currentOver.pop();
      }

      setMatch(updatedMatch);
    } catch (err) {
      setError("Error undoing last ball");
      console.error("Error undoing last ball:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MatchContext.Provider
      value={{
        match,
        loading,
        error,
        fetchMatch,
        updateMatch,
        addBallEvent,
        undoLastBall,
      }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = (): MatchContextType => {
  const context = useContext(MatchContext);

  if (context === undefined) {
    throw new Error("useMatch must be used within a MatchProvider");
  }

  return context;
};
