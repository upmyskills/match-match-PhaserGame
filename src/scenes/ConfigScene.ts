import { IAdditionalParams, IGameConfig } from '../interfaces';
import { activeStyle, commonStyle, headerStyle, paragraphStyle } from '../utils/fontStyles';

interface IData {
  gameConfig: IGameConfig;
  additionalParams: IAdditionalParams;
}

class ConfigScene extends Phaser.Scene {
  difficultiesGroup: Phaser.GameObjects.Group | undefined;
  gameTimeGroup: Phaser.GameObjects.Group | undefined;
  prevConfig!: IGameConfig;
  newConfig!: IGameConfig;
  additionalParams!: IAdditionalParams;

  constructor() {
    super({ key: 'ConfigScene', visible: false });
  }

  create(data: IData) {
    const { gameConfig, additionalParams } = data;

    console.log('ConfigScene get: ', data);

    this.prevConfig = gameConfig;
    this.newConfig = { ...gameConfig };
    this.difficultiesGroup = this.add.group();
    this.gameTimeGroup = this.add.group();
    this.additionalParams = additionalParams;

    this.drawArea();
    this.setApplyButton();
  }

  setApplyButton() {
    const apply = this.add.text(450, 500, 'Apply', commonStyle).setInteractive();

    apply.on('pointerdown', () => {
      this.scene.setVisible(false);
      this.scene.launch('MainScene', { gameConfig: this.newConfig });
    });
  }

  drawArea() {
    const sceneWidth = Number(this.game.config.width);
    const sceneHeight = Number(this.game.config.height);
    const rectOffsetX = 20;
    const rectOffsetY = 20;
    const graph = this.add.graphics();

    graph.fillStyle(0xeeeeee, 0.8);
    graph.fillRoundedRect(rectOffsetX, rectOffsetY, sceneWidth - rectOffsetX * 2, sceneHeight - rectOffsetY * 2, 12);

    const headerText = this.add
      .text(sceneWidth / 2, rectOffsetY, 'Game settings:')
      .setOrigin(0.5)
      .setStyle(headerStyle);

    const difficultyText = this.add
      .text(sceneWidth / 6, rectOffsetY * 5, 'Difficulty:')
      .setOrigin(0.5)
      .setStyle(paragraphStyle)
      .setInteractive();

    this.additionalParams.difficulties.forEach((diff, index) => {
      const currentDiff = this.getDifficulty(this.prevConfig.currentDifficulty);
      const isActive = diff.name === currentDiff.name;
      const styles = isActive ? activeStyle : commonStyle;
      const text = this.add
        .text((sceneWidth / 5) * (index + 1) + difficultyText.width, rectOffsetY * 5, diff.name)
        .setOrigin(0.5)
        .setStyle(styles)
        .setInteractive({ useHandCursor: true });

      text.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        const curr = this.additionalParams.difficulties.map((dfclt) => dfclt.name.toLowerCase() === text.text.toLowerCase());
        this.changeDifficulty(curr.indexOf(true));
      });

      this.difficultiesGroup?.add(text);
    });

    const timeCountText = this.add
      .text(sceneWidth / 6, rectOffsetY * 8, 'Time:')
      .setOrigin(0.5)
      .setStyle(paragraphStyle)
      .setInteractive();

    this.additionalParams.timeCountList.forEach((numb, index) => {
      const space = (sceneWidth - timeCountText.width) / this.additionalParams.timeCountList.length;
      const startPosition = timeCountText.x + timeCountText.width - 20;
      const positionX = startPosition + space + (index > 0 ? space * (index * 0.6) : 0);
      const isActive = numb === this.prevConfig.gameTime;
      const style = isActive ? activeStyle : commonStyle;
      const text = this.add
        .text(positionX, rectOffsetY * 8, numb.toString())
        .setOrigin(0.5)
        .setStyle(style)
        .setInteractive({ useHandCursor: true })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
          this.changeGameTime(text.text);
        });
      this.gameTimeGroup?.add(text);
    });
  }

  getDifficulty(diff: number) {
    const [difficulty] = this.additionalParams.difficulties.slice(diff);
    return difficulty;
  }

  changeDifficulty(index: number) {
    this.difficultiesGroup?.children.getArray().forEach((text) => {
      const isActive = (text as Phaser.GameObjects.Text).text === this.getDifficulty(index).name;
      const style = isActive ? activeStyle : commonStyle;
      (text as Phaser.GameObjects.Text).setStyle(style);
    });
    this.newConfig.currentDifficulty = index;
    console.log(this.newConfig);
  }

  changeGameTime(sec: number | string) {
    this.gameTimeGroup?.children.getArray().forEach((time) => {
      const isActive = (time as Phaser.GameObjects.Text).text === sec;
      const style = isActive ? activeStyle : commonStyle;
      (time as Phaser.GameObjects.Text).setStyle(style);
    });
    this.newConfig.gameTime = Number(sec);
    console.log(this.newConfig);
  }
}

export { ConfigScene };
