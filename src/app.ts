import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';
import { ConfigScene } from './scenes/ConfigScene';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { EndGameScene } from './scenes/EndGameScene';
import './index.scss';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 900,
  height: 700,
  parent: 'content',
  scene: [BootScene, PreloadScene, MainScene, ConfigScene, EndGameScene],
};

const game = new Phaser.Game(gameConfig);
