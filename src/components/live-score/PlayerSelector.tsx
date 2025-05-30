import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Team, Player } from "../../interfaces/Match";

interface PlayerSelectorProps {
  battingTeam: Team;
  bowlingTeam: Team;
  currentBatsmen: string[]; // Array of player IDs [striker, non-striker]
  currentBowler: string; // Player ID
  onSelectStriker: (playerId: string) => void;
  onSelectNonStriker: (playerId: string) => void;
  onSelectBowler: (playerId: string) => void;
  onSwitchBatsmen: () => void;
}

export const PlayerSelector: React.FC<PlayerSelectorProps> = ({
  battingTeam,
  bowlingTeam,
  currentBatsmen,
  currentBowler,
  onSelectStriker,
  onSelectNonStriker,
  onSelectBowler,
  onSwitchBatsmen,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.batsmenContainer}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Striker</Text>
            <TouchableOpacity style={styles.switchButton} onPress={onSwitchBatsmen}>
              <Text style={styles.switchButtonText}>↔️ Switch</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.playerList}>
            {battingTeam.players.map((player) => (
              <TouchableOpacity
                key={player.id}
                style={[styles.playerItem, currentBatsmen[0] === player.id && styles.selectedPlayer]}
                onPress={() => onSelectStriker(player.id)}>
                <Text
                  style={[styles.playerName, currentBatsmen[0] === player.id && styles.selectedPlayerName]}
                  numberOfLines={1}>
                  {player.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Non-Striker</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.playerList}>
            {battingTeam.players.map((player) => (
              <TouchableOpacity
                key={player.id}
                style={[
                  styles.playerItem,
                  currentBatsmen[1] === player.id && styles.selectedPlayer,
                  // Disable if already selected as striker
                  currentBatsmen[0] === player.id && styles.disabledPlayer,
                ]}
                onPress={() => onSelectNonStriker(player.id)}
                disabled={currentBatsmen[0] === player.id}>
                <Text
                  style={[
                    styles.playerName,
                    currentBatsmen[1] === player.id && styles.selectedPlayerName,
                    currentBatsmen[0] === player.id && styles.disabledPlayerName,
                  ]}
                  numberOfLines={1}>
                  {player.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bowler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.playerList}>
          {bowlingTeam.players.map((player) => (
            <TouchableOpacity
              key={player.id}
              style={[styles.playerItem, currentBowler === player.id && styles.selectedPlayer]}
              onPress={() => onSelectBowler(player.id)}>
              <Text
                style={[styles.playerName, currentBowler === player.id && styles.selectedPlayerName]}
                numberOfLines={1}>
                {player.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  batsmenContainer: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  playerList: {
    flexDirection: "row",
  },
  playerItem: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minWidth: 100,
  },
  selectedPlayer: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  disabledPlayer: {
    backgroundColor: "#e0e0e0",
    borderColor: "#cccccc",
  },
  playerName: {
    fontWeight: "500",
    textAlign: "center",
  },
  selectedPlayerName: {
    color: "#ffffff",
  },
  disabledPlayerName: {
    color: "#999999",
  },
  switchButton: {
    backgroundColor: "#6c757d",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  switchButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
