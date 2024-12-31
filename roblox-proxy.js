const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.use(express.json());

// Прокси-роут для получения аватарки пользователя
app.post('/api/proxy-avatar', async (req, res) => {
    const { nickname } = req.body;

    if (!nickname) {
        return res.status(400).json({ error: 'Никнейм обязателен' });
    }

    try {
        // Получение информации о пользователе по никнейму
        const userResponse = await fetch(`https://users.roblox.com/v1/users/search?keyword=${nickname}`);
        const userData = await userResponse.json();

        if (!userData.data || !userData.data.length) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const userId = userData.data[0].id;

        // Получение аватарки по ID пользователя
        const avatarResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=150x150&format=Png&isCircular=false`);
        const avatarData = await avatarResponse.json();

        if (!avatarData.data || !avatarData.data.length) {
            return res.status(404).json({ error: 'Аватарка не найдена' });
        }

        res.json({ avatarUrl: avatarData.data[0].imageUrl });
    } catch (error) {
        console.error('Ошибка при запросе аватарки:', error);
        res.status(500).json({ error: 'Ошибка сервера при обработке запроса' });
    }
});

module.exports = app;
