import React, { useCallback, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colors } from "./src/theme/tokens";
import { MotionProvider } from "./src/components/Motion";
import LaunchAnimation from "./src/components/LaunchAnimation";
import TraquidApp from "./src/components/layout/TraquidApp";

export default function App() {
  const [launching, setLaunching] = useState(true);
  const finishLaunch = useCallback(() => setLaunching(false), []);
  return (
    <MotionProvider>
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.bg,
            width: "100%",
            maxWidth: 480,
            alignSelf: "center",
          }}
        >
          <TraquidApp />
          {launching && <LaunchAnimation onComplete={finishLaunch} />}
        </SafeAreaView>
      </SafeAreaProvider>
    </MotionProvider>
  );
}
