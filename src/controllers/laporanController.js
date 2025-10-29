const laporanController = {
    createLaporan: (req, res) => {
        const data = req.body;
        console.log('Data laporan diterima dari:', req.session.username);
        console.log(data);

        // Di sini nanti bisa ditambahkan logika untuk simpan ke database
        res.json({
            success: true,
            message: 'Laporan berhasil diterima!',
            data: data
        });
    }
};

module.exports = laporanController;