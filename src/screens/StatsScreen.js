import { colors as C } from "../theme/tokens";
import CategoryBars from "../components/stats/CategoryBars";
import Empty from "../components/ui/EmptyState";
import { Heading, Icon, Title } from "../components/ui/index";
import PeriodSwitch from "../components/budget/PeriodSwitch";
import { MotionPressable as Pressable } from "../components/Motion";
import React from "react";
import S from "../theme/styles";
import { Text, View } from "react-native";
import { dateKey, fromKey, money } from "../utils/finance.mjs";
import { niceDate } from "../utils/formatters";
import { useTraquid } from "../context/TraquidContext";

function StatsScreen() {
  const { changePage, r, setMonth, setSelected, today } = useTraquid([
    "changePage",
    "r",
    "setMonth",
    "setSelected",
    "today",
  ]);

  const days = Array.from({ length: r.days }, (_, i) => {
    const d = fromKey(r.start);
    d.setDate(d.getDate() + i);
    return {
      date: dateKey(d),
      sum: r.expenses
        .filter((e) => e.date === dateKey(d))
        .reduce((s, e) => s + e.cents, 0),
    };
  });
  const max = Math.max(1, ...days.map((d) => d.sum));
  return (
    <>
      <Heading
        title="Conoce tus hábitos"
        subtitle="Una mirada clara a dónde va tu dinero."
        right={<PeriodSwitch />}
      />
      <View style={S.statCards}>
        {[
          ["Gastado", money(r.spent), "arrow-up-outline"],
          [
            "Media por día",
            money(Math.round(r.spent / (r.days - r.daysLeft + 1))),
            "calendar-outline",
          ],
          ["Disponible", money(r.remaining), "wallet-outline"],
        ].map(([label, value, icon], index) => (
          <View
            key={label}
            style={[
              S.card,
              {
                flexGrow: 1,
                flexBasis: index === 0 ? "100%" : "46%",
                minWidth: 0,
                padding: 16,
                ...(index === 0
                  ? { flexDirection: "row", alignItems: "center", gap: 12 }
                  : {}),
              },
            ]}
          >
            <View style={[S.inline, { minHeight: 38, flexShrink: 1 }]}>
              <Icon name={icon} size={18} />
              <Text numberOfLines={2} style={[S.caption, { flexShrink: 1 }]}>
                {label}
              </Text>
            </View>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[
                S.statValue,
                {
                  fontSize: index === 0 ? 30 : 24,
                  ...(index === 0
                    ? { marginTop: 0, flex: 1, textAlign: "right" }
                    : {}),
                },
              ]}
            >
              {value}
            </Text>
          </View>
        ))}
      </View>
      <View style={S.card}>
        <View
          style={[
            S.sectionHead,
            { flexDirection: "column", alignItems: "flex-start", gap: 6 },
          ]}
        >
          <Title>Gasto a lo largo del periodo</Title>
          <Text style={S.caption}>
            {niceDate(r.start)} — {niceDate(r.end)}
          </Text>
        </View>
        <View
          style={{
            height: 160,
            flexDirection: "row",
            alignItems: "flex-end",
            gap: r.days > 7 ? 4 : 14,
            marginTop: 30,
          }}
        >
          {days.map((d) => (
            <Pressable
              accessibilityRole="button"
              key={d.date}
              onPress={() => {
                setSelected(d.date);
                setMonth(
                  new Date(
                    fromKey(d.date).getFullYear(),
                    fromKey(d.date).getMonth(),
                    1,
                    12,
                  ),
                );
                changePage("calendar");
              }}
              accessibilityLabel={`${niceDate(d.date)}: ${money(d.sum)}`}
              style={{
                flex: 1,
                height: "100%",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  maxWidth: 52,
                  height: Math.max(3, (d.sum / max) * 125),
                  backgroundColor: d.date === today ? C.green : "#C7DABE",
                  borderRadius: 7,
                }}
              />
              <Text style={[S.caption, { fontSize: 10, marginTop: 10 }]}>
                {r.days > 7
                  ? fromKey(d.date).getDate() % 5 === 0
                    ? fromKey(d.date).getDate()
                    : ""
                  : ["D", "L", "M", "X", "J", "V", "S"][
                      fromKey(d.date).getDay()
                    ]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={[S.card, { marginTop: 20 }]}>
        <Title>Gastos por categoría</Title>
        {r.expenses.length ? <CategoryBars expenses={r.expenses} /> : <Empty />}
      </View>
    </>
  );
}
export default React.memo(StatsScreen);
