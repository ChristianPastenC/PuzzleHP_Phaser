class Bootloader extends Phaser.Scene {

    constructor() { super({ key: 'Bootloader' }) }

    init() {
        this.grid = [];
        this.pieces = [];
        this.puzzle = 'A';
    }

    loading() {
        const { width, height } = this.cameras.main;
        const loadingText = this.add.text(width / 2, height / 2 - 35, 'Cargando...', { fill: '#ffffff' }).setOrigin(0.5);
        const percentText = this.add.text((width / 2) - 10, (height / 2) + 5, '0%', { fill: '#ffffff' }).setOrigin(0.5);

        this.load.on('progress', value => percentText.setText(parseInt(value * 100) + '%'));
        this.load.on('complete', () => {
            loadingText.destroy();
            percentText.destroy();
        });
    }

    preload() {
        this.loading();
        this.load.path = './assets/';
        this.load.spritesheet('back', 'fondo.png', { frameWidth: 500, frameHeight: 581 });
        this.load.image(['skull', 'dobby', 'hermione', 'space']);
        for (let i = 0; i < 8; i++) {
            this.load.image('A' + (i + 1));
            this.load.image('B' + (i + 1));
            this.load.image('C' + (i + 1));
        }
        this.load.audio('claps', 'applause.ogg');
    }

    create() {
        this.back = this.add.sprite(0, -120, 'back');
        this.back.setOrigin(0, 0).setScale(2.4, 1.25);
        this.anims.create({
            key: 'back_anim',
            frames: this.anims.generateFrameNumbers('back'),
            frameRate: 10,
            repeat: -1,
        });
        this.back.play('back_anim');
        this.infoText = this.add.text(750, 575, '*Selecciona un juego para reiniciar', { font: '20px Arial', fill: '#000000' });

        this.win = this.sound.add('claps', { volume: 0.5 });
        this.winner = this.add.image(600, 300, 'skull');
        this.winner.setVisible(false);

        this.menu();
        this.changeBoard('A');
        const events = Phaser.Input.Events;

        this.input.on(events.DRAG_START, (pointer, obj, dragX, dragY) => !obj.input.dropZone && obj.setScale(0.9));

        this.input.on(events.DRAG, (pointer, obj, dragX, dragY) => !obj.input.dropZone && obj.setPosition(dragX, dragY));

        this.input.on(events.DRAG_END, (pointer, obj, dropzone) => {
            const name = obj.name;
            const auxBlack = this.pieces.find(value => value.input.dropZone);
            const validDrops = [[300, 0], [-300, 0], [0, 150], [0, -150]];

            const isValidDrop = validDrops.some(([xDiff, yDiff]) =>
                obj.input.dragStartX + xDiff === auxBlack.x && obj.input.dragStartY + yDiff === auxBlack.y
            );

            if (dropzone && isValidDrop) {
                auxBlack.setPosition(obj.input.dragStartX, obj.input.dragStartY);
                this.move(name);
                this.isCompleted() && this.winning();
            } else obj.setPosition(obj.input.dragStartX, obj.input.dragStartY);

            obj.setScale(1.0);
        });

        this.input.on(events.DROP, (pointer, obj, dropzone) => obj.setPosition(dropzone.x, dropzone.y));
    }

    changeBoard(selected) {
        this.puzzle = selected;
        this.grid = Array.from({ length: 9 }, (_, i) => i);

        let posX = 150, posY = 75;
        this.grid.sort(() => Math.random() - 0.5);
        for (let i = 0; i < this.grid.length; i++) {
            const idxRef = this.grid[i] + 1;
            this.aux = this.add.image(posX, posY, idxRef != 9 ? selected + idxRef : 'space');
            this.aux.setOrigin(0, 0).setDepth(idxRef != 9 ? 2 : 1).setInteractive();
            this.input.setDraggable(this.aux);
            this.aux.name = this.grid[i] + 1;
            this.grid[i] = this.aux.name;
            this.pieces[i] = this.aux;
            this.aux.input.dropZone = idxRef != 9 ? false : true;

            posX += 300;
            if ((i + 1) % 3 == 0) {
                posY += 150;
                posX = 150;
            }
        }
    }

    menu() {
        this.imgA = this.add.image(520, 580, 'skull').setInteractive().setScale(.1).name = 'MenuA';
        this.imgB = this.add.image(600, 580, 'dobby').setInteractive().setScale(.1).name = 'MenuB';
        this.imgC = this.add.image(680, 580, 'hermione').setInteractive().setScale(.1).name = 'MenuC';

        const events = Phaser.Input.Events;
        this.input.on(events.GAMEOBJECT_OVER, (pointer, gameObject) => {
            typeof gameObject.name === 'string' && gameObject.name.includes('Menu') && gameObject.setScale(.12).setDepth(2);
        });
        this.input.on(events.GAMEOBJECT_OUT, (pointer, gameObject) => {
            typeof gameObject.name === 'string' && gameObject.name.includes('Menu') && gameObject.setScale(.1).setDepth(1);
        });
        this.input.on(events.GAMEOBJECT_DOWN, (pointer, gameObj) => {
            typeof gameObj.name === 'string' && gameObj.name.includes('Menu') && this.clean(gameObj.name.slice(-1));
        });
    }

    move(target) {
        let a, b;
        for (let i = 0; i < 9; i++) {
            a = target == this.grid[i] && i;
            b = 9 == this.grid[i] && i;
        }
        this.grid[a] = 9;
        this.grid[b] = target;
    }

    isCompleted() {
        let complete = true;
        for (let i = 0; i < 9; i++) {
            if (this.grid[i] != (i + 1)) {
                complete = false;
                break;
            } else continue;
        }
        return complete;
    }

    clean(op) {
        this.winner.destroy();
        for (let i = 0; i < 9; i++) this.pieces[i].destroy();
        op && this.changeBoard(op);
    }

    winning() {
        let aux = this.puzzle === 'A' && 'skull' || this.puzzle === 'B' && 'dobby' || this.puzzle === 'C' && 'hermione';
        this.winner = this.add.image(600, 300, aux);
        this.winner.setOrigin(0.5, 0.5).setDepth(3);
        this.win.play();
    }
}

export default Bootloader;