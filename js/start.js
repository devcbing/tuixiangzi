/**
 * 开始游戏页面类
 * 负责渲染开始游戏页面和处理页面事件
 */
import './render'; // 确保canvas被创建和初始化

// 获取canvas对象
const canvas = GameGlobal.canvas;

export default class Start {
    constructor() {
        this.buttons = [];
    }
    
    /**
     * 初始化开始游戏页面
     */
    init() {
        console.log('开始游戏页面初始化');
        this.calculateButtonPositions();
    }
    
    /**
     * 计算按钮位置
     */
    calculateButtonPositions() {
        this.buttons = [];
        const buttonWidth = canvas.width * 0.7;
        const buttonHeight = 60;
        const buttonMargin = 30;
        const startY = canvas.height * 0.5;
        
        // 开始游戏按钮
        const startButton = {
            id: 'play',
            text: '开始游戏',
            x: (canvas.width - buttonWidth) / 2,
            y: startY,
            width: buttonWidth,
            height: buttonHeight
        };
        
        // 返回首页按钮（左上角模拟微信返回组件）
        const backButton = {
            id: 'back',
            text: '', // 不显示文字，只显示图标
            x: 20, // 左上角位置
            y: 20,
            width: 50,
            height: 50
        };
        
        this.buttons.push(backButton, startButton);
    }
    
    /**
     * 渲染开始游戏页面
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
        ctx.fillText('开始游戏', canvas.width / 2, canvas.height * 0.2);
        
        // 绘制页面内容
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('点击开始按钮进入游戏', canvas.width / 2, canvas.height * 0.4);
        
        // 绘制按钮
        this.buttons.forEach(button => {
            if (button.id === 'back') {
                // 绘制返回图标（左箭头，模拟微信自带的返回组件）
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.moveTo(button.x + button.width - 15, button.y + 15);
                ctx.lineTo(button.x + 15, button.y + button.height / 2);
                ctx.lineTo(button.x + button.width - 15, button.y + button.height - 15);
                ctx.lineTo(button.x + button.width - 5, button.y + button.height / 2);
                ctx.lineTo(button.x + button.width - 15, button.y + 15);
                ctx.closePath();
                ctx.fill();
                
                // 绘制按钮区域边框（方便调试，可根据需要移除）
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.strokeRect(button.x, button.y, button.width, button.height);
            } else {
                // 绘制其他按钮（开始游戏）
                // 绘制按钮背景
                ctx.fillStyle = '#4CAF50';
                ctx.fillRect(button.x, button.y, button.width, button.height);
                
                // 绘制按钮边框
                ctx.strokeStyle = '#388E3C';
                ctx.lineWidth = 3;
                ctx.strokeRect(button.x, button.y, button.width, button.height);
                
                // 绘制按钮文字
                ctx.fillStyle = '#ffffff';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
            }
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