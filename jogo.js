const Game = {
    gridRows: 5,
    gridCols: 8,
    board: [],
    zombies: [],
    bullets: [],
    wave: 1,
    zombiesSpawnedInWave: 0,
    zombiesPerWave: 5,
    spawnerInterval: null,
    loopInterval: null,
    sunInterval: null,

    init() {
        this.createGrid();
        this.setupPlantSelector();
    },

    start() {
        this.startWave();
        this.startSunGenerator();
        this.startGameLoop();
    },

    restart() {
        clearInterval(this.spawnerInterval);
        clearInterval(this.loopInterval);
        clearInterval(this.sunInterval);

        document.querySelectorAll('.zombie, .bullet').forEach(el => el.remove());
        this.zombies = [];
        this.bullets = [];
        this.wave = 1;
        this.zombiesSpawnedInWave = 0;
        this.zombiesPerWave = 5;

        HUD.resetSuns();
        HUD.clearSelection();
        HUD.updateWaveDisplay(this.wave);
        document.querySelectorAll('.plant-card').forEach(c => c.classList.remove('selected'));

        this.createGrid();
        this.start();
    },

    createGrid() {
        const gridElement = document.getElementById('lawn-grid');
        gridElement.innerHTML = '';

        for (let r = 0; r < this.gridRows; r++) {
            this.board[r] = [];
            for (let c = 0; c < this.gridCols; c++) {
                this.board[r][c] = { plant: null };

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
            card.addEventListener('click', () => {
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

    startSunGenerator() {
        this.sunInterval = setInterval(() => {
            for (let r = 0; r < this.gridRows; r++) {
                for (let c = 0; c < this.gridCols; c++) {
                    if (this.board[r][c].plant && this.board[r][c].plant.type === 'sunflower') {
                        HUD.updateSuns(25);
                        SoundManager.play('sun');
                    }
                }
            }
        }, 8000);
    },

    startWave() {
        HUD.updateWaveDisplay(this.wave);
        this.zombiesSpawnedInWave = 0;
        
        const spawnSpeed = Math.max(1500, 5000 - (this.wave * 400));

        clearInterval(this.spawnerInterval);
        this.spawnerInterval = setInterval(() => {
            if (this.zombiesSpawnedInWave < this.zombiesPerWave) {
                this.spawnZombie();
                this.zombiesSpawnedInWave++;
            } else {
                clearInterval(this.spawnerInterval);
            }
        }, spawnSpeed);
    },

    spawnZombie() {
        const randomRow = Math.floor(Math.random() * this.gridRows);
        const container = document.getElementById('game-container');

        const zombieElement = document.createElement('div');
        zombieElement.classList.add('zombie');
        zombieElement.innerText = '🧟';
        zombieElement.style.position = 'absolute';
        zombieElement.style.fontSize = '35px';
        zombieElement.style.left = '840px';
        zombieElement.style.top = `${80 + randomRow * 85}px`;

        container.appendChild(zombieElement);

        this.zombies.push({
            row: randomRow,
            xPos: 840,
            health: 40 + (this.wave * 10),
            speed: 5 + Math.min(this.wave, 10),
            element: zombieElement
        });
    },

    checkNextWave() {
        if (this.zombiesSpawnedInWave >= this.zombiesPerWave && this.zombies.length === 0) {
            this.wave++;
            this.zombiesPerWave += 3;
            HUD.updateSuns(50);
            this.startWave();
        }
    },

    startGameLoop() {
        this.loopInterval = setInterval(() => {
            for (let r = 0; r < this.gridRows; r++) {
                for (let c = 0; c < this.gridCols; c++) {
                    if (this.board[r][c].plant && this.board[r][c].plant.type === 'peashooter') {
                        const hasZombieInRow = this.zombies.some(z => z.row === r && z.xPos > (c * 100));
                        if (hasZombieInRow) {
                            this.shootBullet(r, c);
                        }
                    }
                }
            }

            this.moveZombies();
            this.moveBullets();
            this.checkCollisions();
            this.checkNextWave();
        }, 300);
    },

    shootBullet(row, col) {
        const container = document.getElementById('game-container');
        const bulletElement = document.createElement('div');
        bulletElement.classList.add('bullet');
        bulletElement.innerText = '🟢';
        bulletElement.style.position = 'absolute';
        bulletElement.style.fontSize = '18px';
        bulletElement.style.left = `${120 + col * 95}px`;
        bulletElement.style.top = `${90 + row * 85}px`;

        container.appendChild(bulletElement);

        this.bullets.push({
            row: row,
            xPos: 120 + col * 95,
            element: bulletElement
        });

        SoundManager.play('shoot');
    },

    moveZombies() {
        this.zombies.forEach(zombie => {
            zombie.xPos -= zombie.speed;
            zombie.element.style.left = `${zombie.xPos}px`;

            if (zombie.xPos < 50) {
                HUD.saveNewRecord(this.wave);
                alert(`Os Zumbis comeram os seus cérebros! Você chegou até a Onda ${this.wave}.`);
                this.restart();
            }
        });
    },

    moveBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.xPos += 20;
            bullet.element.style.left = `${bullet.xPos}px`;

            if (bullet.xPos > 880) {
                bullet.element.remove();
                this.bullets.splice(i, 1);
            }
        }
    },

    checkCollisions() {
        for (let b = this.bullets.length - 1; b >= 0; b--) {
            const bullet = this.bullets[b];

            for (let z = this.zombies.length - 1; z >= 0; z--) {
                const zombie = this.zombies[z];

                if (bullet.row === zombie.row && Math.abs(bullet.xPos - zombie.xPos) < 25) {
                    zombie.health -= 25;

                    bullet.element.remove();
                    this.bullets.splice(b, 1);

                    if (zombie.health <= 0) {
                        zombie.element.remove();
                        this.zombies.splice(z, 1);
                    }
                    break;
                }
            }
        }
    }
};

window.onload = () => {
    Game.init();
};