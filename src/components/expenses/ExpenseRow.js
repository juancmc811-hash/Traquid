import { colors as C } from "../../theme/tokens";
import { Icon } from "../ui/index";
import { MotionPressable as Pressable, SwipeExpense } from "../Motion";
import React from "react";
import S from "../../theme/styles";
import { Text, View } from "react-native";
import { catFor } from "../../config/categories";
import { money } from "../../utils/finance.mjs";
import { niceDate } from "../../utils/formatters";

const ExpenseRow = React.memo(({ e, onEdit, today, stacked = false }) => {
  const c = catFor(e.category);
  return (
    <SwipeExpense onEdit={() => onEdit(e)}>
      <Pressable
        accessibilityRole="button"
        accessibilityHint="Toca para editar o desliza hacia la izquierda para mostrar Editar"
        testID={`expense-row-${e.id}`}
        onPress={() => onEdit(e)}
        style={({ pressed }) => [
          S.expenseRow,
          pressed && { backgroundColor: C.mint },
        ]}
      >
        <View style={[S.categoryIcon, { backgroundColor: c.bg }]}>
          <Icon name={c.icon} color={c.color} />
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
          <Text numberOfLines={2} style={S.rowTitle}>
            {e.note || c.label || c.name}
          </Text>
          <Text numberOfLines={1} style={[S.caption, { fontSize: 11 }]}>
            {c.label || c.name} ·{" "}
            {e.date === today
              ? "Hoy"
              : niceDate(e.date, { day: "numeric", month: "short" })}
          </Text>
          {stacked && (
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={S.expenseAmount}
            >
              −{money(e.cents)}
            </Text>
          )}
        </View>
        {!stacked && (
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[S.expenseAmount, { maxWidth: "42%" }]}
          >
            −{money(e.cents)}
          </Text>
        )}
        <Icon name="chevron-forward" size={15} color="#A0ADA3" />
      </Pressable>
    </SwipeExpense>
  );
});
export default ExpenseRow;
