class Bootloader extends Phaser.Scene {

    constructor() {
        super({
            key: 'Bootloader'
        });
    }

    init() {
        this.grid = [];
        this.pieces = [];
        this.black = null;
        this.puzzle = 'A';
    }

    loading() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 35,
            text: 'Cargando...',
            style: {
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = this.make.text({
            x: (width / 2) - 10,
            y: (height / 2) + 5,
            text: '0%',
            style: {
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
        });

        this.load.on('complete', function () {
            loadingText.destroy();
            percentText.destroy();
        });
    }

    preload() {
        this.loading();
        this.load.path = './assets/';
        this.load.spritesheet('back', 'fondo.png', {
            frameWidth: 500,
            frameHeight: 581,
        });
        this.load.audio('basse', 'themeSong.ogg');
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
        this.back.setOrigin(0, 0);
        this.back.setScale(2.4, 1.25);
        this.anims.create({
            key: 'back_anim',
            frames: this.anims.generateFrameNumbers('back'),
            frameRate: 10,
            repeat: -1,
        });
        this.back.play('back_anim');
        this.music = this.sound.add('basse', { loop: true });
        this.music.play();
        this.infoText = this.add.text(750, 575, '*Selecciona un juego para reiniciar', { font: '20px Arial', fill: '#000000' });


        this.win = this.sound.add('claps', { volume: 0.5 });
        this.winner = this.add.image(600, 300, 'skull');
        this.winner.setVisible(false);

        this.menu();
        this.firstBoard();
        const events = Phaser.Input.Events;

        this.input.on(events.DRAG_START, (pointer, obj, dragX, dragY) => {
            obj.setScale(0.9);
        });

        this.input.on(events.DRAG, (pointer, obj, dragX, dragY) => {
            obj.x = dragX;
            obj.y = dragY;
        });

        this.input.on(events.DRAG_END, (pointer, obj, dropzone) => {
            let name = obj.name,
                namebk = this.black.name;
            if (dropzone && (
                ((obj.input.dragStartX + 300) === this.black.x && obj.input.dragStartY === this.black.y) ||
                ((obj.input.dragStartX - 300) === this.black.x && obj.input.dragStartY === this.black.y) ||
                ((obj.input.dragStartY + 150) === this.black.y && obj.input.dragStartX === this.black.x) ||
                ((obj.input.dragStartY - 150) === this.black.y && obj.input.dragStartX === this.black.x)
            )) {
                this.black.x = obj.input.dragStartX;
                this.black.y = obj.input.dragStartY;
                this.move(name, namebk);
                if (this.isCompleted()) {
                    this.win.play();
                    this.winning();
                }
            } else {
                obj.x = obj.input.dragStartX;
                obj.y = obj.input.dragStartY;
            }
            obj.setScale(1.0);
        });

        this.input.on(events.DROP, (pointer, obj, dropzone) => {
            obj.x = dropzone.x;
            obj.y = dropzone.y;
        });
    }

    firstBoard() {
        this.puzzle = 'A';
        for (let i = 0; i < 9; i++) {
            this.grid[i] = i;
        }

        let posX = 150, posY = 75;
        this.grid.sort(function () { return Math.random() - 0.5 })
        for (let i = 0; i < this.grid.length; i++) {
            if ((this.grid[i] + 1) != 9) {
                this.aux = this.add.image(posX, posY, 'A' + (this.grid[i] + 1));
                this.aux.setOrigin(0, 0);
                this.aux.setDepth(2);
                this.aux.setInteractive();
                this.input.setDraggable(this.aux);
                this.aux.name = this.grid[i] + 1;
                this.grid[i] = this.aux.name;
                this.pieces[i] = this.aux;
            } else {
                this.black = this.add.image(posX, posY, 'space');
                this.black.setOrigin(0, 0);
                this.black.setDepth(1);
                this.black.setInteractive();
                this.black.input.dropZone = true;
                this.black.name = this.grid[i] + 1;
                this.grid[i] = this.black.name;
                this.pieces[i] = this.black;
            }
            posX += 300;
            if ((i + 1) % 3 == 0) {
                posY += 150;
                posX = 150;
            }
        }
    }

    secondBoard() {
        this.puzzle = 'B';
        for (let i = 0; i < 9; i++) {
            this.grid[i] = i;
        }

        let posX = 150, posY = 75;
        this.grid.sort(function () { return Math.random() - 0.5 })
        for (let i = 0; i < this.grid.length; i++) {
            if ((this.grid[i] + 1) != 9) {
                this.aux = this.add.image(posX, posY, 'B' + (this.grid[i] + 1));
                this.aux.setOrigin(0, 0);
                this.aux.setDepth(2);
                this.aux.setInteractive();
                this.input.setDraggable(this.aux);
                this.aux.name = this.grid[i] + 1;
                this.grid[i] = this.aux.name;
                this.pieces[i] = this.aux;
            } else {
                this.black = this.add.image(posX, posY, 'space');
                this.black.setOrigin(0, 0);
                this.black.setDepth(1);
                this.black.setInteractive();
                this.black.input.dropZone = true;
                this.black.name = this.grid[i] + 1;
                this.grid[i] = this.black.name;
                this.pieces[i] = this.black;
            }
            posX += 300;
            if ((i + 1) % 3 == 0) {
                posY += 150;
                posX = 150;
            }
        }
    }

    thirdBoard() {
        this.puzzle = 'C';
        for (let i = 0; i < 9; i++) {
            this.grid[i] = i;
        }

        let posX = 150, posY = 75;
        this.grid.sort(function () { return Math.random() - 0.5 })
        for (let i = 0; i < this.grid.length; i++) {
            if ((this.grid[i] + 1) != 9) {
                this.aux = this.add.image(posX, posY, 'C' + (this.grid[i] + 1));
                this.aux.setOrigin(0, 0);
                this.aux.setDepth(2);
                this.aux.setInteractive();
                this.input.setDraggable(this.aux);
                this.aux.name = this.grid[i] + 1;
                this.grid[i] = this.aux.name;
                this.pieces[i] = this.aux;
            } else {
                this.black = this.add.image(posX, posY, 'space');
                this.black.setOrigin(0, 0);
                this.black.setDepth(1);
                this.black.setInteractive();
                this.black.input.dropZone = true;
                this.black.name = this.grid[i] + 1;
                this.grid[i] = this.black.name;
                this.pieces[i] = this.black;
            }
            posX += 300;
            if ((i + 1) % 3 == 0) {
                posY += 150;
                posX = 150;
            }
        }
    }

    menu() {
        this.imgA = this.add.image(520, 580, 'skull').setInteractive();
        this.imgB = this.add.image(600, 580, 'dobby').setInteractive();
        this.imgC = this.add.image(680, 580, 'hermione').setInteractive();
        this.imgA.setScale(.1);
        this.imgB.setScale(.1);
        this.imgC.setScale(.1);
        this.imgA.name = 'MenuA';
        this.imgB.name = 'MenuB';
        this.imgC.name = 'MenuC';
        const events = Phaser.Input.Events;
        this.input.on(events.GAMEOBJECT_OVER, (pointer, gameObject) => {
            if (gameObject.name == 'MenuA' || gameObject.name == 'MenuB' || gameObject.name == 'MenuC') {
                gameObject.setScale(.12);
                gameObject.setDepth(2);
            }
        });
        this.input.on(events.GAMEOBJECT_OUT, (pointer, gameObject) => {
            if (gameObject.name == 'MenuA' || gameObject.name == 'MenuB' || gameObject.name == 'MenuC') {
                gameObject.setScale(.1);
                gameObject.setDepth(1);
            }
        });
        this.input.on(events.GAMEOBJECT_DOWN, (pointer, gameObj) => {
            if (gameObj.name == 'MenuA') {
                this.clean('A');
            }
            if (gameObj.name == 'MenuB') {
                this.clean('B');

            }
            if (gameObj.name == 'MenuC') {
                this.clean('C');
            }
        });

    }

    move(init, end) {
        let a, b;
        for (let i = 0; i < 9; i++) {
            if (init == this.grid[i])
                a = i;
            if (end == this.grid[i])
                b = i;
        }
        this.grid[a] = end;
        this.grid[b] = init;
    }

    isCompleted() {
        let complete = true;
        for (let i = 0; i < 9; i++) {
            if (this.grid[i] != (i + 1)) {
                complete = false;
                break;
            } else {
                continue;
            }
        }
        return complete;
    }

    clean(op) {
        this.winner.destroy();
        for (let i = 0; i < 9; i++) {
            this.pieces[i].destroy();
        }
        if (op == 'A')
            this.firstBoard();
        if (op == 'B')
            this.secondBoard();
        if (op == 'C')
            this.thirdBoard();
    }

    winning() {
        let aux;
        if (this.puzzle == 'A')
            aux = 'skull';
        if (this.puzzle == 'B')
            aux = 'dobby';
        if (this.puzzle == 'C')
            aux = 'hermione';
        this.winner = this.add.image(600, 300, aux);
        this.winner.setOrigin(0.5, 0.5);
        this.winner.setDepth(3);
    }
}

export default Bootloader;