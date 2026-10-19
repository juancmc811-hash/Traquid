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

## Verificación

Ejecutar `npm test`, exportar la app y usar `scripts/ui-audit.cjs` con `AUDIT_STATIC_ROOT`, `AUDIT_OUTPUT` y `AUDIT_VERIFY=1`. La auditoría usa datos sintéticos y revisa anchos de móvil, navegación, formularios, fechas, filtros y persistencia. La comprobación en navegador no sustituye una prueba en un teléfono Android.
