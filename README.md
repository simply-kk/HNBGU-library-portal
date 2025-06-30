# HNBGU Library Portal

A comprehensive MERN stack application to manage library operations for Hemvati Nandan Bahuguna Garhwal University (HNBGU). This portal provides separate interfaces for Admins and Students to manage books, track issue/return history, and handle notifications.

## ✨ Features

- **Admin Dashboard**: Centralized hub for all administrative tasks.
- **Student Dashboard**: Personalized space for students to view their issued books and history.
- **Role-Based Access Control**: Secure access for Admins and Students.
- **Book Management**: Add, view, update, and delete books from the library catalog.
- **Student Management**: Create, view, and manage student accounts.
- **Bulk Import**: Easily add multiple books or students at once by uploading `.csv` files.
- **Issue & Return System**: Seamlessly manage the process of issuing and returning books.
- **Transaction History**: Keeps a detailed log of all book transactions.
- **Email Notifications**: Automatic email confirmations for book issues, returns, and due date reminders.
- **Scheduled Reminders**: Automated daily checks to send reminders for books due within 3 days.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Email Service**: Nodemailer with Gmail

## 📂 Project Structure

The project is organized into two main folders:

-   `Frontend/`: Contains the React application for the user interface.
-   `Backend/`: Contains the Express.js server, API routes, database models, and business logic.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or later)
-   [MongoDB](https://www.mongodb.com/try/download/community) (local installation or a cloud instance like MongoDB Atlas)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd Backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `Backend` directory and add the following environment variables:
    ```env
    PORT=6000
    MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>
    JWT_SECRET=<YOUR_JWT_SECRET>

    # Gmail credentials for sending emails
    # Note: You may need to create an "App Password" for your Google account
    EMAIL_USER=<YOUR_GMAIL_ADDRESS>
    EMAIL_PASS=<YOUR_GMAIL_APP_PASSWORD>
    ```

4.  **Start the backend server:**
    ```bash
    npm start
    ```
    The server will be running on `http://localhost:6000`.

### Frontend Setup

1.  **Open a new terminal and navigate to the frontend directory:**
    ```bash
    cd Frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

## 🧪 Testing Credentials

For testing purposes, you can use the following credentials to log in:

-   **Admin/Librarian Email**: `test@gmail.com`
-   **Password**: `test123`

You will need to create this user in your database first. You can use the "Add Librarian" feature or create it directly in your MongoDB instance with the role `admin`. The password will be automatically hashed when the user is created through the application.

## 📥 Sample Data

The root directory contains sample CSV files (`sample_books.csv` and `sample_users.csv`) that you can use with the bulk import feature in the admin panel.

## 📝 API Endpoints

The backend exposes the following REST API endpoints:

-   `/api/auth`: Authentication routes (login)
-   `/api/admin`: Admin-specific actions
-   `/api/student`: Student-specific actions
-   `/api/books`: Book management (CRUD)
-   `/api/issues`: Book issuing
-   `/api/returns`: Book returning
-   `/api/history`: Transaction history

---

Feel free to contribute to this project by submitting issues or pull requests.
