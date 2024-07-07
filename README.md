# GeoFeatures Full-Stack Application

This is a full-stack application for managing point, polygon, and event features with real-time updates. The backend is built with Express, MongoDB, and Socket.io, while the frontend is developed using React.

## Features

- Backend:
  - Manage point features
  - Manage polygon features
  - Manage event features
  - Real-time updates via Socket.io
- Frontend:
  - Interactive map to display and manage features
  - User-friendly interface for feature management
  - Real-time updates reflected on the map

## Prerequisites

- Node.js
- npm (or yarn)
- MongoDB

## Installation

### Backend Setup

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>/backend
    ```

2. Install backend dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `backend` directory and add your environment variables. Example:

    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/your-database-name
    ```

4. Start the MongoDB server if it's not already running:

    ```bash
    mongod
    ```

### Frontend Setup

1. Navigate to the frontend directory:

    ```bash
    cd ../frontend
    ```

2. Install frontend dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `frontend` directory and add your environment variables. Example:

    ```env
    REACT_APP_API_URL=http://localhost:5000
    ```

## Running the Application

### Start the Backend

1. Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

2. Start the backend server:

    ```bash
    npm start
    ```

The backend server will start and listen on the port specified in the `.env` file (default is 5000).

### Start the Frontend

1. Navigate to the `frontend` directory:

    ```bash
    cd frontend
    ```

2. Start the frontend development server:

    ```bash
    npm start
    ```

The frontend development server will start and open the application in your default web browser. The app will be accessible at `http://localhost:5173`.

## API Endpoints

### Point Features

- **GET** `/pointsLayer` - Get all point features
- **POST** `/pointsLayer` - Create a new point feature
- **PUT** `/pointsLayer/:id` - Update a point feature
- **DELETE** `/pointsLayer/:id` - Delete a point feature

### Polygon Features

- **GET** `/polygonsLayer` - Get all polygon features
- **POST** `/polygonsLayer` - Create a new polygon feature
- **PUT** `/polygonsLayer/:id` - Update a polygon feature
- **DELETE** `/polygonsLayer/:id` - Delete a polygon feature

### Event Features

- **GET** `/eventsLayer` - Get all event features
- **POST** `/eventsLayer` - Create a new event feature
- **PUT** `/eventsLayer/:id` - Update an event feature
- **DELETE** `/eventsLayer/:id` - Delete an event feature

## Real-Time Updates

This application uses Socket.io for real-time updates. The Socket.io server is configured to allow connections from any origin. You can change this by modifying the `cors` settings in the server configuration.

## Contributing

If you would like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License

This project is licensed under the MIT License.

## Contact

If you have any questions, feel free to reach out to the project maintainer at israeln753951@gmail.com.
