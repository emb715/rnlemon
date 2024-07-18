# React Native Challenge

## Objetivos:

Desarrollar una aplicación en React Native que incluya:
1. Una pantalla de login con autenticación a través de Google.
2. Un listado de criptomonedas consumiendo una API REST.
3. Una pantalla de detalles para una criptomoneda seleccionada.

## Requisitos Detallados:

### Pantalla de Login:
- Diseñar una interfaz intuitiva y segura para el login.
- Implementar el login utilizando Google SignIn.
- Gestionar la navegación post-login correctamente, dirigiendo al usuario al
listado de criptomonedas.
- Manejar los estados de error y éxito de la autenticación.

### Pantalla de listado de Criptomonedas:
- Consumir datos de la API REST de CoinMarketCap para obtener el listado de
criptomonedas.
- Mostrar un listado básico de criptomonedas con información relevante como
nombre, símbolo y precio actual.
- Buscador que permita filtrar monedas por symbol y nombre
- Permitir agregar una criptomoneda a favoritos y que esta moneda se persista
en la app (cuanod se cierra la app y vuelvas abrir, tienen que persistirse)
- Filtro (tipo toggle) para ver solo las criptomonedas favoritas

### Pantalla de Detalles de Criptomoneda:
- Al seleccionar una criptomoneda del listado, mostrar una pantalla con
detalles más extensos: precio actual, variación porcentual en 24h, volumen
de comercio.
- Consumir y actualizar estos datos con la frecuencia adecuada (cada 30
segundos).
- Permitir al usuario interactuar con la información, como refrescar
manualmente.

### Evaluación:
- Funcionalidad completa y sin errores: La aplicación debe funcionar de manera fluida
y sin fallos en cada uno de los puntos requeridos tanto en Android como en iOS.
- Calidad del Código: El código debe ser claro, bien estructurado, y seguir buenas
prácticas de desarrollo.
- Seguridad: Verificar que la implementación de la autenticación y el manejo de datos
sea segura.
- Experiencia de Usuario: La interfaz debe ser intuitiva, atractiva, consitente y
proporcionar una buena experiencia de usuario.

- Pruebas: Incluir pruebas unitarias y de integración que validen la lógica y el
comportamiento de la aplicación.

### Observaciones
- El ejercicio se debera entregar en un repositorio publico de Github con un readme
explicando las tecnologías y librerías aplicadas.
- Utilizar el react-native-cli para hacer el setup del proyecto (no utilizar Expo).