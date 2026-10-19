import { colors as C } from "../../theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { MotionPressable as Pressable } from "../Motion";
import React from "react";
import S from "../../theme/styles";
import { Text, TextInput, View } from "react-native";

const Icon = ({ name, size = 21, color = C.green }) => (
  <Ionicons
    name={name}
    size={size}
    color={color}
    accessible={false}
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
  />
);
const Label = ({ children, style }) => (
  <Text style={[S.label, style]}>{children}</Text>
);
const Title = ({ children, style }) => (
  <Text style={[S.title, style]}>{children}</Text>
);
const Button = ({
  children,
  onPress,
  secondary = false,
  icon,
  disabled = false,
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={typeof children === "string" ? children : undefined}
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [
      S.button,
      secondary && S.secondary,
      pressed && { opacity: 0.75 },
      disabled && { opacity: 0.45 },
    ]}
  >
    {icon && (
      <Icon name={icon} color={secondary ? C.green : "white"} size={18} />
    )}
    <Text style={[S.buttonText, secondary && { color: C.green }]}>
      {children}
    </Text>
  </Pressable>
);
const SmallButton = ({ onPress, children }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={typeof children === "string" ? children : undefined}
    onPress={onPress}
    style={S.smallButton}
  >
    <Text style={S.smallText}>{children}</Text>
    <Icon name="arrow-forward" size={15} />
  </Pressable>
);
const Field = ({ label, ...props }) => (
  <View style={{ gap: 8 }}>
    <Label>{label}</Label>
    <TextInput
      accessibilityLabel={label}
      placeholderTextColor="#A1ABA2"
      style={S.input}
      {...props}
    />
  </View>
);
function Heading({ title, subtitle, right }) {
  return (
    <View style={S.pageHeading}>
      <View style={{ width: "100%" }}>
        <Label>MI ESPACIO</Label>
        <Text style={S.pageTitle}>{title}</Text>
        <Text style={S.subTitle}>{subtitle}</Text>
      </View>
      {right}
    </View>
  );
}
function SettingRow({ icon, title, detail, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={S.settingRow}
    >
      <Icon name={icon} />
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={S.rowTitle}>{title}</Text>
        <Text style={S.caption}>{detail}</Text>
      </View>
      <Icon name="chevron-forward" size={16} />
    </Pressable>
  );
}
export { Icon, Label, Title, Button, SmallButton, Field, Heading, SettingRow };
