const { pool } = require('../config/database');

const laporanController = {

    createLaporan: async (req, res) => {
        try {
            const {
                statusPelapor,
                namaKorban,
                pendidikanPelapor,
                namaPelaku,
                pendidikanPelaku,
                frekuensiKejadian,
                tempatKejadian,
                namaTempat,
                buktiFilePath,
                tanggalWaktu,
                nomorTelepon
            } = req.body;

            // Validasi field wajib
            const requiredFields = {
                'Status Pelapor': statusPelapor,
                'Nama Korban': namaKorban,
                'Pendidikan pelapor': pendidikanPelapor,
                'Nama Pelaku': namaPelaku,
                'Pendidikan Pelaku': pendidikanPelaku,
                'Tempat Kejadian': tempatKejadian,
                'Nama Tempat': namaTempat,
                'Bukti': buktiFilePath,
                'Tanggal dan Waktu': tanggalWaktu,
                'Nomor Telepon': nomorTelepon
            };

            const emptyFields = Object.entries(requiredFields)
                .filter(([_, value]) => !value)
                .map(([key]) => key);

            if (emptyFields.length > 0) {
                return res.redirect(
                    `/report/index?error=Field berikut harus diisi: ${emptyFields.join(', ')}`
                );
            }

            // Validasi nomor telepon
            if (!/^08[0-9]{8,11}$/.test(nomorTelepon)) {
                return res.redirect(`/users/dashboard?error=Format nomor telepon tidak valid (contoh: 081234567890)`);
            }

            // INSERT + status default = pending
            await pool.query(
                `INSERT INTO laporan (
                    status, status_pelapor, nama_korban, pendidikan_pelapor, nama_pelaku,pendidikan_pelaku,
                    frekuensi_kejadian, tempat_kejadian, nama_tempat, bukti_file_path,
                    tanggal_waktu, nomor_telepon, pelapor_id, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, NOW())`,
                [
                    'pending',
                    statusPelapor,
                    namaKorban,
                    pendidikanPelapor,
                    namaPelaku,
                    pendidikanPelaku,
                    frekuensiKejadian || null,
                    tempatKejadian,
                    namaTempat,
                    buktiFilePath,
                    tanggalWaktu,
                    nomorTelepon,
                    req.session.user_id   // ⬅ wajib ada
                ]
            );
            return res.redirect("/users/dashboard?success=" + encodeURIComponent("Laporan berhasil dikirim"));

        } catch (error) {
            console.error('❌ Error saat membuat laporan:', error);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat menyimpan laporan'
            });
        }
    },


    deleteLaporan: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.redirect("/report/list?error=" + encodeURIComponent("ID laporan tidak ditemukan"));
            }

            const [result] = await pool.query(
                "DELETE FROM laporan WHERE id = ?",
                [id]
            );

            if (result.affectedRows === 0) {
                return res.redirect("/admin/page-ml?error=" + encodeURIComponent("Data laporan tidak ditemukan"));
            }

            return res.redirect("/admin/page-ml?success=" + encodeURIComponent("Berhasil menghapus laporan"));

        } catch (error) {
            console.error("❌ Error saat menghapus laporan:", error);
            return res.redirect("/admin/page-ml?error=" + encodeURIComponent("Terjadi kesalahan saat menghapus"));
        }
    },

    accLaporan: async (req, res) => {
        const laporanId = req.params.id;

        try {
            await pool.query(
                "UPDATE laporan SET status = 'diterima' WHERE id = ?",
                [laporanId]
            );

            return res.redirect("/admin/page-ml");

        } catch (error) {
            console.error("❌ Error ACC laporan:", error);
            return res.status(500).json({ error: "Terjadi kesalahan server" });
        }
    },


        tolakLaporan: async (req, res) => {
            const laporanId = req.params.id;
            const adminId = req.session.user_id;
            const { catatan } = req.body;

            const conn = await pool.getConnection();

            try {
                await conn.beginTransaction();

                // 1️⃣ Ambil status lama
                const [rows] = await conn.query(
                    "SELECT status FROM laporan WHERE id = ?",
                    [laporanId]
                );

                if (rows.length === 0) {
                    throw new Error("Laporan tidak ditemukan");
                }

                const statusLama = rows[0].status; // pending / diterima / ditolak

                // 2️⃣ Update status laporan
                await conn.query(
                    "UPDATE laporan SET status = 'ditolak' WHERE id = ?",
                    [laporanId]
                );

                // 3️⃣ Insert ke riwayat_laporan
                await conn.query(
                    `INSERT INTO riwayat_laporan
                (laporan_id, users_id, status_lama, status_baru, catatan)
                VALUES (?, ?, ?, ?, ?)`,
                    [
                        laporanId,
                        adminId,
                        statusLama,
                        'ditolak',
                        catatan   // ✅ dari textarea admin

                    ]
                );

                await conn.commit();
                conn.release();

                res.redirect("/admin/page-ml");

            } catch (error) {
                await conn.rollback();
                conn.release();
                console.error("❌ Error tolak laporan:", error);
                res.status(500).send("Terjadi kesalahan server");
            }
        }

};

module.exports = laporanController;
