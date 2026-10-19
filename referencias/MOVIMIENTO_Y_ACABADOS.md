# Traquid: movimiento y acabados

Se conserva la estructura móvil, el fondo botánico aportado por el usuario y la jerarquía de importes.

## Referencias visuales consultadas

- [Material 3: ejemplos animados y esquema de movimiento](https://m3.material.io/styles/motion/overview/how-it-works). Respuesta elástica breve en controles, gestos que siguen al dedo y menor rebote para una herramienta financiera.
- [Google Design: Introducing Material 3 Expressive, vídeo](https://www.youtube.com/watch?v=n17dnMChX14).
- [Apple: Meet Liquid Glass, vídeo, Dynamics desde 1:29](https://developer.apple.com/videos/play/wwdc2025/219/?time=89). Referencia visual para luz, transparencia y profundidad; no se reproduce el material nativo exclusivo de Apple.
- [Software Mansion: demostración de filas deslizables](https://docs.swmansion.com/react-native-gesture-handler/docs/components/reanimated_swipeable/). Referencia del gesto que descubre una acción lateral.
- [React Native: Animated y gestos](https://reactnative.dev/docs/animations), [PanResponder](https://reactnative.dev/docs/panresponder). La implementación usa las APIs ya incluidas en el proyecto.
- [Moss Banking: referencia visual de finanzas y naturaleza](https://me.muz.li/blacklead/moss-banking-mobile-app-2). Referencia de composición; no se importan sus imágenes.

## Aplicación en Traquid

- Botones, tarjetas y navegación: escala de 1 a 0,985; pulsación de 70 ms y retorno de 140 ms. Sigue funcionando la acción habitual al tocar.
- Pantallas: opacidad y desplazamiento vertical de 4 puntos en 160 ms.
- Tarjetas de Inicio: una sola transición compartida con la pantalla, sin una segunda entrada escalonada.
- Formularios: panel inferior, asa y cierre deslizando desde el asa. El desplazamiento del formulario queda reservado a su contenido.
- Calendario: gesto horizontal de más de 60 puntos cambia un mes; los controles de flecha siguen disponibles.
- Gastos: deslizar a la izquierda descubre «Editar». El gesto no borra datos.
- Confirmaciones: entrada suave de los mensajes existentes.
- Acabados: tarjetas marfil con mayor opacidad, borde claro y sombra tenue; iluminación y grano SVG originales sobre el fondo. No hay texturas externas descargadas.
- Accesibilidad: se respeta Reducir movimiento; las animaciones no bloquean la navegación. Los gestos conservan alternativas mediante botones.

## Verificación

Ejecutar las pruebas, compilar la vista web y el APK. Verificar en Android: arranque, pulsaciones rápidas, scroll vertical de gastos, edición mediante swipe, cambios de mes en ambos sentidos y teclado dentro del formulario. La vista web permite comprobar composición y acciones, pero no sustituye la prueba táctil en un dispositivo.
