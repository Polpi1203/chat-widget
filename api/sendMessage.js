import fetch from 'node-fetch';

console.log("SENDMESSAGE -> OK");

export default async function handler(req, res) {

    console.log("Request received:", res, req);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Autoriser toutes les origines (à restreindre pour production)
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Autoriser seulement POST et OPTIONS
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Autoriser seulement Content-Type et x-api-key

    if (req.method === 'OPTIONS') {
        // Réponse pour les requêtes préalables (préflight)
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        const { message, conversationId } = req.body;
        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        const apiKey = process.env.API_KEY;

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
                body: JSON.stringify({ message, conversationId }),
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
