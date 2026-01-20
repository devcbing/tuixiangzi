import BackGround from './runtime/background'; // 导入背景类
import Map from './runtime/map'; // 导入地图类
import Button from './base/button'; // 导入按钮类
import Home from './runtime/aaa'; // 导入首页类
 

const ctx = canvas.getContext('2d'); // 获取canvas的2D绘图上下文

// 游戏状态枚举
const GAME_STATUS = {
    HOME: 'home',
    PLAYING: 'playing',
    COMPLETE: 'complete'
};

/**
 * 游戏主函数
 */
export default class Main {
    bg = new BackGround(); // 创建背景
    map = new Map(); // 创建地图
    home = new Home(); // 创建首页
    buttons = {}; // 存储按钮
  _gesture = { active: false, startX: 0, startY: 0, startTime: 0, uiHit: false, dx: 0, dy: 0 };
    
    constructor() {
        this.gameStatus = GAME_STATUS.HOME; // 初始状态为首页
        
        this.init();
        this.home.init();
        this.bindEvents();
        this.gameComplete = false; // 游戏是否完成
    }

    init() {
        console.log('游戏初始化');
        this.gameLoop();
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
        this.buttons.up = new Button('up', startX + buttonSize + buttonMargin, startY, buttonSize, buttonSize);
        this.buttons.left = new Button('left', startX, startY + buttonSize + buttonMargin, buttonSize, buttonSize);
        this.buttons.right = new Button('right', startX + buttonSize * 2 + buttonMargin * 2, startY + buttonSize + buttonMargin, buttonSize, buttonSize);
        this.buttons.down = new Button('down', startX + buttonSize + buttonMargin, startY + buttonSize + buttonMargin, buttonSize, buttonSize);
        
        // 设置按钮点击事件
        this.buttons.up.onClick = () => this.movePlayer('up');
        this.buttons.down.onClick = () => this.movePlayer('down');
        this.buttons.left.onClick = () => this.movePlayer('left');
        this.buttons.right.onClick = () => this.movePlayer('right');
        
        // 添加返回首页按钮
        this.buttons.back = {
            x: 20,
            y: 20,
            width: 100,
            height: 40,
            text: '返回首页',
            onClick: () => this.backToHome()
        };
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const touchPos = {
                x: touch.clientX,
                y: touch.clientY
            };
            
            if (this.gameStatus === GAME_STATUS.HOME) {
                const buttonId = this.home.checkButtonClick(touchPos);
                if (buttonId) {
                    this.handleHomeButtonClick(buttonId);
                }
            } else {
                for (const buttonKey in this.buttons) {
                    const button = this.buttons[buttonKey];
                    if (button.checkClick) {
                        if (button.checkClick(touchPos)) {
                            break;
                        }
                    } else if (button.onClick) {
                        if (touchPos.x >= button.x && touchPos.x <= button.x + button.width &&
                            touchPos.y >= button.y && touchPos.y <= button.y + button.height) {
                            button.onClick();
                            break;
                        }
                    }
                }
            }
        });
        canvas.addEventListener('touchstart', (e) => {
            const t = e.touches[0];
            if (!t) return;
            if (this.gameStatus !== GAME_STATUS.PLAYING) return;
            if (this.map.getLevel && this.map.getLevel() !== 0) return;
            const x = t.clientX;
            const y = t.clientY;
            let uiHit = false;
            for (const key in this.buttons) {
                const b = this.buttons[key];
                if (b && b.x !== undefined) {
                    if (x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height) {
                        uiHit = true;
                        break;
                    }
                }
            }
            this._gesture.active = !uiHit;
            this._gesture.uiHit = uiHit;
            this._gesture.startX = x;
            this._gesture.startY = y;
            this._gesture.startTime = Date.now();
            this._gesture.dx = 0;
            this._gesture.dy = 0;
        }, { passive: true });
        canvas.addEventListener('touchmove', (e) => {
            if (!this._gesture.active) return;
            const t = e.touches[0];
            if (!t) return;
            this._gesture.dx = t.clientX - this._gesture.startX;
            this._gesture.dy = t.clientY - this._gesture.startY;
        }, { passive: true });
        canvas.addEventListener('touchend', () => {
            if (!this._gesture.active) return;
            const duration = Date.now() - this._gesture.startTime;
            const dist = Math.hypot(this._gesture.dx, this._gesture.dy);
            const minBase = Math.min(canvas.width, canvas.height);
            const swipeMinDistance = Math.max(30, Math.round(minBase * 0.05));
            const swipeMaxTime = 300;
            if (duration <= swipeMaxTime && dist >= swipeMinDistance) {
                const direction = this._getSwipeDirection(this._gesture.dx, this._gesture.dy);
                this.movePlayer(direction);
            }
            this._gesture.active = false;
            this._gesture.uiHit = false;
            this._gesture.dx = 0;
            this._gesture.dy = 0;
        }, { passive: true });
    }
    
    /**
     * 处理首页按钮点击
     * @param {string} buttonId - 点击的按钮ID
     */
    handleHomeButtonClick(buttonId) {
        switch (buttonId) {
            case 'start':
                this.startGame();
                break;
            case 'history':
                this.showHistory();
                break;
            case 'selectLevel':
                this.selectLevel();
                break;
            case 'help':
                this.showHelp();
                break;
        }
    }

    /**
     * 开始游戏
     */
    startGame() {
        this.gameStatus = GAME_STATUS.PLAYING;
        this.gameComplete = false;
        this.map = new Map(0); // 从第一关开始
        this.initGameButtons();
    }
    
    /**
     * 查看历史记录
     */
    showHistory() {
        console.log('查看历史记录');
        // 这里可以添加历史记录的实现
    }
    
    /**
     * 选择关卡
     */
    selectLevel() {
        console.log('选择关卡');
        // 这里可以添加选择关卡的实现
    }
    
    /**
     * 帮助
     */
    showHelp() {
        console.log('帮助');
        // 这里可以添加帮助信息的实现
    }
    
    /**
     * 返回首页
     */
    backToHome() {
        this.gameStatus = GAME_STATUS.HOME;
        this.home.init();
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
     * 游戏主循环
     */
    gameLoop() {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 根据游戏状态渲染不同的界面
        switch (this.gameStatus) {
            case GAME_STATUS.HOME:
                this.home.render(ctx, this.bg);
                break;
            case GAME_STATUS.PLAYING:
                this.renderPlaying();
                break;
            case GAME_STATUS.COMPLETE:
                this.renderPlaying();
                this.showGameComplete();
                break;
        }
        
        // 递归调用游戏主循环
        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * 渲染游戏界面
     */
    renderPlaying() {
        // 更新背景
        this.bg.update();
        
        // 渲染背景
        this.bg.render(ctx);
        
        // 渲染地图
        this.map.render(ctx);
        
        // 渲染游戏按钮
        for (const buttonKey in this.buttons) {
            const button = this.buttons[buttonKey];
            if (button.render) {
                button.render(ctx);
            } else if (button.text) {
                // 绘制返回首页按钮
                ctx.fillStyle = '#f44336';
                ctx.fillRect(button.x, button.y, button.width, button.height);
                
                ctx.strokeStyle = '#d32f2f';
                ctx.lineWidth = 2;
                ctx.strokeRect(button.x, button.y, button.width, button.height);
                
                ctx.fillStyle = '#ffffff';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
            }
        }
        
    }
    _getSwipeDirection(dx, dy) {
        const ax = Math.abs(dx);
        const ay = Math.abs(dy);
        if (ax >= ay) return dx > 0 ? 'right' : 'left';
        return dy > 0 ? 'down' : 'up';
    }

    /**
     * 显示游戏完成提示
     */
    showGameComplete() {
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
}
