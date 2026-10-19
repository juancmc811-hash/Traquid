# Revisión de estructura y experiencia móvil — 16/10/2026

Se separó el archivo principal en pantallas, formularios, componentes reutilizables, navegación, controlador, contexto, almacenamiento y utilidades. El mayor módulo de la app tiene 399 líneas. Se retiraron estilos y ramas de interfaz de escritorio que no se utilizaban.

El estado financiero sigue teniendo una única fuente. Los componentes se suscriben a los campos que necesitan; los cálculos derivados están memorizados. La lista de movimientos carga 30 filas inicialmente y amplía por bloques de 30.

Se ajustaron botones, navegación inferior, estadísticas, calendario y formulario de gastos para pantallas estrechas. El formulario mantiene visible la acción de guardar y presenta las categorías en dos columnas. Los errores aparecen junto a la acción de guardar.

## Referencias consultadas

- [Y Combinator: Design Review, Mobile Apps](https://www.ycombinator.com/blog/design-review-mobile-apps), incluyendo fragmentos visuales del vídeo sobre controles táctiles y jerarquía.
- [NNGroup: organización visual de formularios](https://www.nngroup.com/videos/better-forms-visual-organization/).
- [NNGroup: propósito de la animación en UX](https://www.nngroup.com/articles/animation-purpose-ux/).
- [Material: navegación inferior](https://m3.material.io/components/navigation-bar/guidelines).

## Verificación posterior

- 10 pruebas automáticas superadas: cálculos financieros, gestos, APIs nativas de estilos y límites e imports de los módulos.
- Exportación web de la versión modular completada.
- Auditoría con datos sintéticos en 320, 360, 390 y 430 píxeles: navegación, alineación, ausencia de desbordamiento horizontal y errores de ejecución, foco al escribir, fecha inválida, guardado, búsqueda y persistencia.
- 600 gastos: 30 filas iniciales, 60 al ampliar y búsqueda del último movimiento.
- Primera apertura sin datos: creación y guardado del presupuesto.
- Capturas de revisión en `tmp/ui-audit-modular`; informe detallado en `report.json`.

Estas comprobaciones se ejecutaron en navegador con tamaño móvil. Queda pendiente la prueba en un teléfono físico; no se ha medido la fluidez real en el dispositivo.
