import Bootloader from './scenes/Bootloader.js'

const config = {
    title: "Puzzle HP Phaser",
    version: "1.0.2",
    type: Phaser.AUTO,
    scale: {
        parent: "phaser_container",
        width: 1200, height: 600,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    audio: {
        disableWebAudio: false,
    },
    backgroundColor: "#111111",
    scene: [Bootloader],
};

const game = new Phaser.Game(config);