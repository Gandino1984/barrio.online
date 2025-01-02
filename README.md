# uribarri.online

Este es un sistema open-source para la gestión de pedidos y reservas online. Diseñado para comercios locales en el Distrito 02 de Bilbao.

## Descripción

Este proyecto proporciona una plataforma completa para manejar los pedidos y/o reservas en línea que reciben los comercios locales en el distrito de Uribarri (Distrito 02) de Bilbao. Cuenta con componentes divididos de frontend, backend y DB, diseñados para agilizar las operaciones entre clientes, comercios y proveedores de servicios o productos.

## Stack Tecnológico
### Backend
- Node.js con Express.js
- Base de datos MySQL
- ORM Sequelize
- CORS para compartir recursos entre orígenes
- dotenv para gestión de variables de entorno

### Frontend
- React 
- Vite como herramienta de construcción
- Axios para solicitudes API
- Lucide React para iconos

## Estructura de la Base de Datos

El sistema utiliza una base de datos MySQL con las siguientes entidades principales:
- Usuarios
- Productos
- comercios
- Proveedores
- Pedidos
- Ventas
- Compras
- registro de IP

## Características

- Autenticación y autorización de usuarios
- Gestión de productos
- Perfiles y gestión de comercios
- Gestión de relaciones con proveedores
- Procesamiento de pedidos
- Seguimiento de ventas
- Manejo de productos estacionales
- Sistema de calificación para productos y comercios
- Servicios basados en ubicación

## Requisitos Previos

- Node.js (versión LTS más reciente recomendada)
- Servidor MySQL
- Gestor de paquetes npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Gandino1984/uribarri.online.git
cd uribarri.online
```

2. Instalar dependencias del backend:
```bash
npm install
```

3. Instalar dependencias del frontend:
```bash
cd front-end
npm install
```

4. Configurar variables de entorno:
Crear un archivo `.env` en el directorio raíz y añadir configuraciones necesarias:
```env
DB_HOST=host_de_base_de_datos
DB_USER=usuario_de_base_de_datos
DB_PASSWORD=contraseña_de_base_de_datos
DB_NAME=DB_gestionPedidosOnline_2024
```

5. Inicializar la base de datos:
Ejecutar el script SQL ubicado en `1DB_schema_gestionPedidosOnline_2024.sql`

## Ejecutando la Aplicación

### Modo Desarrollo

Backend:
```bash
npm run dev
```

Frontend:
```bash
cd front-end
npm run dev
```

### Modo Producción

Backend:
```bash
npm start
```

Frontend:
```bash
cd front-end
npm run build
npm run preview
```

## Rutas API

La aplicación proporciona los siguientes endpoints API principales:

- `/user` - Endpoints de gestión de usuarios
- `/product` - Endpoints de gestión de productos
- `/shop` - Endpoints de gestión de comercios
- `/provider` - Endpoints de gestión de proveedores

## Contribución

1. Bifurcar el repositorio
2. Crear rama de características (`git checkout -b feature/AmazingFeature`)
3. Confirmar cambios (`git commit -m 'Añadir AmazingFeature'`)
4. Subir a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Autor

German Andino

## Licencia

Este proyecto está licenciado bajo la Licencia ISC.

## Soporte

Para soporte, por favor abrir un issue en: https://github.com/Gandino1984/uribarri.online/issues