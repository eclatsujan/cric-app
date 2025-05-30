import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { mockMatch } from "../../src/utils/mockData";
import { MatchFormat, MatchStatus } from "../../src/interfaces/Match";

// Mock list of matches based on our single mock match
const mockMatches = [
  mockMatch,
  {
    ...mockMatch,
    id: "match-002",
    teams: {
      team1: { ...mockMatch.teams.team1, name: "England", shortName: "ENG" },
      team2: { ...mockMatch.teams.team2, name: "New Zealand", shortName: "NZ" },
    },
    venue: "Lord's Cricket Ground",
    status: MatchStatus.UPCOMING,
    date: "2025-06-02",
  },
  {
    ...mockMatch,
    id: "match-003",
    teams: {
      team1: { ...mockMatch.teams.team1, name: "South Africa", shortName: "SA" },
      team2: { ...mockMatch.teams.team2, name: "Pakistan", shortName: "PAK" },
    },
    venue: "Wanderers Stadium",
    format: MatchFormat.ODI,
    status: MatchStatus.COMPLETED,
    date: "2025-05-28",
  },
];

export default function MatchesScreen() {
  const renderMatchCard = ({ item }) => {
    const formatLabel = item.format === MatchFormat.T20 ? "T20" : item.format === MatchFormat.ODI ? "ODI" : "Test";

    const statusColor =
      item.status === MatchStatus.LIVE
        ? "#dc3545"
        : item.status === MatchStatus.UPCOMING
        ? "#28a745"
        : item.status === MatchStatus.COMPLETED
        ? "#6c757d"
        : "#17a2b8";

    const statusLabel =
      item.status === MatchStatus.LIVE
        ? "LIVE"
        : item.status === MatchStatus.UPCOMING
        ? "UPCOMING"
        : item.status === MatchStatus.COMPLETED
        ? "COMPLETED"
        : item.status === MatchStatus.PAUSED
        ? "PAUSED"
        : "DELAYED";

    return (
      <Link href={`/match/${item.id}`} asChild>
        <TouchableOpacity style={styles.matchCard}>
          <View style={styles.matchHeader}>
            <Text style={styles.formatLabel}>{formatLabel}</Text>
            <Text style={[styles.statusLabel, { color: statusColor }]}>{statusLabel}</Text>
          </View>

          <View style={styles.teamsContainer}>
            <View style={styles.teamRow}>
              <Text style={styles.teamName}>{item.teams.team1.name}</Text>
              {item.status !== MatchStatus.UPCOMING && item.innings && item.innings[0] && (
                <Text style={styles.score}>
                  {item.innings[0].totalRuns}/{item.innings[0].totalWickets}
                </Text>
              )}
            </View>

            <View style={styles.teamRow}>
              <Text style={styles.teamName}>{item.teams.team2.name}</Text>
              {item.status !== MatchStatus.UPCOMING && item.innings && item.innings[1] && (
                <Text style={styles.score}>
                  {item.innings[1].totalRuns}/{item.innings[1].totalWickets}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.matchFooter}>
            <Text style={styles.venueText}>{item.venue}</Text>
            <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockMatches}
        renderItem={renderMatchCard}
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
  matchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  formatLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6c757d",
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  teamsContainer: {
    marginBottom: 12,
  },
  teamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "500",
  },
  score: {
    fontSize: 16,
    fontWeight: "bold",
  },
  matchFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  venueText: {
    fontSize: 12,
    color: "#6c757d",
  },
  dateText: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
  },
});
