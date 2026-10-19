import { Field } from "../ui/index";
import { MotionPressable as Pressable } from "../Motion";
import React from "react";
import S from "../../theme/styles";
import { Text, View } from "react-native";
import { niceDate } from "../../utils/formatters";
import { periodBounds } from "../../utils/finance.mjs";
import { useTraquid } from "../../context/TraquidContext";

function BudgetForm() {
  const { amount, budgetMode, setAmount, setBudgetMode, state } = useTraquid([
    "amount",
    "budgetMode",
    "setAmount",
    "setBudgetMode",
    "state",
  ]);
  return (
    <>
      <Text style={S.caption}>
        Decide cuánto quieres gastar. Podrás ajustarlo cuando necesites.
      </Text>
      <View style={S.segment}>
        {[
          ["week", "Semanal"],
          ["month", "Mensual"],
        ].map(([id, label]) => (
          <Pressable
            accessibilityRole="button"
            key={id}
            onPress={() => {
              setBudgetMode(id);
              const b = state.budgets[`${id}:${periodBounds(id).start}`];
              setAmount(b ? String(b / 100).replace(".", ",") : "");
            }}
            style={[S.segmentItem, budgetMode === id && S.segmentActive]}
          >
            <Text style={S.segmentText}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <Field
        label="Presupuesto en euros"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="180,00"
        autoFocus
      />
      <Text style={S.caption}>
        {niceDate(periodBounds(budgetMode).start)} —{" "}
        {niceDate(periodBounds(budgetMode).end)}
      </Text>
    </>
  );
}
export default React.memo(BudgetForm);
