import { Card } from '../sprites/Card';
import bgImage from '../assets/sprites/backgrounds/background.png';
import cardbackImage from '../assets/sprites/cardback/back1.png';
import cardTapSound from '../assets/sounds/card.mp3';
import themeSound from '../assets/sounds/theme.mp3';
import successSound from '../assets/sounds/success.mp3';
import completeSound from '../assets/sounds/complete.mp3';
import timeisoverSound from '../assets/sounds/timeout.mp3';

interface ICardsPositions {
  posX: number;
  posY: number;
}

interface IDifficulty {
  name: string;
  rows: number;
  colls: number;
}

interface ISounds {
  cardTap: Phaser.Sound.BaseSound;
  themeSound: Phaser.Sound.BaseSound;
  success: Phaser.Sound.BaseSound;
  complete: Phaser.Sound.BaseSound;
  timeisover: Phaser.Sound.BaseSound;
}

class MainScene extends Phaser.Scene {
  cardsPositions: Array<ICardsPositions>;
  cardScale: number;
  difficulties: Array<IDifficulty>;
  currentDifficulty: IDifficulty;
  cardBack = 'cardbackImage';
  cardsList: Array<Card> = [];
  activeCards: Array<Card> = [];
  blocked = false;
  wrongAttempts = 0;
  incorrectAttemptsMessage: Phaser.GameObjects.Text | undefined;
  variants = ['ocean_01', 'ocean_02', 'ocean_03', 'ocean_04', 'ocean_05'];
  gameTime = 30;
  elapsedTime = 0;
  elapsedTimeMessage: Phaser.GameObjects.Text | undefined;
  sounds: ISounds | undefined;

  constructor() {
    super('MainScene');

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
  }

  create() {
    const canvasCenterPoint = {
      x: Number(this.sys.game.config.width) / 2,
      y: Number(this.sys.game.config.height) / 2,
    };

    this.add.sprite(canvasCenterPoint.x, canvasCenterPoint.y, 'bgImage');
    this.initSounds();
    this.initGame();

    this.input.on('gameobjectdown', this.flip, this);
    this.incorrectAttemptsMessage = this.add.text(0, 0, `Incorrect: ${this.wrongAttempts}`, { color: '#000' });
    this.elapsedTimeMessage = this.add.text(500, 0, `Time: ${this.gameTime - this.elapsedTime}`, {
      color: '#000',
      fontFamily: 'CevicheOne-Regular',
      fontSize: '48px',
      fontStyle: 'bold',
    });
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
      themeSound: this.sound.add('themeSound', { volume: 0.1 }),
      complete: this.sound.add('completeSound'),
      timeisover: this.sound.add('timeisoverSound'),
      success: this.sound.add('successSound'),
    };
  }

  private initGame() {
    this.setCardPositions(this.currentDifficulty);
    this.createCards(this.variants);
    this.createTimer();
    this.sounds?.themeSound.play({ loop: true });
  }

  private endGame() {
    const isGc = this.cardsList.length === this.cardsList.filter((card) => card.getGuessStatus()).length;
    const tmpl = `
      My war is over!!!\n
      Wrong attempts: ${this.wrongAttempts}!\n
      ${isGc ? 'Congratulation!' : 'GAME OVER!'}
    `;

    if (isGc) {
      this.sounds?.complete.play();
    } else {
      this.sounds?.timeisover.play();
    }

    this.time.removeAllEvents();

    this.add.text(300, 300, tmpl, { color: '#000000', fontFamily: 'Arial', fontSize: '48px', align: 'center' }).setOrigin(0.5, 0.5);
  }

  private createTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: this.onTick,
      callbackScope: this,
      loop: true,
    });
  }

  private onTick() {
    if (this.elapsedTime > this.gameTime) {
      this.endGame();
      this.time.removeAllEvents();
      this.clearGame();
    }
    this.elapsedTimeMessage?.setText(`Time: ${this.gameTime - this.elapsedTime}`);
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
            card.setTint(0x00ff00).setAlpha(0.6);
            card.guessed();
            this.blocked = false;
          });
        } else {
          this.wrongAttempts += 1;
          this.incorrectAttemptsMessage?.setText(`Incorrect: ${this.wrongAttempts}`);
          this.activeCards.forEach((card) => {
            card.setTint(0xff0000).setAlpha(0.6);

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
      this.endGame();
      this.clearGame();
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
    this.cardsPositions.forEach((position, index) => this.cardsList[index].setPosition(position.posX, position.posY));
    // this.cardsList.map((card, index) => card.setPosition(this.cardsPositions[index].posX, this.cardsPositions[index].posY));
  }

  private setCardPositions(difficulty: IDifficulty) {
    this.clearGame();
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

  private clearGame() {
    this.cardsList.map((card) => card.destroy());
    this.wrongAttempts = 0;
    this.cardsList = [];
    this.cardsPositions = [];
    this.incorrectAttemptsMessage?.setText(`Incorrect: ${this.wrongAttempts}`);
    this.elapsedTime = 0;
  }

  private preloadCardVariants() {
    this.variants.forEach((img) => this.load.image(`${img}`, `../media/cards/${img}.png`));
  }
}

export { MainScene };
