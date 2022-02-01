import { commonStyle, cursorMoveStyle, paragraphStyle } from '../utils/fontStyles';
import { IData, IEndGameStatus } from '../interfaces';

class EndGameScene extends Phaser.Scene {
  constructor() {
    super('EndGameScene');
  }

  create(data: IEndGameStatus) {
    const center = Number(this.game.config.width) / 2;
    const offsetY = 20;
    const gameStatus = data.isWin ? 'You win!' : 'You lose!';
    const config: IData = {
      gameConfig: data.config.gameConfig,
      additionalParams: data.config.additionalParams,
      sounds: data.config.sounds,
    };

    this.createParagraph(gameStatus, center, offsetY * 4, '');
    this.createParagraph('Guessed pairs:', center, offsetY * 7, data.guessedPairs);
    this.createParagraph('Difficulty:', center, offsetY * 10, data.difficulty);
    this.createParagraph('Category:', center, offsetY * 13, data.gameCategory);
    this.createParagraph('Elapsed time:', center, offsetY * 16, data.elapsedTime);
    this.createParagraph('Incorrect answers:', center, offsetY * 19, data.incorrectAnsw);

    this.createButton('Settings', () => this.scene.start('ConfigScene', config), center + 200, 600);
  }

  createParagraph(text: string, x: number, y: number, val: string | number) {
    const caption = this.add.text(x, y, `${text} ${val}`, paragraphStyle);
    caption.setOrigin(0.5);
  }

  createButton(caption: string, callback: () => void, x: number, y: number) {
    const button = this.add.text(x, y, caption, commonStyle);
    button.setInteractive({ useHandCursor: true });
    button
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_MOVE, () => {
        button.setStyle(cursorMoveStyle);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        button.setStyle(commonStyle);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback);
  }
}

export { EndGameScene };
