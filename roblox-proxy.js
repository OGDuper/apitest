const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();

// Настройка CORS
app.use(cors({
    origin: 'https://rbxmarket.ru', // Укажите точный домен
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.get('/api/avatar', async (req, res) => {
    const { nickname } = req.query;

    if (!nickname) {
        return res.status(400).json({ error: 'Никнейм обязателен' });
    }

    try {
        const response = await fetch(`https://users.roblox.com/v1/users/search?keyword=${nickname}`);
        const data = await response.json();

        if (!data.data || !data.data.length) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const userId = data.data[0].id;
        const avatarResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=150x150&format=Png&isCircular=false`);
        const avatarData = await avatarResponse.json();

        if (!avatarData.data || !avatarData.data.length) {
            return res.status(404).json({ error: 'Аватарка не найдена' });
        }

        res.json({ avatarUrl: avatarData.data[0].imageUrl });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = app;
