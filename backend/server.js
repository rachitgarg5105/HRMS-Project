const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./hr_management.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Employees table
  db.run(`CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    department TEXT,
    position TEXT,
    salary REAL,
    hire_date DATE,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Attendance table
  db.run(`CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status TEXT DEFAULT 'present',
    notes TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id)
  )`);

  // Leave requests table
  db.run(`CREATE TABLE IF NOT EXISTS leave_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    leave_type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending',
    approved_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id)
  )`);

  // Users table for authentication
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'employee',
    employee_id TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id)
  )`);
}

// Middleware for JWT authentication
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Routes

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  });
});

// Employee Management
app.get('/api/employees', (req, res) => {
  db.all('SELECT * FROM employees ORDER BY last_name, first_name', (err, employees) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(employees);
  });
});

app.post('/api/employees', (req, res) => {
  const { employee_id, first_name, last_name, email, phone, department, position, salary, hire_date } = req.body;

  db.run(
    `INSERT INTO employees (employee_id, first_name, last_name, email, phone, department, position, salary, hire_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [employee_id, first_name, last_name, email, phone, department, position, salary, hire_date],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create employee' });
      }
      res.json({ id: this.lastID, message: 'Employee created successfully' });
    }
  );
});

app.put('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone, department, position, salary, status } = req.body;

  db.run(
    `UPDATE employees SET first_name = ?, last_name = ?, email = ?, phone = ?, 
     department = ?, position = ?, salary = ?, status = ? WHERE id = ?`,
    [first_name, last_name, email, phone, department, position, salary, status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update employee' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json({ message: 'Employee updated successfully' });
    }
  );
});

app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM employees WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete employee' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  });
});

// Attendance Management
app.get('/api/attendance', (req, res) => {
  const { date, employee_id } = req.query;
  let query = 'SELECT a.*, e.first_name, e.last_name FROM attendance a JOIN employees e ON a.employee_id = e.employee_id';
  let params = [];

  if (date) {
    query += ' WHERE a.date = ?';
    params.push(date);
  }
  if (employee_id) {
    query += date ? ' AND a.employee_id = ?' : ' WHERE a.employee_id = ?';
    params.push(employee_id);
  }

  query += ' ORDER BY a.date DESC, a.check_in';

  db.all(query, params, (err, attendance) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(attendance);
  });
});

app.post('/api/attendance/check-in', (req, res) => {
  const { employee_id, date, check_in } = req.body;

  db.run(
    'INSERT OR REPLACE INTO attendance (employee_id, date, check_in, status) VALUES (?, ?, ?, ?)',
    [employee_id, date, check_in, 'present'],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to check in' });
      }
      res.json({ message: 'Check-in successful' });
    }
  );
});

app.post('/api/attendance/check-out', (req, res) => {
  const { employee_id, date, check_out } = req.body;

  db.run(
    'UPDATE attendance SET check_out = ? WHERE employee_id = ? AND date = ?',
    [check_out, employee_id, date],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to check out' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'No check-in record found' });
      }
      res.json({ message: 'Check-out successful' });
    }
  );
});

// Leave Management
app.get('/api/leave-requests', (req, res) => {
  const { employee_id, status } = req.query;
  let query = 'SELECT lr.*, e.first_name, e.last_name FROM leave_requests lr JOIN employees e ON lr.employee_id = e.employee_id';
  let params = [];

  if (employee_id) {
    query += ' WHERE lr.employee_id = ?';
    params.push(employee_id);
  }
  if (status) {
    query += employee_id ? ' AND lr.status = ?' : ' WHERE lr.status = ?';
    params.push(status);
  }

  query += ' ORDER BY lr.created_at DESC';

  db.all(query, params, (err, leaveRequests) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(leaveRequests);
  });
});

app.post('/api/leave-requests', (req, res) => {
  const { employee_id, leave_type, start_date, end_date, reason } = req.body;

  db.run(
    'INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?)',
    [employee_id, leave_type, start_date, end_date, reason],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create leave request' });
      }
      res.json({ id: this.lastID, message: 'Leave request submitted successfully' });
    }
  );
});

app.put('/api/leave-requests/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, approved_by } = req.body;

  db.run(
    'UPDATE leave_requests SET status = ?, approved_by = ? WHERE id = ?',
    [status, approved_by, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update leave request' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Leave request not found' });
      }
      res.json({ message: 'Leave request updated successfully' });
    }
  );
});

// Dashboard Statistics
app.get('/api/dashboard/stats', (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total_employees FROM employees WHERE status = "active"',
    'SELECT COUNT(*) as present_today FROM attendance WHERE date = DATE("now") AND status = "present"',
    'SELECT COUNT(*) as pending_leaves FROM leave_requests WHERE status = "pending"',
    'SELECT COUNT(*) as total_departments FROM (SELECT DISTINCT department FROM employees WHERE department IS NOT NULL)'
  ];

  Promise.all(queries.map(query => 
    new Promise((resolve, reject) => {
      db.get(query, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    })
  )).then(([totalEmployees, presentToday, pendingLeaves, totalDepartments]) => {
    res.json({
      totalEmployees: totalEmployees.total_employees,
      presentToday: presentToday.present_today,
      pendingLeaves: pendingLeaves.pending_leaves,
      totalDepartments: totalDepartments.total_departments
    });
  }).catch(err => {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
