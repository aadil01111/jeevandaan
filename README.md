# LifeLink – Blood Donation Management System

## Setup Instructions

### 1. Requirements
- PHP 7.4+ with MySQLi extension
- MySQL 5.7+ or MariaDB 10+
- Apache/Nginx web server (Apache recommended with mod_rewrite)

### 2. Configure Database
Edit `php/config.php` and update:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');
define('DB_NAME', 'lifelink_db');
```

### 3. Create Database & Tables
Navigate to your project in browser and visit:
```
http://localhost/lifelink/php/setup_db.php
```
Then delete or restrict access to `setup_db.php` after running it once.

### 4. Default Credentials
| Role      | Email                   | Password     | Access Code    |
|-----------|-------------------------|--------------|----------------|
| Admin     | admin@lifelink.com      | Admin@1234   | —              |
| Red Cross | (code-based login)      | —            | REDCROSS2024   |
| User      | (self-register)         | (set own)    | —              |

### 5. Upload Folder Permissions
```bash
chmod 755 uploads/citizenship uploads/certificates
```

### 6. File Structure
```
lifelink/
├── index.html
├── login.html
├── signup.html
├── verification.html
├── forgot-password.html
├── user.html        ← requires user session
├── redcross.html    ← requires redcross session
├── admin.html       ← requires admin session
├── logout.html
├── css/style.css
├── js/script.js     ← shared JS (login, signup, verify)
├── js/user.js       ← user dashboard JS
├── user.css
├── redcross.css
├── admin.css
├── logout.css
├── images/
├── uploads/
│   ├── citizenship/
│   └── certificates/
├── php/
│   ├── config.php
│   ├── setup_db.php
│   ├── signup.php
│   ├── login.php
│   ├── logout.php
│   ├── verify_redcross.php
│   ├── upload_verification.php
│   ├── session_data.php
│   ├── submit_donation.php
│   ├── submit_request.php
│   ├── rare_contact.php
│   └── check_auth.php
└── .htaccess
```

### 7. Flow Summary
- User signs up → redirected to `verification.html`
- User uploads documents → redirected to `user.html`
- Admin logs in → redirected to `admin.html`
- Red Cross enters code → redirected to `redcross.html`
- Any role clicks logout → `logout.html` → session destroyed → `index.html`

### 8. Security Notes
- All passwords hashed with `password_hash()` / `PASSWORD_BCRYPT`
- Red Cross access code verified server-side only
- File uploads validated by MIME type (not extension)
- Session checks on every protected PHP endpoint
- `.htaccess` blocks direct config.php access
