import bgImage from '../assets/sprites/backgrounds/background.png';

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image('bgImage', bgImage);
  }

  create() {
    const gb = this.add.image(Number(this.game.config.width) / 2, Number(this.game.config.height) / 2, 'bgImage').setOrigin(0.5);
    gb.scene.tweens.add({
      targets: gb,
      duration: 5000,
      delay: 500,
      repeat: -1,
      scale: 1.05,
      yoyo: true,
    });

    this.scene.launch('PreloadScene');
  }
}

export { BootScene };
