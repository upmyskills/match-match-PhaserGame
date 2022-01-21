import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'content',
  scene: [MainScene],
};

const game = new Phaser.Game(gameConfig);
