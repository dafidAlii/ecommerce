const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Route Register
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Cek apakah email sudah digunakan
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).send('Terjadi kesalahan pada server.');
        }
        if (results.length > 0) {
            return res.status(400).send('Email sudah digunakan!');
        }

        // Simpan user ke database
        db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password],
            (err) => {
                if (err) {
                    return res.status(500).send('Terjadi kesalahan saat menyimpan data.');
                }
                res.status(201).send('Registrasi berhasil!');
            }
        );
    });
});

// Route Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Cek user di database
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).send('Terjadi kesalahan pada server.');
        }
        if (results.length === 0) {
            return res.status(404).send('Email tidak ditemukan!');
        }

        const user = results[0];

        // Bandingkan password langsung (plaintext)
        if (password !== user.password) {
            return res.status(401).send('Password salah!');
        }

        // Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, 'secretkey', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login berhasil!', token });
    });
});

module.exports = router;
