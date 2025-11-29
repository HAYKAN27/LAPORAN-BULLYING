# 📢 Website Laporan Bullying

Website **Laporan Bullying** adalah sistem informasi berbasis web yang digunakan untuk **melaporkan, mengelola, dan memonitor kasus perundungan (bullying) di lingkungan sekolah** secara aman, terstruktur, dan transparan.

Sistem ini memiliki dua peran utama, yaitu **Admin** dan **User/Pelapor**.

---

## 🧩 Tahapan Pengembangan Sistem

### 1️⃣ Analisis Kebutuhan
- Identifikasi permasalahan bullying di sekolah
- Menentukan kebutuhan fungsional sistem
- Menentukan aktor (Admin & User)
- Menentukan data yang dibutuhkan dalam laporan bullying

---

### 2️⃣ Perancangan Sistem
- Perancangan alur sistem (flow laporan)
- Perancangan struktur database MySQL
- Perancangan hak akses (Admin & User)
- Perancangan tampilan menggunakan template **Mazer**

---

### 3️⃣ Implementasi Sistem
- Pembuatan backend dengan **Node.js & Express**
- Implementasi template view menggunakan **EJS**
- Implementasi session & authentication
- CRUD laporan bullying
- Pengelolaan akun admin & user

---

### 4️⃣ Pengujian Sistem
- Pengujian login & logout
- Pengujian pembuatan laporan
- Pengujian penerimaan & penolakan laporan
- Pengujian hak akses user dan admin
- Pengujian koneksi database

---

### 5️⃣ Pemeliharaan Sistem
- Perbaikan bug
- Optimasi performa
- Pengembangan fitur lanjutan

---

## 🚀 Fitur Utama

### 👨‍💼 Admin
- Login & Dashboard Admin
- Melihat laporan masuk
- Menerima atau menolak laporan bullying
- Menambahkan catatan pada laporan yang ditolak
- Mengelola akun admin dan user
- Reset / ganti password user dan admin
- Melihat riwayat status laporan
- Logout Admin

---

### 👤 User / Pelapor
- Registrasi akun
- Login User
- Membuat laporan bullying
- Upload bukti laporan
- Melihat status laporan
- Melihat catatan penolakan laporan
- Mengelola laporan
- Logout User

---

## 🔁 Alur Sistem Laporan Bullying
1. User melakukan login
2. User mengisi form laporan bullying
3. Laporan masuk ke dashboard admin
4. Admin memverifikasi laporan
5. Admin menerima atau menolak laporan
6. Status laporan ditampilkan ke user
7. Riwayat laporan disimpan dalam database

---

## 🛠️ Teknologi yang Digunakan
- **Node.js**
- **Express.js**
- **EJS (Template Engine)**
- **MySQL**
- **Bootstrap**
- **Mazer Admin Template**
- **Express Session**
- **Multer (Upload File)**

---

## ⚙️ Cara Menjalankan Project

### 1️⃣ Clone Repository
```bash
git clone https://github.com/username/laporan-bullying.git
