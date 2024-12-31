const fetch = require('node-fetch');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    const { usernames } = req.body;

    if (!usernames || !Array.isArray(usernames)) {
        return res.status(400).json({ error: 'Invalid request. Provide an array of usernames.' });
    }

    try {
        const robloxResponse = await fetch('https://users.roblox.com/v1/usernames/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usernames }),
        });

        if (!robloxResponse.ok) {
            return res.status(robloxResponse.status).json({
                error: 'Error fetching data from Roblox API',
                details: await robloxResponse.text(),
            });
        }

        const data = await robloxResponse.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
