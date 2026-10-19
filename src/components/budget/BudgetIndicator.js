import React from "react";
import { Text, View } from "react-native";
import H from "../../theme/homeStyles";
import { colors as C } from "../../theme/tokens";
export default function BudgetIndicator({ budget, remaining, used }) {
  const percent = budget > 0 ? Math.min(100, Math.max(0, 100 - used)) : 0;
  return (
    <View style={{ gap: 9 }}>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Presupuesto restante"
        accessibilityValue={
          budget > 0
            ? {
                min: 0,
                max: 100,
                now: percent,
                text: Math.floor(percent) + "% restante",
              }
            : { text: "Sin presupuesto" }
        }
        style={H.track}
      >
        <View
          style={[
            H.fill,
            {
              width: percent + "%",
              backgroundColor: remaining <= 0 ? C.red : C.green,
            },
          ]}
        />
      </View>
      <Text style={H.caption}>
        {budget > 0
          ? Math.floor(percent) + "% restante del presupuesto"
          : "Define un presupuesto para ver tu progreso"}
      </Text>
    </View>
  );
}
