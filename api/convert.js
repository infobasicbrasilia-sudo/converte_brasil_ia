export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb', // Permite arquivos de até 20MB
        },
    },
    // Força o Vercel a usar mais CPU para processar o Base64 rápido
    memory: 1024, 
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const API_KEY = process.env.CONVERTIO_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: "Chave de API (CONVERTIO_KEY) não encontrada no Vercel." });
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

        // Verificamos se a Convertio respondeu algo que não é JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const textError = await response.text();
            return res.status(500).json({ error: "Erro na Convertio: " + textError });
        }

        const data = await response.json();
        
        if (data.status !== 'ok') {
            return res.status(400).json(data);
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error("Erro no Handler:", error.message);
        return res.status(500).json({ error: 'Erro interno: ' + error.message });
    }
}