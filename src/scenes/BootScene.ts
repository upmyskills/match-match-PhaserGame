import bgImage from '../assets/sprites/backgrounds/background.png';

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image('bgImage', bgImage);
  }

  create() {
    this.add.image(Number(this.game.config.width) / 2, Number(this.game.config.height) / 2, 'bgImage').setOrigin(0.5);
    this.scene.launch('PreloadScene');
  }
}

export { BootScene };
