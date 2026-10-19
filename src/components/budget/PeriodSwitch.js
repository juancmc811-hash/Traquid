import { colors as C } from "../../theme/tokens";
import { MotionPressable as Pressable } from "../Motion";
import React from "react";
import S from "../../theme/styles";
import { Text, View } from "react-native";
import { useTraquid } from "../../context/TraquidContext";

function PeriodSwitch() {
  const { setState, state } = useTraquid(["setState", "state"]);
  return (
    <View style={S.segment}>
      {[
        ["week", "Semana"],
        ["month", "Mes"],
      ].map(([id, label]) => (
        <Pressable
          accessibilityRole="button"
          key={id}
          accessibilityState={{ selected: state.mode === id }}
          onPress={() => setState((s) => ({ ...s, mode: id }))}
          style={[S.segmentItem, state.mode === id && S.segmentActive]}
        >
          <Text
            style={[S.segmentText, state.mode === id && { color: C.green }]}
          >
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
export default React.memo(PeriodSwitch);
