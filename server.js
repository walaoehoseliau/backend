
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

        // Validasi keyword
        if (!keyword || typeof keyword !== "string") {
            return res.status(400).json({ error: "Keyword harus berupa teks!" })
        }
        if (keyword.length > 100) {
            return res.status(400).json({ error: "Keyword terlalu panjang! Maksimal 100 karakter." });
        }

        console.log(`[${new Date().toISOString()}] Keyword diterima: ${keyword}`);

        // Prompt yang lebih fleksibel dan dinamis
        const prompt = `Buat artikel SEO yang menarik sepanjang 2000 kata tentang ${keyword}. 
        Artikel harus informatif, unik, dan mudah dipahami. Gunakan bahasa yang menarik untuk pembaca Indonesia.
        Struktur artikel harus seperti berikut:
        Gunakan <h1> untuk judul utama.
        Gunakan <h2> untuk subjudul yang relevan.
        Gunakan <p> untuk isi paragraf.
        Pastikan ada minimal 7-10 subjudul.
        Berikan informasi yang mendalam dan menarik.
        Ubah kata Slot Menjadi Game.

        Contoh format output:
        
        <h1>Judul Clickbait tentang Hal yang sedang Trending</h1>
        <p>Paragraf pembuka yang menarik perhatian pembaca</p>
        <h2>Subjudul 1</h2>
        <p>Isi paragraf yang relevan</p>
        <h2>Subjudul 2</h2>
        <p>Isi paragraf yang relevan</p>
        ;

        console.log(`[${new Date().toISOString()}] Mengirim prompt ke OpenAI...`);

        const response = await openai.chat.completions.create({
            model: "o3-mini",
            messages: [{ role: "user", content: prompt }],
        });

        let htmlArticle = response.choices?.[0]?.message?.content || "Gagal menghasilkan artikel.";
        htmlArticle = htmlArticle.replace(/```html|```/g, "").trim();

        console.log(`[${new Date().toISOString()}] Artikel berhasil dibuat, panjang karakter: ${htmlArticle.length}`);

        res.json({ text: htmlArticle });

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error OpenAI API:`, error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Terjadi kesalahan dengan OpenAI API, coba lagi nanti." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[${new Date().toISOString()}] Backend berjalan di port ${PORT}`));
