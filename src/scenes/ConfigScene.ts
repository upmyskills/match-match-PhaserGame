import { Button } from '../components/Button';
import { IDifficulty } from '../interfaces';
import { activeStyle, commonStyle, headerStyle, paragraphStyle } from '../utils/fontStyles';

interface ICurrentConfig {
  gameTime?: number;
  cardBack?: string;
  currentDifficulty?: IDifficulty;
  difficulties?: Array<IDifficulty>;
}

class ConfigScene extends Phaser.Scene {
  currentConfig: ICurrentConfig | undefined;
  constructor() {
    super({ key: 'ConfigScene', visible: false });
  }

  create(currentConfig: ICurrentConfig) {
    console.log(currentConfig);
    this.currentConfig = currentConfig;
    this.drawArea();
    // const apply = this.add.text(100, 100, 'ConfigScene', { fontSize: '32px', fontStyle: 'bold' }).setInteractive();

    // apply.on('pointerdown', () => {
    //   this.scene.setVisible(false);
    //   this.scene.resume('MainScene');
    // });
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
      .text(sceneWidth / 7, rectOffsetY * 4, 'Difficylty:', { fontSize: '28px', fontStyle: 'bold' })
      .setOrigin(0.5)
      .setStyle(paragraphStyle);

    const difficultiesGroup = this.add.group();
    const gameTimeGroup = this.add.group();

    this.currentConfig?.difficulties?.forEach((diff, index) => {
      const isActive = diff.name === this.currentConfig?.currentDifficulty?.name;
      const dfc = this.add
        .text((sceneWidth / 5) * (index + 1) + difficultyText.width, rectOffsetY * 4, diff.name, { fontSize: '22px' })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setStyle(commonStyle);

      if (isActive) dfc.setStyle(activeStyle);
      difficultiesGroup.add(dfc);
    });

    console.log('GROUP:', difficultiesGroup);
  }
}

export { ConfigScene };
