export default async function handler(req, res) {
    // ✅ AQUI também!
    const API_KEY = process.env.CONVERTIO_KEY;
    
    if (!API_KEY) {
        return res.status(500).json({ 
            error: 'Chave de API não configurada' 
        });
    }

    // ... resto do código
}