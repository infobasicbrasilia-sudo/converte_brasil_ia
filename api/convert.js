export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', 
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const API_KEY = process.env.CONVERTIO_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: "Chave de API não configurada no Vercel." });
    }

    const { file, filename } = req.body;

    if (!file) {
        return res.status(400).json({ error: "Arquivo não recebido corretamente." });
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
        
        if (data.status !== 'ok') {
            return res.status(400).json({ error: data.error || "Erro na Convertio." });
        }

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: 'Erro de conexão no servidor.' });
    }
}