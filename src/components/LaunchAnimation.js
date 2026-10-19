import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  AccessibilityInfo,
} from "react-native";
import Svg, { Path, Ellipse } from "react-native-svg";

export default function LaunchAnimation({ onComplete }) {
  const growth = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    let active = true;
    const animation = Animated.sequence([
      Animated.timing(growth, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.delay(200),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);
    animation.start(() => {
      if (active) onComplete();
    });
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (active && reduced) {
        animation.stop();
        onComplete();
      }
    });
    return () => {
      active = false;
      animation.stop();
    };
  }, [growth, opacity, onComplete]);
  return (
    <Animated.View
      accessibilityLabel="Abriendo Traquid"
      style={[StyleSheet.absoluteFill, s.screen, { opacity }]}
    >
      <View style={{ width: 160, height: 180 }}>
        <Svg width={160} height={180} style={StyleSheet.absoluteFill}>
          <Ellipse cx="80" cy="153" rx="57" ry="14" fill="#725B42" />
          <Ellipse cx="80" cy="149" rx="53" ry="10" fill="#917655" />
          <Ellipse cx="57" cy="147" rx="4" ry="2" fill="#B39B77" />
          <Ellipse cx="97" cy="152" rx="5" ry="2" fill="#B39B77" />
        </Svg>
        <Animated.View
          style={{
            position: "absolute",
            bottom: 30,
            left: 20,
            width: 120,
            height: 140,
            opacity: growth,
            transform: [
              {
                translateY: growth.interpolate({
                  inputRange: [0, 1],
                  outputRange: [55, 0],
                }),
              },
              {
                scale: growth.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.15, 1],
                }),
              },
            ],
          }}
        >
          <Svg width={120} height={140} viewBox="0 0 120 140">
            <Path
              d="M60 138 C62 100 57 65 78 34"
              stroke="#38674B"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M61 107 C17 100 7 68 10 53 C47 49 65 77 61 107"
              fill="#739A63"
            />
            <Path
              d="M64 83 C60 37 86 12 110 7 C118 42 101 74 64 83"
              fill="#477F55"
            />
            <Path
              d="M61 104 L22 65 M65 80 L100 23"
              stroke="#B6CF8C"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>
      </View>
      <Text style={s.name}>traquid.</Text>
      <Text style={s.caption}>Cada pequeño paso cuenta.</Text>
    </Animated.View>
  );
}
const s = StyleSheet.create({
  screen: {
    zIndex: 100,
    backgroundColor: "#EEF1E4",
    justifyContent: "center",
    alignItems: "center",
  },
  name: { fontSize: 32, fontWeight: "600", color: "#245C43", marginTop: 12 },
  caption: { fontSize: 13, color: "#5E7065", marginTop: 10 },
});
