import { IAdditionalParams, IGameConfig, ISounds } from '../interfaces';
import { activeStyle, commonStyle, cursorMoveStyle, headerStyle, paragraphStyle } from '../utils/fontStyles';

interface IData {
  gameConfig: IGameConfig;
  additionalParams: IAdditionalParams;
  sounds: ISounds;
}

class ConfigScene extends Phaser.Scene {
  difficultiesGroup: Phaser.GameObjects.Group | undefined;
  gameTimeGroup: Phaser.GameObjects.Group | undefined;
  cardBackGroup!: Phaser.GameObjects.Group;
  categoriesGroup!: Phaser.GameObjects.Group;
  prevConfig!: IGameConfig;
  newConfig!: IGameConfig;
  additionalParams!: IAdditionalParams;
  sounds!: ISounds;
  success!: Phaser.GameObjects.Image;

  constructor() {
    super({ key: 'ConfigScene', visible: false });
  }

  create(data: IData) {
    const { gameConfig, additionalParams, sounds } = data;

    console.log('ConfigScene get: ', data);

    this.prevConfig = gameConfig;
    this.newConfig = { ...gameConfig };
    this.difficultiesGroup = this.add.group();
    this.gameTimeGroup = this.add.group();
    this.cardBackGroup = this.add.group();
    this.categoriesGroup = this.add.group();
    this.additionalParams = additionalParams;
    this.sounds = sounds;
    this.success = this.add.image(0, 0, 'successIcon').setVisible(false).setDepth(1);

    this.drawArea();
    this.setApplyButton();
  }

  setApplyButton() {
    const apply = this.add.text(450, 650, 'New game', commonStyle).setInteractive({ useHandCursor: true });
    apply.setOrigin(0.5);
    apply
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        this.scene.setVisible(false);
        this.scene.setActive(false);
        this.scene.launch('MainScene', { gameConfig: this.newConfig });
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_MOVE, () => {
        apply.setStyle(cursorMoveStyle);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        apply.setStyle(commonStyle);
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
      const startPosition = difficultyText.x + difficultyText.width + 70;
      const space = (sceneWidth - startPosition) / this.additionalParams.difficulties.length;
      const positionX = startPosition + (index > 0 ? space * (index * 1) : 0);

      const currentDiff = this.getDifficulty(this.prevConfig.currentDifficulty);
      const isActive = diff.name === currentDiff.name;
      const styles = isActive ? activeStyle : commonStyle;
      const text = this.add
        .text(positionX, rectOffsetY * 5, diff.name)
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
      const startPosition = timeCountText.x + timeCountText.width + 70;
      const space = (sceneWidth - startPosition) / this.additionalParams.timeCountList.length;
      const positionX = startPosition + (index > 0 ? space * (index * 1) : 0);
      // const space = (sceneWidth - timeCountText.width) / this.additionalParams.timeCountList.length;
      // const startPosition = timeCountText.x + timeCountText.width - 20;
      // const positionX = startPosition + space + (index > 0 ? space * (index * 0.6) : 0);
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

    const cardBackVariantText = this.add
      .text(sceneWidth / 6, rectOffsetY * 13, 'Cardback:')
      .setOrigin(0.5)
      .setStyle(paragraphStyle)
      .setInteractive();

    this.additionalParams.cardBackVariants.forEach((cardBack, index) => {
      const startPosition = cardBackVariantText.x + cardBackVariantText.width + 70;
      const space = (sceneWidth - startPosition) / this.additionalParams.cardBackVariants.length;
      const positionX = startPosition + (index > 0 ? space * (index * 1) : 0);
      // const space = (sceneWidth - timeCountText.width) / this.additionalParams.timeCountList.length;
      // const startPosition = timeCountText.x + timeCountText.width - 20;
      // const positionX = startPosition + space + (index > 0 ? space * (index * 0.6) : 0);
      const cardImg = this.add
        .image(positionX, rectOffsetY * 13, cardBack)
        .setOrigin(0.5)
        .setScale(0.4)
        .setInteractive({ useHandCursor: true })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
          // this.newConfig.cardBack = cardBack;
          this.changeCardBackBariant(cardBack);
        });
      if (cardBack === this.prevConfig.cardBack) {
        this.setAsSelect(cardImg, false);
      }
      this.cardBackGroup.add(cardImg);
    });

    const cardCategoriesText = this.add
      .text(sceneWidth / 6, rectOffsetY * 18, 'Category:')
      .setOrigin(0.5)
      .setStyle(paragraphStyle)
      .setInteractive();

    Object.keys(this.additionalParams.categories).forEach((key, index) => {
      const startPosition = cardCategoriesText.x + cardCategoriesText.width + 70;
      const space = (sceneWidth - startPosition) / Object.keys(this.additionalParams.categories).length;
      const positionX = startPosition + (index > 0 ? space * (index * 1) : 0);
      // const space = (sceneWidth - timeCountText.width) / this.additionalParams.timeCountList.length;
      // const startPosition = timeCountText.x + timeCountText.width - 20;
      // const positionX = startPosition + space + (index > 0 ? space * (index * 1) : 0);
      const isActive = key === this.prevConfig.category;
      const style = isActive ? activeStyle : commonStyle;

      const categoryText = this.add
        .text(positionX, rectOffsetY * 18, key.toString())
        .setOrigin(0.5)
        .setStyle(style)
        .setInteractive({ useHandCursor: true })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
          this.changeCategory(key);
        });

      this.categoriesGroup.add(categoryText);
    });
  }

  setAsSelect(obj: Phaser.GameObjects.Image, withTween = true) {
    const posX = obj.x + obj.displayWidth / 4;
    const posY = obj.y + obj.displayHeight / 4;
    this.success.setPosition(posX, posY).setVisible(true);
    if (withTween) {
      this.success.setAlpha(0);
    }
    this.tweens.add({
      targets: this.success,
      duration: 200,
      alpha: 1,
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

  changeCardBackBariant(cardback: string) {
    this.cardBackGroup.children.getArray().forEach((item) => {
      const isActive = (item as Phaser.GameObjects.Image).texture.key === cardback;
      if (isActive) {
        this.setAsSelect(item as Phaser.GameObjects.Image);
      }

      this.newConfig.cardBack = cardback;
      console.log(this.newConfig);
    });
  }

  changeCategory(categoryName: string) {
    this.categoriesGroup.children.getArray().forEach((category) => {
      const isActive = (category as Phaser.GameObjects.Text).text === categoryName;
      const style = isActive ? activeStyle : commonStyle;
      (category as Phaser.GameObjects.Text).setStyle(style);
      this.newConfig.category = categoryName;
      console.log(this.newConfig);
    });
  }
}

export { ConfigScene };
