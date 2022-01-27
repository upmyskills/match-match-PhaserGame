import cardbackImage from '../assets/sprites/cardback/back1.png';
import cardTapSound from '../assets/sounds/card.mp3';
import themeSound from '../assets/sounds/theme.mp3';
import successSound from '../assets/sounds/success.mp3';
import completeSound from '../assets/sounds/complete.mp3';
import timeisoverSound from '../assets/sounds/timeout.mp3';
import { ISounds } from '../interfaces';

class PreloadScene extends Phaser.Scene {
  sounds!: ISounds;
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.image('cardbackImage', cardbackImage);

    this.load.audio('cardTapSound', cardTapSound);
    this.load.audio('themeSound', themeSound);
    this.load.audio('timeisoverSound', timeisoverSound);
    this.load.audio('successSound', successSound);
    this.load.audio('completeSound', completeSound);
  }

  create() {
    this.initSounds();
    this.scene.launch('MainScene', { sounds: this.sounds });
  }

  private initSounds() {
    this.sounds = {
      cardTap: this.sound.add('cardTapSound', { volume: 0.05 }),
      themeSound: this.sound.add('themeSound', { volume: 0.05 }),
      complete: this.sound.add('completeSound'),
      timeisover: this.sound.add('timeisoverSound'),
      success: this.sound.add('successSound'),
    };

    this.sounds.themeSound.play({ loop: true });
  }
}

export { PreloadScene };
