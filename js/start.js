/**
 * 开始游戏页面类
 * 负责渲染开始游戏页面和处理推箱子游戏逻辑
 */
import './render'; // 确保canvas被创建和初始化
import BackGround from './runtime/background'; // 导入背景类
import Map from './runtime/map'; // 导入地图类

// 获取canvas对象和2D上下文
const canvas = GameGlobal.canvas;
const ctx = canvas.getContext('2d');

// 游戏状态枚举
const GAME_STATUS = {
    PLAYING: 'playing',
    COMPLETE: 'complete'
};

export default class Start {
    bg = null; // 创建背景
    map = null; // 创建地图
    buttons = {}; // 存储按钮
    
    constructor() {
        this.gameStatus = GAME_STATUS.PLAYING; // 初始状态为游戏中
        this.gameComplete = false; // 游戏是否完成
    }
    
    /**
     * 初始化开始游戏页面
     */
    init() {
        console.log('开始游戏页面初始化');
        this.initGame();
    }
    
    /**
     * 初始化游戏
     */
    initGame() {
        // 创建背景和地图
        this.bg = new BackGround();
        this.map = new Map();
        
        // 初始化游戏按钮
        this.initGameButtons();
        
        // 绑定触摸事件
        this.bindEvents();
    }
    
    /**
     * 初始化游戏按钮
     */
    initGameButtons() {
        this.buttons = {};
        
        const buttonSize = 60;
        const buttonMargin = 10;
        const buttonAreaWidth = buttonSize * 3 + buttonMargin * 2;
        const buttonAreaHeight = buttonSize * 2 + buttonMargin;
        
        // 按钮区域左上角坐标（居中显示在屏幕底部）
        const startX = (canvas.width - buttonAreaWidth) / 2;
        const startY = canvas.height - buttonAreaHeight - 20;
        
        // 创建上下左右按钮
        const centerY = startY + buttonSize + buttonMargin / 2;
        const halfButtonHeight = buttonSize / 2;
        
        this.buttons.up = {
            id: 'up',
            x: startX + buttonSize + buttonMargin,
            y: startY,
            width: buttonSize,
            height: buttonSize,
            onClick: () => this.movePlayer('up')
        };
        
        this.buttons.left = {
            id: 'left',
            x: startX,
            y: centerY - halfButtonHeight,
            width: buttonSize,
            height: buttonSize,
            onClick: () => this.movePlayer('left')
        };
        
        this.buttons.right = {
            id: 'right',
            x: startX + buttonSize * 2 + buttonMargin * 2,
            y: centerY - halfButtonHeight,
            width: buttonSize,
            height: buttonSize,
            onClick: () => this.movePlayer('right')
        };
        
        this.buttons.down = {
            id: 'down',
            x: startX + buttonSize + buttonMargin,
            y: startY + buttonSize + buttonMargin,
            width: buttonSize,
            height: buttonSize,
            onClick: () => this.movePlayer('down')
        };
        
        // 添加返回首页按钮
        this.buttons.back = {
            id: 'back',
            x: 20,
            y: 20,
            width: 50,
            height: 50,
            onClick: () => this.handleBackClick()
        };
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 监听触摸事件
        wx.onTouchStart((e) => {
            const touch = e.touches[0];
            const touchPos = {
                x: touch.clientX,
                y: touch.clientY
            };
            
            // 检查所有按钮点击
            for (const buttonKey in this.buttons) {
                const button = this.buttons[buttonKey];
                if (touchPos.x >= button.x && touchPos.x <= button.x + button.width &&
                    touchPos.y >= button.y && touchPos.y <= button.y + button.height) {
                    button.onClick();
                    break;
                }
            }
        });
    }
    
    /**
     * 渲染开始游戏页面
     * @param {CanvasRenderingContext2D} ctx - 2D绘图上下文
     * @param {Object} bg - 背景对象
     */
    render(ctx, bg) {
        // 渲染游戏界面
        this.renderPlaying(ctx, bg);
        
        // 如果游戏完成，显示游戏完成提示
        if (this.gameComplete) {
            this.showGameComplete(ctx);
        }
    }
    
