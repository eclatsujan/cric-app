import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BatsmanInnings, Player } from "../../interfaces/Match";

interface BatsmanStatsProps {
  batsmen: Record<string, BatsmanInnings>;
  players: Player[];
  currentBatsmen: string[]; // [striker, non-striker]
}

export const BatsmanStats: React.FC<BatsmanStatsProps> = ({ batsmen, players, currentBatsmen }) => {
  const getBatsmanName = (id: string) => {
    const player = players.find((p) => p.id === id);
    return player ? player.name : "Unknown Player";
  };

  const renderBatsmanRow = (batsmanId: string, isStriker: boolean) => {
    const innings = batsmen[batsmanId];
    if (!innings) return null;

    return (
      <View style={styles.batsmanRow} key={batsmanId}>
        <View style={styles.nameColumn}>
          <Text style={styles.batsmanName}>
            {getBatsmanName(batsmanId)} {isStriker && "*"}
          </Text>
          {innings.outMethod && (
            <Text style={styles.outMethod}>
              {innings.outMethod === "CAUGHT" && "c. " + getBatsmanName(innings.outFielder || "")}
              {innings.outMethod === "BOWLED" && "b. "}
              {innings.outMethod === "LBW" && "lbw. "}
              {innings.outMethod === "RUN_OUT" && "run out (" + getBatsmanName(innings.outFielder || "") + ")"}
              {innings.outMethod === "STUMPED" && "st. " + getBatsmanName(innings.outFielder || "")}
              {innings.outBowler && " " + getBatsmanName(innings.outBowler)}
            </Text>
          )}
        </View>
        <Text style={styles.stat}>{innings.runs}</Text>
        <Text style={styles.stat}>{innings.balls}</Text>
        <Text style={styles.stat}>{innings.fours}</Text>
        <Text style={styles.stat}>{innings.sixes}</Text>
        <Text style={styles.stat}>{innings.strikeRate.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, styles.nameColumn]}>Batter</Text>
        <Text style={[styles.headerText, styles.stat]}>R</Text>
        <Text style={[styles.headerText, styles.stat]}>B</Text>
        <Text style={[styles.headerText, styles.stat]}>4s</Text>
        <Text style={[styles.headerText, styles.stat]}>6s</Text>
        <Text style={[styles.headerText, styles.stat]}>SR</Text>
      </View>

      {/* Current batsmen */}
      {currentBatsmen[0] && renderBatsmanRow(currentBatsmen[0], true)}
      {currentBatsmen[1] && renderBatsmanRow(currentBatsmen[1], false)}

      {/* Show other batsmen who have batted */}
      {Object.keys(batsmen)
        .filter((id) => !currentBatsmen.includes(id) && batsmen[id].balls > 0)
        .map((id) => renderBatsmanRow(id, false))}
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
  batsmanRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  nameColumn: {
    flex: 2.5,
  },
  batsmanName: {
    fontWeight: "500",
    fontSize: 14,
  },
  outMethod: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  stat: {
    flex: 0.7,
    textAlign: "center",
    fontSize: 14,
  },
});
