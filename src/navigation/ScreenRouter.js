import CalendarScreen from "../screens/CalendarScreen";
import ExpensesScreen from "../screens/ExpensesScreen";
import HomeScreen from "../screens/HomeScreen";
import React from "react";
import SettingsScreen from "../screens/SettingsScreen";
import StatsScreen from "../screens/StatsScreen";
import { useTraquid } from "../context/TraquidContext";

function ScreenRouter() {
  const { page } = useTraquid(["page"]);
  const Screen =
    {
      home: HomeScreen,
      calendar: CalendarScreen,
      stats: StatsScreen,
      expenses: ExpensesScreen,
      settings: SettingsScreen,
    }[page] || HomeScreen;
  return <Screen />;
}
export default React.memo(ScreenRouter);
