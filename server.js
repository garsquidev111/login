const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware pour gérer les données JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Charger les données du jeu (unique pour tous les utilisateurs)
function loadGameData() {
    const filePath = path.join(__dirname, 'game_data.json');
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return {
        notecoins: 0,
        notecoins_per_second: 0,
        upgrades_owned: [0, 0, 0]
    };
}

// Sauvegarder les données du jeu (unique pour tous les utilisateurs)
function saveGameData(data) {
    const filePath = path.join(__dirname, 'game_data.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Route pour obtenir les données du jeu
app.get('/api/game', (req, res) => {
    const gameData = loadGameData();
    res.json(gameData);
});

// Route pour mettre à jour les données du jeu
app.post('/api/game', (req, res) => {
    const { notecoins, notecoins_per_second, upgrades_owned } = req.body;
    const gameData = { notecoins, notecoins_per_second, upgrades_owned };
    saveGameData(gameData);
    res.json({ message: 'Game data saved successfully' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
