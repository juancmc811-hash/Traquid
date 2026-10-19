import {
  Button,
  Field,
  Heading,
  Icon,
  SettingRow,
  Title,
} from "../components/ui/index";
import { colors as C } from "../theme/tokens";
import { Platform, Text, View } from "react-native";
import { MotionPressable as Pressable } from "../components/Motion";
import React from "react";
import S from "../theme/styles";
import { useTraquid } from "../context/TraquidContext";

function SettingsScreen() {
  const {
    busy,
    exportBackup,
    exportPDF,
    openBudget,
    setModal,
    setState,
    state,
  } = useTraquid([
    "busy",
    "exportBackup",
    "exportPDF",
    "openBudget",
    "setModal",
    "setState",
    "state",
  ]);
  return (
    <>
      <Heading
        title="A tu manera"
        subtitle="Tu espacio, tus preferencias, tus datos."
      />
      <View style={[S.mainGrid, false]}>
        <View style={[S.card, { flex: 1, gap: 22 }]}>
          <Title>Mi perfil local</Title>
          <Field
            label="¿Cómo te llamas?"
            placeholder="Tu nombre"
            value={state.name}
            maxLength={30}
            onChangeText={(name) => setState((s) => ({ ...s, name }))}
          />
          <View style={S.insight}>
            <Icon name="shield-checkmark-outline" />
            <Text style={S.insightText}>
              No necesitas una cuenta. Tus datos se guardan aquí, en este
              dispositivo.
            </Text>
          </View>
          <Title>Mi presupuesto</Title>
          <Text style={S.caption}>
            El presupuesto se define para cada semana o mes. Los gastos
            anteriores se conservan en el calendario.
          </Text>
          <Button secondary icon="pencil-outline" onPress={openBudget}>
            Ajustar presupuesto
          </Button>
          <Title>Próximamente</Title>
          <SettingRow
            icon="people-outline"
            title="Gastos compartidos"
            detail="Viajes, amigos y planes juntos · Fase 2"
            onPress={() => setModal("shared")}
          />
          <SettingRow
            icon="person-circle-outline"
            title="Cuenta Traquid y Google"
            detail="Sincronización entre dispositivos · Fase 2"
            onPress={() => setModal("shared")}
          />
        </View>
        <View style={[S.card, { flex: 1, gap: 20 }]}>
          <Title>Tus datos, contigo</Title>
          <Text style={[S.caption, { lineHeight: 22 }]}>
            Exporta tus movimientos para revisarlos, archivarlos o usarlos donde
            quieras.
          </Text>
          <Button icon="download-outline" disabled={busy} onPress={exportPDF}>
            {busy ? "Preparando…" : "Exportar informe PDF"}
          </Button>
          {Platform.OS === "web" && (
            <Button secondary icon="save-outline" onPress={exportBackup}>
              Descargar copia JSON
            </Button>
          )}
          <View style={S.rule} />
          <Title>Explorar Traquid</Title>
          <Text style={[S.caption, { lineHeight: 21 }]}>
            Prueba la app con datos de ejemplo. Esta opción está disponible
            cuando no tienes gastos.
          </Text>
          <Button
            secondary
            disabled={state.expenses.length > 0}
            icon="sparkles-outline"
            onPress={() => setModal("demo")}
          >
            Cargar un ejemplo
          </Button>
          <View style={S.rule} />
          <Pressable
            accessibilityRole="button"
            onPress={() => setModal("reset")}
            style={[S.button, { backgroundColor: "#FAEDEA" }]}
          >
            <Text style={{ color: C.red, fontWeight: "600" }}>
              Borrar todos mis datos
            </Text>
          </Pressable>
          <Text style={[S.caption, { fontSize: 11, textAlign: "center" }]}>
            Traquid · Primera versión · Hecho para ir paso a paso
          </Text>
        </View>
      </View>
    </>
  );
}
export default React.memo(SettingsScreen);
