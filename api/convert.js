export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    const API_KEY = process.env.CONVERTIO_KEY;
    const { file, filename } = req.body;

    if (!file || !API_KEY) {
        return res.status(400).json({ error: "Configuração ou arquivo ausente." });
    }

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
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Erro interno: " + error.message });
    }
}