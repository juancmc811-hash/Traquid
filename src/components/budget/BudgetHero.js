import React from "react";
import { Text, View } from "react-native";
import { EnterView, MotionPressable } from "../Motion";
import { Icon } from "../ui/index";
import PeriodSwitch from "./PeriodSwitch";
import BudgetIndicator from "./BudgetIndicator";
import { money } from "../../utils/finance.mjs";
import { niceDate } from "../../utils/formatters";
import H from "../../theme/homeStyles";
export default function BudgetHero({ r, onEdit }) {
  const label = !r.budget
    ? "Tu punto de partida"
    : r.remaining < 0
      ? "Presupuesto superado"
      : r.remaining === 0
        ? "Presupuesto agotado"
        : "Disponible del periodo";
  return (
    <View style={[H.card, H.hero]}>
      <View pointerEvents="none" style={H.ornament} />
      <View style={H.row}>
        <Text style={H.label}>MI PRESUPUESTO</Text>
        <PeriodSwitch highContrast />
      </View>
      <View style={{ gap: 5 }}>
        <Text style={H.caption}>
          {niceDate(r.start, { day: "numeric", month: "short" })} —{" "}
          {niceDate(r.end, { day: "numeric", month: "short" })}
        </Text>
        <Text style={H.label}>{label}</Text>
        <EnterView trigger={r.start + ":" + r.budget + ":" + r.spent}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[H.balance, r.remaining < 0 && { color: "#943B32" }]}
          >
            {r.budget ? money(r.remaining) : "Sin definir"}
          </Text>
        </EnterView>
        {!r.budget && (
          <Text style={H.caption}>
            Elige cuánto quieres destinar a este periodo.
          </Text>
        )}
      </View>
      <BudgetIndicator {...r} />
      <View style={[H.row, H.rule]}>
        <View style={H.pair}>
          <Text style={H.caption}>Presupuesto total</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} style={H.amount}>
            {r.budget ? money(r.budget) : "—"}
          </Text>
        </View>
        <View style={H.pair}>
          <Text style={H.caption}>Gastado</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} style={H.amount}>
            {money(r.spent)}
          </Text>
        </View>
      </View>
      <MotionPressable
        accessibilityRole="button"
        accessibilityLabel={r.budget ? "Editar presupuesto" : "Empezar"}
        onPress={onEdit}
        style={[H.row, { minHeight: 44 }]}
      >
        <Text style={H.label}>
          {r.budget ? "Editar presupuesto" : "Empezar"}
        </Text>
        <Icon name={r.budget ? "pencil-outline" : "arrow-forward"} size={18} />
      </MotionPressable>
    </View>
  );
}
