# Evaluación Crítica de la IA

## 1. Prompts utilizados
- **Prompt 1 (Análisis de riesgos):** Se le pidió a la IA actuar como Senior QA y priorizar los riesgos del sistema StockPascual basándose en los requisitos.
- **Prompt 2 (Casos de prueba):** Se le pidió generar una suite de casos de prueba detallando precondiciones, pasos y resultados esperados.

## 2. ¿Qué acertó la IA?
- Generó una estructura muy clara y profesional para priorizar riesgos.
- Los datos de prueba que inventó (SKUs, precios en COP) fueron muy realistas y útiles para entender el contexto.
- Propuso casos de prueba de integridad (como el ADJUST) que efectivamente resultaron ser bugs reales en el sistema.

## 3. ¿Qué alucinó o inventó?
- En el análisis de riesgos, asumió que el sistema necesitaba manejar "transacciones atómicas" y "concurrencia" (temas avanzados de bases de datos), cuando el MVP es un sistema básico en Node.js.
- Propuso una "Estrategia de ejecución en 3 fases" demasiado corporativa para un laboratorio académico local.

## 4. ¿Qué no vio (puntos ciegos)?
- La IA ignoró por completo los riesgos de ataques XSS en los campos de texto, a pesar de que es un criterio de aceptación explícito en los requisitos.
- No detectó que el dashboard podría calcular mal el valor del inventario si se borra un producto con historial.

## 5. Reflexión final: ¿Contratarías un QA 100% reemplazado por IA?
No, de ninguna manera. La IA es una excelente asistente para acelerar el trabajo (como redactar el formato CSV o listar ideas), pero carece de la intuición humana. Un tester humano puede explorar la app, dar doble clic en un botón por aburrimiento y descubrir que el sistema duplica el stock. La IA no navega, no "juega" con la interfaz ni entiende el contexto real del almacén de la Institución Pascual Bravo. Además, la IA tiende a asumir que todo funciona bien hasta que le dices lo contrario. En QA, el humano es el que toma la decisión final de aprobar o rechazar un software.