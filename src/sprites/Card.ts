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
  private baseScale;

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
    this.baseScale = cardObj.scale;
  }

  public flipCardAnim(texture: string) {
    const conf = {
      targets: this,
      scaleX: 0,
      ease: 'Linear',
      duration: 150,
      onComplete: () => this.changeTexture(texture),
    };
    this.scene.tweens.add(conf);
  }

  public changeTexture(texture: string) {
    const conf = {
      targets: this,
      scaleX: this.baseScale,
      ease: 'Linear',
      duration: 150,
    };

    this.setTexture(texture);
    this.scene.tweens.add(conf);
  }

  public flipCard() {
    this.isFlipped = true;
    this.flipCardAnim(this.secretValue);
  }

  public closeCard() {
    this.isFlipped = false;
    this.flipCardAnim(this.cardBack);
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
    return this.direction ? this.step : -this.step;
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
