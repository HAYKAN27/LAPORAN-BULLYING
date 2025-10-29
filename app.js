const express = require('express')
const path = require('path')
const session = require('express-session')
const bcrypt = require('bcryptjs')
const app = express()
const port = process.env.PORT || 3000
const mysql = require('mysql2')

// Routes & controllers (modular)
const authRoutes = require('./src/routes/auth')
const laporanRoutes = require('./src/routes/laporan')
const authController = require('./src/controllers/authController')
const laporanController = require('./src/controllers/laporanController')
const checkAuth = require('./src/middleware/auth')

// Static files (public)
app.use(express.static(path.join(__dirname, 'public')))

// Middleware untuk parsing body
app.use(express.urlencoded({ extended: true })) // form
app.use(express.json()) // json

// Session (development-friendly). Gunakan env var untuk secret di produksi.
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'admin27',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  })
)

// Serve index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// Mount modular routes
app.use('/auth', authRoutes) // /auth/login, /auth/logout
app.use('/api', laporanRoutes) // /api/lapor (protected in route file)

// Backwards-compatible aliases (optional)
// These call the same controller logic as the modular routes so existing code works.
app.post('/login', authController.login)
app.get('/logout', authController.logout)
app.post('/lapor', checkAuth, laporanController.createLaporan)

// Simple health route
app.get('/health', (req, res) => res.json({ ok: true }))

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
