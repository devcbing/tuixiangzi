import Sprite from '../base/sprite';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

const BACKGROUND_IMAGE_SRC = 'images/background.jpg';
const BACKGROUND_WIDTH = 512;
const BACKGROUND_HEIGHT = 512;
const BACKGROUND_SPEED = 2;

/**
 * 游戏背景类
 * 提供 update 和 render 函数实现无限滚动的背景功能
 */
export default class BackGround extends Sprite {
  constructor() {
    super(BACKGROUND_IMAGE_SRC, BACKGROUND_WIDTH, BACKGROUND_HEIGHT);
    this.top = 0;
  }

  update() {
    // 背景静止，不需要更新位置
  }

  /**
   * 背景图重绘函数
   * 绘制一张静止的背景图片
   */
  render(ctx) {
    // 绘制背景图片，覆盖整个屏幕
    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      0,
      0,
      SCREEN_WIDTH,
      SCREEN_HEIGHT
    );
  }
}
