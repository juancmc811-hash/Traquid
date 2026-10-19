import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { MotionPressable as Pressable } from "./Motion";
import { dateKey, fromKey } from "../utils/finance.mjs";
import { colors as C } from "../theme/tokens";

const displayDate = (key) => key.split("-").reverse().join("/");

export default function ExpenseDateField({ value, onChange }) {
  const today = dateKey();
  const [text, setText] = useState(() => displayDate(value));
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => fromKey(value));
  const first = new Date(month.getFullYear(), month.getMonth(), 1, 12);
  const offset = (first.getDay() + 6) % 7;
  const count = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const move = (delta) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1, 12));
  const choose = (key) => {
    onChange(key);
    setText(displayDate(key));
    setOpen(false);
  };
  return (
    <View style={{ gap: 10 }}>
      <Text style={s.label}>FECHA (DD/MM/AAAA)</Text>
      <View style={s.row}>
        <TextInput
          accessibilityLabel="Fecha (DD/MM/AAAA)"
          value={text}
          placeholder="DD/MM/AAAA"
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          onFocus={() => setOpen(true)}
          onChangeText={(next) => {
            setText(next);
            const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(next);
            const key = match ? `${match[3]}-${match[2]}-${match[1]}` : "";
            onChange(key);
            if (key && dateKey(fromKey(key)) === key) setMonth(fromKey(key));
          }}
          style={s.input}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            open ? "Cerrar calendario de fecha" : "Abrir calendario de fecha"
          }
          onPress={() => setOpen(!open)}
          style={s.button}
        >
          <Text style={s.label}>Calendario</Text>
        </Pressable>
      </View>
      {open && (
        <View style={s.calendar}>
          <View style={[s.row, { justifyContent: "space-between" }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mes anterior"
              onPress={() => move(-1)}
              style={s.button}
            >
              <Text style={[s.label, { fontSize: 24 }]}>‹</Text>
            </Pressable>
            <Text style={s.label}>
              {month.toLocaleDateString("es-ES", {
                month: "long",
                year: "numeric",
              })}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mes siguiente"
              disabled={dateKey(first).slice(0, 7) >= today.slice(0, 7)}
              onPress={() => move(1)}
              style={s.button}
            >
              <Text style={[s.label, { fontSize: 24 }]}>›</Text>
            </Pressable>
          </View>
          <View style={s.grid}>
            {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
              <View key={day} style={s.cell}>
                <Text style={s.label}>{day}</Text>
              </View>
            ))}
            {Array.from({ length: offset }, (_, i) => (
              <View key={`blank-${i}`} style={s.cell} />
            ))}
            {Array.from({ length: count }, (_, i) => {
              const key = dateKey(
                new Date(month.getFullYear(), month.getMonth(), i + 1, 12),
              );
              return (
                <Pressable
                  key={key}
                  accessibilityRole="button"
                  accessibilityLabel={`Seleccionar ${displayDate(key)}${key === today ? ", hoy" : ""}`}
                  accessibilityState={{
                    selected: key === value,
                    disabled: key > today,
                  }}
                  disabled={key > today}
                  onPress={() => choose(key)}
                  style={[
                    s.cell,
                    key === today && s.today,
                    key === value && s.selected,
                  ]}
                >
                  <Text
                    style={{
                      color: key === value ? "white" : C.ink,
                      opacity: key > today ? 0.3 : 1,
                    }}
                  >
                    {i + 1}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setMonth(fromKey(today));
              choose(today);
            }}
            style={s.button}
          >
            <Text style={s.label}>Hoy · {displayDate(today)}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  label: { color: C.green, fontSize: 12, fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: C.ink,
    backgroundColor: "#F7F8F2",
  },
  button: {
    minHeight: 44,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  calendar: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    padding: 8,
    backgroundColor: C.paper,
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: "14.285714%",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  today: { borderWidth: 1, borderColor: C.green },
  selected: { backgroundColor: C.green },
});
