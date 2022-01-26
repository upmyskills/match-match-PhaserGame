interface IButtonParams {
  scene: Phaser.Scene;
  type: string;
  posX: number;
  posY: number;
  label: string;
  style: Phaser.Types.GameObjects.Text.TextStyle;
  callback?: (pointer: any, obj: any) => void;
}

class ActiveText extends Phaser.GameObjects.Text {
  constructor(params: IButtonParams) {
    super(params.scene, params.posX, params.posY, params.label, params.style);
    this.setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, params.callback || this.doThis, this);
  }

  private doThis() {
    console.log(this.text, 'summon inner callback!');
  }

  public getText() {
    return this;
  }
}

export { ActiveText };
