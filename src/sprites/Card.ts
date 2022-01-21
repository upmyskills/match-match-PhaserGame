interface ICustomSprite {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string | Phaser.Textures.Texture;
  scale: number;
}

class Card extends Phaser.GameObjects.Sprite {
  constructor(cardObj: ICustomSprite) {
    super(cardObj.scene, cardObj.x, cardObj.y, cardObj.texture);
    cardObj.scene.add.existing(this);
    this.setOrigin(0, 0);
    this.setScale(cardObj.scale);
  }
}

export { Card };
