import { Card } from '../sprites/Card';
import bgImage from '../assets/sprites/backgrounds/background.png';
import cardbackImage from '../assets/sprites/cardback/back1.png';

interface ICardsPositions {
  posX: number;
  posY: number;
}

interface IDifficulty {
  name: string;
  rows: number;
  colls: number;
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
  }

  create() {
    const canvasCenterPoint = {
      x: Number(this.sys.game.config.width) / 2,
      y: Number(this.sys.game.config.height) / 2,
    };

    this.add.sprite(canvasCenterPoint.x, canvasCenterPoint.y, 'bgImage');

    this.setCardPositions(this.currentDifficulty);
    // this.createCards();
    const variants = ['ocean_01', 'ocean_02', 'ocean_03', 'ocean_04', 'ocean_05'];
    this.createCards(variants);

    this.input.on('gameobjectdown', this.flip, this);

    // const c = new Card({ scene: this, x: 0, y: 0, key: this.cardBack, scale: this.cardScale });
  }

  private flip(_pointer: Phaser.Input.Pointer, obj: Card) {
    if (obj.isNotFlipped() && !this.blocked) {
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
    const isSame = firstCard.compareWith(secondCard);
    const timeout = setTimeout(() => {
      this.blocked = false;
      if (!isSame) this.activeCards.forEach((card) => card.closeCard());
      this.activeCards = [];
      clearTimeout(timeout);
    }, 1000);
  }

  private createCards(variants: Array<string>) {
    const totalCard = this.currentDifficulty.rows * this.currentDifficulty.colls;
    for (let i = 0; i < totalCard / 2; i += 1) {
      for (let j = 0; j < 2; j += 1) {
        const card = new Card({ scene: this, x: 0, y: 0, texture: this.cardBack, scale: this.cardScale, secret: variants[i] });
        this.cardsList = [...this.cardsList, card];
      }
    }
    Phaser.Utils.Array.Shuffle(this.cardsList);
    this.cardsList.map((card, index) => card.setPosition(this.cardsPositions[index].posX, this.cardsPositions[index].posY));
  }

  private setCardPositions(difficulty: IDifficulty) {
    this.eraseCards();
    for (let col = 0; col < difficulty.colls; col += 1) {
      for (let row = 0; row < difficulty.rows; row += 1) {
        const cardSpacing = 10;
        const cardTexture = this.textures.get(this.cardBack);
        const textureWidth = cardTexture.getSourceImage().width;
        const textureHeight = cardTexture.getSourceImage().height;
        // const card = new Card({ scene: this, x: 0, y: 0, texture: cardTexture, scale: this.cardScale, secret: '' });
        const offsetX = (Number(this.sys.game.config.width) - difficulty.colls * ((textureWidth + cardSpacing) * this.cardScale)) / 2;
        const offsetY = (Number(this.sys.game.config.height) - difficulty.rows * ((textureHeight + cardSpacing) * this.cardScale)) / 2;

        const position: ICardsPositions = {
          posX: col * ((textureWidth + cardSpacing) * this.cardScale) + offsetX,
          posY: row * ((textureHeight + cardSpacing) * this.cardScale) + offsetY,
        };

        this.cardsPositions = [...this.cardsPositions, position];
      }
    }
  }

  private eraseCards() {
    this.cardsPositions = [];
    this.cardsList = [];
  }

  private preloadCardVariants() {
    const variants = ['ocean_01', 'ocean_02', 'ocean_03', 'ocean_04', 'ocean_05'];

    variants.forEach((img) => this.load.image(`${img}`, `../media/cards/${img}.png`));
  }
}

export { MainScene };
