import { Button, Heading, Icon } from "../components/ui/index";
import { colors as C } from "../theme/tokens";
import DragScroll from "../components/DragScroll";
import Empty from "../components/ui/EmptyState";
import ExpenseRow from "../components/expenses/ExpenseRow";
import { MotionPressable as Pressable } from "../components/Motion";
import React from "react";
import S from "../theme/styles";
import { Text, TextInput, View } from "react-native";
import { categories } from "../config/categories";
import { money } from "../utils/finance.mjs";
import { useTraquid } from "../context/TraquidContext";

function ExpensesScreen() {
  const {
    activeRows,
    filter,
    openExpense,
    query,
    r,
    setFilter,
    setQuery,
    setVisibleExpenses,
    state,
    today,
    visibleExpenses,
  } = useTraquid([
    "activeRows",
    "filter",
    "openExpense",
    "query",
    "r",
    "setFilter",
    "setQuery",
    "setVisibleExpenses",
    "state",
    "today",
    "visibleExpenses",
  ]);
  return (
    <>
      <Heading
        title="Tus movimientos"
        subtitle={`${r.expenses.length} gastos este ${state.mode === "week" ? "periodo semanal" : "mes"} · ${money(r.spent)}`}
        right={
          <Button icon="add" onPress={() => openExpense()}>
            Añadir gasto
          </Button>
        }
      />
      <View style={S.search}>
        <Icon name="search-outline" color={C.muted} />
        <TextInput
          value={query}
          onChangeText={(value) => {
            setQuery(value);
            setVisibleExpenses(30);
          }}
          placeholder="Buscar un gasto…"
          placeholderTextColor={C.muted}
          accessibilityLabel="Buscar un gasto"
          returnKeyType="search"
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 14,
            color: C.ink,
            outlineStyle: "none",
            paddingVertical: 0,
          }}
        />
      </View>
      <DragScroll
        style={{ marginVertical: 18 }}
        contentContainerStyle={{ gap: 8 }}
      >
        {[{ id: "all", name: "Todos" }, ...categories].map((c) => (
          <Pressable
            accessibilityRole="button"
            key={c.id}
            accessibilityState={{ selected: filter === c.id }}
            onPress={() => {
              setFilter(c.id);
              setVisibleExpenses(30);
            }}
            style={[
              S.filterChip,
              filter === c.id && {
                backgroundColor: C.green,
                borderColor: C.green,
              },
            ]}
          >
            <Text style={[S.caption, filter === c.id && { color: "white" }]}>
              {c.label || c.name}
            </Text>
          </Pressable>
        ))}
      </DragScroll>
      <View style={S.card}>
        {activeRows.length ? (
          activeRows
            .slice(0, visibleExpenses)
            .map((e) => (
              <ExpenseRow key={e.id} e={e} onEdit={openExpense} today={today} />
            ))
        ) : (
          <Empty
            text={
              query || filter !== "all"
                ? "No hay coincidencias"
                : "Aún no hay movimientos"
            }
          />
        )}
      </View>
      {activeRows.length > visibleExpenses && (
        <View style={{ marginTop: 12 }}>
          <Button
            secondary
            onPress={() => setVisibleExpenses((count) => count + 30)}
          >
            Ver más movimientos
          </Button>
        </View>
      )}
      <Text style={[S.caption, { marginTop: 18 }]}>
        Se muestran los gastos del periodo actual. Consulta cualquier otro día
        en Calendario.
      </Text>
    </>
  );
}
export default React.memo(ExpensesScreen);
