/**
 * 游戏主函数
 */
import './render'; // 确保canvas被创建和初始化
import BackGround from './runtime/background'; // 导入背景类
import Home from './home';
import My from './my';
import Help from './help';
import Start from './start';
import History from './history';
import SelectLevel from './selectLevel';

// 获取canvas对象和2D上下文
const canvas = GameGlobal.canvas;
const ctx = canvas.getContext('2d');

export default class Welcome {
    constructor() {
        this.currentPage = 'home'; // 当前显示的页面：'home'、'my'或'help'
        this.tabButtons = [];
        this.isResourcesLoaded = false;
        
        // 初始化资源加载计数器
        this.resourcesToLoad = 1; // 目前只有背景图片需要加载
        this.resourcesLoaded = 0;
        
        // 创建背景对象
        this.bg = new BackGround();
        
        // 创建页面实例
        this.home = new Home();
        this.my = new My();
        this.help = new Help(); // 创建帮助页面实例
        this.start = new Start(); // 创建开始游戏页面实例
        this.history = new History(); // 创建历史记录页面实例
        this.selectLevel = new SelectLevel(); // 创建选择关卡页面实例
        
        // 监听背景图片加载完成事件
        this.bg.on('loaded', () => {
            this.resourceLoaded();
        });
        
        // 初始化页面和事件
        this.init();
        this.bindEvents();
    }
    
    /**
     * 资源加载完成回调
     */
    resourceLoaded() {
        this.resourcesLoaded++;
        if (this.resourcesLoaded >= this.resourcesToLoad) {
            this.isResourcesLoaded = true;
            this.gameLoop(); // 所有资源加载完成后再启动渲染循环
        }
    }

    init() {
        console.log('游戏初始化');
        this.home.init();
        this.my.init();
        this.help.init(); // 初始化帮助页面
        this.start.init(); // 初始化开始游戏页面
        this.history.init(); // 初始化历史记录页面
        this.selectLevel.init(); // 初始化选择关卡页面
        this.initTabButtons();
    }
    
    /**
     * 游戏主循环
     */
    gameLoop() {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 渲染当前页面内容
        this.render(ctx, this.bg);
        
        // 递归调用游戏主循环
        requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 监听触摸事件 - 使用微信小游戏的事件API
        wx.onTouchStart((e) => {
            const touch = e.touches[0];
            const touchPos = {
                x: touch.clientX,
                y: touch.clientY
            };
            
            // 检查是否点击了tab按钮
            const tabId = this.checkTabClick(touchPos);
            if (tabId) {
                this.currentPage = tabId;
                return;
            }
            
            // 根据当前页面检查是否点击了页面内的按钮
            if (this.currentPage === 'home') {
                // 首页按钮检测
                const buttonId = this.home.checkButtonClick(touchPos);
                if (buttonId) {
                    this.handleHomeButtonClick(buttonId);
                }
            } else if (this.currentPage === 'my') {
                // 我的页面按钮检测（如果有）
                const buttonId = this.my.checkButtonClick(touchPos);
                if (buttonId) {
                    this.handleMyButtonClick(buttonId);
                }
            } else if (this.currentPage === 'help') {
                // 帮助页面按钮检测
                const buttonId = this.help.checkButtonClick(touchPos);
                if (buttonId) {
                    this.handleHelpButtonClick(buttonId);
                }
            } else if (this.currentPage === 'start') {
                // 开始游戏页面按钮检测
                const buttonId = this.start.checkButtonClick(touchPos);
                if (buttonId) {
                    this.handleStartButtonClick(buttonId);
                }
            } else if (this.currentPage === 'history') {
                // 历史记录页面按钮检测
                const buttonId = this.history.checkButtonClick(touchPos);
                if (buttonId) {
                    this.handleHistoryButtonClick(buttonId);
                }
            } else if (this.currentPage === 'selectLevel') {
                // 选择关卡页面按钮检测
                const buttonId = this.selectLevel.checkButtonClick(touchPos);
                if (buttonId) {
                    this.handleSelectLevelButtonClick(buttonId);
                }
            }
        });
    }
    
    /**
     * 检测tab按钮点击
     * @param {Object} touchPos - 点击位置 {x, y}
     * @returns {string|null} - 点击的tab ID，如果没有点击则返回null
     */
    checkTabClick(touchPos) {
        for (const tab of this.tabButtons) {
            if (touchPos.x >= tab.x && touchPos.x <= tab.x + tab.width &&
                touchPos.y >= tab.y && touchPos.y <= tab.y + tab.height) {
                return tab.id;
            }
        }
        return null;
    }
    
