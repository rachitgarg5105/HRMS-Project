# HR Management System

A lightweight, full-stack Human Resource Management System built with modern web technologies.

## Features

- **Employee Management**: Add, edit, delete, and search employees
- **Attendance Tracking**: Check-in/check-out system with daily attendance records
- **Leave Management**: Submit, approve, and reject leave requests
- **Dashboard**: Real-time statistics and quick actions
- **Authentication**: Secure login system with JWT tokens
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Tech Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database for lightweight data storage
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls

## Project Structure

```
hr-management-system/
├── backend/
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   └── .env.example          # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/        # React contexts
│   │   ├── App.tsx          # Main App component
│   │   └── index.tsx        # Entry point
│   ├── public/
│   └── package.json          # Frontend dependencies
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hr-management-system
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The server will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## Default Login Credentials

For demonstration purposes, you can use:
- **Username**: admin
- **Password**: admin123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/check-in` - Check in employee
- `POST /api/attendance/check-out` - Check out employee

### Leave Requests
- `GET /api/leave-requests` - Get leave requests
- `POST /api/leave-requests` - Submit leave request
- `PUT /api/leave-requests/:id/status` - Update leave request status

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Schema

The application uses SQLite with the following tables:

- **employees**: Employee information
- **attendance**: Attendance records
- **leave_requests**: Leave request data
- **users**: Authentication users

## Usage Guide

### 1. Employee Management
- Navigate to the Employees section
- Add new employees with their details
- Edit existing employee information
- Delete employees when necessary
- Search employees by name, ID, or email

### 2. Attendance Tracking
- Go to the Attendance section
- Check in employees by entering their ID
- Check out employees at the end of the day
- View daily attendance records
- Filter by date using the date picker

### 3. Leave Management
- Access the Leave Requests section
- Submit new leave requests for employees
- Approve or reject pending requests
- Filter requests by status (pending, approved, rejected)
- View leave statistics

### 4. Dashboard
- View real-time statistics
- Quick access to common actions
- Monitor system activity

## Development

### Adding New Features

1. **Backend**: Add new routes in `server.js`
2. **Frontend**: Create new components in `src/components/`
3. **Styling**: Use Tailwind CSS classes
4. **State Management**: Use React Context or local state

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use semantic HTML elements
- Implement proper error handling
- Add loading states for async operations

## Deployment

### Backend Deployment
1. Set production environment variables
2. Install dependencies: `npm install --production`
3. Start server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `build` folder to your hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.

---

**Note**: This is a demonstration project. For production use, consider additional security measures, database optimization, and scalability improvements.
