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
        const prompt = `
            Buatlah postingan blog dengan menggunakan Tag HTML yang telah dioptimalkan untuk SEO ${keyword}.
            Tulislah dengan gaya SEO. Gunakan kata transisi. Gunakan kalimat aktif. Tulis lebih dari 2000 kata.
            Gunakan judul yang sangat kreatif dan unik untuk postingan blog contoh judul: Petir Kemenangan! 5 Pola Strategis Buka Pintu Cuan Selangit di Game Online${Keyword}, Teknik Jurus Maut ${Keyword} Rahasia Maxwin Terbaru Dari Admin [Nama Acak], Wow! Intip 7 Langkah Sakti Bawa Cuan Besar di Game Online ${Keyword} Jackpot Tanpa Henti.
            Buat teks mudah dipahami dan dibaca. Pastikan minimal 8 bagian. Setiap bagian harus memiliki minimal dua paragraf. Cantumkan kata kunci yang telah dioptimalkan SEO ${keyword}. Tulis dalam Bahasa Indonesia.       	
            
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

            <h2>Subjudul</h2>
            <p>Paragraf</p>
            <p>Paragraf</p>
            
            <h2>Kesimpulan</h2>
            <p>Paragraf</p>
            <p>Paragraf</p>
        `;
        console.log(`[${new Date().toISOString()}] Mengirim prompt ke OpenAI...`);
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 3000,
            temperature: 0.9
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
