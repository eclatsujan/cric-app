import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ExtraType, WicketType } from "../../interfaces/Match";

interface BallInputProps {
  onBallAdded: (data: { runs: number; extraType: ExtraType; extraRuns: number; wicketType: WicketType }) => void;
}

export const BallInput: React.FC<BallInputProps> = ({ onBallAdded }) => {
  const [selectedRuns, setSelectedRuns] = useState<number | null>(null);
  const [selectedExtraType, setSelectedExtraType] = useState<ExtraType>(ExtraType.NONE);
  const [selectedWicketType, setSelectedWicketType] = useState<WicketType>(WicketType.NONE);
  const [extraRuns, setExtraRuns] = useState(0);

  const handleRunSelection = (runs: number) => {
    setSelectedRuns(runs);
  };

  const handleExtraTypeSelection = (extraType: ExtraType) => {
    setSelectedExtraType(extraType === selectedExtraType ? ExtraType.NONE : extraType);
  };

  const handleWicketTypeSelection = (wicketType: WicketType) => {
    setSelectedWicketType(wicketType === selectedWicketType ? WicketType.NONE : wicketType);
  };

  const handleSubmit = () => {
    onBallAdded({
      runs: selectedRuns || 0,
      extraType: selectedExtraType,
      extraRuns: extraRuns,
      wicketType: selectedWicketType,
    });

    // Reset state after submission
    setSelectedRuns(null);
    setSelectedExtraType(ExtraType.NONE);
    setSelectedWicketType(WicketType.NONE);
    setExtraRuns(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Runs</Text>
      <View style={styles.runsContainer}>
        {[0, 1, 2, 3, 4, 5, 6].map((run) => (
          <TouchableOpacity
            key={run}
            style={[
              styles.runButton,
              selectedRuns === run && styles.selectedButton,
              run === 4 && styles.fourButton,
              run === 6 && styles.sixButton,
            ]}
            onPress={() => handleRunSelection(run)}>
            <Text style={[styles.buttonText, selectedRuns === run && styles.selectedButtonText]}>{run}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Extras</Text>
      <View style={styles.extrasContainer}>
        {Object.values(ExtraType)
          .filter((type) => type !== ExtraType.NONE)
          .map((extraType) => (
            <TouchableOpacity
              key={extraType}
              style={[styles.extraButton, selectedExtraType === extraType && styles.selectedButton]}
              onPress={() => handleExtraTypeSelection(extraType)}>
              <Text style={[styles.buttonText, selectedExtraType === extraType && styles.selectedButtonText]}>
                {extraType === ExtraType.WIDE
                  ? "WD"
                  : extraType === ExtraType.NO_BALL
                  ? "NB"
                  : extraType === ExtraType.BYE
                  ? "B"
                  : "LB"}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      <Text style={styles.sectionTitle}>Wicket</Text>
      <View style={styles.wicketsContainer}>
        {[WicketType.BOWLED, WicketType.CAUGHT, WicketType.LBW, WicketType.RUN_OUT, WicketType.STUMPED].map(
          (wicketType) => (
            <TouchableOpacity
              key={wicketType}
              style={[styles.wicketButton, selectedWicketType === wicketType && styles.selectedWicketButton]}
              onPress={() => handleWicketTypeSelection(wicketType)}>
              <Text style={[styles.buttonText, selectedWicketType === wicketType && styles.selectedButtonText]}>
                {wicketType === WicketType.BOWLED
                  ? "B"
                  : wicketType === WicketType.CAUGHT
                  ? "C"
                  : wicketType === WicketType.LBW
                  ? "LBW"
                  : wicketType === WicketType.RUN_OUT
                  ? "RO"
                  : "ST"}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Ball</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  runsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  runButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  fourButton: {
    borderColor: "#f0ad4e",
  },
  sixButton: {
    borderColor: "#5cb85c",
  },
  selectedButton: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  selectedWicketButton: {
    backgroundColor: "#dc3545",
    borderColor: "#dc3545",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedButtonText: {
    color: "#ffffff",
  },
  extrasContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  extraButton: {
    width: 50,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  wicketsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  wicketButton: {
    width: 50,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  submitButton: {
    backgroundColor: "#28a745",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
