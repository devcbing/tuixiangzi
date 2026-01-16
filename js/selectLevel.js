/**
 * 选择关卡页面类
 * 负责渲染选择关卡页面和处理页面事件
 */
import './render'; // 确保canvas被创建和初始化

// 获取canvas对象
const canvas = GameGlobal.canvas;

export default class SelectLevel {
    constructor() {
        this.buttons = [];
        this.levels = [];
        this.totalLevels = 20; // 总关卡数
    }
    
    /**
     * 初始化选择关卡页面
     */
    init() {
        console.log('选择关卡页面初始化');
        this.generateLevels();
        this.calculateButtonPositions();
    }
    
    /**
     * 生成关卡数据
     */
    generateLevels() {
        this.levels = [];
        for (let i = 1; i <= this.totalLevels; i++) {
            this.levels.push({
                id: i,
                isLocked: false // 关卡是否锁定，这里可以根据实际情况设置
            });
        }
    }
    
    /**
     * 计算按钮位置
     */
    calculateButtonPositions() {
        this.buttons = [];
        const buttonWidth = 80;
        const buttonHeight = 80;
        const buttonMargin = 20;
        const cols = 4; // 每行显示的关卡数
        const rows = Math.ceil(this.totalLevels / cols);
        
        // 计算关卡按钮区域的起始位置（居中显示）
        const totalWidth = cols * buttonWidth + (cols - 1) * buttonMargin;
        const totalHeight = rows * buttonHeight + (rows - 1) * buttonMargin;
        const startX = (canvas.width - totalWidth) / 2;
        const startY = canvas.height * 0.25;
        
        // 生成关卡按钮
        this.levels.forEach((level, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            
            const levelButton = {
                id: `level-${level.id}`,
                text: level.id.toString(),
                x: startX + col * (buttonWidth + buttonMargin),
                y: startY + row * (buttonHeight + buttonMargin),
                width: buttonWidth,
                height: buttonHeight,
                levelId: level.id,
                isLocked: level.isLocked
            };
            
            this.buttons.push(levelButton);
        });
        
        // 返回首页按钮（左上角模拟微信返回组件）
        const backButton = {
            id: 'back',
            text: '', // 不显示文字，只显示图标
            x: 20, // 左上角位置
            y: 20,
            width: 50,
            height: 50
        };
        
        // 将返回按钮添加到按钮数组的开头
        this.buttons.unshift(backButton);
    }
    
    /**
     * 渲染选择关卡页面
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
        ctx.fillText('选择关卡', canvas.width / 2, canvas.height * 0.15);
        
        // 绘制按钮
        this.buttons.forEach(button => {
            if (button.id === 'back') {
                // 绘制返回图标（左箭头，模拟微信自带的返回组件）
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
            } else {
                // 绘制关卡按钮
                if (button.isLocked) {
                    ctx.fillStyle = '#cccccc';
                } else {
                    ctx.fillStyle = '#2196F3';
                }
                ctx.fillRect(button.x, button.y, button.width, button.height);
                
                ctx.strokeStyle = button.isLocked ? '#999999' : '#1976D2';
                ctx.lineWidth = 3;
                ctx.strokeRect(button.x, button.y, button.width, button.height);
                
                ctx.fillStyle = '#ffffff';
                ctx.font = '24px Arial';
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