# uribarri.online

An online management system for orders and reservations designed for local businesses in District 02 of Bilbao.

## Description

This project provides a comprehensive platform for managing online orders and reservations for local businesses in the Uribarri district (District 02) of Bilbao. It features a full-stack implementation with separate frontend and backend components, designed to streamline business operations for local shops and service providers.

## Tech Stack

### Backend
- Node.js with Express.js
- MySQL Database
- Sequelize ORM
- CORS for cross-origin resource sharing
- dotenv for environment variable management

### Frontend
- React 18
- Vite as build tool
- Axios for API requests
- Lucide React for icons

## Database Structure

The system uses a MySQL database with the following main entities:
- Users
- Products
- Shops
- Providers
- Orders
- Sales
- Purchases (Buys)
- Production tracking

## Features

- User authentication and authorization
- Product management
- Shop profiles and management
- Provider relationship management
- Order processing
- Sales tracking
- Seasonal product handling
- Rating system for products and shops
- Location-based services

## Prerequisites

- Node.js (Latest LTS version recommended)
- MySQL Server
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Gandino1984/uribarri.online.git
cd uribarri.online
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd front-end
npm install
```

4. Configure environment variables:
Create a `.env` file in the root directory and add necessary configurations:
```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=DB_gestionPedidosOnline_2024
```

5. Initialize the database:
Execute the SQL script located at `1DB_schema_gestionPedidosOnline_2024.sql`

## Running the Application

### Development Mode

Backend:
```bash
npm run dev
```

Frontend:
```bash
cd front-end
npm run dev
```

### Production Mode

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

## API Routes

The application provides the following main API endpoints:

- `/user` - User management endpoints
- `/product` - Product management endpoints
- `/shop` - Shop management endpoints
- `/provider` - Provider management endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Author

German Andino

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue at: https://github.com/Gandino1984/uribarri.online/issues
