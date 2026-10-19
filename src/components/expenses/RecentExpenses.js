import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { MotionPressable } from "../Motion";
import ExpenseRow from "./ExpenseRow";
import H from "../../theme/homeStyles";
export default function RecentExpenses({
  expenses,
  today,
  onEdit,
  onHistory,
  onAdd,
}) {
  const recent = useMemo(
    () =>
      [...expenses]
        .sort(
          (a, b) =>
            b.date.localeCompare(a.date) ||
            b.createdAt.localeCompare(a.createdAt),
        )
        .slice(0, 3),
    [expenses],
  );
  return (
    <View style={H.card}>
      <View style={H.row}>
        <Text accessibilityRole="header" style={H.title}>
          Últimos gastos
        </Text>
        <MotionPressable
          accessibilityRole="button"
          accessibilityLabel="Ver historial completo"
          onPress={onHistory}
          style={H.link}
        >
          <Text style={H.label}>Ver todos →</Text>
        </MotionPressable>
      </View>
      <Text style={H.caption}>En este periodo</Text>
      {recent.map((e) => (
        <ExpenseRow key={e.id} e={e} today={today} onEdit={onEdit} stacked />
      ))}
      {!recent.length && (
        <View style={H.empty}>
          <Text style={H.title}>Aún no hay movimientos</Text>
          <Text style={H.caption}>
            Registra tu primer gasto para empezar a ver en qué se va tu dinero.
          </Text>
          <MotionPressable
            accessibilityRole="button"
            onPress={onAdd}
            style={H.link}
          >
            <Text style={H.label}>Registrar un gasto →</Text>
          </MotionPressable>
        </View>
      )}
    </View>
  );
}
