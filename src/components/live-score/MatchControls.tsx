import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MatchStatus } from "../../interfaces/Match";

interface MatchControlsProps {
  matchStatus: MatchStatus;
  onPauseMatch: () => void;
  onResumeMatch: () => void;
  onEndInnings: () => void;
  onEndMatch: () => void;
  onUndoLastBall: () => void;
}

export const MatchControls: React.FC<MatchControlsProps> = ({
  matchStatus,
  onPauseMatch,
  onResumeMatch,
  onEndInnings,
  onEndMatch,
  onUndoLastBall,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {matchStatus === MatchStatus.LIVE ? (
          <TouchableOpacity style={[styles.button, styles.pauseButton]} onPress={onPauseMatch}>
            <Text style={styles.buttonText}>Pause Match</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.resumeButton]}
            onPress={onResumeMatch}
            disabled={matchStatus === MatchStatus.COMPLETED}>
            <Text style={styles.buttonText}>Resume Match</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.button, styles.undoButton]} onPress={onUndoLastBall}>
          <Text style={styles.buttonText}>Undo Last Ball</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={[styles.button, styles.endInningsButton]} onPress={onEndInnings}>
          <Text style={styles.buttonText}>End Innings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.endMatchButton]} onPress={onEndMatch}>
          <Text style={styles.buttonText}>End Match</Text>
        </TouchableOpacity>
      </View>

      {matchStatus !== MatchStatus.LIVE && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {matchStatus === MatchStatus.PAUSED && "Match Paused"}
            {matchStatus === MatchStatus.DELAYED && "Match Delayed"}
            {matchStatus === MatchStatus.COMPLETED && "Match Completed"}
          </Text>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  pauseButton: {
    backgroundColor: "#ffc107",
  },
  resumeButton: {
    backgroundColor: "#28a745",
  },
  endInningsButton: {
    backgroundColor: "#17a2b8",
  },
  endMatchButton: {
    backgroundColor: "#dc3545",
  },
  undoButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  statusContainer: {
    backgroundColor: "#f8d7da",
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
    alignItems: "center",
  },
  statusText: {
    color: "#721c24",
    fontWeight: "500",
  },
});
