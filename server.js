require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
// Inisialisasi Express
const app = express();
app.use(express.json());
// Konfigurasi CORS agar lebih aman
app.use(cors({
    origin: ['https://hoseliau.vercel.app'], // Ganti dengan domain frontend Anda
    methods: ['POST']
}));
// Ambil API Key dari .env
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error("❌ ERROR: OPENAI_API_KEY tidak ditemukan di .env!");
    process.exit(1);
}
// Inisialisasi OpenAI
const openai = new OpenAI({ apiKey });
// Endpoint untuk Generate Artikel
app.post('/generate', async (req, res) => {
    try {
        const { keyword } = req.body;
        // Validasi input keyword
        if (!keyword || typeof keyword !== "string") {
            return res.status(400).json({ error: "❌ Keyword harus berupa teks!" });
        }
        if (keyword.length > 100) {
            return res.status(400).json({ error: "❌ Keyword terlalu panjang! Maksimal 100 karakter." });
        }
        console.log(`[${new Date().toISOString()}] ✅ Keyword diterima: ${keyword}`);
        // Prompt yang lebih optimal untuk OpenAI
        const prompt = `
        Buatlah postingan blog dengan menggunakan Tag HTML yang telah dioptimalkan untuk SEO '${keyword}'.
        Tulislah dengan gaya SEO. Gunakan kata transisi. Gunakan kalimat aktif. Tulis lebih dari 2000 kata.
        Gunakan judul yang sangat kreatif dan unik untuk postingan blog. Tambahkan judul untuk setiap bagian.
        Buat teks mudah dipahami dan dibaca. Pastikan ada minimal 8 bagian.
        Setiap bagian harus memiliki minimal dua paragraf.
        Cantumkan kata kunci yang telah dioptimalkan SEO.
        Tulis dalam Bahasa Indonesia.
        Output:        	
        <h1>Judul Utama</h1>
        <p>Paragraf</p>
        <h2>Subjudul</h2>
        <p>Paragraf</p>
        <p>Paragraf</p>
        <h2>Subjudul</h2>
        <ul>
        <li>Paragraf</li>
        <li>Paragraf</li>
        <li>Paragraf</li>
        <li>Paragraf</li>
        </ul>
        <h2>Subjudul</h2>
        <p>Paragraf</p>
        <p>Paragraf</p>
        <h2>Subjudul</h2>
        <ul>
        <li>Paragraf</li>
        <li>Paragraf</li>
        <li>Paragraf</li>
        <li>Paragraf</li>
        </ul>
        <h2>Subjudul</h2>
        <p>Paragraf</p>
        <p>Paragraf</p>
        <h2>Kesimpulan</h2>
        <p>Paragraf</p>
        <p>Paragraf</p>
        `;
        console.log(`[${new Date().toISOString()}] ✅ Mengirim prompt ke OpenAI...`);
        // Panggil OpenAI API
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 5000,
            temperature: 1.2
        });
        let htmlArticle = response.choices[0].message.content;
        // Hapus simbol pemformatan yang tidak diinginkan
        htmlArticle = htmlArticle.replace(/```html|```/g, "").trim();
        console.log(`[${new Date().toISOString()}] ✅ Artikel berhasil dibuat, panjang karakter: ${htmlArticle.length}`);
        res.json({ text: htmlArticle });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ Error OpenAI API:`, error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Terjadi kesalahan dengan OpenAI API" });
    }
});
// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[${new Date().toISOString()}] ✅ Backend berjalan di port ${PORT}`));
