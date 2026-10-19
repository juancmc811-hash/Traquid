import { BottomSheet, MotionPressable as Pressable } from "../Motion";
import BudgetForm from "./BudgetForm";
import { Button, Icon, Title } from "../ui/index";
import ExpenseForm from "./ExpenseForm";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import S from "../../theme/styles";
import { freshState } from "../../storage/state";
import { useTraquid } from "../../context/TraquidContext";

function AppModal() {
  const {
    commit,
    editId,
    formError,
    loadDemo,
    modal,
    notify,
    setModal,
    setState,
    width,
  } = useTraquid([
    "commit",
    "editId",
    "formError",
    "loadDemo",
    "modal",
    "notify",
    "setModal",
    "setState",
    "width",
  ]);
  return (
    <Modal
      visible={!!modal}
      transparent
      animationType="none"
      onRequestClose={() => setModal(null)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={S.overlay}
      >
        <Pressable
          accessibilityRole="button"
          style={StyleSheet.absoluteFill}
          onPress={() => setModal(null)}
        />
        <BottomSheet
          key={modal}
          onClose={() => setModal(null)}
          style={[S.modal, { maxHeight: "92%", width: Math.min(width, 480) }]}
        >
          <View
            style={[
              S.sectionHead,
              { paddingHorizontal: 20, paddingBottom: 12 },
            ]}
          >
            <Title>
              {modal === "budget"
                ? "Tu presupuesto"
                : modal === "expense"
                  ? editId
                    ? "Editar gasto"
                    : "Añadir gasto"
                  : modal === "delete"
                    ? "Eliminar gasto"
                    : modal === "reset"
                      ? "Borrar tus datos"
                      : modal === "demo"
                        ? "Conoce Traquid"
                        : "Mejor, juntos"}
            </Title>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar"
              onPress={() => setModal(null)}
              style={S.iconButton}
            >
              <Icon name="close" />
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              padding: 20,
              paddingTop: 8,
              paddingBottom: 16,
              gap: 16,
            }}
          >
            {modal === "budget" ? (
              <BudgetForm />
            ) : modal === "expense" ? (
              <ExpenseForm />
            ) : modal === "delete" ? (
              <>
                <Text style={S.subTitle}>
                  Este gasto se eliminará y se recalculará el saldo disponible.
                </Text>
                <Button
                  onPress={() => {
                    setState((s) => ({
                      ...s,
                      expenses: s.expenses.filter((e) => e.id !== editId),
                    }));
                    setModal(null);
                    notify("Gasto eliminado");
                  }}
                >
                  Eliminar gasto
                </Button>
                <Button secondary onPress={() => setModal("expense")}>
                  Volver
                </Button>
              </>
            ) : modal === "reset" ? (
              <>
                <Text style={[S.subTitle, { lineHeight: 24 }]}>
                  Se borrarán todos los presupuestos, gastos y tu nombre de este
                  dispositivo. Puedes descargar una copia JSON o un informe PDF
                  antes.
                </Text>
                <Button
                  onPress={() => {
                    setState(freshState());
                    setModal(null);
                    notify("Todos los datos se han borrado");
                  }}
                >
                  Borrar definitivamente
                </Button>
                <Button secondary onPress={() => setModal(null)}>
                  Conservar mis datos
                </Button>
              </>
            ) : modal === "demo" ? (
              <>
                <Text style={[S.subTitle, { lineHeight: 24 }]}>
                  Cargaremos un presupuesto y unos gastos ficticios para que
                  explores la app. Puedes eliminarlos después en Ajustes.
                </Text>
                <Button onPress={loadDemo}>Cargar datos de ejemplo</Button>
              </>
            ) : (
              <>
                <View
                  style={[
                    S.emptyIcon,
                    { alignSelf: "center", width: 80, height: 80 },
                  ]}
                >
                  <Icon name="people-outline" size={38} />
                </View>
                <Text
                  style={[S.pageTitle, { textAlign: "center", fontSize: 27 }]}
                >
                  Los planes se comparten.
                  {"\n"}
                  Los gastos, también.
                </Text>
                <Text
                  style={[S.subTitle, { textAlign: "center", lineHeight: 24 }]}
                >
                  En la fase 2 podrás crear grupos, repartir gastos y
                  sincronizar tus datos con tu cuenta de Google o Traquid.
                </Text>
                <View style={S.insight}>
                  <Icon name="time-outline" />
                  <Text style={S.insightText}>
                    Esta función aún no está disponible. Ahora puedes empezar
                    con tus finanzas personales.
                  </Text>
                </View>
                <Button onPress={() => setModal(null)}>
                  Seguir con mi presupuesto
                </Button>
              </>
            )}
          </ScrollView>
          {(modal === "expense" || modal === "budget") && (
            <View style={S.sheetFooter}>
              {!!formError && (
                <Text
                  accessibilityRole="alert"
                  accessibilityLiveRegion="polite"
                  style={[S.formError, { marginBottom: 10 }]}
                >
                  {formError}
                </Text>
              )}
              <Button icon="checkmark" onPress={commit}>
                {modal === "budget"
                  ? "Guardar presupuesto"
                  : editId
                    ? "Guardar cambios"
                    : "Guardar gasto"}
              </Button>
            </View>
          )}
        </BottomSheet>
      </KeyboardAvoidingView>
    </Modal>
  );
}
export default React.memo(AppModal);
