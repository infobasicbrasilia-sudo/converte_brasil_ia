const express = require('express');
const app = express();
const port = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Endpoint de conversão
app.post('/api/convert', async (req, res) => {
    const API_KEY = process.env.CONVERTIO_KEY || 'sua_chave_aqui';
    const { file, filename } = req.body;
    
    try {
        const response = await fetch('https://api.convertio.co/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                apikey: API_KEY,
                input: 'base64',
                file: file,
                filename: filename,
                outputformat: 'mp3'
            })
        });
        const data = await response.json();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});