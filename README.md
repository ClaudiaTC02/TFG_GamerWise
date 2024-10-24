# 🎮 GamerWise: Sistema de Recomendación y Gestión de Videojuegos

[🎥 Ver Demo en YouTube](https://www.youtube.com/watch?v=ak5ZJCCSCFQ&feature=youtu.be)

## 📑 Índice
- [Descripción](#📖-descripción)
- [Características](#✨-características)
- [Tecnologías utilizadas](#🛠️-tecnologías-utilizadas)
- [Algoritmos de recomendación](#🤖-algoritmos-de-recomendación)
- [Instalación y ejecución](#🚀-instalación-y-ejecución)
- [Pruebas](#🧪-pruebas)
- [Contribuciones](#🤝-contribuciones)
- [Licencia](#📜-licencia)
- [Creadora](#👩‍💻-creadora)

## 📖 Descripción
**GamerWise** es una aplicación web Full-Stack diseñada para mejorar la experiencia de los gamers 🎮. Permite gestionar colecciones de videojuegos y ofrece recomendaciones personalizadas 🧠 basadas en las preferencias de los usuarios. 

Esta herramienta resuelve el desafío de organizar colecciones dispersas en diferentes plataformas y descubrir nuevos títulos personalizados. Utiliza tecnologías como **MySQL**, **Express**, **React** y **Node.js**, con algoritmos avanzados de recomendación. 

## ✨ Características
- 📋 **Gestión de colecciones**: Añade, edita y elimina videojuegos en listas personalizadas.
- 🎯 **Recomendaciones personalizadas**: Algoritmos de filtrado colaborativo, basado en contenido e híbrido.
- 🕹️ **Sincronización con Steam**: Vincula tu cuenta de Steam y sincroniza tu biblioteca de juegos.
- 📱 **Compatibilidad multiplataforma**: Diseño responsive que funciona en móviles y ordenadores.

## 🛠️ Tecnologías utilizadas
- **Frontend**: [React](https://reactjs.org/)
- **Backend**: [Node.js](https://nodejs.org/en/) con [Express](https://expressjs.com/)
- **Base de datos**: [MySQL](https://www.mysql.com/) utilizando Sequelize como ORM
- **Seguridad**: Autenticación con JWT 🔐 y encriptación de contraseñas con bcrypt 🔑
- **API de terceros**: Integración con [IGDB](https://www.igdb.com/) y [Steam API](https://developer.valvesoftware.com/wiki/Steam_Web_API)

## 🤖 Algoritmos de recomendación
- 👥 **Filtrado colaborativo**: Basado en interacciones y preferencias de usuarios similares.
- 🔍 **Filtrado basado en contenido**: Recomendaciones en base a las características de los juegos que te gustan.
- ⚡ **Filtrado híbrido**: Combinación de ambos métodos para obtener recomendaciones más precisas.

## 🚀 Instalación y ejecución
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu_usuario/gamerwise.git
   cd gamerwise
   ```
2. Instalar dependencias en la carpeta de node y la carpeta de react
   ```bash
   npm install
   ```
3. Desde la carpeta node, acceder a “recommender” y ejecutar
   ```bash
   pip install -r requirements.txt
   ```
   de esta forma se instalan los paquetes de Python necesarios.
4. Asegúrate de tener MySQL en ejecución y crea una base de datos con nombre "gamerwise_db" y "gamerwise_db_test".
5. Inicia el servidor desde la carpeta node, se te habrán creado las tablas y relaciones:
   ```bash
   npm start
   ```
6. Abre la aplicación en tu navegador 🌐 en http://localhost:8000, ya se tiene el servidor escuchando.
7. Para ejecutar el frontend, diríjase a la carpeta de react y ejecute el comando:
   ```bash
   npm run dev
   ```
Es importante disponer de un archivo con las siguientes variables de entorno: 
- **JWT_token_secret**: esta es la clave que se utilizará para firmar el token JWT.
- **IGDB_client_id** y **IGBD_authorization**: proporcionados por la API de IGDB.
- **JWT_test**: token JWT que se utilizará para la realización de las pruebas.
- **STEAM_key**: proporcionado por la API de Steam.
- **EXPRESS_sesion_secret**: es una clave secreta para firmar y verificar la identificación 
de sesión en una cookie, protegiendo los datos del usuario

## 🧪 Pruebas
Las funcionalidades fueron evaluadas con encuestas de usabilidad y pruebas de endpoints REST. La retroalimentación 📊 mostró una alta satisfacción en la sincronización de juegos y la calidad de las recomendaciones 🎯.
Para su funcionamiento, desde la carpeta node, abra un terminal y ejecute el siguiente comando:
  ```bash
   npm test
  ```

## 🤝 Contribuciones
Si te interesa contribuir a este proyecto, ¡eres bienvenido! Abre un issue o envía un pull request. Cualquier ayuda será apreciada 💡.

## 📜 Licencia
Este proyecto está bajo la Licencia MIT.

## 👩‍💻 Creadora
GamerWise ha sido creado y desarrollado por Claudia Torres Cruz, como parte de un proyecto personal para mejorar la experiencia de los gamers. ¡Espero que disfrutes usando la aplicación tanto como yo disfruté creándola! 
