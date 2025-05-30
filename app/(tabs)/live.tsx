import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { mockMatch } from "../../src/utils/mockData";
import { MatchStatus } from "../../src/interfaces/Match";

// Filter only live matches
const liveMatches = [
  mockMatch,
  {
    ...mockMatch,
    id: "match-004",
    teams: {
      team1: { ...mockMatch.teams.team1, name: "West Indies", shortName: "WI" },
      team2: { ...mockMatch.teams.team2, name: "Sri Lanka", shortName: "SL" },
    },
    venue: "Kensington Oval",
    status: MatchStatus.LIVE,
    date: "2025-05-30",
    innings: [
      {
        ...mockMatch.innings[0],
        teamId: mockMatch.teams.team2.id,
        teamName: "Sri Lanka",
        totalRuns: 142,
        totalWickets: 6,
        totalOvers: 18,
        currentOverBalls: 2,
      },
    ],
  },
];

export default function LiveScreen() {
  // If no live matches are available
  if (liveMatches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No live matches at the moment</Text>
      </View>
    );
  }

  const renderLiveMatchCard = ({ item }) => {
    const currentInnings = item.innings[item.currentInningsNumber - 1];
    const battingTeamName = currentInnings.teamName;
    const bowlingTeamName = battingTeamName === item.teams.team1.name ? item.teams.team2.name : item.teams.team1.name;

    // Format overs (e.g., 12.3 for 12 overs and 3 balls)
    const formatOvers = () => {
      return `${currentInnings.totalOvers}.${currentInnings.currentOverBalls}`;
    };

    return (
      <Link href={`/match/${item.id}`} asChild>
        <TouchableOpacity style={styles.matchCard}>
          <View style={styles.liveIndicatorContainer}>
            <View style={styles.liveIndicator} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              {battingTeamName} {currentInnings.totalRuns}/{currentInnings.totalWickets}
              <Text style={styles.oversText}> ({formatOvers()} ov)</Text>
            </Text>
          </View>

          <View style={styles.teamsContainer}>
            <Text style={styles.vsText}>
              {battingTeamName} vs {bowlingTeamName}
            </Text>
            <Text style={styles.formatText}>{item.venue}</Text>
          </View>

          {currentInnings.currentRunRate > 0 && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>CRR</Text>
                <Text style={styles.statValue}>{currentInnings.currentRunRate.toFixed(2)}</Text>
              </View>

              {currentInnings.requiredRunRate > 0 && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>RRR</Text>
                  <Text style={[styles.statValue, currentInnings.requiredRunRate > 12 ? styles.highRR : null]}>
                    {currentInnings.requiredRunRate.toFixed(2)}
                  </Text>
                </View>
              )}

              {item.targetScore > 0 && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Target</Text>
                  <Text style={styles.statValue}>{item.targetScore}</Text>
                </View>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Match</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={liveMatches}
        renderItem={renderLiveMatchCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#6c757d",
  },
  listContainer: {
    padding: 16,
  },
  matchCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  liveIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#dc3545",
    marginRight: 6,
  },
  liveText: {
    color: "#dc3545",
    fontWeight: "bold",
    fontSize: 14,
  },
  scoreContainer: {
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  oversText: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#6c757d",
  },
  teamsContainer: {
    marginBottom: 12,
  },
  vsText: {
    fontSize: 14,
  },
  formatText: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  highRR: {
    color: "#dc3545",
  },
  viewButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
