import fetch from 'node-fetch';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Autoriser toutes les origines (à restreindre pour production)
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Autoriser seulement POST et OPTIONS
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key'); // Autoriser les headers Content-Type et x-api-key

    if (req.method === 'OPTIONS') {
        // Réponse pour les requêtes préalables (préflight)
        res.status(200).end();
        return;
    }

    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY;  // Définie dans les variables d'environnement Vercel

    if (apiKey !== validApiKey) {
        console.log('Invalid API key:', apiKey);
        return res.status(403).json({ error: "Unauthorized" });
    }

    if (req.method === 'POST') {
        const { message } = req.body;
        const webhookUrl = process.env.N8N_WEBHOOK_URL;

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la communication avec le webhook N8N');
            }

            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la communication avec l’agent IA' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
}
