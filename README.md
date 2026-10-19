# Traquid

App móvil de presupuesto personal creada con React Native y Expo. El navegador se utiliza como vista previa y entorno de pruebas del diseño móvil.

La estructura de módulos, responsabilidades y flujo de datos se describe en [ARQUITECTURA.md](ARQUITECTURA.md). Los módulos propios de la app tienen un máximo de 500 líneas, verificado por `npm test`.

## Arrancar

```sh
npm install
npm run web
```

Vista previa: http://localhost:8081. Para probar en un teléfono, ejecuta `npm start` y abre el proyecto en una versión compatible de Expo Go, con el ordenador y el teléfono en la misma red.

## Funciones

- Presupuesto semanal (lunes a domingo) o mensual, independiente para cada periodo.
- Saldo disponible, consumo del presupuesto y reparto diario del saldo restante, incluido hoy.
- Crear, editar y eliminar gastos por categoría y fecha; búsqueda y filtros.
- Calendario mensual con importe diario y detalle de movimientos.
- Estadísticas del periodo y distribución por categorías.
- Persistencia local con AsyncStorage; sin cuenta ni servidor.
- PDF descargable en web y exportable mediante el menú de compartir en móvil.
- Copia JSON descargable en web. La restauración de esa copia aún no está implementada.
- Ejemplo opcional, claramente ficticio, disponible en Ajustes cuando no hay gastos.

La app empieza vacía para evitar confundir datos de ejemplo con gastos reales. El presupuesto se introduce para cada periodo nuevo. El desajuste acumulado indica cuánto supera el gasto el ritmo proporcional del periodo; no representa una deuda real. Si se agota el presupuesto, el saldo puede ser negativo y el importe diario disponible será cero.

## Validación

```sh
npm test
npm run export:web
npm run export:native
```

Las pruebas financieras cubren límites de semanas, cambios de año, meses bisiestos, importes en céntimos, periodos independientes, exceso de gasto y umbrales de color. Las comprobaciones de interfaz se registran en `scripts/browser-check.cjs`; ese script usa el Playwright incluido en este entorno y Edge, y requiere adaptar su ruta para ejecutarlo en otro ordenador.

Los bundles JavaScript de Android e iOS se comprobaron inicialmente con `--no-bytecode`. Posteriormente se compiló una APK Android de release con bytecode Hermes, firmada con la clave de pruebas del proyecto. Se verificaron la firma APK v2, el manifiesto, las dos arquitecturas ARM y la integridad del paquete. No se ha probado en un dispositivo físico. El análisis de dependencias detecta avisos transitivos de Expo/React Native (24 en la instalación inicial); deben revisarse antes de distribución. No se aplicaron las degradaciones incompatibles de SDK que propone `npm audit fix --force`.

## APK de prueba

Archivo actual: `output/android/Traquid-1.0.3.apk`, para Android 7 o superior, ARM de 32 y 64 bits. Es autónoma y no necesita el servidor de desarrollo. Se instala sobre la versión anterior, conservando los datos locales. La compilación sigue usando la misma clave de pruebas.

Para volver a compilar en Windows:

```powershell
./scripts/build-apk.ps1
```

El script usa Android Studio y su Java 21, el SDK local y una unidad temporal T: para evitar el límite de rutas de Windows. T: debe estar libre. Desactiva la compilación incremental de Kotlin para evitar conflictos entre la ruta real y la unidad temporal. El build de prueba conserva la firma de `android/app/debug.keystore`; no sustituye una clave de publicación para Google Play.

## Próximas fases

1. MVP local: implementado; validado en navegador de escritorio y tamaño móvil. Prueba física en Android/iOS pendiente.
2. Cuenta Traquid/Google, base de datos, sincronización y gastos compartidos: pendientes, sin autenticación ficticia.
3. Objetivos de ahorro y recomendaciones: evolución posterior; sin IA implementada.
4. Publicación: pendientes firma de distribución, pruebas en dispositivos, iconos definitivos, política de privacidad y fichas de las tiendas. Ya hay una APK de prueba local; la app todavía no está publicada.

Los datos locales no se sincronizan entre dispositivos y pueden perderse al borrar el almacenamiento de la app o del navegador. Exporta un informe antes de borrarlos.
