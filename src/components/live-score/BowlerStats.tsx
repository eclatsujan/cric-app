import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BowlerInnings, Player } from "../../interfaces/Match";

interface BowlerStatsProps {
  bowlers: Record<string, BowlerInnings>;
  players: Player[];
  currentBowler: string;
}

export const BowlerStats: React.FC<BowlerStatsProps> = ({ bowlers, players, currentBowler }) => {
  const getBowlerName = (id: string) => {
    const player = players.find((p) => p.id === id);
    return player ? player.name : "Unknown Player";
  };

  const renderBowlerRow = (bowlerId: string, isCurrent: boolean) => {
    const innings = bowlers[bowlerId];
    if (!innings) return null;

    // Format overs (e.g., 4.2 for 4 overs and 2 balls)
    const formatOvers = (overs: number) => {
      const fullOvers = Math.floor(overs);
      const balls = (overs - fullOvers) * 6;
      return `${fullOvers}.${balls}`;
    };

    return (
      <View style={styles.bowlerRow} key={bowlerId}>
        <View style={styles.nameColumn}>
          <Text style={[styles.bowlerName, isCurrent && styles.currentBowler]}>
            {getBowlerName(bowlerId)} {isCurrent && "*"}
          </Text>
        </View>
        <Text style={styles.stat}>{formatOvers(innings.overs)}</Text>
        <Text style={styles.stat}>{innings.maidens}</Text>
        <Text style={styles.stat}>{innings.runs}</Text>
        <Text style={styles.stat}>{innings.wickets}</Text>
        <Text style={styles.stat}>{innings.economy.toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, styles.nameColumn]}>Bowler</Text>
        <Text style={[styles.headerText, styles.stat]}>O</Text>
        <Text style={[styles.headerText, styles.stat]}>M</Text>
        <Text style={[styles.headerText, styles.stat]}>R</Text>
        <Text style={[styles.headerText, styles.stat]}>W</Text>
        <Text style={[styles.headerText, styles.stat]}>ECON</Text>
      </View>

      {/* Current bowler */}
      {currentBowler && renderBowlerRow(currentBowler, true)}

      {/* Show other bowlers who have bowled */}
      {Object.keys(bowlers)
        .filter((id) => id !== currentBowler && bowlers[id].overs > 0)
        .map((id) => renderBowlerRow(id, false))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#666",
  },
  bowlerRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  nameColumn: {
    flex: 2,
  },
  bowlerName: {
    fontWeight: "500",
    fontSize: 14,
  },
  currentBowler: {
    fontWeight: "bold",
  },
  stat: {
    flex: 0.7,
    textAlign: "center",
    fontSize: 14,
  },
});
