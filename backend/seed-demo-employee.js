/**
 * Optional: creates demo employee EMP001 and user "employee" / "employee123" (role: employee).
 * Run from backend folder: node seed-demo-employee.js
 */
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./hr_management.db');

const EMP_ID = 'EMP001';

async function seed() {
  await new Promise((resolve, reject) => {
    db.run(
      `INSERT OR IGNORE INTO employees (employee_id, first_name, last_name, email, department, position, salary, hire_date, status)
       VALUES (?, 'Jane', 'Doe', 'jane.doe@demo.local', 'Engineering', 'Developer', 75000, date('now'), 'active')`,
      [EMP_ID],
      (err) => (err ? reject(err) : resolve())
    );
  });

  const hash = await bcrypt.hash('employee123', 10);

  await new Promise((resolve, reject) => {
    db.run('DELETE FROM users WHERE username = ?', ['employee'], (delErr) => {
      if (delErr) return reject(delErr);
      db.run(
        'INSERT INTO users (username, password, role, employee_id) VALUES (?, ?, ?, ?)',
        ['employee', hash, 'employee', EMP_ID],
        (err) => (err ? reject(err) : resolve())
      );
    });
  });

  console.log('Demo employee user created: username "employee", password "employee123" (linked to EMP001).');
  db.close();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
