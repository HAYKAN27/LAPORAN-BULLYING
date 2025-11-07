const { pool } = require('../config/database');

const laporanController = {
    createLaporan: async (req, res) => {
        try {
            const {
                statusPelapor,
                namaKorban,
                pendidikan,
                namaPelaku,
                frekuensiKejadian,
                tempatKejadian,
                namaTempat,
                tanggalWaktu,
                nomorTelepon
            } = req.body;

            const requiredFields = {
                'Status Pelapor': statusPelapor,
                'Nama Korban': namaKorban,
                'Pendidikan': pendidikan,
                'Nama Pelaku': namaPelaku,
                'Tempat Kejadian': tempatKejadian,
                'Nama Tempat': namaTempat,
                'Tanggal dan Waktu': tanggalWaktu,
                'Nomor Telepon': nomorTelepon
            };

            const emptyFields = Object.entries(requiredFields)
                .filter(([_, value]) => !value)
                .map(([key]) => key);

            if (emptyFields.length > 0) {
                // jika form HTML biasa (bukan AJAX)
                return res.redirect(`/index?error=Field berikut harus diisi: ${emptyFields.join(', ')}`);

            }   

            if (!/^08[0-9]{8,11}$/.test(nomorTelepon)) {
                return res.redirect(`/index?error=Format nomor telepon tidak valid (contoh: 081234567890)`);
            }

            const [result] = await pool.query(
                `INSERT INTO laporan (
                    status_pelapor, nama_korban, pendidikan, nama_pelaku, frekuensi_kejadian,
                    tempat_kejadian, nama_tempat, tanggal_waktu, nomor_telepon, pelapor_id, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                [
                    statusPelapor, namaKorban, pendidikan, namaPelaku,
                    frekuensiKejadian || null, tempatKejadian, namaTempat,
                    tanggalWaktu, nomorTelepon, req.session.userId
                ]
            );

                return res.redirect("/index?success=Laporan berhasil dikirim!");


        } catch (error) {
            console.error('❌ Error saat membuat laporan:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat menyimpan laporan'
            });
        }
    },
};
module.exports = laporanController;
