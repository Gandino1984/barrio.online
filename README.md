# uribarri.online 🏪

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

Sistema de gestión de pedidos y reservas online para comercios locales del Distrito 02 de Bilbao.
La app está configurada con un frontend hecho con React.js, un backend con Node.js y una base de datos MySQL, backend y DB dentro de contenedores de Docker. El backend depende del servicio de base de datos, lo que garantiza el orden de inicio adecuado, y ambos servicios utilizan variables de entorno para su configuración, lo que permite una implementación flexible.

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
- Gestión de sesiones

### Frontend
- React 18+
- Vite como bundler
- Axios para peticiones HTTP
- Gestión de estado moderna
- Componentes reutilizables

### Infraestructura
- Docker + Docker Compose
- Variables de entorno
- CORS configurado
- Multer para subir archivos
- Logs y monitorización
