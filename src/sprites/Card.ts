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

  constructor(cardObj: ICustomSprite) {
    super(cardObj.scene, cardObj.x, cardObj.y, cardObj.texture);
    cardObj.scene.add.existing(this);
    this.setOrigin(0, 0);
    this.setScale(cardObj.scale);
    this.setInteractive();
    this.secretValue = cardObj.secret;

    // this.on('pointerdown', this.flipCard, this);        /*  like as Eventlistener  */
    this.cardBack = cardObj.texture as string;
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

  public compareWith(card: Card) {
    return this.secretValue === card.getSecret();
  }
}

export { Card };
