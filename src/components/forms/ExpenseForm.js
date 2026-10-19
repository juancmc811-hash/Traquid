import { colors as C } from "../../theme/tokens";
import ExpenseDateField from "../ExpenseDateField";
import { Field, Icon, Label } from "../ui/index";
import { MotionPressable as Pressable } from "../Motion";
import React from "react";
import S from "../../theme/styles";
import { Text, TextInput, View } from "react-native";
import { categories } from "../../config/categories";
import { useTraquid } from "../../context/TraquidContext";

function ExpenseForm() {
  const {
    amount,
    category,
    editId,
    expenseDate,
    note,
    setAmount,
    setCategory,
    setExpenseDate,
    setModal,
    setNote,
  } = useTraquid([
    "amount",
    "category",
    "editId",
    "expenseDate",
    "note",
    "setAmount",
    "setCategory",
    "setExpenseDate",
    "setModal",
    "setNote",
  ]);
  return (
    <>
      <View style={S.amountInputWrap}>
        <TextInput
          accessibilityLabel="Importe en euros"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0,00"
          placeholderTextColor="#B6C2B3"
          style={S.amountInput}
          autoFocus
        />
        <Text style={S.euro}>€</Text>
      </View>
      <Label>CATEGORÍA</Label>
      <View style={S.categories}>
        {categories.map((c) => (
          <Pressable
            accessibilityRole="button"
            key={c.id}
            onPress={() => setCategory(c.id)}
            style={[
              S.categoryChoice,
              category === c.id && {
                backgroundColor: C.mint,
                borderColor: "#B3C9A5",
              },
            ]}
          >
            <View
              style={[
                S.categoryIcon,
                {
                  backgroundColor: c.bg,
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                },
              ]}
            >
              <Icon name={c.icon} color={c.color} />
            </View>
            <Text style={S.categoryName}>{c.label || c.name}</Text>
          </Pressable>
        ))}
      </View>
      <Field
        label="¿En qué lo has gastado?"
        value={note}
        onChangeText={setNote}
        maxLength={120}
        placeholder="Por ejemplo, café con amigos"
      />
      <ExpenseDateField value={expenseDate} onChange={setExpenseDate} />

      {editId && (
        <Pressable
          accessibilityRole="button"
          onPress={() => setModal("delete")}
        >
          <Text style={S.deleteText}>Eliminar este gasto</Text>
        </Pressable>
      )}
    </>
  );
}
export default React.memo(ExpenseForm);
