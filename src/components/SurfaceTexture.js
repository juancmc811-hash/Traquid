import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Rect,
  Stop,
} from "react-native-svg";

const SurfaceTexture = React.memo(function SurfaceTexture() {
  return (
    <View
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      style={StyleSheet.absoluteFill}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 480 960"
        preserveAspectRatio="xMidYMid slice"
      >
        <Defs>
          <LinearGradient id="ambient-light" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFF8DD" stopOpacity="0.2" />
            <Stop offset="0.55" stopColor="#F4F7EB" stopOpacity="0" />
            <Stop offset="1" stopColor="#245C43" stopOpacity="0.08" />
          </LinearGradient>
        </Defs>
        <Rect width="480" height="960" fill="url(#ambient-light)" />
        {Array.from({ length: 170 }, (_, i) => (
          <Circle
            key={i}
            cx={(i * 137.51) % 480}
            cy={(i * 83.17) % 960}
            r={i % 3 === 0 ? 0.8 : 0.45}
            fill={i % 2 ? "#FFFFFF" : "#42654E"}
            opacity="0.14"
          />
        ))}
      </Svg>
    </View>
  );
});
export default SurfaceTexture;
