const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./hr_management.db');

async function createAdminUser() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  db.run('INSERT OR REPLACE INTO users (username, password, role) VALUES (?, ?, ?)', 
    ['admin', hashedPassword, 'admin'], 
    function(err) {
      if (err) {
        console.error('Error creating admin user:', err);
      } else {
        console.log('Admin user created successfully');
      }
      db.close();
    }
  );
}

createAdminUser();
