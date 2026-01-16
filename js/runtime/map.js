import Sprite from '../base/sprite';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import { maps } from '../levelsdata/levelsdata';

// 游戏元素图片路径
const WALL_IMAGE_SRC = 'images/wall.png';
const FLOOR_IMAGE_SRC = 'images/stone.png';
const DIAMOND_IMAGE_SRC = 'images/diamond.png';
const BOX_IMAGE_SRC = 'images/box.png';
const PLAYER_IMAGE_SRC = 'images/bird.png';

// 元素大小
const ELEMENT_SIZE = 40;

/**
 * 游戏地图类
 * 根据关卡数据生成推箱子布局
 */
export default class Map {
  constructor(level = 0) {
    this.level = level;
    this.currentMap = maps[this.level];
    this.elements = [];
    this.player = null;
    this.boxes = [];
    this.diamonds = [];
    this.offsetX = 0; // 地图水平偏移量，用于居中显示
    this.offsetY = 0; // 地图垂直偏移量，用于居中显示
    
    this.init();
  }
  
  init() {
    // 根据地图数据生成元素
    this.elements = [];
    this.boxes = [];
    this.diamonds = [];
    
    // 计算地图大小
    const mapWidth = this.currentMap[0].length * ELEMENT_SIZE;
    const mapHeight = this.currentMap.length * ELEMENT_SIZE;
    
    // 计算居中偏移量
    this.offsetX = Math.max(0, (SCREEN_WIDTH - mapWidth) / 2);
    this.offsetY = Math.max(0, (SCREEN_HEIGHT - mapHeight) / 2);
    
    for (let row = 0; row < this.currentMap.length; row++) {
      for (let col = 0; col < this.currentMap[row].length; col++) {
        const element = this.currentMap[row][col];
        const x = col * ELEMENT_SIZE + this.offsetX;
        const y = row * ELEMENT_SIZE + this.offsetY;
        
        let sprite = null;
        
        switch (element) {
          case 1: // 墙体
            sprite = new Sprite(WALL_IMAGE_SRC, ELEMENT_SIZE, ELEMENT_SIZE, x, y);
            this.elements.push(sprite);
            break;
          case 2: // 通路
            sprite = new Sprite(FLOOR_IMAGE_SRC, ELEMENT_SIZE, ELEMENT_SIZE, x, y);
            this.elements.push(sprite);
            break;
          case 3: // 终点（钻石）
            // 先绘制通路
            const floorSprite = new Sprite(FLOOR_IMAGE_SRC, ELEMENT_SIZE, ELEMENT_SIZE, x, y);
            this.elements.push(floorSprite);
            
            // 再绘制钻石
            sprite = new Sprite(DIAMOND_IMAGE_SRC, ELEMENT_SIZE, ELEMENT_SIZE, x, y);
            this.elements.push(sprite);
            this.diamonds.push({ x: col, y: row });
            break;
          case 4: // 箱子
            // 先绘制通路
            const floorSprite2 = new Sprite(FLOOR_IMAGE_SRC, ELEMENT_SIZE, ELEMENT_SIZE, x, y);
            this.elements.push(floorSprite2);
            
            // 再绘制箱子
            sprite = new Sprite(BOX_IMAGE_SRC, ELEMENT_SIZE, ELEMENT_SIZE, x, y);
            this.elements.push(sprite);
            this.boxes.push({ x: col, y: row, sprite });
            break;
          case 5: // 人物
            // 先绘制通路
            const floorSprite3 = new Sprite(FLOOR_IMAGE_SRC, ELEMENT_SIZE, ELEMENT_SIZE, x, y);
            this.elements.push(floorSprite3);
            
            // 再绘制人物
            sprite = new Sprite(PLAYER_IMAGE_SRC, ELEMENT_SIZE, ELEMENT_SIZE, x, y);
            this.elements.push(sprite);
            this.player = { x: col, y: row, sprite };
            break;
          // 0 - 外围，不需要绘制
        }
      }
    }
  }
  
  render(ctx) {
    // 渲染所有元素
    this.elements.forEach(element => {
      element.render(ctx);
    });
  }
  
  // 更新关卡
  setLevel(level) {
    this.level = level;
    this.currentMap = maps[this.level];
    this.init();
  }
  
  // 获取当前关卡
  getLevel() {
    return this.level;
  }
  
  /**
   * 检查游戏是否完成
   * @returns {boolean} - 游戏是否完成
   */
  checkGameComplete() {
    // 检查所有钻石位置是否都有箱子
    for (const diamond of this.diamonds) {
      if (this.currentMap[diamond.y][diamond.x] !== 4) {
        return false;
      }
    }
    return true;
  }
}