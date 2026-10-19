---
name: arquitectura-modular
description: Aplica arquitectura modular al crear proyectos de software, desarrollar funcionalidades o modificar y refactorizar código. Organiza responsabilidades y dependencias respetando el lenguaje, el framework y la estructura existente.
---

# Arquitectura modular

Aplica estas preferencias a proyectos nuevos y modificaciones de código. Cada archivo tiene una responsabilidad concreta y cada carpeta agrupa funcionalidades relacionadas. Evita monolitos, duplicación y dependencias innecesarias.

Prioriza, en orden: correctitud y funcionamiento; separación de responsabilidades; claridad y mantenimiento; escalabilidad y reutilización; rendimiento; tamaño razonable. No sacrifiques funcionamiento por reglas estéticas.

## Ubicación y estructura

Antes de escribir código, examina las instrucciones del repositorio, estructura, puntos de entrada, convenciones y módulos reutilizables. Identifica dónde pertenece el cambio.

- Usa la raíz existente como punto central; establece una raíz clara en proyectos nuevos.
- Agrupa cada funcionalidad importante en su módulo y organiza componentes, servicios, lógica, configuración y recursos por responsabilidad.
- Separa interfaz, negocio, acceso a datos y configuración cuando sean responsabilidades distintas.
- Adapta la estructura al lenguaje, framework y tamaño. No impongas una plantilla ni crees capas vacías.
- Usa nombres descriptivos y convenciones consistentes con el repositorio.

## Entradas y módulos

Los puntos de entrada, uno o varios según la arquitectura, inician y configuran la aplicación y delegan funcionalidades. La raíz coordina; los módulos ejecutan sus responsabilidades.

- Conecta módulos con importaciones, exportaciones e interfaces explícitas; evita dependencias circulares.
- Mantén alta cohesión y bajo acoplamiento; evita referencias innecesarias entre funcionalidades.
- Usa contratos y servicios compartidos cuando corresponda. Mantén estado y lógica cerca de sus consumidores y centraliza solo lo que deba compartirse.
- Reutiliza lo existente cuando encaje. Evita abstracciones excesivas y dependencias innecesarias.
- No dupliques estados, procesos ni cálculos. Usa carga diferida cuando aporte beneficios y respeta las optimizaciones del framework.

## Tamaño de archivos

Busca archivos de menos de 400 líneas; prefiere entre 50 y 250 cuando sea razonable. No añadas relleno a archivos más cortos.

Si un archivo supera 400 líneas, analiza sus responsabilidades y extrae componentes, funciones, servicios o módulos cuando mejore la arquitectura. No fragmentes código cohesivo solo para cumplir el objetivo.

Permite excepciones justificadas para archivos generados, configuraciones extensas o módulos cuya división perjudique la comprensión. Explica brevemente una excepción relevante para el cambio, sin exigir aprobación por ella.

## Desarrollo y mantenimiento

Para funcionalidades nuevas, reutiliza los módulos adecuados y crea archivos o carpetas solo cuando hagan falta. No concentres funcionalidades grandes en el archivo principal.

Si el código afectado mezcla responsabilidades o resulta demasiado largo, realiza separaciones incrementales dentro del alcance solicitado. Conserva el comportamiento y la compatibilidad de interfaces públicas siempre que sea posible. Comprueba los usos antes de eliminar código; actualiza importaciones y pruebas afectadas.

Encontrar desorganización fuera del cambio no autoriza una reestructuración masiva. Señala mejoras mayores por separado cuando sean relevantes.

## Comprobación y documentación

Comprueba que no introduces duplicación ni dependencias circulares. Ejecuta pruebas y comprobaciones disponibles pertinentes al cambio, incluidos linting, formato y tipos cuando estén configurados. Incluye o actualiza pruebas para lógica crítica y comportamiento modificado. Informa de comprobaciones ejecutadas y limitaciones.

Documenta decisiones arquitectónicas importantes donde el proyecto las mantenga. En proyectos nuevos, incluye un README con instalación, ejecución y estructura; en proyectos existentes, actualízalo cuando el cambio altere esas instrucciones.
