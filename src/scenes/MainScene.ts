import { Card } from '../sprites/Card';
import bgImage from '../assets/sprites/backgrounds/background.png';
import cardbackImage from '../assets/sprites/cardback/back1.png';

interface ICardsPositions {
  card: Card;
  posX: number;
  posY: number;
}

interface IDifficulties {
  name: string;
  rows: number;
  colls: number;
}

class MainScene extends Phaser.Scene {
  cardsPositions: Array<ICardsPositions>;
  cardScale: number;
  difficulties: Array<IDifficulties>;
  cardBack = 'cardbackImage';

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
  }

  preload() {
    this.load.image('bgImage', bgImage);
    this.load.image(this.cardBack, cardbackImage);
  }

  create() {
    const [currentDifficulty] = this.difficulties;
    const canvasCenterPoint = {
      x: Number(this.sys.game.config.width) / 2,
      y: Number(this.sys.game.config.height) / 2,
    };

    this.add.sprite(canvasCenterPoint.x, canvasCenterPoint.y, 'bgImage');

    this.setCardPositions(currentDifficulty);

    // const c = new Card({ scene: this, x: 0, y: 0, key: this.cardBack, scale: this.cardScale });
  }

  private setCardPositions(difficulty: IDifficulties) {
    this.eraseCardPositions();
    for (let col = 0; col < difficulty.colls; col += 1) {
      for (let row = 0; row < difficulty.rows; row += 1) {
        const cardSpacing = 10;
        const cardTexture = this.textures.get(this.cardBack);
        const card = new Card({ scene: this, x: 0, y: 0, texture: cardTexture, scale: this.cardScale });
        const offsetX = (Number(this.sys.game.config.width) - difficulty.colls * ((card.width + cardSpacing) * card.scaleX)) / 2;
        const offsetY = (Number(this.sys.game.config.height) - difficulty.rows * ((card.height + cardSpacing) * card.scaleY)) / 2;

        const position: ICardsPositions = {
          card,
          posX: col * ((card.width + cardSpacing) * card.scaleX) + offsetX,
          posY: row * ((card.height + cardSpacing) * card.scaleY) + offsetY,
        };

        this.cardsPositions = [...this.cardsPositions, position];
        card.setPosition(position.posX, position.posY);
      }
    }
  }

  private eraseCardPositions() {
    this.cardsPositions = [];
  }
}

export { MainScene };
