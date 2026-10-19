import { colors as C } from "../../theme/tokens";
import { Icon } from "../ui/index";
import { MotionPressable as Pressable } from "../Motion";
import React from "react";
import S from "../../theme/styles";
import { Text, View } from "react-native";
import { useTraquid } from "../../context/TraquidContext";

function BottomNavigation() {
  const { changePage, openExpense, page } = useTraquid([
    "changePage",
    "openExpense",
    "page",
  ]);
  return (
    <View style={S.bottomNav}>
      {[
        ["home", "Inicio", "home-outline"],
        ["expenses", "Gastos", "receipt-outline"],
        ["add", "Añadir", "add"],
        ["calendar", "Calendario", "calendar-outline"],
        ["settings", "Ajustes", "settings-outline"],
      ].map(([id, label, icon]) => (
        <Pressable
          accessibilityRole="button"
          key={id}
          accessibilityLabel={id === "add" ? "Añadir gasto" : label}
          accessibilityState={
            id === "add" ? undefined : { selected: page === id }
          }
          onPress={() => (id === "add" ? openExpense() : changePage(id))}
          style={[S.bottomItem, page === id && S.bottomItemActive]}
        >
          <View style={[S.navIcon, id === "add" && S.navAddIcon]}>
            <Icon
              name={icon}
              color={
                id === "add" ? C.green : page === id ? "#D9EBAE" : "#D2DDCE"
              }
              size={id === "add" ? 26 : 21}
            />
          </View>
          {!!label && (
            <Text
              style={[
                S.bottomLabel,
                page === id && { color: "#D9EBAE", fontWeight: "700" },
              ]}
            >
              {label}
            </Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}
export default React.memo(BottomNavigation);
