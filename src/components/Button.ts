interface IButtonParams {
  scene: Phaser.Scene;
  type: string;
  posX: number;
  posY: number;
  label: string;
  callback?: () => void;
}

class Button extends Phaser.GameObjects.Container {
  constructor(params: IButtonParams) {
    super(params.scene);
    const button = params.scene.add.text(params.posX, params.posY, params.label);

    // button.setOrigin(0.5);

    button.setStyle({ fill: '#0f0' });
    button.setInteractive({ useHandCursor: true });
    button.on(Phaser.Input.Events.POINTER_DOWN, this.doThis);
    console.log(button);
  }

  private doThis() {
    console.log(this);
  }
}

export { Button };
