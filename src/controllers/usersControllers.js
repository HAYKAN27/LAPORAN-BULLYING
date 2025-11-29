const db = require('../config/database');


const usersController = {

    createUsers: async (req, res) => {
        const { username, password, role, email, no_telp } = req.body;
        try {
            await db.pool.query(
                `INSERT INTO users (username, password, role, created_at, email, no_telp) VALUES (?, ?, ?, NOW(), ?, ?)`,
                [username, password, role, email, no_telp]
            );

            res.redirect('/admin/page-role');
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    deletedUsers: async (req, res) => {
        try {
            const { id } = req.params;
            await db.pool.query(
                `DELETE FROM users WHERE id = ?`,
                [id]
            );

            res.redirect('/admin/page-role');
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    updatePassword: async (req, res) => {
        const { password } = req.body;  // ambil password
        const { id } = req.params;      // ambil id dari URL
        console.log("ID diterima:", id);
        console.log("Password baru:", password);


        try {
            await db.pool.query(
                `UPDATE users SET password = ? WHERE id = ?`,
                [password, id]
            );

            res.redirect('/admin/page-role?success=" + encodeURIComponent("Laporan berhasil dikirim")');
        } catch (error) {
            console.error('Error updating password:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = usersController;
