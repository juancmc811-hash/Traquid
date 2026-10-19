import { Button, Heading, Icon, Label, Title } from "../components/ui/index";
import { colors as C } from "../theme/tokens";
import DailyExpenses from "../components/expenses/DailyExpenses";
import {
  EnterView,
  MotionPressable as Pressable,
  SwipeSurface,
} from "../components/Motion";
import React from "react";
import S from "../theme/styles";
import { Text, View } from "react-native";
import { dateKey, money } from "../utils/finance.mjs";
import { niceDate } from "../utils/formatters";
import { useTraquid } from "../context/TraquidContext";

function CalendarScreen() {
  const { month, openExpense, selected, setMonth, setSelected, state, today } =
    useTraquid([
      "month",
      "openExpense",
      "selected",
      "setMonth",
      "setSelected",
      "state",
      "today",
    ]);

  const first = new Date(month.getFullYear(), month.getMonth(), 1, 12);
  const count = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const offset = (first.getDay() + 6) % 7;
  const monthRows = state.expenses.filter((e) =>
    e.date.startsWith(dateKey(month).slice(0, 7)),
  );
  return (
    <>
      <Heading
        title="Tu calendario"
        subtitle="Cada día cuenta una pequeña historia."
      />
      <View style={[S.mainGrid, false]}>
        <View style={[S.card, { flex: 1.3 }]}>
          <View style={S.sectionHead}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mes anterior"
              onPress={() =>
                setMonth(
                  new Date(month.getFullYear(), month.getMonth() - 1, 1, 12),
                )
              }
              style={S.iconButton}
            >
              <Icon name="chevron-back" />
            </Pressable>
            <Title
              style={{
                textTransform: "capitalize",
                flex: 1,
                textAlign: "center",
                fontSize: 16,
              }}
            >
              {month.toLocaleDateString("es-ES", {
                month: "long",
                year: "numeric",
              })}
            </Title>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mes siguiente"
              onPress={() =>
                setMonth(
                  new Date(month.getFullYear(), month.getMonth() + 1, 1, 12),
                )
              }
              style={S.iconButton}
            >
              <Icon name="chevron-forward" />
            </Pressable>
          </View>
          <SwipeSurface
            onSwipe={(delta) =>
              setMonth(
                new Date(month.getFullYear(), month.getMonth() + delta, 1, 12),
              )
            }
          >
            <EnterView trigger={dateKey(month)}>
              <View style={S.calendarGrid}>
                {["L", "M", "X", "J", "V", "S", "D"].map((d, i) => (
                  <View key={i} style={S.calendarCell}>
                    <Label>{d}</Label>
                  </View>
                ))}
                {Array.from({ length: offset }, (_, i) => (
                  <View key={`blank${i}`} style={S.calendarCell} />
                ))}
                {Array.from({ length: count }, (_, i) => {
                  const k = dateKey(
                    new Date(month.getFullYear(), month.getMonth(), i + 1, 12),
                  );
                  const sum = monthRows
                    .filter((e) => e.date === k)
                    .reduce((s, e) => s + e.cents, 0);
                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${niceDate(k)}: ${money(sum)}`}
                      key={k}
                      onPress={() => setSelected(k)}
                      style={[
                        S.calendarCell,
                        S.calendarDay,
                        selected === k && { backgroundColor: C.green },
                        k === today &&
                          selected !== k && { backgroundColor: C.mint },
                      ]}
                    >
                      <Text
                        style={[
                          S.dayNumber,
                          selected === k && { color: "white" },
                        ]}
                      >
                        {i + 1}
                      </Text>
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={[
                          S.calendarAmount,
                          selected === k && { color: "#DDEAD7" },
                        ]}
                      >
                        {sum ? money(sum).replace(/\s?€$/, "") : "·"}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </EnterView>
          </SwipeSurface>
          <Text
            style={[
              S.caption,
              { fontSize: 10, textAlign: "center", marginTop: 8 },
            ]}
          >
            Desliza para cambiar de mes
          </Text>
          <View style={[S.balanceFooter, { marginTop: 20 }]}>
            <Text style={S.caption}>Total del mes</Text>
            <Text style={S.rowTitle}>
              {money(monthRows.reduce((s, e) => s + e.cents, 0))}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <DailyExpenses />
          <View style={{ marginTop: 16 }}>
            <Button icon="add" onPress={() => openExpense()}>
              Añadir en este día
            </Button>
          </View>
        </View>
      </View>
    </>
  );
}
export default React.memo(CalendarScreen);
