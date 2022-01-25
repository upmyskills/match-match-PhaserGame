export interface ICardsPositions {
  posX: number;
  posY: number;
}

export interface IDifficulty {
  name: string;
  rows: number;
  colls: number;
}

export interface ISounds {
  cardTap: Phaser.Sound.BaseSound;
  themeSound: Phaser.Sound.BaseSound;
  success: Phaser.Sound.BaseSound;
  complete: Phaser.Sound.BaseSound;
  timeisover: Phaser.Sound.BaseSound;
}

export interface ICustomSprite {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string | Phaser.Textures.Texture;
  scale: number;
  secret: string;
}

export interface ICardChangePosition {
  index: number;
  posX?: number;
  posY?: number;
}