    /**
     * 处理首页按钮点击
     * @param {string} buttonId - 点击的按钮ID
     */
    handleHomeButtonClick(buttonId) {
        switch (buttonId) {
            case 'start':
                console.log('开始游戏');
                this.currentPage = 'start'; // 跳转到开始游戏页面
                break;
            case 'history':
                console.log('查看历史记录');
                this.currentPage = 'history'; // 跳转到历史记录页面
                break;
            case 'selectLevel':
                console.log('选择关卡');
                this.currentPage = 'selectLevel'; // 跳转到选择关卡页面
                break;
            case 'help':
                console.log('查看帮助');
                this.currentPage = 'help'; // 跳转到帮助页面
                break;
        }
    }
    
    /**
     * 处理我的页面按钮点击
     * @param {string} buttonId - 点击的按钮ID
     */
    handleMyButtonClick(buttonId) {
        // 这里可以添加我的页面按钮的处理逻辑
        console.log('点击了我的页面按钮:', buttonId);
    }
    
    /**
     * 处理帮助页面按钮点击
     * @param {string} buttonId - 点击的按钮ID
     */
    handleHelpButtonClick(buttonId) {
        switch (buttonId) {
            case 'back':
                console.log('返回首页');
                this.currentPage = 'home'; // 返回到首页
                break;
        }
    }
    
    /**
     * 处理开始游戏页面按钮点击
     * @param {string} buttonId - 点击的按钮ID
     */
    handleStartButtonClick(buttonId) {
        switch (buttonId) {
            case 'play':
                console.log('开始游戏');
                // 这里可以添加游戏开始的逻辑
                break;
            case 'back':
                console.log('返回首页');
                this.currentPage = 'home'; // 返回到首页
                break;
        }
    }
    
    /**
     * 处理历史记录页面按钮点击
     * @param {string} buttonId - 点击的按钮ID
     */
    handleHistoryButtonClick(buttonId) {
        switch (buttonId) {
            case 'back':
                console.log('返回首页');
                this.currentPage = 'home'; // 返回到首页
                break;
        }
    }
    
    /**
     * 处理选择关卡页面按钮点击
     * @param {string} buttonId - 点击的按钮ID
     */
    handleSelectLevelButtonClick(buttonId) {
        switch (buttonId) {
            case 'back':
                console.log('返回首页');
                this.currentPage = 'home'; // 返回到首页
                break;
            default:
                // 处理关卡选择
                if (buttonId.startsWith('level-')) {
                    const levelId = parseInt(buttonId.split('-')[1]);
                    console.log(`选择关卡 ${levelId}`);
                    // 这里可以添加选择关卡后的逻辑
                }
                break;
        }
    }
    
    /**
     * 初始化底部tab按钮
     */
    initTabButtons() {
        this.tabButtons = [];
        const tabWidth = canvas.width / 2;
        const tabHeight = 60;
        const tabY = canvas.height - tabHeight;
        
        // 首页tab按钮
        const homeTab = {
            id: 'home',
            text: '首页',
            x: 0,
            y: tabY,
            width: tabWidth,
            height: tabHeight
        };
        
        // 我的tab按钮
        const myTab = {
            id: 'my',
            text: '我的',
            x: tabWidth,
            y: tabY,
            width: tabWidth,
            height: tabHeight
        };
        
        this.tabButtons.push(homeTab, myTab);
    }
    
    /**
     * 渲染方法
     * @param {CanvasRenderingContext2D} ctx - 2D绘图上下文
     * @param {Object} bg - 背景对象
     */
    render(ctx, bg) {
        // 根据当前页面渲染对应的内容
        if (this.currentPage === 'home') {
            this.home.render(ctx, bg);
            // 渲染底部tab按钮
            this.renderTabButtons(ctx);
        } else if (this.currentPage === 'my') {
            this.my.render(ctx, bg);
            // 渲染底部tab按钮
            this.renderTabButtons(ctx);
        } else if (this.currentPage === 'help') {
            this.help.render(ctx, bg);
            // 帮助页面不显示底部tab按钮
        } else if (this.currentPage === 'start') {
            this.start.render(ctx, bg);
            // 开始游戏页面不显示底部tab按钮
        } else if (this.currentPage === 'history') {
            this.history.render(ctx, bg);
            // 历史记录页面不显示底部tab按钮
        } else if (this.currentPage === 'selectLevel') {
            this.selectLevel.render(ctx, bg);
            // 选择关卡页面不显示底部tab按钮
        }
    }
    
    /**
     * 渲染底部tab按钮
     * @param {CanvasRenderingContext2D} ctx - 2D绘图上下文
     */
    renderTabButtons(ctx) {
        this.tabButtons.forEach(tab => {
            // 根据是否为当前页面设置不同的背景颜色
            const isActive = this.currentPage === tab.id;
            ctx.fillStyle = isActive ? '#4CAF50' : '#f5f5f5';
            ctx.fillRect(tab.x, tab.y, tab.width, tab.height);
            
            // 绘制边框
            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 1;
            ctx.strokeRect(tab.x, tab.y, tab.width, tab.height);
            
            // 绘制文字
            ctx.fillStyle = isActive ? '#ffffff' : '#333333';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(tab.text, tab.x + tab.width / 2, tab.y + tab.height / 2);
        });
    }
}