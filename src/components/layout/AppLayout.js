import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppHeader from "./AppHeader";
import AppModal from "../forms/AppModal";
import BottomNavigation from "./BottomNavigation";
import { colors as C } from "../../theme/tokens";
import { EnterView } from "../Motion";
import { Icon } from "../ui/index";
import React from "react";
import S from "../../theme/styles";
import ScreenRouter from "../../navigation/ScreenRouter";
import { StatusBar } from "expo-status-bar";
import SurfaceTexture from "../SurfaceTexture";
import { useTraquid } from "../../context/TraquidContext";

function AppLayout() {
  const { page, ready, scroll, storageError, toast } = useTraquid([
    "page",
    "ready",
    "scroll",
    "storageError",
    "toast",
  ]);

  if (!ready)
    return (
      <View
        style={[S.root, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator color={C.green} />
      </View>
    );
  return (
    <View style={S.root}>
      <Image
        source={require("../../../assets/botanical-background.png")}
        resizeMode="cover"
        style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor:
              page === "home"
                ? "rgba(244,245,239,0.88)"
                : "rgba(244,245,239,0.16)",
          },
        ]}
      />
      <StatusBar style="dark" hidden={Platform.OS === "android"} />
      <SurfaceTexture />
      <View style={{ flex: 1, minWidth: 0 }}>
        <AppHeader />
        {!!storageError && (
          <View style={S.errorBanner}>
            <Text style={{ color: C.red }}>{storageError}</Text>
          </View>
        )}
        <ScrollView
          ref={scroll}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            S.content,
            { padding: 16, paddingBottom: 108 },
          ]}
        >
          <EnterView
            trigger={page}
            style={{ width: "100%", alignSelf: "center" }}
          >
            <ScreenRouter />
          </EnterView>
        </ScrollView>
        <BottomNavigation />
      </View>
      <AppModal />
      {!!toast && (
        <EnterView trigger={toast} style={[S.toast, { bottom: 100 }]}>
          <Icon name="checkmark-circle" color="#C9DBB7" size={20} />
          <Text style={S.toastText}>{toast}</Text>
        </EnterView>
      )}
    </View>
  );
}
export default React.memo(AppLayout);
