import { Card } from '../sprites/Card';
import bgImage from '../assets/sprites/backgrounds/background.png';
import cardbackImage from '../assets/sprites/cardback/back1.png';
import cardTapSound from '../assets/sounds/card.mp3';
import themeSound from '../assets/sounds/theme.mp3';
import successSound from '../assets/sounds/success.mp3';
import completeSound from '../assets/sounds/complete.mp3';
import timeisoverSound from '../assets/sounds/timeout.mp3';
import { ICardsPositions, IDifficulty, ISounds } from '../interfaces';

class MainScene extends Phaser.Scene {
  cardsPositions: Array<ICardsPositions>;
  cardScale: number;
  difficulties: Array<IDifficulty>;
  currentDifficulty: IDifficulty;
  cardBack = 'cardbackImage';
  cardsList: Array<Card> = [];
  activeCards: Array<Card> = [];
  canvasCenterPoint = { x: 0, y: 0 };
  blocked = false;
  wrongAttempts = 0;
  incorrectAttemptsMessage: Phaser.GameObjects.Text | undefined;
  variants = ['ocean_01', 'ocean_02', 'ocean_03', 'ocean_04', 'ocean_05'];
  gameTime = 10;
  elapsedTime = 1;
  elapsedTimeMessage: Phaser.GameObjects.Text | undefined;
  sounds: ISounds | undefined;

  constructor() {
    super({ key: 'MainScene' });

    this.cardsPositions = [];
    this.cardScale = 0.6;
    this.difficulties = [
      {
        name: 'easy',
        rows: 2,
        colls: 5,
      },
      {
        name: 'normal',
        rows: 3,
        colls: 4,
      },
      {
        name: 'hard',
        rows: 3,
        colls: 6,
      },
    ];

    [this.currentDifficulty] = this.difficulties;
  }

  preload() {
    this.load.image('bgImage', bgImage);
    this.load.image(this.cardBack, cardbackImage);
    this.preloadCardVariants();

    this.load.audio('cardTapSound', cardTapSound);
    this.load.audio('themeSound', themeSound);
    this.load.audio('timeisoverSound', timeisoverSound);
    this.load.audio('successSound', successSound);
    this.load.audio('completeSound', completeSound);

    this.canvasCenterPoint = {
      x: Number(this.sys.game.config.width) / 2,
      y: Number(this.sys.game.config.height) / 2,
    };
  }

  create(config: any) {
    console.log(config);
    if (config.difficulty) {
      this.currentDifficulty = config.difficulty;
    }
    this.initSounds();
    const bg = this.add.sprite(this.canvasCenterPoint.x, this.canvasCenterPoint.y, 'bgImage');

    this.input.on('gameobjectdown', this.flip, this);

    this.incorrectAttemptsMessage = this.add.text(210, 0, ` `, {
      color: '#000',
      fontFamily: 'CevicheOne-Regular',
      fontSize: '42px',
      // fontStyle: 'bold',
    });

    this.initGame();
    // this.scene.launch('ConfigScene');

    this.elapsedTimeMessage = this.add.text(540, 0, ` `, {
      color: '#000',
      fontFamily: 'CevicheOne-Regular',
      fontSize: '42px',
      // fontStyle: 'bold',
    });

    const button = this.add.text(Number(this.game.config.width) / 10, Number(this.game.config.height) - 20, 'Change!');
    button.setInteractive();
    button.on('pointerdown', () => {
      console.log('Click to change scene!');
      // this.scene.pause();
      this.scene.run('ConfigScene', { difficulties: this.difficulties, currentDifficulty: this.currentDifficulty });
    });
    // this.switchToConfig();
  }

  switchToConfig() {
    console.log(this.game.config);
    const button = this.add.text(Number(this.game.config.width) / 10, Number(this.game.config.height) - 20, 'Change!');
    button.setInteractive();
    button.on('pointerdown', () => {
      console.log('Click to change scene!');
      this.scene.launch('ConfigScene');
    });
    // this.scene.pause();
    // this.scene.launch();
  }

