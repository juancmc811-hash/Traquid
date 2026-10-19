import { Icon, SmallButton } from "./index";
import React from "react";
import S from "../../theme/styles";
import { Text, View } from "react-native";
import { useTraquid } from "../../context/TraquidContext";

function EmptyState({
  text = "Aún no hay gastos",
  detail = "Añade tu primer gasto y empieza a ver dónde va tu dinero.",
}) {
  const { openExpense } = useTraquid(["openExpense"]);
  return (
    <View style={S.empty}>
      <View style={S.emptyIcon}>
        <Icon name="receipt-outline" size={27} />
      </View>
      <Text style={S.rowTitle}>{text}</Text>
      <Text
        style={[
          S.caption,
          { textAlign: "center", maxWidth: 280, lineHeight: 21 },
        ]}
      >
        {detail}
      </Text>
      <SmallButton onPress={() => openExpense()}>Añadir gasto</SmallButton>
    </View>
  );
}
export default React.memo(EmptyState);
