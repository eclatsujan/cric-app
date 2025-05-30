import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { mockMatch } from "../../src/utils/mockData";

// Create a list of teams based on our mock data
const mockTeams = [
  mockMatch.teams.team1,
  mockMatch.teams.team2,
  {
    id: "team-003",
    name: "England",
    shortName: "ENG",
    logoUrl: "https://example.com/england-logo.png",
    players: [],
  },
  {
    id: "team-004",
    name: "New Zealand",
    shortName: "NZ",
    logoUrl: "https://example.com/new-zealand-logo.png",
    players: [],
  },
  {
    id: "team-005",
    name: "South Africa",
    shortName: "SA",
    logoUrl: "https://example.com/south-africa-logo.png",
    players: [],
  },
  {
    id: "team-006",
    name: "Pakistan",
    shortName: "PAK",
    logoUrl: "https://example.com/pakistan-logo.png",
    players: [],
  },
  {
    id: "team-007",
    name: "West Indies",
    shortName: "WI",
    logoUrl: "https://example.com/west-indies-logo.png",
    players: [],
  },
  {
    id: "team-008",
    name: "Sri Lanka",
    shortName: "SL",
    logoUrl: "https://example.com/sri-lanka-logo.png",
    players: [],
  },
];

export default function TeamsScreen() {
  const renderTeamCard = ({ item }) => {
    return (
      <TouchableOpacity style={styles.teamCard}>
        <View style={styles.teamLogoPlaceholder}>
          <Text style={styles.teamLogoText}>{item.shortName}</Text>
        </View>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{item.name}</Text>
          <Text style={styles.playerCount}>{item.players.length} Players</Text>
        </View>
        <View style={styles.viewProfileButton}>
          <Text style={styles.viewProfileText}>View</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockTeams}
        renderItem={renderTeamCard}
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
  teamCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  teamLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
  },
  teamLogoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#495057",
  },
  teamInfo: {
    flex: 1,
    marginLeft: 16,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  playerCount: {
    fontSize: 14,
    color: "#6c757d",
  },
  viewProfileButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewProfileText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
