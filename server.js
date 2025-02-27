require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const app = express();
app.use(express.json());
app.use(cors({
    origin: ['https://hoseliau.vercel.app'],
    methods: ['POST']
}));
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error("ERROR: OPENAI_API_KEY tidak ditemukan di .env!");
    process.exit(1);
}
const openai = new OpenAI({ apiKey });
app.post('/generate', async (req, res) => {
    try {
        const { keyword } = req.body;
        if (!keyword || typeof keyword !== "string") {
            return res.status(400).json({ error: "Keyword harus berupa teks!" });
        }
        if (keyword.length > 100) {
            return res.status(400).json({ error: "Keyword terlalu panjang! Maksimal 100 karakter." });
        }
        console.log(`[${new Date().toISOString()}] Keyword diterima: ${keyword}`);
        const prompt = `Tulis artikel SEO sepanjang 2000 kata tentang ${Keyword} dengan nada SEO. buat judul [Clickbait] yang sangat menarik. Artikel harus informatif, menarik serta unik dalam bahasa Indonesia. (Penting! Buatlah Artikel Versi Terbaikmu Disini Agar Dapat di Baca oleh Banyak Orang di Luar Sana).
                        OUTPUT:
                        <h1>Judul</h1>
                        <p>Paragraf</p>
                        <h2>Judul</h2>
                        <p>Paragraf</p>
                        <h2>Judul</h2>
                        <p>Paragraf</p>
                        <h2>Judul</h2>
                        <p>Paragraf</p>
                        <h2>Judul</h2>
                        <p>Paragraf</p>
                        <h2>Judul</h2>
                        <p>Paragraf</p>
                        <h2>Judul</h2>
                        <p>Paragraf</p>
                        <h2>Judul</h2>
                        <p>Paragraf</p>
                        <h2>Judul</h2>
                        <p>Paragraf</p>
                        <h2>Judul</h2>
                        <p>Paragraf</p>
                        <h2>Judul</h2>
                        <p>Paragraf</p>
                        <h2>Judul</h2>
                        <p>Paragraf</p>
                        <h2>Judul</h2>
                        <p>Paragraf</p>
                        <h2>Judul</h2>
                        <p>Paragraf</p>
                        <h2>Judul</h2>
                        <p>Paragraf</p>
                        <h2>Judul</h2>
                        <p>Paragraf</p>
                        <h2>Judul</h2>
                        <p>Paragraf</p>`;
        console.log(`[${new Date().toISOString()}] Mengirim prompt ke OpenAI...`);
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 2048,
            temperature: 1.2
        });
        let htmlArticle = response.choices[0].message.content;
        htmlArticle = htmlArticle.replace(/```html|```/g, "").trim();
        console.log(`[${new Date().toISOString()}] Artikel berhasil dibuat, panjang karakter: ${htmlArticle.length}`);
        res.json({ text: htmlArticle });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error OpenAI API:`, error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Terjadi kesalahan dengan OpenAI API" });
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[${new Date().toISOString()}] Backend berjalan di port ${PORT}`));