  update() {
    this.cardsList.forEach((card) => {
      const angle = card.angle + card.getStep();
      card.setAngle(angle);
      if (card.angle >= 3 || card.angle <= -3) card.changeDirection();
    });
  }

  private initSounds() {
    this.sounds = {
      cardTap: this.sound.add('cardTapSound', { volume: 0.05 }),
      themeSound: this.sound.add('themeSound', { volume: 0.05 }),
      complete: this.sound.add('completeSound'),
      timeisover: this.sound.add('timeisoverSound'),
      success: this.sound.add('successSound'),
    };

    this.sounds?.themeSound.play({ loop: true });
  }

  private initGame() {
    this.setCardPositions(this.currentDifficulty);
    this.createCards(this.variants);
    this.layoutCards();
  }

  private endGame() {
    const guessedCardsCount = this.cardsList.filter((card) => card.getGuessStatus()).length;
    const isComplete = this.cardsList.length === guessedCardsCount;
    // this.sounds?.themeSound.stop();
    // this.scene.start('ConfigScene', { isComplete, guessedCardsCount: guessedCardsCount / 2 });
    const tmpl = `
      My war is over!!!\n
      Wrong attempts: ${this.wrongAttempts}!\n
      Cards guessed: ${guessedCardsCount}!\n
      Elapsed time: ${this.elapsedTime}!\n\n
      ${isComplete ? '! Congratulation !' : '!!! GAME OVER !!!'}\n
    `;

    if (isComplete) {
      this.sounds?.complete.play();
    } else {
      this.sounds?.timeisover.play();
    }

    const textConfig: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#000000',
      fontFamily: 'CevicheOne-Regular',
      fontSize: '48px',
      align: 'center',
    };

    // this.sounds?.themeSound.stop();
    // this.scene.start('ConfigScene');

