/* eslint-disable class-methods-use-this */
import { Card } from '../sprites/Card';
import { IAdditionalParams, ICardsPositions, ICategories, IDifficulty, IGameConfig, ISounds } from '../interfaces';
import { commonStyle } from '../utils/fontStyles';

class MainScene extends Phaser.Scene {
  private gameConfig: IGameConfig = {
    background: 'string',
    currentDifficulty: 0,
    cardBack: 'cardbackImage',
    gameTime: 10,
    category: 'ocean',
  };

  private additionInfo: IAdditionalParams = {
    difficulties: [
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
    ],
    timeCountList: [3, 10, 20, 30, 50, 60],
    scene: this,
    cardBackVariants: [],
    categories: { ocean: [], airplanes: [], radioppl: [] },
  };

  cardsPositions: Array<ICardsPositions>;
  cardScale: number;
  cardsList: Array<Card> = [];
  activeCards: Array<Card> = [];
  canvasCenterPoint = { x: 0, y: 0 };
  blocked = false;
  wrongAttempts = 0;
  incorrectAttemptsMessage: Phaser.GameObjects.Text | undefined;
  elapsedTime = 1;
  elapsedTimeMessage: Phaser.GameObjects.Text | undefined;
  sounds: ISounds | undefined;
  gameTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: 'MainScene' });

    this.cardsPositions = [];
    this.cardScale = 0.6;
  }

  create(data: { gameConfig: IGameConfig; sounds: ISounds; cardBackVariants: Array<string>; categories: ICategories }) {
    if (data.sounds) this.sounds = data.sounds;
    if (data.cardBackVariants) this.additionInfo.cardBackVariants = data.cardBackVariants;
    if (data.cardBackVariants) this.additionInfo.categories = data.categories;

    this.canvasCenterPoint = {
      x: Number(this.sys.game.config.width) / 2,
      y: Number(this.sys.game.config.height) / 2,
    };

    this.input.on('gameobjectdown', this.flip, this);

    this.incorrectAttemptsMessage = this.add.text(210, 0, ` `, {
      color: '#000',
      fontFamily: 'CevicheOne-Regular',
      fontSize: '42px',
    });

    this.elapsedTimeMessage = this.add.text(540, 0, ` `, {
      color: '#000',
      fontFamily: 'CevicheOne-Regular',
      fontSize: '42px',
    });

    if (data.gameConfig) {
      this.gameConfig = { ...this.gameConfig, ...data.gameConfig };
      this.clearGame();
    }

    this.initGame();

    const button = this.add.text(Number(this.game.config.width) / 10, Number(this.game.config.height) - 20, 'Change!');
    button.setInteractive();
    button.on('pointerdown', () => {
      this.scene.pause();
      this.scene.launch('ConfigScene', { gameConfig: this.gameConfig, additionalParams: this.additionInfo, sounds: this.sounds });
    });
  }

  switchToConfig() {
    const button = this.add.text(Number(this.game.config.width) / 10, Number(this.game.config.height) - 20, 'Change!', commonStyle);
    button.setInteractive();
    button.on('pointerdown', () => {
      this.scene.launch('ConfigScene');
    });
  }

  update() {
    this.cardsList.forEach((card) => {
      const angle = card.angle + card.getStep();
      card.setAngle(angle);
      if (card.angle >= 3 || card.angle <= -3) card.changeDirection();
    });
  }

  private getDifficulties() {
    return this.additionInfo.difficulties;
  }

  private initGame() {
    const [difficulty] = this.getDifficulties().slice(this.gameConfig.currentDifficulty);
    const categoryVariants = this.additionInfo.categories[this.gameConfig.category];
    const shuffledVariants = Phaser.Utils.Array.Shuffle(categoryVariants);
    this.setCardPositions(difficulty);
    this.createCards(shuffledVariants);
    this.layoutCards();
  }

  private endGame() {
    const guessedCardsCount = this.cardsList.filter((card) => card.getGuessStatus()).length;
    const isComplete = this.cardsList.length === guessedCardsCount;
    const tmpl = `
      My war is over!!!\n
      Wrong attempts: ${this.wrongAttempts}!\n
      Cards guessed: ${guessedCardsCount / 2}!\n
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

    const tempMessage = this.add.text(this.canvasCenterPoint.x, this.canvasCenterPoint.y, tmpl, textConfig).setOrigin(0.5, 0.5);
    tempMessage.setInteractive();
    tempMessage.on('pointerdown', () => {
      tempMessage.destroy();
      this.initGame();
    });
  }

  public stopGame(custom = true) {
    if (this.gameTimer) {
      this.time.removeEvent(this.gameTimer);
    }
    this.dropDownCards().then(() => {
      if (custom) this.endGame();
      this.clearGame();
    });
  }

  private createTimer() {
    this.elapsedTimeMessage?.setText(`Time: ${this.gameConfig.gameTime}`);
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.onTick,
      callbackScope: this,
      loop: true,
      repeat: 0,
    });
  }

  private onTick() {
    this.elapsedTimeMessage?.setText(`Time: ${this.gameConfig.gameTime - this.elapsedTime}`);

    if (this.elapsedTime >= this.gameConfig.gameTime) {
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
    const [difficulty] = this.getDifficulties().slice(this.gameConfig.currentDifficulty);
    const totalCard = difficulty.rows * difficulty.colls;
    const cardInst = { scene: this, x: 0, y: 0, texture: this.gameConfig.cardBack, scale: this.cardScale, secret: '' };
    for (let i = 0; i < totalCard / 2; i += 1) {
      for (let j = 0; j < 2; j += 1) {
        cardInst.secret = variants[i];
        const card = new Card(cardInst);
        this.cardsList = [...this.cardsList, card];
      }
    }
    Phaser.Utils.Array.Shuffle(this.cardsList);
    this.cardsPositions.forEach((position, index) => this.cardsList[index].init(position));
  }

  private setCardPositions(difficulty: IDifficulty) {
    for (let col = 0; col < difficulty.colls; col += 1) {
      for (let row = 0; row < difficulty.rows; row += 1) {
        const cardSpacing = 20;
        const cardTexture = this.textures.get(this.gameConfig.cardBack);
        const textureWidth = cardTexture.getSourceImage().width;
        const textureHeight = cardTexture.getSourceImage().height;
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
}

export { MainScene };
