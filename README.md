# Bicycle Dock Management

A full-stack web application for managing bicycle docks, riders, and dock bookings. Built with Express + MongoDB on the backend and React + Vite on the frontend.

## Tech Stack

- **Backend:** Node.js, Express, Mongoose, Swagger UI
- **Frontend:** React 19, React Router, Vite
- **Database:** MongoDB

## Project Structure

```
├── src/
│   ├── index.js              # Express server entry point
│   ├── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── Dock.js           # Dock schema (dock_id, location, capacity)
│   │   ├── Rider.js          # Rider schema (rider_id, name, cycle_model)
│   │   └── DockRider.js      # Booking schema (dock_id, rider_id, rental_duration)
│   └── routes/
│       ├── dockRoutes.js     # CRUD for docks
│       ├── riderRoutes.js    # CRUD for riders
│       └── dockRiderRoutes.js # CRUD for bookings
├── frontend/
│   └── src/
│       ├── App.jsx           # Main app with navigation
│       ├── api.js            # API client functions
│       └── pages/
│           ├── DocksPage.jsx       # Dock management with availability
│           ├── RidersPage.jsx      # Rider management
│           └── BookedDocksPage.jsx # Booking management with entry/exit times
├── api-contracts.json        # OpenAPI 3.0 spec
├── start.sh                  # One-command setup & launch script
└── package.json
```

## Getting Started

### Prerequisites

- Node.js v20+
- MongoDB 6.0+

### Quick Start

```bash
chmod +x start.sh
./start.sh
```

This installs dependencies, starts MongoDB, and launches both servers.

### Manual Start

```bash
# Install dependencies
npm install
npm install --prefix frontend

# Start MongoDB (if not running)
sudo systemctl start mongod

# Start backend (port 3000)
npm start

# Start frontend (port 5173) — in a separate terminal
cd frontend && npm run dev
```

## API Endpoints

| Method | Endpoint               | Description          |
|--------|------------------------|----------------------|
| GET    | `/api/docks`           | List all docks       |
| POST   | `/api/docks`           | Create a dock        |
| GET    | `/api/docks/:dock_id`  | Get dock by ID       |
| PUT    | `/api/docks/:dock_id`  | Update a dock        |
| DELETE | `/api/docks/:dock_id`  | Delete a dock        |
| GET    | `/api/riders`          | List all riders      |
| POST   | `/api/riders`          | Create a rider       |
| GET    | `/api/riders/:rider_id`| Get rider by ID      |
| PUT    | `/api/riders/:rider_id`| Update a rider       |
| DELETE | `/api/riders/:rider_id`| Delete a rider       |
| GET    | `/api/dock-riders`     | List all bookings    |
| POST   | `/api/dock-riders`     | Create a booking     |
| GET    | `/api/dock-riders/:id` | Get booking by ID    |
| PUT    | `/api/dock-riders/:id` | Update a booking     |
| DELETE | `/api/dock-riders/:id` | Delete a booking     |
| DELETE | `/api/clear-data`      | Clear all data       |
| GET    | `/health`              | Health check         |

Swagger UI is available at `http://localhost:3000/api-docs`.

## Features

### Docks Page
- Create, edit, and delete bicycle docks
- Each dock has a location and parking capacity
- Table shows **Booked** count and **Available** slots per dock (capacity minus active bookings)

### Riders Page
- Create, edit, and delete riders
- Each rider has a name and cycle model

### Booked Docks Page
- Book a dock by selecting a dock and rider from dropdowns
- Set rental duration in minutes
- Table displays **Entry Time** (booking creation timestamp) and **Exit Time** (entry time + rental duration)
- Edit or cancel bookings

### Clear Data
- "Clear Data" button in the navbar wipes all docks, riders, and bookings from MongoDB

## Environment Variables

| Variable        | Default                                    | Description         |
|-----------------|--------------------------------------------|---------------------|
| `PORT`          | `3000`                                     | Backend server port |
| `FRONTEND_PORT` | `5173`                                     | Vite dev server port|
| `MONGO_URI`     | `mongodb://localhost:27017/bicycle_dock_db`| MongoDB connection  |
