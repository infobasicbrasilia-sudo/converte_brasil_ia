export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb', // Permite vídeos de até 20MB
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const API_KEY = process.env.CONVERTIO_KEY;

    if (!API_KEY) {
        console.error("ERRO: CONVERTIO_KEY não configurada no Vercel.");
        return res.status(500).json({ error: "Chave de API ausente no servidor." });
    }

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
        
        // Se a Convertio retornar erro (ex: chave inválida ou limite excedido)
        if (data.status !== 'ok') {
            console.error("Erro Convertio:", data.error);
            return res.status(400).json(data);
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("Erro interno:", error.message);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
}