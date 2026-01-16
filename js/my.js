/**
 * 我的页面类
 * 负责渲染我的页面和处理页面事件
 */
import './render'; // 确保canvas被创建和初始化

// 获取canvas对象
const canvas = GameGlobal.canvas;

export default class My {
    constructor() {
        this.buttons = [];
    }
    
    /**
     * 初始化我的页面
     */
    init() {
        console.log('我的页面初始化');
        this.calculateButtonPositions();
    }
    
    /**
     * 计算按钮位置
     */
    calculateButtonPositions() {
        this.buttons = [];
        // 可以在这里添加我的页面的按钮配置
    }
    
    /**
     * 渲染我的页面
     * @param {CanvasRenderingContext2D} ctx - 2D绘图上下文
     * @param {Object} bg - 背景对象
     */
    render(ctx, bg) {
        // 渲染背景
        bg.update();
        bg.render(ctx);
        
        // 绘制标题
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('我的', canvas.width / 2, canvas.height * 0.25);
        
        // 绘制我的页面内容
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('这是我的页面', canvas.width / 2, canvas.height * 0.5);
    }
    
    /**
     * 检测按钮点击
     * @param {Object} touchPos - 点击位置 {x, y}
     * @returns {string|null} - 点击的按钮ID，如果没有点击则返回null
     */
    checkButtonClick(touchPos) {
        for (const button of this.buttons) {
            if (touchPos.x >= button.x && touchPos.x <= button.x + button.width &&
                touchPos.y >= button.y && touchPos.y <= button.y + button.height) {
                return button.id;
            }
        }
        return null;
    }
}