    const tempMessage = this.add.text(this.canvasCenterPoint.x, this.canvasCenterPoint.y, tmpl, textConfig).setOrigin(0.5, 0.5);
    tempMessage.setInteractive();
    tempMessage.on('pointerdown', () => {
      tempMessage.destroy();
      this.initGame();
    });
  }

  private stopGame(custom = true) {
    this.time.removeAllEvents();
    this.dropDownCards().then(() => {
      if (custom) this.endGame();
      this.clearGame();
    });
  }

  private createTimer() {
    this.elapsedTimeMessage?.setText(`Time: ${this.gameTime}`);
    this.time.addEvent({
      delay: 1000,
      callback: this.onTick,
      callbackScope: this,
      loop: true,
      repeat: 0,
    });
  }

  private onTick() {
    this.elapsedTimeMessage?.setText(`Time: ${this.gameTime - this.elapsedTime}`);

    if (this.elapsedTime >= this.gameTime) {
      this.stopGame();
      return;
    }

    this.elapsedTime += 1;
  }

  private flip(_pointer: Phaser.Input.Pointer, obj: Card) {
    const isNotCardInstance = !(obj instanceof Card);
    if (isNotCardInstance) return;
    if (obj.isNotFlipped() && !this.blocked) {
      this.sounds?.cardTap.play();
      obj.flipCard();
      this.activeCards = [...this.activeCards, obj];
    } else {
      return;
    }

    if (this.activeCards.length === 2) {
      this.checkActiveCards();
    }
  }

  private checkActiveCards() {
    this.blocked = true;
    const [firstCard, secondCard] = this.activeCards;
    const isSimilar = firstCard.compareWith(secondCard);
    const blockTime = 500;

    this.time.addEvent({
      delay: blockTime,
      callback: () => {
        if (isSimilar) {
          this.sounds?.success.play();
          this.activeCards.forEach((card) => {
            card.setTint(0x00ff00).setAlpha(0.7);
            card.guessed();
            this.blocked = false;
          });
        } else {
          this.wrongAttempts += 1;
          this.incorrectAttemptsMessage?.setText(`Incorrect: ${this.wrongAttempts}`);
          this.activeCards.forEach((card) => {
            card.setTint(0xff0136).setAlpha(0.7);

            this.time.addEvent({
              delay: 500,
              callback: () => {
                card.closeCard();
                card.setTint().setAlpha(1);
                this.blocked = false;
              },
            });
          });
        }

        this.activeCards = [];
        this.checkGameStatus();
      },
    });
  }

  private checkGameStatus() {
    const guessedCards = this.cardsList.filter((card) => card.getGuessStatus());
    const isAllGuessed = this.cardsList.length === guessedCards.length;

    if (isAllGuessed) {
      this.stopGame();
    }
  }

  private createCards(variants: Array<string>) {
    const totalCard = this.currentDifficulty.rows * this.currentDifficulty.colls;
    const cardInst = { scene: this, x: 0, y: 0, texture: this.cardBack, scale: this.cardScale, secret: '' };
    for (let i = 0; i < totalCard / 2; i += 1) {
      for (let j = 0; j < 2; j += 1) {
        cardInst.secret = variants[i];
        const card = new Card(cardInst);
        this.cardsList = [...this.cardsList, card];
      }
    }
    Phaser.Utils.Array.Shuffle(this.cardsList);
    this.cardsPositions.forEach((position, index) => this.cardsList[index].init(position));
    // this.cardsList.map((card, index) => card.setPosition(this.cardsPositions[index].posX, this.cardsPositions[index].posY));
  }

  private setCardPositions(difficulty: IDifficulty) {
    // this.clearGame();
    for (let col = 0; col < difficulty.colls; col += 1) {
      for (let row = 0; row < difficulty.rows; row += 1) {
        const cardSpacing = 20;
        const cardTexture = this.textures.get(this.cardBack);
        const textureWidth = cardTexture.getSourceImage().width;
        const textureHeight = cardTexture.getSourceImage().height;
        // const card = new Card({ scene: this, x: 0, y: 0, texture: cardTexture, scale: this.cardScale, secret: '' });
        const offsetX = (Number(this.sys.game.config.width) - difficulty.colls * ((textureWidth + cardSpacing) * this.cardScale)) / 2;
        const offsetY = (Number(this.sys.game.config.height) - difficulty.rows * ((textureHeight + cardSpacing) * this.cardScale)) / 2;

        const position: ICardsPositions = {
          posX: col * ((textureWidth + cardSpacing) * this.cardScale) + offsetX + (textureWidth * this.cardScale) / 2,
          posY: row * ((textureHeight + cardSpacing) * this.cardScale) + offsetY + (textureHeight * this.cardScale) / 2,
        };

        this.cardsPositions = [...this.cardsPositions, position];
      }
    }
  }

  private layoutCards() {
    this.blocked = true;
    const promiseList = this.cardsList.reverse().map((card, index) => card.moveToPosition({ index }));
    Promise.all(promiseList).then(() => {
      this.createTimer();
      this.blocked = false;
    });
  }

  private async dropDownCards() {
    this.blocked = true;
    const promiseList = this.cardsList.map((card, index) => {
      const confMove = {
        index,
        posX: Number(this.sys.game.config.width) + card.width,
        posY: Number(this.sys.game.config.height) + card.height,
      };
      return card.moveToPosition(confMove);
    });
    await Promise.allSettled(promiseList).then(() => {
      this.blocked = false;
    });
  }

  private clearGame() {
    this.activeCards = [];
    this.cardsList.map((card) => card.destroy());
    this.wrongAttempts = 0;
    this.cardsList = [];
    this.cardsPositions = [];
    this.incorrectAttemptsMessage?.setText(``);
    this.elapsedTimeMessage?.setText('');
    this.elapsedTime = 1;
  }

  private preloadCardVariants() {
    this.variants.forEach((img) => this.load.image(`${img}`, `../media/cards/${img}.png`));
  }
}

export { MainScene };
