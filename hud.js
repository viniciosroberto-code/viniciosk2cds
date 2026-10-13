const HUD = {
    suns: 150,
    selectedPlant: null,
    selectedCost: 0,

    init() {
        this.updateSunDisplay();
        this.setupFullscreen();
        this.setupRestart();
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

    setSelectedPlant(plantName, cost) {
        this.selectedPlant = plantName;
        this.selectedCost = cost;
        document.getElementById('selected-plant').innerText = `${plantName} (${cost}☀️)`;
    },

    clearSelection() {
        this.selectedPlant = null;
        this.selectedCost = 0;
        document.getElementById('selected-plant').innerText = 'Nenhuma';
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
    }
};

HUD.init();