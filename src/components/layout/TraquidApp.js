import React from "react";
import { TraquidProvider } from "../../context/TraquidContext";
import useTraquidController from "../../hooks/useTraquidController";
import AppLayout from "./AppLayout";

function TraquidApp() {
  const controller = useTraquidController();
  return (
    <TraquidProvider value={controller}>
      <AppLayout />
    </TraquidProvider>
  );
}

export default React.memo(TraquidApp);
