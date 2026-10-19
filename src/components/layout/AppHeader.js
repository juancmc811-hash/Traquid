import { Icon } from "../ui/index";
import { MotionPressable as Pressable } from "../Motion";
import React from "react";
import S from "../../theme/styles";
import { Text, View } from "react-native";
import { useTraquid } from "../../context/TraquidContext";

function AppHeader() {
  const { changePage } = useTraquid(["changePage"]);
  return (
    <View style={S.topbar}>
      {
        <View style={S.inline}>
          <Icon name="leaf" size={23} />
          <Text style={[S.wordmark, { fontSize: 23 }]}>traquid.</Text>
        </View>
      }
      <View style={S.inline}>
        <Text style={S.topDate}>
          {new Date().toLocaleDateString("es-ES", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir ajustes"
          onPress={() => changePage("settings")}
          style={S.avatar}
        >
          <Icon name="person-outline" size={18} />
        </Pressable>
      </View>
    </View>
  );
}
export default React.memo(AppHeader);
