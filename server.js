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
            return res.status(400).json({ error: "Keyword harus berupa teks!" });
        }
        if (keyword.length > 100) {
            return res.status(400).json({ error: "Keyword terlalu panjang! Maksimal 100 karakter." });
        }

        console.log(`[${new Date().toISOString()}] Keyword diterima: ${keyword}`);
        
        const prompt = `Please ignore all previous instructions. I want you to respond only in language Indonesian. I want you to act as a blog post title writer that speaks and writes fluent Indonesian. I will type a title or keywords via comma and you will reply with blog post titles in Indonesian. They should all have a hook and high potential to go viral on social media. Write all in Indonesian. my first keywords are ${keyword}`;

        console.log(`[${new Date().toISOString()}] Mengirim prompt ke OpenAI...`);

        const response = await openai.chat.completions.create({
            model: "o3-mini",
            messages: [{ role: "user", content: prompt }],
        });

        let htmlArticle = response.choices?.[0]?.message?.content;
        
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
