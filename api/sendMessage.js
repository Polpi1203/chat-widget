// /api/sendMessage.js

export default async function handler(req, res) {
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
