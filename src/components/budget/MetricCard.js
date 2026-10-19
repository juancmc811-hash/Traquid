import React from "react";
import { Text, View } from "react-native";
import { MotionPressable } from "../Motion";
import { Icon } from "../ui/index";
import H from "../../theme/homeStyles";
export default function MetricCard({ icon, title, onPress, children }) {
  return (
    <MotionPressable
      accessibilityRole="button"
      onPress={onPress}
      style={[H.card, H.metric]}
    >
      <View style={H.icon}>
        <Icon name={icon} size={19} />
      </View>
      <Text style={H.label}>{title}</Text>
      {children}
    </MotionPressable>
  );
}
