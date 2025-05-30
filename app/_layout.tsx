import { Stack } from "expo-router";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MatchProvider } from "../src/contexts/MatchContext";

// Ignore specific LogBox warnings
useEffect(() => {
  LogBox.ignoreLogs(["Reanimated 2"]);
}, []);

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MatchProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="match/[id]"
            options={{
              title: "Match Details",
              headerBackTitleVisible: false,
            }}
          />
        </Stack>
      </MatchProvider>
    </GestureHandlerRootView>
  );
}
