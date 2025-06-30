![Pure Care Fitness](public\images\purecarefitness-cPgDB8df.png)

# Pure Care Fitness

A comprehensive fitness management web application built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Chat functionality
- Fitness service management
- Trainer profiles
- Gym listings
- Supplementaries information
- Reviews system
- Contact management

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: EJS templates
- **Authentication**: JWT, bcrypt
- **Real-time Communication**: Socket.io

## Project Structure

```
pure-care-fitness/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── models/         # Database models
├── public/         # Static files
├── routes/         # API routes
├── utils/          # Utility functions
├── views/          # EJS templates
└── middlewares/    # Custom middleware
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Current Status

This project is currently under development. Features are being added and improved regularly.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
