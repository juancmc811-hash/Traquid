# Estructura de la app móvil

`App.js` inicia los proveedores y la animación de apertura. No contiene pantallas ni lógica de gastos.

## Flujo de datos

`App → TraquidApp → useTraquidController → TraquidProvider → AppLayout → ScreenRouter → pantalla`

El controlador mantiene el estado y las acciones. Cada pantalla o formulario solicita únicamente los campos que utiliza mediante `useTraquid([...])`. El contexto ofrece suscripciones con snapshots estables; los componentes memorizados evitan actualizaciones por campos que no usan. Las acciones modifican el mismo estado y el almacenamiento conserva los datos. No hay copias independientes del presupuesto entre pantallas.

## Carpetas

- `src/screens`: las cinco pantallas móviles.
- `src/navigation`: selección de pantalla.
- `src/components/layout`: cabecera, navegación inferior y composición general.
- `src/components/forms`: modal y formularios de presupuesto y gasto.
- `src/components/expenses`, `budget`, `stats`: componentes de cada función.
- `src/components/ui`: botones, textos, campos y estados vacíos reutilizables.
- `src/context`: suscripciones al estado compartido.
- `src/hooks`: coordinación de estado, persistencia y acciones.
- `src/storage`: lectura y escritura de datos.
- `src/utils`: cálculos, fechas, gestos e informes.
- `src/config`: categorías.
- `src/theme`: colores y estilos compartidos.
- `assets`: imágenes e iconos.
- `tests`: comprobaciones de cálculos, gestos, compatibilidad nativa y estructura.
- `scripts`: ejecución, compilación y auditoría visual.
- `android`: proyecto nativo generado y configuración Android.
- `output`: compilaciones y APK; `tmp`: registros y capturas de revisión.

## Mantener esta organización

Cada archivo propio de la aplicación debe quedar por debajo de 500 líneas; preferiblemente 400. `npm test` comprueba ese límite y los imports relativos. Los archivos generados por Expo/Android y las dependencias no se dividen manualmente.

Las pantallas componen componentes y llaman acciones del controlador. Los cálculos puros permanecen en utilidades; la persistencia en almacenamiento. Si crece una función, se extrae por responsabilidad antes de alcanzar el límite.

## Home — fase 1

`HomeScreen` compone `BudgetHero`, `BudgetIndicator`, `MetricCard`, `PaceIndicator` y `RecentExpenses`. Los estilos propios están en `src/theme/homeStyles.js` para no ampliar el archivo compartido ni alterar las demás pantallas. La cabecera, el modal, los iconos Ionicons y las microinteracciones de `Motion` se reutilizan. No se añaden dependencias. La capa crema del fondo cambia únicamente en Inicio.

Los importes siguen viniendo de `summary` en céntimos; no se modifican saldo, gasto, reparto diario ni persistencia. `financialPace` clasifica la presentación usando el mismo presupuesto proporcional de `summary`: `floor(presupuesto × días transcurridos / días del periodo)`, incluido hoy. Menos del 90%: dentro; desde el 90% hasta el 100% inclusive: cerca del límite; cualquier exceso: por encima. Sin presupuesto no se clasifica. Saldo cero o negativo nunca muestra una señal favorable: se presenta como «Sin saldo disponible», incluso el último día del periodo. Si el importe proporcional redondea a cero, cero gasto queda dentro y cualquier gasto queda por encima. No son previsiones, ingresos ni deudas. El porcentaje restante se limita a 0–100 y se redondea hacia abajo para no mostrar un 100% engañoso tras un gasto pequeño.

Los tres últimos gastos corresponden al periodo seleccionado, ordenados por fecha y después por creación; se reutiliza la fila editable existente. «Ver todos» abre el historial del mismo periodo. Las acciones no esperan al final de las animaciones. La actualización del saldo reutiliza `EnterView` y la apertura de formularios conserva `BottomSheet`; ambas respetan el proveedor de movimiento reducido. No se anima la anchura del progreso para evitar trabajo de layout continuo.

Pruebas específicas: `tests/pace.test.mjs` y `scripts/home-audit.cjs`. Este último sirve `dist` localmente y comprueba datos sintéticos en 320, 390 y 768 px, estados vacíos, presupuesto agotado/negativo, cantidades grandes, textos largos, límite de tres filas y apertura del formulario con movimiento reducido. Usa la misma instalación local de Playwright/Edge que la auditoría existente; su ruta se debe adaptar en otros equipos.

Documentación consultada: [AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo), [Animated](https://reactnative.dev/docs/animated), [Expo Vector Icons](https://docs.expo.dev/guides/icons/) y [exportación web de Expo](https://docs.expo.dev/workflow/web/). Se conservan las APIs ya instaladas; no se introduce blur nativo ni otra biblioteca de animación.

## Verificación

Ejecutar `npm test`, exportar la app y usar `scripts/ui-audit.cjs` con `AUDIT_STATIC_ROOT`, `AUDIT_OUTPUT` y `AUDIT_VERIFY=1`. La auditoría usa datos sintéticos y revisa anchos de móvil, navegación, formularios, fechas, filtros y persistencia. La comprobación en navegador no sustituye una prueba en un teléfono Android.
