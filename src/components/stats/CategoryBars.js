import { colors as C } from "../../theme/tokens";
import React from "react";
import S from "../../theme/styles";
import { Text, View } from "react-native";
import { categories } from "../../config/categories";
import { money } from "../../utils/finance.mjs";

function CategoryBars({ expenses, limit = 8 }) {
  const total = expenses.reduce((s, e) => s + e.cents, 0);
  return (
    <View style={{ gap: 23, marginTop: 27, marginBottom: 20 }}>
      {categories
        .map((c) => ({
          ...c,
          total: expenses
            .filter((e) => e.category === c.id)
            .reduce((s, e) => s + e.cents, 0),
        }))
        .filter((c) => c.total)
        .sort((a, b) => b.total - a.total)
        .slice(0, limit)
        .map((c) => (
          <View key={c.id} style={{ gap: 10 }}>
            <View style={S.sectionHead}>
              <View style={S.inline}>
                <View
                  style={[
                    S.dot,
                    { backgroundColor: c.color, width: 8, height: 8 },
                  ]}
                />
                <Text style={S.caption}>{c.label || c.name}</Text>
              </View>
              <Text style={S.rowTitle}>
                {money(c.total)}{" "}
                <Text
                  style={{ fontSize: 11, fontWeight: "400", color: C.muted }}
                >
                  {" "}
                  {Math.round((c.total / total) * 100)}%
                </Text>
              </Text>
            </View>
            <View style={S.bar}>
              <View
                style={{
                  height: 5,
                  borderRadius: 5,
                  width: `${(c.total / total) * 100}%`,
                  backgroundColor: c.color,
                }}
              />
            </View>
          </View>
        ))}
    </View>
  );
}
export default React.memo(CategoryBars);
