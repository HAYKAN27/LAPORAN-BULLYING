const express = require('express')
const path = require('path')
const app = express()
const port = 3000
const mysql = require('mysql2')

// Middleware biar Express bisa baca data dari form (body parser)
app.use(express.urlencoded({ extended: true })) // untuk form HTML
app.use(express.json()) // untuk JSON (kalau pakai fetch API)

// Serve file HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// 🧠 Route POST untuk terima data form
app.post('/lapor', (req, res) => {
  const data = req.body
  console.log('Data laporan diterima:')
  console.log(data)

  // Di sini nanti bisa kamu tambahkan logika untuk simpan ke database
  // Contoh: simpan ke MongoDB / MySQL

  res.json({
    success: true,
    message: 'Laporan berhasil diterima!',
    data: data
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
