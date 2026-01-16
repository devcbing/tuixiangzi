/**
 * 首页类
 * 负责渲染首页界面和处理首页按钮事件
 */
import './render'; // 确保canvas被创建和初始化

// 获取canvas对象
const canvas = GameGlobal.canvas;

export default class Home {
    constructor() {
        this.buttons = [];
    }
    
    /**
     * 初始化首页
     */
    init() {
        console.log('首页初始化');
        this.calculateButtonPositions();
    }
    
    /**
     * 计算按钮位置
     */
    calculateButtonPositions() {
        this.buttons = [];
        const buttonWidth = canvas.width * 0.7;
        const buttonHeight = 60;
        const buttonMargin = 20;
        const startY = canvas.height * 0.4;
        
        // 按钮配置
        const homeButtons = [
            { id: 'start', text: '开始游戏' },
            { id: 'history', text: '查看历史记录' },
            { id: 'selectLevel', text: '选择关卡' },
            { id: 'help', text: '帮助' }
        ];
        
        homeButtons.forEach((buttonConfig, index) => {
            const button = {
                id: buttonConfig.id,
                text: buttonConfig.text,
                x: (canvas.width - buttonWidth) / 2,
                y: startY + index * (buttonHeight + buttonMargin),
                width: buttonWidth,
                height: buttonHeight
            };
            this.buttons.push(button);
        });
    }
    
    /**
     * 渲染首页
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
        ctx.fillText('欢迎来到推箱子小游戏', canvas.width / 2, canvas.height * 0.25);
        
        // 绘制按钮
        this.buttons.forEach(button => {
            // 绘制按钮背景（绿色）
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(button.x, button.y, button.width, button.height);
            
            // 绘制按钮边框
            ctx.strokeStyle = '#388E3C';
            ctx.lineWidth = 3;
            ctx.strokeRect(button.x, button.y, button.width, button.height);
            
            // 绘制按钮文字（白色）
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
        });
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