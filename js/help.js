/**
 * 帮助页面类
 * 负责渲染帮助页面和处理页面事件
 */
import './render'; // 确保canvas被创建和初始化

// 获取canvas对象
const canvas = GameGlobal.canvas;

export default class Help {
    constructor() {
        this.buttons = [];
    }
    
    /**
     * 初始化帮助页面
     */
    init() {
        console.log('帮助页面初始化');
        this.calculateButtonPositions();
    }
    
    /**
     * 计算按钮位置
     */
    calculateButtonPositions() {
        this.buttons = [];
        
        // 返回首页按钮（左上角模拟微信返回组件）
        const backButton = {
            id: 'back',
            text: '', // 不显示文字，只显示图标
            x: 20, // 左上角位置
            y: 20,
            width: 50,
            height: 50
        };
        
        this.buttons.push(backButton);
    }
    
    /**
     * 渲染帮助页面
     * @param {CanvasRenderingContext2D} ctx - 2D绘图上下文
     * @param {Object} bg - 背景对象
     */
    render(ctx, bg) {
        // 渲染背景
        bg.update();
        bg.render(ctx);
        
        // 绘制标题
        ctx.fillStyle = '#000000ff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏帮助', canvas.width / 2, canvas.height * 0.2);
        
        // 绘制帮助内容
        const helpText = [
            '游戏目标：',
            '将所有箱子推到指定的位置',
            '',
            '操作方法：',
            '使用方向键控制角色移动',
            '推动箱子到目标位置即可过关',
            '',
            '游戏规则：',
            '1. 角色只能推动箱子，不能拉动',
            '2. 箱子只能推动一个',
            '3. 所有箱子都到达目标位置后，游戏过关'
        ];
        
        ctx.fillStyle = '#000000ff';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        
        helpText.forEach((line, index) => {
            ctx.fillText(line, canvas.width / 2, canvas.height * 0.3 + index * 30);
        });
        
        // 绘制返回按钮（模拟微信自带的返回组件）
        this.buttons.forEach(button => {
            if (button.id === 'back') {
                // 绘制返回图标（左箭头）
                ctx.fillStyle = '#000000ff';
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