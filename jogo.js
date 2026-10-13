const Game = {
    gridRows: 5,
    gridCols: 8,
    board: [],
    spawnerInterval: null,
    loopInterval: null,

    init() {
        this.createGrid();
        this.setupPlantSelector();
        this.startZombieSpawner();
        this.startGameLoop();
    },

    restart() {
        clearInterval(this.spawnerInterval);
        clearInterval(this.loopInterval);
        
        HUD.resetSuns();
        HUD.clearSelection();
        document.querySelectorAll('.plant-card').forEach(c => c.classList.remove('selected'));

        this.createGrid();
        this.startZombieSpawner();
        this.startGameLoop();
    },

    createGrid() {
        const gridElement = document.getElementById('lawn-grid');
        gridElement.innerHTML = '';

        for (let r = 0; r < this.gridRows; r++) {
            this.board[r] = [];
            for (let c = 0; c < this.gridCols; c++) {
                this.board[r][c] = { plant: null, zombies: [] };

                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;

                cell.addEventListener('click', () => this.handleCellClick(r, c, cell));
                gridElement.appendChild(cell);
            }
        }
    },

    setupPlantSelector() {
        const cards = document.querySelectorAll('.plant-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                cards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');

                const plantName = card.dataset.plant;
                const cost = parseInt(card.dataset.cost);
                HUD.setSelectedPlant(plantName, cost);
                SoundManager.play('plant');
            });
        });
    },

    handleCellClick(r, c, cellElement) {
        if (!HUD.selectedPlant) return;

        if (HUD.suns < HUD.selectedCost) {
            alert('Sóis insuficientes!');
            return;
        }

        if (this.board[r][c].plant !== null) {
            return;
        }

        HUD.updateSuns(-HUD.selectedCost);
        this.board[r][c].plant = {
            type: HUD.selectedPlant,
            health: 100
        };

        cellElement.innerText = HUD.selectedPlant === 'peashooter' ? '🌱' : '🌻';
        SoundManager.play('plant');

        document.querySelectorAll('.plant-card').forEach(c => c.classList.remove('selected'));
        HUD.clearSelection();
    },

    startZombieSpawner() {
        this.spawnerInterval = setInterval(() => {
            const randomRow = Math.floor(Math.random() * this.gridRows);
            this.board[randomRow][this.gridCols - 1].zombies.push({
                xPos: (this.gridCols - 1),
                health: 50
            });
        }, 8000);
    },

    startGameLoop() {
        this.loopInterval = setInterval(() => {
            for (let r = 0; r < this.gridRows; r++) {
                for (let c = 0; c < this.gridCols; c++) {
                    const cellData = this.board[r][c];

                    if (cellData.plant && cellData.plant.type === 'peashooter') {
                        let hasZombieAhead = false;
                        for (let colCheck = c; colCheck < this.gridCols; colCheck++) {
                            if (this.board[r][colCheck].zombies.length > 0) {
                                hasZombieAhead = true;
                                break;
                            }
                        }
                        if (hasZombieAhead) {
                            SoundManager.play('shoot');
                        }
                    }
                }
            }
        }, 1500);
    }
};

window.onload = () => {
    Game.init();
};