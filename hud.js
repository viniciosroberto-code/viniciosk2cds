const HUD = {
    suns: 150,
    selectedPlant: null,
    selectedCost: 0,

    init() {
        this.updateSunDisplay();
        this.updateHighScoreDisplay();
        this.setupFullscreen();
        this.setupRestart();
        this.setupStartButton();
    },

    updateSuns(amount) {
        this.suns += amount;
        this.updateSunDisplay();
    },

    resetSuns() {
        this.suns = 150;
        this.updateSunDisplay();
    },

    updateSunDisplay() {
        document.getElementById('sun-count').innerText = this.suns;
    },

    updateWaveDisplay(wave) {
        document.getElementById('wave-count').innerText = wave;
    },

    updateHighScoreDisplay() {
        const savedScore = localStorage.getItem('pvz_highscore') || 0;
        const savedName = localStorage.getItem('pvz_playername') || 'Ninguém';
        document.getElementById('high-score-display').innerText = `${savedScore} (${savedName})`;
    },

    saveNewRecord(wave) {
        const currentHigh = parseInt(localStorage.getItem('pvz_highscore') || 0);
        if (wave > currentHigh) {
            const name = prompt(`🎉 NOVO RECORDE DA PÁGINA! Você sobreviveu até a Onda ${wave}!\nDigite seu nome para o placar:`) || 'JogadorAnônimo';
            localStorage.setItem('pvz_highscore', wave);
            localStorage.setItem('pvz_playername', name);
            this.updateHighScoreDisplay();
        }
    },

    setSelectedPlant(plantName, cost) {
        this.selectedPlant = plantName;
        this.selectedCost = cost;
    },

    clearSelection() {
        this.selectedPlant = null;
        this.selectedCost = 0;
    },

    setupFullscreen() {
        const btn = document.getElementById('fullscreen-btn');
        const container = document.getElementById('game-container');

        btn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                container.requestFullscreen().catch(err => {
                    alert(`Erro ao tentar modo tela cheia: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });
    },

    setupRestart() {
        const btn = document.getElementById('restart-btn');
        btn.addEventListener('click', () => {
            Game.restart();
        });
    },

    setupStartButton() {
        const startBtn = document.getElementById('start-game-btn');
        const startMenu = document.getElementById('start-menu');

        startBtn.addEventListener('click', () => {
            startMenu.style.display = 'none';
            Game.start();
        });
    }
};

HUD.init();