class ConfigScene extends Phaser.Scene {
  constructor() {
    super('ConfigScene');
  }

  create(data: any) {
    this.input.on('gameobjectdown', (pointer: any, obj: any) => {
      console.log(pointer, obj.text);
    });

    const apply = this.add.text(100, 100, 'ConfigScene', { fontSize: '32px', fontStyle: 'bold' }).setInteractive();
    apply.on('pointerdown', () => {
      this.scene.start('MainScene');
    });

    this.add.text(200, 200, 'Easy', { fontSize: '32px', fontStyle: 'bold' }).setInteractive();
    this.add.text(400, 200, 'Normal', { fontSize: '32px', fontStyle: 'bold' }).setInteractive();
    this.add.text(600, 200, 'Hard', { fontSize: '32px', fontStyle: 'bold' }).setInteractive();

    this.add.text(450, 500, `${data.isComplete} --- ${data.guessedCardsCount}`, { color: 'red' }).setInteractive();
  }
}

export { ConfigScene };
