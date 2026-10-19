import Empty from "../ui/EmptyState";
import ExpenseRow from "./ExpenseRow";
import React from "react";
import S from "../../theme/styles";
import { Text, View } from "react-native";
import { Title } from "../ui/index";
import { money } from "../../utils/finance.mjs";
import { niceDate } from "../../utils/formatters";
import { useTraquid } from "../../context/TraquidContext";

function DailyExpenses() {
  const { openExpense, selected, selectedRows, today } = useTraquid([
    "openExpense",
    "selected",
    "selectedRows",
    "today",
  ]);
  return (
    <View style={S.card}>
      <View style={S.sectionHead}>
        <View>
          <Title>Gastos del día</Title>
          <Text style={[S.caption, { marginTop: 5 }]}>
            {niceDate(selected, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Text>
        </View>
        <Text style={S.rowTitle}>
          {money(selectedRows.reduce((s, e) => s + e.cents, 0))}
        </Text>
      </View>
      {selectedRows.length ? (
        selectedRows.map((e) => (
          <ExpenseRow key={e.id} e={e} onEdit={openExpense} today={today} />
        ))
      ) : (
        <Empty
          text="Un día sin gastos"
          detail="Los movimientos de este día aparecerán aquí."
        />
      )}
    </View>
  );
}
export default React.memo(DailyExpenses);
