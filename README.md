# 🎉 Event Guidance and Inventory Management System

## 📌 Overview
Event Guidance and Inventory Management System is a comprehensive full-stack web application designed to help users seamlessly **plan, organize, and manage events**, while also tracking and maintaining **inventory** resources. It provides a unified platform for milestone tracking, event status updates, and inventory assignment – all through a user-friendly interface.

---

## ✨ Key Features

### 📅 Event Management
- Create, update, and delete events
- Track event status (`Pending`, `In Progress`, `Completed`, `Cancelled`)
- Add essential event details like title, description, location, and date
- Edit and monitor event status with real-time updates

### ✅ Milestone Tracking
- Add multiple milestones for each event
- Set milestone titles, deadlines, and optional descriptions
- Track progress visually
- Mark milestones as completed

### 📦 Inventory Management
- Add and manage inventory items with quantity and unit tracking
- Assign inventory items to specific events
- Update or delete inventory as needed
- Keep detailed logs of all inventory transactions

### 🔐 User Authentication
- Register and login securely with JWT
- Role-based access (Admin, Event Coordinator, Viewer, etc.)
- Protected routes for authenticated users
- Secure session and token management

---

## 🚀 Tech Stack

| Tech | Description |
|------|-------------|
| 🗂 **MongoDB** | NoSQL database for flexible and scalable data storage |
| ⚙️ **Express.js** | Backend framework for routing, API logic, and middleware |
| ⚛️ **React** | Component-based frontend for dynamic and responsive UIs |
| 🌐 **Node.js** | Runtime environment for executing backend code |
| 📦 **Axios** | HTTP client for connecting frontend to backend APIs |
| 🔀 **React Router** | Declarative navigation and route handling in React |
| 🧠 **Context API** | Lightweight global state management for user/session data |
| 🔐 **JWT** | Secure authentication and authorization mechanism |
| 🔑 **Bcrypt.js** | Password hashing for secure user data storage |
| ⏱️ **Date-fns / Moment.js** | Date and time formatting and manipulation |
| 🔢 **UUID** | Unique ID generation for events and inventory |
| 🧪 **Nodemon** | Dev tool for hot-reloading backend server |
| ⚡ **Concurrently** | Run frontend and backend servers together during dev |

---

## ⚙️ Setup and Installation

1.  **Prerequisites:**
    * [Node.js](https://nodejs.org/) (version >= 14 recommended) and npm (which comes with Node.js) or yarn installed on your system.
    * [MongoDB](https://www.mongodb.com/try/download/community) installed and running, or access to a MongoDB Atlas cluster.

2.  **Installation Steps:**

    **Backend Setup (Express.js/Node.js):**

    ```bash
    cd backend # Navigate to your backend directory
    npm install # or yarn install
    ```

    * **Configuration:**
        * Create a `.env` file in your backend directory to store sensitive information such as your MongoDB connection URI, API keys, etc.
        * Example `.env` file:
            ```
            MONGODB_URI=mongodb://localhost:27017/event_inventory_db
            # Add other configuration variables if needed
            ```
        * Update your backend code to read these environment variables using a library like `dotenv`.


    **Frontend Setup (React):**

    ```bash
    cd frontend # Navigate to your frontend directory
    npm install # or yarn install
    ```

3.  **Running the Application:**

    **Backend:**

    ```bash
    cd backend
    npm run dev # or yarn dev (if you have a dev script using nodemon)
    # or
    npm start # or yarn start (for production build)
    ```

    This will typically start your Express.js server on a specified port (e.g., `http://localhost:5000`).

    **Frontend:**

    ```bash
    cd frontend
    npm start # or yarn start
    ```

    This will usually start the React development server, often on `http://localhost:3000`.

    You will need to ensure that your frontend application is configured to communicate with your backend API endpoint.

---

## Usage

* Once both the frontend and backend servers are running, you can access the application through your web browser (usually at `http://localhost:3000`).
* The user interface should provide options to create and manage events, add and track inventory items, and link them together.
* Refer to the application's user guide or in-app instructions for detailed usage information.

---

## Contributing

* Fork the repository on GitHub.
* Create a new branch for your feature or bug fix (`git checkout -b feature/your-feature-name`).
* Make your changes and commit them (`git commit -m 'Add some feature'`).
* Push to the branch (`git push origin feature/your-feature-name`).
* Open a pull request on GitHub.

Please follow any existing code style and contribution guidelines outlined in the project.
