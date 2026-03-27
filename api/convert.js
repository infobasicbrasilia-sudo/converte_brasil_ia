export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    // A chave está SEGURA aqui nas variáveis de ambiente do Vercel
    const API_KEY = process.env.CONVERTIO_KEY; 

    try {
        const response = await fetch('https://api.convertio.co/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                apikey: API_KEY,
                input: 'base64',
                file: req.body.file,
                filename: req.body.filename,
                outputformat: 'mp3'
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
}