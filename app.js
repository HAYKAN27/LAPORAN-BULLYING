const express = require('express')
const path = require('path')
const session = require('express-session')
const bcrypt = require('bcryptjs')
const { pool, checkConnection, initializeDatabase } = require('./src/config/database')

const app = express()
const port = process.env.PORT || 3000

// Routes & controllers
const authRoutes = require('./src/routes/auth')
const laporanRoutes = require('./src/routes/laporan')
const authController = require('./src/controllers/authController')
const laporanController = require('./src/controllers/laporanController')
const checkAuth = require('./src/middleware/auth')

// View Engine EJS
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Static assets (css/js/img)
app.use(express.static(path.join(__dirname, 'public')))

// Body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'admin27',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  })
)
// Home → login page
app.get('/', (req, res) => {
  res.render('login', { user: req.session.username })
})
// Login form post
app.post('/login', (req, res) => {
  authController.login(req, res)
})
// Logout
app.get('/logout', authController.logout)

// Menampilkan form laporan
app.get('/index', checkAuth, (req, res) => {
  res.render('index', { user: req.session.username })
})

// Handle form laporan POST
app.post('/lapor', checkAuth, laporanController.createLaporan)

// API Routes (JSON)
app.use('/auth', authRoutes)
app.use('/api', laporanRoutes)

// Health
app.get('/health', (req, res) => res.json({ ok: true }))

// Start Server
async function startServer() {
  try {
    await checkConnection()
    await initializeDatabase()

    app.listen(port, () => {
      console.log(`
🚀 Server running at http://localhost:${port}

📝 Endpoints:
- GET  /               Login Page
- POST /login          Login
- GET  /lapor          Form laporan
- POST /lapor          Submit laporan
- GET  /logout         Logout

📡 API:
- POST /api/lapor
- GET  /api/laporan
- GET  /api/laporan/saya

Default Admin:
  username: admin
  password: admin123

✅ Server & Database siap!
`)
    })
  } catch (error) {
    console.error('❌ Gagal menjalankan server:', error)
    process.exit(1)
  }
}

startServer()
