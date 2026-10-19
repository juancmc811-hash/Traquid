import React from "react";
import { Text, View } from "react-native";
import { financialPace, money } from "../../utils/finance.mjs";
import H from "../../theme/homeStyles";
const states = {
  unset: [
    "Sin referencia",
    "Define tu presupuesto para comparar el ritmo.",
    "#5E7065",
  ],
  within: [
    "Dentro del ritmo",
    "Tu gasto está por debajo del ritmo previsto hasta hoy.",
    "#245C43",
  ],
  near: [
    "Cerca del límite",
    "Queda poco margen hasta el ritmo previsto de hoy.",
    "#785415",
  ],
  above: [
    "Por encima del ritmo",
    "Has superado el gasto proporcional hasta hoy.",
    "#943B32",
  ],
};
export default function PaceIndicator({ r }) {
  const { status } = financialPace(r);
  const [label, detail, color] = states[status];
  return (
    <View style={{ gap: 8 }}>
      <Text style={[H.pace, { color }]}>
        {r.budget > 0 && r.remaining <= 0 ? "Sin saldo disponible" : label}
      </Text>
      <Text style={H.caption}>
        {r.budget > 0 && r.remaining <= 0
          ? "Presupuesto agotado. No queda saldo disponible."
          : detail}
      </Text>
      {r.overspend > 0 && (
        <Text style={[H.caption, { color }]}>
          {money(r.overspend)} sobre el ritmo previsto.
        </Text>
      )}
      <Text style={H.caption}>Referencia de gasto, no saldo ni deuda.</Text>
    </View>
  );
}
