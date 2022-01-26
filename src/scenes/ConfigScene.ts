import { IDifficulty } from '../interfaces';
import { activeStyle, commonStyle, headerStyle, paragraphStyle } from '../utils/fontStyles';

interface ICurrentConfig {
  gameTime?: number;
  cardBack?: string;
  currentDifficulty?: IDifficulty;
  difficulties: Array<IDifficulty>;
  timeCountList?: Array<number>;
}

class ConfigScene extends Phaser.Scene {
  prevConfig!: ICurrentConfig;
  difficultiesGroup: Phaser.GameObjects.Group | undefined;
  gameTimeGroup: Phaser.GameObjects.Group | undefined;
  newConfig!: ICurrentConfig;

  constructor() {
    super({ key: 'ConfigScene', visible: false });
  }

  create(prevConfig: ICurrentConfig) {
    console.log('We get: ', prevConfig);
    this.prevConfig = prevConfig;
    this.newConfig = prevConfig;
    this.difficultiesGroup = this.add.group();
    this.gameTimeGroup = this.add.group();

    this.drawArea();
    this.setApplyButton();
  }

  setApplyButton() {
    const apply = this.add.text(100, 100, 'Apply', commonStyle).setInteractive();

    apply.on('pointerdown', () => {
      this.scene.setVisible(false);
      this.scene.run('MainScene', this.newConfig);
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

    this.prevConfig?.difficulties?.forEach((diff, index) => {
      const isActive = diff.name === this.prevConfig?.currentDifficulty?.name;
      const styles = isActive ? activeStyle : commonStyle;
      const text = this.add
        .text((sceneWidth / 5) * (index + 1) + difficultyText.width, rectOffsetY * 5, diff.name)
        .setOrigin(0.5)
        .setStyle(styles)
        .setInteractive({ useHandCursor: true });

      text.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        const [curr] = this.prevConfig.difficulties.filter((dfclt) => dfclt.name.toLowerCase() === text.text.toLowerCase());
        this.changeDifficulty(curr);
      });

      this.difficultiesGroup?.add(text);
    });

    const timeCountText = this.add
      .text(sceneWidth / 6, rectOffsetY * 7, 'Time:')
      .setOrigin(0.5)
      .setStyle(paragraphStyle)
      .setInteractive();

    this.prevConfig.timeCountList?.forEach((numb, index) => {
      const text = this.add
        .text(sceneWidth / this.prevConfig.timeCountList!.length + timeCountText.width, rectOffsetY * 7, numb.toString())
        .setOrigin(0.5)
        .setStyle(commonStyle)
        .setInteractive({ useHandCursor: true });
    });
  }

  changeDifficulty(diff: IDifficulty) {
    // this.newConfig?.currentDifficulty = ;
    // this.prevConfig?.difficulties.filter((element) => {
    //   element.name ===
    // });
    this.difficultiesGroup?.children.getArray().forEach((text) => {
      const isActive = (text as Phaser.GameObjects.Text).text === diff.name;
      const style = isActive ? activeStyle : commonStyle;
      (text as Phaser.GameObjects.Text).setStyle(style);
    });
    this.newConfig.currentDifficulty = diff;
    console.log(this.newConfig);
  }
}

export { ConfigScene };
