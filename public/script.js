let notecoins = 0;
let notecoinsPerSecond = 0;
let upgradesOwned = [0, 0, 0];
let upgradePrices = [10, 50, 200];
const upgradeTiers = [0.2, 0.5, 1.0];

// Charger les données du jeu depuis le serveur
async function loadGameData() {
    const response = await fetch('/api/game', { credentials: 'include' });
    const data = await response.json();
    notecoins = data.notecoins;
    notecoinsPerSecond = data.notecoins_per_second;
    upgradesOwned = data.upgrades_owned;
    updateUI();
}

// Sauvegarder les données du jeu vers le serveur
async function saveGameData() {
    const gameData = {
        notecoins,
        notecoins_per_second: notecoinsPerSecond,
        upgrades_owned: upgradesOwned,
    };
    await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(gameData),
    });
}

// Mettre à jour l'interface utilisateur
function updateUI() {
    const roundedNotecoins = Math.floor(notecoins);
    document.getElementById('notecoin-count').textContent = `Notecoins: ${roundedNotecoins}`;
    document.getElementById('notecoin-gen').textContent = `Notecoins generated per second: ${notecoinsPerSecond.toFixed(1)}`;

    // Mise à jour des boutons d'amélioration avec le nombre acheté
    const upgradeList = document.getElementById('upgrade-list');
    upgradeList.innerHTML = ''; // Réinitialiser la liste des améliorations
    for (let i = 0; i < 3; i++) {
        const upgradeDiv = document.createElement('div');
        upgradeDiv.classList.add('upgrade-item');
        
        const upgradeButton = document.createElement('button');
        upgradeButton.textContent = `Buy Tier ${i + 1} - ${upgradePrices[i]} Notecoins`;
        upgradeButton.onclick = () => buyUpgrade(i);
        upgradeDiv.appendChild(upgradeButton);

        // Afficher le nombre d'achats à côté du bouton
        const upgradeCount = document.createElement('span');
        upgradeCount.textContent = ` (Bought: ${upgradesOwned[i]})`;
        upgradeDiv.appendChild(upgradeCount);

        upgradeList.appendChild(upgradeDiv);
    }
}

// Gérer le clic pour gagner des notecoins
document.getElementById('click-button').onclick = () => {
    notecoins++;
    updateUI();
    saveGameData();
};

// Acheter une amélioration
function buyUpgrade(tier) {
    if (notecoins >= upgradePrices[tier]) {
        notecoins -= upgradePrices[tier];
        upgradesOwned[tier]++;
        notecoinsPerSecond += upgradeTiers[tier];
        upgradePrices[tier] = Math.floor(upgradePrices[tier] * 1.5); // Augmenter le prix exponentiellement
        updateUI();
        saveGameData();
    } else {
        alert('Pas assez de notecoins pour acheter cette amélioration.');
    }
}

// Générer des notecoins automatiquement toutes les secondes
setInterval(() => {
    notecoins += notecoinsPerSecond;
    updateUI();
    saveGameData();
}, 1000); // Mise à jour toutes les secondes

// Mettre à jour les données toutes les secondes (1000ms) depuis le serveur
setInterval(async () => {
    try {
        const response = await fetch('/api/game', { credentials: 'include' });
        const data = await response.json();
        notecoins = data.notecoins;
        notecoinsPerSecond = data.notecoins_per_second;
        upgradesOwned = data.upgrades_owned;
        updateUI(); // Mettre à jour l'interface avec les nouvelles données
    } catch (error) {
        console.error("Erreur de communication avec le serveur:", error);
    }
}, 1000); // Rafraîchir toutes les secondes

// Fonction pour générer une note musicale
function generateMusicNote() {
    const note = document.createElement('div');
    note.classList.add('music-note');
    note.innerHTML = '🎵'; // Icône de note de musique

    // Positionner la note à une position horizontale aléatoire
    note.style.left = `${Math.random() * 100}vw`;

    // Ajouter la note au jeu
    document.body.appendChild(note);

    // Supprimer la note après la fin de l'animation
    setTimeout(() => {
        note.remove();
    }, 5000); // 5 secondes = durée de l'animation
}

// Fonction pour ajuster la génération des notes musicales en fonction des notecoins par seconde
function adjustMusicNotes() {
    let numberOfNotes = Math.floor(notecoinsPerSecond * 0.7); // Ajuster le facteur pour une fréquence raisonnable
    for (let i = 0; i < numberOfNotes; i++) {
        setTimeout(generateMusicNote, Math.random() * 1000); // Ajout aléatoire de la note
    }
}

// Mettre à jour la pluie de notes toutes les secondes
setInterval(() => {
    adjustMusicNotes();
}, 1000); // Mettre à jour toutes les secondes

// Charger les données dès le chargement de la page
window.onload = loadGameData;
