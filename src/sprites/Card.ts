interface ICustomSprite {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string | Phaser.Textures.Texture;
  scale: number;
  secret: string;
}

class Card extends Phaser.GameObjects.Sprite {
  private secretValue: string;
  private isFlipped = false;
  private cardBack: string;
  private direction: boolean;
  private step = 0.03;
  private isGuessed = false;

  constructor(cardObj: ICustomSprite) {
    super(cardObj.scene, cardObj.x, cardObj.y, cardObj.texture);
    cardObj.scene.add.existing(this);
    // this.setOrigin(0, 0);
    this.setScale(cardObj.scale);
    this.secretValue = cardObj.secret;

    // this.on('pointerdown', this.flipCard, this);        /*  like as Eventlistener  */
    this.cardBack = cardObj.texture as string;
    this.direction = Math.random() * 10 - 5 > 0;
    this.setAngle(Math.random() * 3);
    this.setInteractive();
  }

  public flipCard() {
    this.isFlipped = true;
    this.setTexture(this.secretValue);
  }

  public closeCard() {
    this.isFlipped = false;
    this.setTexture(this.cardBack);
  }

  public isNotFlipped() {
    return !this.isFlipped;
  }

  public getSecret() {
    return this.secretValue;
  }

  public getDirection() {
    return this.direction;
  }

  public getStep() {
    return this.step;
  }

  public changeDirection() {
    this.direction = !this.direction;
  }

  public setStep(step: number) {
    this.step = step;
  }

  public compareWith(card: Card) {
    return this.secretValue === card.getSecret();
  }

  public getGuessStatus() {
    return this.isGuessed;
  }

  public guessed() {
    this.isGuessed = true;
  }
}

export { Card };
