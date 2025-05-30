import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Innings } from "../../interfaces/Match";

interface ScoreBoardProps {
  innings: Innings;
  targetScore?: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ innings, targetScore }) => {
  const currentRunRate =
    innings.totalRuns > 0
      ? (innings.totalRuns / (innings.totalOvers + innings.currentOverBalls / 6)).toFixed(2)
      : "0.00";

  const requiredRunRate =
    targetScore && innings.totalRuns < targetScore
      ? (
          (targetScore - innings.totalRuns) /
          (innings.maxOvers - innings.totalOvers - innings.currentOverBalls / 6 || 1)
        ).toFixed(2)
      : undefined;

  // Format overs (e.g., 12.3 for 12 overs and 3 balls)
  const formatOvers = () => {
    return `${innings.totalOvers}.${innings.currentOverBalls}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreHeader}>
        <Text style={styles.teamName}>{innings.teamName}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>
            {innings.totalRuns}/{innings.totalWickets}
          </Text>
          <Text style={styles.overs}>({formatOvers()} ov)</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>CRR</Text>
          <Text style={styles.statValue}>{currentRunRate}</Text>
        </View>

        {requiredRunRate && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>RRR</Text>
            <Text style={[styles.statValue, parseFloat(requiredRunRate) > 10 && styles.highRR]}>{requiredRunRate}</Text>
          </View>
        )}

        {targetScore && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Target</Text>
            <Text style={styles.statValue}>{targetScore}</Text>
          </View>
        )}
      </View>

      {/* Current over display */}
      {innings.currentOverBalls > 0 && (
        <View style={styles.currentOverContainer}>
          <Text style={styles.currentOverLabel}>This Over:</Text>
          <View style={styles.ballsContainer}>
            {innings.currentOverBalls > 0 &&
              innings.currentOver.map((ball, index) => (
                <View
                  key={index}
                  style={[
                    styles.ballItem,
                    ball.runs === 4 && styles.boundaryFour,
                    ball.runs === 6 && styles.boundarySix,
                    ball.wicketType !== "NONE" && styles.wicketBall,
                    ball.extraType !== "NONE" && styles.extraBall,
                  ]}>
                  <Text style={styles.ballText}>
                    {ball.wicketType !== "NONE"
                      ? "W"
                      : ball.extraType === "WIDE"
                      ? "Wd"
                      : ball.extraType === "NO_BALL"
                      ? "Nb"
                      : ball.runs}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  score: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 4,
  },
  overs: {
    fontSize: 14,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  highRR: {
    color: "#dc3545",
  },
  currentOverContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  currentOverLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  ballsContainer: {
    flexDirection: "row",
  },
  ballItem: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  boundaryFour: {
    backgroundColor: "#f0ad4e",
    borderColor: "#f0ad4e",
  },
  boundarySix: {
    backgroundColor: "#5cb85c",
    borderColor: "#5cb85c",
  },
  wicketBall: {
    backgroundColor: "#dc3545",
    borderColor: "#dc3545",
  },
  extraBall: {
    backgroundColor: "#17a2b8",
    borderColor: "#17a2b8",
  },
  ballText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
});
