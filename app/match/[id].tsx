import React, { useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BallInput } from "../../src/components/live-score/BallInput";
import { ScoreBoard } from "../../src/components/live-score/ScoreBoard";
import { PlayerSelector } from "../../src/components/live-score/PlayerSelector";
import { BatsmanStats } from "../../src/components/live-score/BatsmanStats";
import { BowlerStats } from "../../src/components/live-score/BowlerStats";
import { MatchControls } from "../../src/components/live-score/MatchControls";
import { BallEvent, ExtraType, WicketType, MatchStatus } from "../../src/interfaces/Match";
import { useMatch } from "../../src/contexts/MatchContext";

export default function MatchScreen() {
  const { id } = useLocalSearchParams();
  const { match, loading, error, fetchMatch, updateMatch, addBallEvent, undoLastBall } = useMatch();

  useEffect(() => {
    if (id) {
      fetchMatch(id as string);
    }
  }, [id, fetchMatch]);

  const getCurrentInnings = () => {
    if (!match) return null;
    return match.innings[match.currentInningsNumber - 1];
  };

  const getBattingTeam = () => {
    if (!match) return null;
    const currentInnings = getCurrentInnings();
    return currentInnings?.teamId === match.teams.team1.id ? match.teams.team1 : match.teams.team2;
  };

  const getBowlingTeam = () => {
    if (!match) return null;
    const currentInnings = getCurrentInnings();
    return currentInnings?.teamId === match.teams.team1.id ? match.teams.team2 : match.teams.team1;
  };

  const handleBallAdded = (ballData: {
    runs: number;
    extraType: ExtraType;
    extraRuns: number;
    wicketType: WicketType;
  }) => {
    if (!match) return;

    const innings = getCurrentInnings();
    if (!innings) return;

    // Create a new ball event
    const newBall: BallEvent = {
      id: `ball-${Date.now()}`,
      ballNumber: innings.totalOvers + innings.currentOverBalls / 10,
      runs: ballData.runs,
      extraType: ballData.extraType,
      extraRuns: ballData.extraRuns,
      wicketType: ballData.wicketType,
      striker: innings.currentBatsmen[0],
      nonStriker: innings.currentBatsmen[1],
      bowler: innings.currentBowler,
      timestamp: Date.now(),
    };

    // Create updated match state with the new ball
    const updatedMatch = processNewBall(match, newBall);

    // Update state via context
    updateMatch(updatedMatch);

    // Also add ball event to the real-time database
    addBallEvent(match.id, newBall);
  };

  const processNewBall = (currentMatch, ball) => {
    // Deep copy the match to avoid mutation
    const updatedMatch = JSON.parse(JSON.stringify(currentMatch));
    const innings = updatedMatch.innings[updatedMatch.currentInningsNumber - 1];

    // Calculate total runs from this ball
    const totalRuns = ball.runs + ball.extraRuns;

    // Update innings totals
    innings.totalRuns += totalRuns;

    // Handle extras - don't increment balls faced for wides and no balls
    if (ball.extraType !== ExtraType.WIDE && ball.extraType !== ExtraType.NO_BALL) {
      innings.currentOverBalls += 1;

      // Check if over is complete
      if (innings.currentOverBalls === 6) {
        innings.totalOvers += 1;
        innings.currentOverBalls = 0;
      }
    }

    // Handle wicket
    if (ball.wicketType !== WicketType.NONE) {
      innings.totalWickets += 1;
    }

    // Update batsman stats
    const striker = innings.batsmen[ball.striker];
    if (striker) {
      striker.runs += ball.runs;
      striker.balls += 1;
      if (ball.runs === 4) striker.fours += 1;
      if (ball.runs === 6) striker.sixes += 1;
      striker.strikeRate = (striker.runs / striker.balls) * 100;

      // If out, update dismissal info
      if (ball.wicketType !== WicketType.NONE) {
        striker.isOut = true;
        striker.outMethod = ball.wicketType;
        striker.outBowler = ball.bowler;
        striker.outFielder = ball.fielder;
        striker.isBatting = false;
      }
    }

    // Update bowler stats
    const bowler = innings.bowlers[ball.bowler];
    if (bowler) {
      bowler.runs += totalRuns;
      // Only count legal deliveries for overs bowled
      if (ball.extraType !== ExtraType.WIDE && ball.extraType !== ExtraType.NO_BALL) {
        bowler.overs = Math.floor(bowler.overs) + 1 / 6;
      }
      if (ball.wicketType !== WicketType.NONE && ball.wicketType !== WicketType.RUN_OUT) {
        bowler.wickets += 1;
      }
      bowler.economy = bowler.runs / (Math.floor(bowler.overs) + (bowler.overs % 1) * (10 / 6));
    }

    // Add ball to match history
    updatedMatch.matchHistory.push(ball);

    // Update current over
    if (innings.currentOver) {
      innings.currentOver.push(ball);
    } else {
      innings.currentOver = [ball];
    }

    return updatedMatch;
  };

  const handleSwitchBatsmen = () => {
    if (!match) return;

    const updatedMatch = { ...match };
    const innings = updatedMatch.innings[updatedMatch.currentInningsNumber - 1];

    // Swap striker and non-striker
    [innings.currentBatsmen[0], innings.currentBatsmen[1]] = [innings.currentBatsmen[1], innings.currentBatsmen[0]];

    updateMatch(updatedMatch);
  };

  const handleSelectStriker = (playerId: string) => {
    if (!match) return;

    const updatedMatch = { ...match };
    const innings = updatedMatch.innings[updatedMatch.currentInningsNumber - 1];

    // Set new striker
    innings.currentBatsmen[0] = playerId;

    // Initialize batsman stats if not already present
    if (!innings.batsmen[playerId]) {
      innings.batsmen[playerId] = {
        playerId,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        isBatting: true,
        isOut: false,
      };
    }

    updateMatch(updatedMatch);
  };

  const handleSelectNonStriker = (playerId: string) => {
    if (!match) return;

    const updatedMatch = { ...match };
    const innings = updatedMatch.innings[updatedMatch.currentInningsNumber - 1];

    // Set new non-striker
    innings.currentBatsmen[1] = playerId;

    // Initialize batsman stats if not already present
    if (!innings.batsmen[playerId]) {
      innings.batsmen[playerId] = {
        playerId,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        isBatting: true,
        isOut: false,
      };
    }

    updateMatch(updatedMatch);
  };

  const handleSelectBowler = (playerId: string) => {
    if (!match) return;

    const updatedMatch = { ...match };
    const innings = updatedMatch.innings[updatedMatch.currentInningsNumber - 1];

    // Set new bowler
    innings.currentBowler = playerId;

    // Initialize bowler stats if not already present
    if (!innings.bowlers[playerId]) {
      innings.bowlers[playerId] = {
        playerId,
        overs: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
        economy: 0,
      };
    }

    updateMatch(updatedMatch);
  };

  const handlePauseMatch = () => {
    if (!match) return;

    const updatedMatch = { ...match, status: MatchStatus.PAUSED };
    updateMatch(updatedMatch);
  };

  const handleResumeMatch = () => {
    if (!match) return;

    const updatedMatch = { ...match, status: MatchStatus.LIVE };
    updateMatch(updatedMatch);
  };

  const handleEndInnings = () => {
    if (!match) return;

    const updatedMatch = { ...match };

    // Move to next innings if available
    if (updatedMatch.currentInningsNumber === 1) {
      updatedMatch.currentInningsNumber = 2;

      // Set target for second innings
      updatedMatch.targetScore = updatedMatch.innings[0].totalRuns + 1;

      // Initialize second innings if not already present
      if (!updatedMatch.innings[1]) {
        const battingTeamId =
          updatedMatch.innings[0].teamId === updatedMatch.teams.team1.id
            ? updatedMatch.teams.team2.id
            : updatedMatch.teams.team1.id;

        updatedMatch.innings[1] = {
          id: `innings-${Date.now()}`,
          teamId: battingTeamId,
          teamName:
            battingTeamId === updatedMatch.teams.team1.id
              ? updatedMatch.teams.team1.name
              : updatedMatch.teams.team2.name,
          battingOrder: [],
          currentBatsmen: [],
          batsmen: {},
          bowlers: {},
          currentBowler: "",
          totalRuns: 0,
          totalWickets: 0,
          totalOvers: 0,
          currentOverBalls: 0,
          extras: 0,
          overs: [],
          currentOver: [],
          currentRunRate: 0,
          requiredRunRate: (updatedMatch.targetScore || 0) / updatedMatch.maxOvers,
          maxOvers: updatedMatch.maxOvers,
        };
      }
    } else {
      // End match if second innings
      updatedMatch.status = MatchStatus.COMPLETED;

      // Determine match result
      const firstInningsRuns = updatedMatch.innings[0].totalRuns;
      const secondInningsRuns = updatedMatch.innings[1].totalRuns;

      updatedMatch.result = {
        winner: secondInningsRuns > firstInningsRuns ? updatedMatch.innings[1].teamId : updatedMatch.innings[0].teamId,
        winMargin: Math.abs(secondInningsRuns - firstInningsRuns),
        winMarginType: secondInningsRuns > firstInningsRuns ? "WICKETS" : "RUNS",
      };
    }

    updateMatch(updatedMatch);
  };

  const handleEndMatch = () => {
    if (!match) return;

    const updatedMatch = { ...match, status: MatchStatus.COMPLETED };
    updateMatch(updatedMatch);
  };

  const handleUndoLastBall = () => {
    undoLastBall();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading match data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!match) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load match data</Text>
      </View>
    );
  }

  const currentInnings = getCurrentInnings();
  const battingTeam = getBattingTeam();
  const bowlingTeam = getBowlingTeam();

  if (!currentInnings || !battingTeam || !bowlingTeam) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Match data is incomplete</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Match header */}
      <View style={styles.header}>
        <Text style={styles.matchTitle}>
          {match.teams.team1.name} vs {match.teams.team2.name}
        </Text>
        <Text style={styles.venueText}>{match.venue}</Text>
      </View>

      {/* Scoreboard */}
      <ScoreBoard innings={currentInnings} targetScore={match.targetScore} />

      {/* Match controls */}
      <MatchControls
        matchStatus={match.status}
        onPauseMatch={handlePauseMatch}
        onResumeMatch={handleResumeMatch}
        onEndInnings={handleEndInnings}
        onEndMatch={handleEndMatch}
        onUndoLastBall={handleUndoLastBall}
      />

      {/* Player selector */}
      <PlayerSelector
        battingTeam={battingTeam}
        bowlingTeam={bowlingTeam}
        currentBatsmen={currentInnings.currentBatsmen}
        currentBowler={currentInnings.currentBowler}
        onSelectStriker={handleSelectStriker}
        onSelectNonStriker={handleSelectNonStriker}
        onSelectBowler={handleSelectBowler}
        onSwitchBatsmen={handleSwitchBatsmen}
      />

      {/* Ball input */}
      <BallInput onBallAdded={handleBallAdded} />

      {/* Batsman stats */}
      <Text style={styles.sectionTitle}>Batting</Text>
      <BatsmanStats
        batsmen={currentInnings.batsmen}
        players={battingTeam.players}
        currentBatsmen={currentInnings.currentBatsmen}
      />

      {/* Bowler stats */}
      <Text style={styles.sectionTitle}>Bowling</Text>
      <BowlerStats
        bowlers={currentInnings.bowlers}
        players={bowlingTeam.players}
        currentBowler={currentInnings.currentBowler}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
  },
  header: {
    marginBottom: 16,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  venueText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
});