    /**
     * 渲染游戏界面
     */
    renderPlaying(ctx, bg) {
        // 更新背景
        this.bg.update();
        
        // 渲染背景
        this.bg.render(ctx);
        
        // 渲染地图
        this.map.render(ctx);
        
        // 渲染游戏按钮
        for (const buttonKey in this.buttons) {
            const button = this.buttons[buttonKey];
            
            // 绘制箭头图标（参考help.js中的返回按钮样式）
            ctx.fillStyle = '#000000ff';
            ctx.beginPath();
            
            const arrowSize = 15;
            const centerX = button.x + button.width / 2;
            const centerY = button.y + button.height / 2;
            
            switch (button.id) {
                case 'back':
                    // 绘制返回图标（左箭头，模拟微信自带的返回组件）
                    ctx.moveTo(button.x + button.width - arrowSize, button.y + arrowSize);
                    ctx.lineTo(button.x + arrowSize, centerY);
                    ctx.lineTo(button.x + button.width - arrowSize, button.y + button.height - arrowSize);
                    ctx.lineTo(button.x + button.width - 5, centerY);
                    ctx.lineTo(button.x + button.width - arrowSize, button.y + arrowSize);
                    break;
                case 'up':
                    // 绘制上箭头（与左右箭头样式完全一致，只是方向不同）
                    ctx.moveTo(button.x + button.width - arrowSize, button.y + button.height - arrowSize);
                    ctx.lineTo(centerX, button.y + arrowSize);
                    ctx.lineTo(button.x + arrowSize, button.y + button.height - arrowSize);
                    ctx.lineTo(centerX, button.y + button.height - 5);
                    ctx.lineTo(button.x + button.width - arrowSize, button.y + button.height - arrowSize);
                    break;
                case 'down':
                    // 绘制下箭头（与左右箭头样式完全一致，只是方向不同）
                    ctx.moveTo(button.x + button.width - arrowSize, button.y + arrowSize);
                    ctx.lineTo(centerX, button.y + button.height - arrowSize);
                    ctx.lineTo(button.x + arrowSize, button.y + arrowSize);
                    ctx.lineTo(centerX, button.y + 5);
                    ctx.lineTo(button.x + button.width - arrowSize, button.y + arrowSize);
                    break;
                case 'left':
                    // 绘制左箭头（与返回按钮样式一致，只是方向相同但大小一致）
                    ctx.moveTo(button.x + button.width - arrowSize, button.y + arrowSize);
                    ctx.lineTo(button.x + arrowSize, centerY);
                    ctx.lineTo(button.x + button.width - arrowSize, button.y + button.height - arrowSize);
                    ctx.lineTo(button.x + button.width - 5, centerY);
                    ctx.lineTo(button.x + button.width - arrowSize, button.y + arrowSize);
                    break;
                case 'right':
                    // 绘制右箭头（与返回按钮样式一致，只是方向不同）
                    ctx.moveTo(button.x + arrowSize, button.y + arrowSize);
                    ctx.lineTo(button.x + button.width - arrowSize, centerY);
                    ctx.lineTo(button.x + arrowSize, button.y + button.height - arrowSize);
                    ctx.lineTo(button.x + 5, centerY);
                    ctx.lineTo(button.x + arrowSize, button.y + arrowSize);
                    break;
            }
            
            ctx.closePath();
            ctx.fill();
            
            // 绘制按钮区域边框（与help.js保持一致，方便调试）
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.strokeRect(button.x, button.y, button.width, button.height);
        }
    }
    
    /**
     * 移动玩家
     * @param {string} direction - 移动方向：'up', 'down', 'left', 'right'
     */
    movePlayer(direction) {
        if (this.gameStatus !== GAME_STATUS.PLAYING || !this.map.player) return;
        
        const player = this.map.player;
        const dx = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
        const dy = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
        
        // 计算新位置
        const newX = player.x + dx;
        const newY = player.y + dy;
        
        // 检查新位置是否在地图范围内
        if (newX < 0 || newX >= this.map.currentMap[0].length || 
            newY < 0 || newY >= this.map.currentMap.length) {
            return;
        }
        
        const newElement = this.map.currentMap[newY][newX];
        
        // 检查新位置是否是墙体
        if (newElement === 1) {
            return;
        }
        
        // 检查新位置是否是箱子
        if (newElement === 4) {
            // 计算箱子的新位置
            const boxNewX = newX + dx;
            const boxNewY = newY + dy;
            
            // 检查箱子的新位置是否在地图范围内
            if (boxNewX < 0 || boxNewX >= this.map.currentMap[0].length || 
                boxNewY < 0 || boxNewY >= this.map.currentMap.length) {
                return;
            }
            
            const boxNewElement = this.map.currentMap[boxNewY][boxNewX];
            
            // 检查箱子的新位置是否是墙体或其他箱子
            if (boxNewElement === 1 || boxNewElement === 4) {
                return;
            }
            
            // 移动箱子
            this.map.currentMap[boxNewY][boxNewX] = 4;
            this.map.currentMap[newY][newX] = 2;
        } else if (newElement === 3) {
            // 新位置是终点，直接移动玩家
            this.map.currentMap[player.y][player.x] = 2;
            this.map.currentMap[newY][newX] = 5;
        } else {
            // 新位置是通路，直接移动玩家
            this.map.currentMap[player.y][player.x] = 2;
            this.map.currentMap[newY][newX] = 5;
        }
        
        // 更新玩家位置
        player.x = newX;
        player.y = newY;
        
        // 重新初始化地图元素
        this.map.init();
        
        // 检查游戏是否完成
        this.gameComplete = this.map.checkGameComplete();
        if (this.gameComplete) {
            this.gameStatus = GAME_STATUS.COMPLETE;
        }
    }
    
    /**
     * 显示游戏完成提示
     */
    showGameComplete(ctx) {
        // 绘制半透明背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制游戏完成文字
        ctx.fillStyle = '#ffffff';
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏完成！', canvas.width / 2, canvas.height / 2 - 50);
        
        ctx.font = '24px Arial';
        ctx.fillText('恭喜你通过了这一关！', canvas.width / 2, canvas.height / 2 + 10);
    }
    
    /**
     * 返回首页
     */
    handleBackClick() {
        // 这里只需要返回按钮ID，具体的页面切换由welcome.js处理
        console.log('返回首页');
    }
    
    /**
     * 检测按钮点击
     * @param {Object} touchPos - 点击位置 {x, y}
     * @returns {string|null} - 点击的按钮ID，如果没有点击则返回null
     */
    checkButtonClick(touchPos) {
        // 检查返回按钮点击
        const backButton = this.buttons.back;
        if (backButton &&
            touchPos.x >= backButton.x && touchPos.x <= backButton.x + backButton.width &&
            touchPos.y >= backButton.y && touchPos.y <= backButton.y + backButton.height) {
            return backButton.id;
        }
        
        return null;
    }
}