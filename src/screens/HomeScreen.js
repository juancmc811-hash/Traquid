import { colors as C } from "../theme/tokens";
import Svg, { Circle } from "react-native-svg";
import { Icon, Label, SmallButton } from "../components/ui/index";
import PeriodSwitch from "../components/budget/PeriodSwitch";
import { MotionPressable as Pressable } from "../components/Motion";
import React from "react";
import S from "../theme/styles";
import { Text, View } from "react-native";
import { money, riskColor } from "../utils/finance.mjs";
import { niceDate } from "../utils/formatters";
import { useTraquid } from "../context/TraquidContext";

function HomeScreen() {
  const { changePage, openBudget, r, state } = useTraquid([
    "changePage",
    "openBudget",
    "r",
    "state",
  ]);
  return (
    <View style={{ gap: 12 }}>
      <View style={{ marginBottom: 4 }}>
        <Label>TU DINERO, CON CALMA</Label>
        <Text style={[S.pageTitle, { fontSize: 26, marginTop: 6 }]}>
          {state.name ? `Hola, ${state.name}` : "Cada pequeño paso cuenta."}
        </Text>
      </View>
      <View style={[S.glass, { padding: 16, gap: 12 }]}>
        <View style={[S.sectionHead, { flexWrap: "wrap" }]}>
          <View style={S.inline}>
            <Icon name="wallet-outline" size={18} />
            <Text style={S.kicker}>Presupuesto</Text>
          </View>
          <PeriodSwitch />
        </View>
        <View style={[S.inline, { gap: 18 }]}>
          <View
            style={{
              width: 96,
              height: 96,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Svg width={96} height={96} viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="42"
                stroke="#DCE5D3"
                strokeWidth="7"
                fill="none"
              />
              <Circle
                cx="50"
                cy="50"
                r="42"
                stroke={riskColor(r.used)}
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${Math.min(100, Math.max(0, r.budget ? 100 - r.used : 0)) * 2.639} 263.9`}
                transform="rotate(-90 50 50)"
              />
            </Svg>
            <Text
              style={{
                position: "absolute",
                fontSize: 21,
                fontWeight: "600",
                color: C.green,
              }}
            >
              {r.budget ? `${Math.max(0, Math.round(100 - r.used))}%` : "—"}
            </Text>
          </View>
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={S.caption}>
              {r.remaining < 0 ? "Presupuesto superado" : "Te quedan"}
            </Text>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[
                S.compactValue,
                { fontSize: 30, color: r.remaining < 0 ? C.red : C.green },
              ]}
            >
              {money(r.remaining)}
            </Text>
            <Text style={[S.caption, { fontSize: 11 }]}>
              {niceDate(r.start, { day: "numeric", month: "short" })} —{" "}
              {niceDate(r.end, { day: "numeric", month: "short" })}
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Editar presupuesto"
          onPress={openBudget}
          style={[
            S.sectionHead,
            {
              borderTopWidth: 1,
              borderColor: "#D6DFCF",
              paddingTop: 10,
              minHeight: 38,
            },
          ]}
        >
          <Text style={S.caption}>Presupuesto · {money(r.budget)}</Text>
          <Icon name="pencil-outline" size={16} />
        </Pressable>
        {!r.budget && <SmallButton onPress={openBudget}>Empezar</SmallButton>}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {[
          [
            "receipt-outline",
            "Gastado",
            money(r.spent),
            "En este periodo",
            "expenses",
          ],
          [
            "sunny-outline",
            "Disponible al día",
            money(r.allowance),
            `${r.daysLeft} días, incluido hoy`,
            "stats",
          ],
          [
            "today-outline",
            "Gastado hoy",
            money(r.todaySpent),
            "Tus movimientos de hoy",
            "expenses",
          ],
          [
            "bar-chart-outline",
            "Ritmo de gasto",
            money(r.overspend),
            r.overspend
              ? "Por encima del ritmo previsto"
              : "Sin desajuste acumulado",
            "stats",
          ],
        ].map(([icon, title, value, detail, target], index) => (
          <View
            key={title}
            style={{ flexBasis: "47%", flexGrow: 1, minWidth: 0 }}
          >
            <Pressable
              accessibilityRole="button"
              onPress={() => changePage(target)}
              style={[
                S.glass,
                {
                  flexGrow: 1,
                  minWidth: 0,
                  padding: 13,
                  gap: 8,
                },
              ]}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Icon name={icon} size={17} />
                <Text
                  style={{
                    color: C.green,
                    fontSize: 11,
                    fontWeight: "600",
                    flex: 1,
                  }}
                >
                  {title}
                </Text>
              </View>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={S.compactValue}
              >
                {value}
              </Text>
              <Text style={{ color: C.muted, fontSize: 10, lineHeight: 14 }}>
                {detail}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => changePage("calendar")}
        style={[
          S.glass,
          { padding: 14, flexDirection: "row", alignItems: "center", gap: 10 },
        ]}
      >
        <Icon name="calendar-outline" size={20} />
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={S.kicker}>Tu calendario</Text>
          <Text style={[S.caption, { fontSize: 11 }]}>
            Consulta y organiza tus gastos
          </Text>
        </View>
        <Icon name="arrow-forward" size={18} />
      </Pressable>
    </View>
  );
}
export default React.memo(HomeScreen);
