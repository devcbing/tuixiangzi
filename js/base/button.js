// 按钮大小
const BUTTON_SIZE = 60;

/**
 * 按钮类
 * 用于创建可点击的游戏按钮
 */
export default class Button {
  constructor(type, x, y, width = BUTTON_SIZE, height = BUTTON_SIZE) {
    this.type = type; // 'up', 'down', 'left', 'right'
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isPressed = false;
    this.onClick = null;
  }
  
  /**
   * 检测点击事件
   * @param {Object} touchPos - 点击位置 {x, y}
   */
  checkClick(touchPos) {
    if (touchPos.x >= this.x && touchPos.x <= this.x + this.width &&
        touchPos.y >= this.y && touchPos.y <= this.y + this.height) {
      this.isPressed = true;
      if (this.onClick) {
        this.onClick();
      }
      return true;
    }
    return false;
  }
  
  /**
   * 渲染按钮
   * @param {CanvasRenderingContext2D} ctx - 2D绘图上下文
   */
  render(ctx) {
    // 绘制按钮阴影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(this.x + 5, this.y + 5, this.width, this.height);
    
    // 绘制按钮背景
    ctx.fillStyle = this.isPressed ? '#cccccc' : '#ffffff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // 绘制按钮边框
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // 绘制箭头符号
    this.drawArrow(ctx);
    
    // 重置按钮状态
    this.isPressed = false;
  }
  
  /**
   * 绘制箭头符号
   * @param {CanvasRenderingContext2D} ctx - 2D绘图上下文
   */
  drawArrow(ctx) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const arrowSize = this.width / 2;
    
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    
    switch (this.type) {
      case 'up':
        ctx.moveTo(centerX, centerY - arrowSize);
        ctx.lineTo(centerX - arrowSize, centerY + arrowSize);
        ctx.lineTo(centerX + arrowSize, centerY + arrowSize);
        break;
      case 'down':
        ctx.moveTo(centerX, centerY + arrowSize);
        ctx.lineTo(centerX - arrowSize, centerY - arrowSize);
        ctx.lineTo(centerX + arrowSize, centerY - arrowSize);
        break;
      case 'left':
        ctx.moveTo(centerX - arrowSize, centerY);
        ctx.lineTo(centerX + arrowSize, centerY - arrowSize);
        ctx.lineTo(centerX + arrowSize, centerY + arrowSize);
        break;
      case 'right':
        ctx.moveTo(centerX + arrowSize, centerY);
        ctx.lineTo(centerX - arrowSize, centerY - arrowSize);
        ctx.lineTo(centerX - arrowSize, centerY + arrowSize);
        break;
    }
    
    ctx.closePath();
    ctx.fill();
  }
}