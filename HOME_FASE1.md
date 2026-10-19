# Home premium — fase 1

## Auditoría y decisiones

El Home anterior mostraba un anillo de presupuesto y cuatro métricas con la misma jerarquía. No incluía movimientos recientes ni una acción propia de alta de gasto. El desajuste acumulado se mostraba como un importe sin distinguir tres niveles de ritmo.

Se conserva el flujo controlador → contexto → pantalla y el almacenamiento local. La cabecera mantiene marca, fecha y acceso a ajustes. Inicio incorpora saldo protagonista, selector de periodo, presupuesto total y gastado, barra y porcentaje restante, acción de gasto, dos métricas, tres gastos editables y acceso a historial/calendario. El gasto de hoy continúa visible en el acceso al calendario.

La dirección visual usa salvia, crema, superficies casi opacas, bordes claros, sombras suaves y un motivo circular ligero. El fondo botánico se atenúa solo en Inicio. No se añaden dependencias, blur ni imágenes nuevas. El selector ofrece más contraste en el Home. En pantallas estrechas las cifras y métricas pueden apilarse; los gastos recientes muestran el importe debajo del concepto para evitar recortes.

## Archivos modificados

- `src/screens/HomeScreen.js`: composición y acciones del Home.
- `src/components/layout/AppLayout.js`: capa crema condicional de Inicio.
- `src/components/budget/PeriodSwitch.js`: opción de contraste, usada por el Home.
- `src/components/expenses/ExpenseRow.js`: variante de importe debajo del concepto, usada por gastos recientes.
- `src/utils/finance.mjs`: expone `expectedSpent` desde el cálculo proporcional ya existente y añade la clasificación pura `financialPace`.
- `ARQUITECTURA.md`: componentes, umbrales y decisiones de esta fase.

## Componentes y recursos creados

- `src/components/budget/BudgetHero.js`: tarjeta principal.
- `src/components/budget/BudgetIndicator.js`: porcentaje y barra accesible.
- `src/components/budget/MetricCard.js`: tarjeta de métrica pulsable.
- `src/components/budget/PaceIndicator.js`: estado textual y color del ritmo.
- `src/components/expenses/RecentExpenses.js`: tres gastos del periodo con edición e historial.
- `src/theme/homeStyles.js`: estilos aislados del Home.
- `tests/pace.test.mjs`: fronteras del ritmo, mensual/semanal, redondeo, saldo agotado y conservación de importes.
- `scripts/home-audit.cjs`: revisión de estados y capturas con datos sintéticos en Edge.

## Ritmo y estados

El importe proporcional es `floor(presupuesto × días transcurridos / días del periodo)`, incluido hoy. Se calcula una sola vez en `summary`; el desajuste y el ritmo lo reutilizan. Por debajo del 90% se muestra «Dentro del ritmo»; desde el 90% hasta el 100% inclusive, «Cerca del límite»; cualquier exceso, «Por encima del ritmo». No se altera la fórmula de saldo, gasto ni asignación diaria.

Sin presupuesto se muestra «Sin referencia» y no se presenta un saldo disponible ficticio. Con presupuesto agotado o negativo se prioriza «Sin saldo disponible». Esto evita una etiqueta favorable incluso al finalizar el periodo. El ritmo no representa una deuda, un ingreso ni una previsión. Los porcentajes restantes se limitan a 0–100 y se redondean hacia abajo.

Las pulsaciones, cambios de saldo y apertura del formulario reutilizan `MotionPressable`, `EnterView` y `BottomSheet`. Las acciones se ejecutan sin esperar a la animación; el proveedor existente consulta el movimiento reducido y escucha sus cambios. La barra de progreso se actualiza sin animar el layout.

## Reproducir la validación

```sh
npm test
npm run export:web
node scripts/home-audit.cjs
```

La auditoría general se ejecuta con `AUDIT_STATIC_ROOT=dist`, `AUDIT_OUTPUT=tmp/home-phase1`, `AUDIT_VERIFY=1` y `node scripts/ui-audit.cjs`. Cubre navegación, formularios, fecha inválida, edición de texto, guardado, búsqueda y persistencia en 320/360/390/430 px, además de una lista de 600 gastos y el primer presupuesto.

La auditoría del Home comprueba 320/390/768 px con siete escenarios: habitual, sin presupuesto, sin gastos, agotado, negativo, cantidades grandes y gastos sin presupuesto. Comprueba los límites de texto e importes, tres filas como máximo y apertura del formulario con movimiento reducido. Las capturas se guardan en `tmp/home-states/`. Ambos scripts usan la ruta local de Playwright ya utilizada por el proyecto; se debe adaptar en otro equipo.

Para Android se utiliza `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/build-apk.ps1`, con el SDK y Java existentes. La APK local mantiene la versión 1.0.3 y la firma de pruebas del proyecto. No es una publicación en Google Play.

## Pendiente

Probar en un dispositivo físico Android: TalkBack, escala de fuente del sistema, teclado, zonas seguras y fluidez. La emulación de movimiento reducido del navegador no sustituye la verificación nativa de accesibilidad. Gradle informa de APIs obsoletas de cara a Gradle 10; la actualización de la cadena de compilación queda fuera de esta fase.

## Documentación oficial consultada

- [React Native AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo)
- [React Native Animated](https://reactnative.dev/docs/animated)
- [Expo Vector Icons](https://docs.expo.dev/guides/icons/)
- [Expo web y exportación](https://docs.expo.dev/workflow/web/)
