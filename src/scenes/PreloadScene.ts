import cardbackImage from '../assets/sprites/cardback/back1.png';
import cardback_v2 from '../assets/sprites/cardback/back2.png';
import cardback_v3 from '../assets/sprites/cardback/back3.png';
import cardback_v4 from '../assets/sprites/cardback/back4.png';
import cardTapSound from '../assets/sounds/card.mp3';
import themeSound from '../assets/sounds/theme.mp3';
import successSound from '../assets/sounds/success.mp3';
import completeSound from '../assets/sounds/complete.mp3';
import timeisoverSound from '../assets/sounds/timeout.mp3';
import successIcon from '../assets/sprites/utils/success.png';
import { ICategories, ISounds } from '../interfaces';
import { commonStyle, headerStyle } from '../utils/fontStyles';

class PreloadScene extends Phaser.Scene {
  sounds!: ISounds;
  variants: ICategories = { ocean: [], airplanes: [], radioppl: [] };

  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.image('cardbackImage', cardbackImage);
    this.load.image('cardback_v2', cardback_v2);
    this.load.image('cardback_v3', cardback_v3);
    this.load.image('cardback_v4', cardback_v4);

    this.load.audio('cardTapSound', cardTapSound);
    this.load.audio('themeSound', themeSound);
    this.load.audio('timeisoverSound', timeisoverSound);
    this.load.audio('successSound', successSound);
    this.load.audio('completeSound', completeSound);

    this.load.image('successIcon', successIcon);

    this.initPictures();
    this.initFonts();
  }

  create() {
    this.initSounds();
    const cardBackVariants = ['cardbackImage', 'cardback_v2', 'cardback_v3', 'cardback_v4'];
    this.scene.start('MainScene', {
      sounds: this.sounds,
      cardBackVariants,
      categories: this.variants,
    });
  }

  private initSounds() {
    this.sounds = {
      cardTap: this.sound.add('cardTapSound', { volume: 0.8 }),
      themeSound: this.sound.add('themeSound', { volume: 0.5 }),
      complete: this.sound.add('completeSound'),
      timeisover: this.sound.add('timeisoverSound'),
      success: this.sound.add('successSound'),
    };

    this.sounds.themeSound.play({ loop: true });
  }

  private initPictures() {
    const pathToImages = '../media/cards';
    const oceanimages = 16;
    const airplanesimages = 15;
    const radiopplaimages = 24;

    this.loadCategory('ocean', oceanimages, pathToImages);
    this.loadCategory('airplanes', airplanesimages, pathToImages);
    this.loadCategory('radioppl', radiopplaimages, pathToImages);
  }

  private loadCategory(categoryName: string, filesCount: number, pathToDir: string) {
    for (let i = 0; i < filesCount; i += 1) {
      const category = categoryName;
      const number = i + 1 < 10 ? `0${i + 1}` : i + 1;
      const fileName = `${category}_${number}`;
      this.load.image(fileName, `${pathToDir}/${categoryName}/${fileName}.png`);
      this.variants[categoryName].push(fileName);
    }
  }

  private initFonts() {
    this.add.text(0, 0, '', commonStyle);
    this.add.text(0, 0, '', headerStyle);
  }
}

export { PreloadScene };
