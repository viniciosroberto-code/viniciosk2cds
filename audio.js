const SoundManager = {
    sounds: {
        shoot: new Audio('https://www.myinstants.com/media/sounds/blip.mp3'),
        sun: new Audio('https://www.myinstants.com/media/sounds/coin.mp3'),
        plant: new Audio('https://www.myinstants.com/media/sounds/click.mp3')
    },

    bgMusic: new Audio('https://ia801509.us.archive.org/15/items/plants-vs-zombies-soundtrack-grasswalk/Plants%20vs.%20Zombies%20OST%20-%20Grasswalk.mp3'),

    init() {
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.4;

        const startMusicOnInteraction = () => {
            this.bgMusic.play().then(() => {
                window.removeEventListener('click', startMusicOnInteraction);
                window.removeEventListener('keydown', startMusicOnInteraction);
            }).catch(e => console.log("Aguardando interação para tocar a música:", e));
        };

        window.addEventListener('click', startMusicOnInteraction);
        window.addEventListener('keydown', startMusicOnInteraction);
    },

    play(soundName) {
        if (this.sounds[soundName]) {
            const clone = this.sounds[soundName].cloneNode();
            clone.volume = 0.3;
            clone.play().catch(e => console.log("Áudio bloqueado:", e));
        }
    }
};

SoundManager.init();