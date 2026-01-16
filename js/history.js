/**
 * 历史记录页面类
 * 负责渲染历史记录页面和处理页面事件
 */
import './render'; // 确保canvas被创建和初始化

// 获取canvas对象
const canvas = GameGlobal.canvas;

export default class History {
    constructor() {
        this.buttons = [];
        this.historyData = [];
    }
    
    /**
     * 初始化历史记录页面
     */
    init() {
        console.log('历史记录页面初始化');
        this.loadHistoryData();
        this.calculateButtonPositions();
    }
    
    /**
     * 加载历史记录数据
     */
    loadHistoryData() {
        // 这里可以从本地存储或服务器加载真实的历史记录数据
        // 目前使用模拟数据
        this.historyData = [
            { level: 1, date: '2026-01-16', time: '02:30', moves: 45 },
            { level: 2, date: '2026-01-16', time: '03:45', moves: 67 },
            { level: 3, date: '2026-01-15', time: '04:20', moves: 89 }
        ];
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
     * 渲染历史记录页面
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
        ctx.fillText('游戏历史记录', canvas.width / 2, canvas.height * 0.15);
        
        // 绘制表头
        ctx.fillStyle = '#000000ff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('关卡', canvas.width * 0.25, canvas.height * 0.25);
        ctx.fillText('日期', canvas.width * 0.5, canvas.height * 0.25);
        ctx.fillText('时间', canvas.width * 0.75, canvas.height * 0.25);
        
        // 绘制历史记录列表
        ctx.fillStyle = '#000000ff';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        
        this.historyData.forEach((record, index) => {
            const y = canvas.height * 0.25 + 40 * (index + 1);
            ctx.fillText(record.level, canvas.width * 0.25, y);
            ctx.fillText(record.date, canvas.width * 0.5, y);
            ctx.fillText(record.time, canvas.width * 0.75, y);
        });
        
        // 如果没有历史记录，显示提示信息
        if (this.historyData.length === 0) {
            ctx.fillStyle = '#000000ff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('暂无历史记录', canvas.width / 2, canvas.height * 0.5);
        }
        
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