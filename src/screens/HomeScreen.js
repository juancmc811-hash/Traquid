import React from "react";
import { Text, View } from "react-native";
import { useTraquid } from "../context/TraquidContext";
import { money } from "../utils/finance.mjs";
import BudgetHero from "../components/budget/BudgetHero";
import MetricCard from "../components/budget/MetricCard";
import PaceIndicator from "../components/budget/PaceIndicator";
import RecentExpenses from "../components/expenses/RecentExpenses";
import { MotionPressable } from "../components/Motion";
import { Icon } from "../components/ui/index";
import H from "../theme/homeStyles";

function HomeScreen() {
  const { changePage, openBudget, openExpense, r, state, today } = useTraquid([
    "changePage",
    "openBudget",
    "openExpense",
    "r",
    "state",
    "today",
  ]);
  return (
    <View style={H.screen}>
      <View style={H.intro}>
        <Text style={H.eyebrow}>TU DINERO, CON CALMA</Text>
        <Text accessibilityRole="header" style={H.greeting}>
          {state.name ? `Hola, ${state.name}` : "Un poco más de claridad."}
        </Text>
        <Text style={H.caption}>Tu periodo, de un vistazo.</Text>
      </View>
      <BudgetHero r={r} onEdit={openBudget} />
      <MotionPressable
        accessibilityRole="button"
        accessibilityLabel="Añadir gasto"
        onPress={() => openExpense()}
        style={H.action}
      >
        <Icon name="add-circle-outline" color="#FFFFFF" size={23} />
        <Text style={H.actionText}>Añadir gasto</Text>
      </MotionPressable>
      <View style={H.metrics}>
        <MetricCard
          icon="sunny-outline"
          title="Disponible al día"
          onPress={() => changePage("stats")}
        >
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              H.metricValue,
              money(r.allowance).length > 10 && { fontSize: 18 },
            ]}
          >
            {r.budget ? money(r.allowance) : "—"}
          </Text>
          <Text style={H.caption}>
            {r.budget
              ? `Saldo repartido entre ${r.daysLeft} días, incluido hoy.`
              : "Primero define un presupuesto."}
          </Text>
        </MetricCard>
        <MetricCard
          icon="pulse-outline"
          title="Ritmo financiero"
          onPress={() => changePage("stats")}
        >
          <PaceIndicator r={r} />
        </MetricCard>
      </View>
      <RecentExpenses
        expenses={r.expenses}
        today={today}
        onEdit={openExpense}
        onHistory={() => changePage("expenses")}
        onAdd={() => openExpense()}
      />
      <MotionPressable
        accessibilityRole="button"
        accessibilityLabel="Tu calendario"
        onPress={() => changePage("calendar")}
        style={[H.card, H.row]}
      >
        <Icon name="calendar-outline" />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={H.label}>Tu calendario</Text>
          <Text style={H.caption}>Gastado hoy · {money(r.todaySpent)}</Text>
        </View>
        <Icon name="arrow-forward" size={18} />
      </MotionPressable>
    </View>
  );
}
export default React.memo(HomeScreen);
