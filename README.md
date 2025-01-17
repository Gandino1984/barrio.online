# uribarri.online 🏪

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

Sistema de gestión de pedidos y reservas online para comercios locales del Distrito 02 de Bilbao.

El proyecto es una aplicación web estructurada con una arquitectura full-stack, utilizando una combinación de tecnologías tanto para el front-end como para el back-end. El front-end está construido con React.js y Vite. El backend está estructurado con Node.js, utilizando Express para enrutamiento y controladores, e interactúa con una base de datos a través de modelos. El proyecto utiliza Docker para la contenedorización, estructurado a través de un archivo `Dockerfile` y un archivo `docker-compose.yml`. El `Dockerfile` comienza con la imagen base `node:22.9.0` , establece el directorio de trabajo en `/app` e instala las dependencias desde `package.json`. Expone el puerto `3000` y ejecuta el servidor back-end usando `node back-end/index.js`. El `docker-compose.yml` define dos servicios: una base de datos MySQL y la aplicación back-end. El servicio de base de datos utiliza la imagen `mysql:8.0` , con variables de entorno para credenciales y configuraciones de almacenamiento persistente.

## 🌟 Características Principales

- Gestión de productos y servicios
- Sistema de reservas en tiempo real
- Panel de administración para comercios y compradores
- Gestión de inventario
- Sistema de notificaciones
- Integración con mapas(no implementado)

## 🛠️ Stack Tecnológico

### Backend
- Node.js + Express.js
- MySQL + Sequelize ORM
- Sistema de autenticación con bcrypt
- API RESTful
- Multer para subir archivos
- Gestión de sesiones (localStorage)

### Frontend
- React 18+
- Vite como bundler
- Axios para peticiones HTTP
- Componentes reutilizables

### Infraestructura
- Docker + Docker Compose
- Variables de entorno
- CORS configurado
- Logs para monitorización
