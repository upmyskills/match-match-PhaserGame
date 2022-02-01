import { IAdditionalParams, IData, IGameConfig, ISounds } from '../interfaces';
import { activeStyle, commonStyle, cursorMoveStyle, headerStyle, paragraphStyle } from '../utils/fontStyles';

class ConfigScene extends Phaser.Scene {
  difficultiesList!: Array<Phaser.GameObjects.Text>;
  gameTimeList!: Array<Phaser.GameObjects.Text>;
  cardBackList!: Array<Phaser.GameObjects.Image>;
  categoriesList!: Array<Phaser.GameObjects.Text>;
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

    this.prevConfig = gameConfig;
    this.newConfig = { ...gameConfig };
    this.difficultiesList = [];
    this.gameTimeList = [];
    this.cardBackList = [];
    this.categoriesList = [];
    this.additionalParams = additionalParams;
    this.sounds = sounds;
    this.success = this.add.image(0, 0, 'successIcon').setVisible(false).setDepth(1);

    this.drawArea();
    this.setApplyButton();
    this.setContinueButton();
  }

  setApplyButton() {
    const apply = this.add.text(600, 650, 'New game', commonStyle).setInteractive({ useHandCursor: true });
    apply.setOrigin(0.5);
    apply
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        this.scene.setVisible(false);
        this.scene.setActive(false);
        this.scene.start('MainScene', { gameConfig: this.newConfig });
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_MOVE, () => {
        apply.setStyle(cursorMoveStyle);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        apply.setStyle(commonStyle);
      });
  }

  setContinueButton() {
    const continueBtn = this.add.text(300, 650, 'Return', commonStyle).setInteractive({ useHandCursor: true });
    continueBtn.setOrigin(0.5);
    continueBtn
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        this.scene.setVisible(false);
        this.scene.setActive(false);
        this.scene.run('MainScene');
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_MOVE, () => {
        continueBtn.setStyle(cursorMoveStyle);
      })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
        continueBtn.setStyle(commonStyle);
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

    this.add
      .text(sceneWidth / 2, rectOffsetY, 'Game settings:')
      .setOrigin(0.5)
      .setStyle(headerStyle);

    const difficultyText = this.add
      .text(sceneWidth / 6, rectOffsetY * 5, 'Difficulty:')
      .setOrigin(0.5)
      .setStyle(paragraphStyle)
      .setInteractive();

    this.additionalParams.difficulties.forEach((diff, index) => {
      const coord = this.getItemPositions(difficultyText, this.additionalParams.difficulties, rectOffsetY, 5, index);

      const currentDiff = this.getDifficulty(this.prevConfig.currentDifficulty);
      const isActive = diff.name === currentDiff.name;
      const styles = isActive ? activeStyle : commonStyle;
      const text = this.add
        .text(coord.positionX, coord.positionY, diff.name)
        .setOrigin(0.5)
        .setStyle(styles)
        .setInteractive({ useHandCursor: true });

      text.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        const curr = this.additionalParams.difficulties.map((dfclt) => dfclt.name.toLowerCase() === text.text.toLowerCase());
        this.changeDifficulty(curr.indexOf(true));
      });

      this.difficultiesList = [...this.difficultiesList, text];
    });

    const timeCountText = this.add
      .text(sceneWidth / 6, rectOffsetY * 8, 'Time:')
      .setOrigin(0.5)
      .setStyle(paragraphStyle)
      .setInteractive();

    this.additionalParams.timeCountList.forEach((numb, index) => {
      const coords = this.getItemPositions(timeCountText, this.additionalParams.timeCountList, rectOffsetY, 8, index);

      const isActive = numb === this.prevConfig.gameTime;
      const style = isActive ? activeStyle : commonStyle;
      const text = this.add
        .text(coords.positionX, coords.positionY, numb.toString())
        .setOrigin(0.5)
        .setStyle(style)
        .setInteractive({ useHandCursor: true })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
          this.changeGameTime(text.text);
        });

      this.gameTimeList = [...this.gameTimeList, text];
    });

    const cardBackVariantText = this.add
      .text(sceneWidth / 6, rectOffsetY * 13, 'Cardback:')
      .setOrigin(0.5)
      .setStyle(paragraphStyle)
      .setInteractive();

    this.additionalParams.cardBackVariants.forEach((cardBack, index) => {
      const coords = this.getItemPositions(cardBackVariantText, this.additionalParams.cardBackVariants, rectOffsetY, 13, index);

      const cardImg = this.add
        .image(coords.positionX, coords.positionY, cardBack)
        .setOrigin(0.5)
        .setScale(0.4)
        .setInteractive({ useHandCursor: true })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
          this.changeCardBackVariant(cardBack);
        });
      if (cardBack === this.prevConfig.cardBack) {
        this.setAsSelect(cardImg, false);
      }
      this.cardBackList = [...this.cardBackList, cardImg];
    });

    const cardCategoriesText = this.add
      .text(sceneWidth / 6, rectOffsetY * 18, 'Category:')
      .setOrigin(0.5)
      .setStyle(paragraphStyle)
      .setInteractive();

    const categoryKeys = Object.keys(this.additionalParams.categories);

    categoryKeys.forEach((key, index) => {
      const coords = this.getItemPositions(cardCategoriesText, categoryKeys, rectOffsetY, 18, index);
      const isActive = key === this.prevConfig.category;
      const style = isActive ? activeStyle : commonStyle;

      const categoryText = this.add
        .text(coords.positionX, coords.positionY, key.toString())
        .setOrigin(0.5)
        .setStyle(style)
        .setInteractive({ useHandCursor: true })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
          this.changeCategory(key);
        });

      this.categoriesList = [...this.categoriesList, categoryText];
    });
  }

  getItemPositions(paragraph: Phaser.GameObjects.Text, objList: Array<any>, offsetY: number, row: number, col: number) {
    const add = 70;
    const startPosition = paragraph.x + paragraph.width + add;
    const space = (Number(this.game.config.width) - startPosition) / objList.length;
    const positionX = startPosition + (col > 0 ? space * (col * 1) : 0);
    const positionY = offsetY * row;

    return { positionX, positionY };
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
    this.difficultiesList.forEach((text) => {
      const isActive = (text as Phaser.GameObjects.Text).text === this.getDifficulty(index).name;
      const style = isActive ? activeStyle : commonStyle;
      (text as Phaser.GameObjects.Text).setStyle(style);
    });
    this.newConfig.currentDifficulty = index;
  }

  changeGameTime(sec: number | string) {
    this.gameTimeList.forEach((time) => {
      const isActive = (time as Phaser.GameObjects.Text).text === sec;
      const style = isActive ? activeStyle : commonStyle;
      (time as Phaser.GameObjects.Text).setStyle(style);
    });
    this.newConfig.gameTime = Number(sec);
  }

  changeCardBackVariant(cardback: string) {
    this.cardBackList.forEach((item) => {
      const isActive = (item as Phaser.GameObjects.Image).texture.key === cardback;
      if (isActive) {
        this.setAsSelect(item as Phaser.GameObjects.Image);
      }

      this.newConfig.cardBack = cardback;
    });
  }

  changeCategory(categoryName: string) {
    this.categoriesList.forEach((category) => {
      const isActive = (category as Phaser.GameObjects.Text).text === categoryName;
      const style = isActive ? activeStyle : commonStyle;
      (category as Phaser.GameObjects.Text).setStyle(style);
      this.newConfig.category = categoryName;
    });
  }
}

export { ConfigScene };
