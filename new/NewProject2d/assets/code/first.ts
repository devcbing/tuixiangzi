import { _decorator, Component, Node, SpriteFrame, Sprite, UITransform, BoxCollider2D, RigidBody2D, ERigidBody2DType, Size, Vec3, PhysicsSystem2D, Vec2 } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property, executeInEditMode } = _decorator;

enum ElementType {
    EMPTY = 0,
    WALL = 1,
    PLAYER = 2,
    BOX = 3,
    TARGET = 4,
    STONE = 5, // 石块障碍
}

@ccclass('第一关场景')
@executeInEditMode
export class 第一关场景 extends Component {
    @property({ type: SpriteFrame, tooltip: '墙体图片 (Wall)' })
    wallSprite: SpriteFrame | null = null;

    @property({ type: SpriteFrame, tooltip: '玩家图片 (Player)' })
    playerSprite: SpriteFrame | null = null;

    @property({ type: SpriteFrame, tooltip: '箱子图片 (Box)' })
    boxSprite: SpriteFrame | null = null;

    @property({ type: SpriteFrame, tooltip: '目标点/钻石图片 (Target)' })
    targetSprite: SpriteFrame | null = null;

    @property({ type: SpriteFrame, tooltip: '石块/障碍图片 (Stone)' })
    stoneSprite: SpriteFrame | null = null;

    @property({ type: SpriteFrame, tooltip: '地板图片 (Floor) - 可选，铺在最下层' })
    floorSprite: SpriteFrame | null = null;

    @property({ tooltip: '单元格统一大小' })
    tileSize: Size = new Size(150, 150);

    @property({ tooltip: '是否在加载时自动生成' })
    buildOnLoad: boolean = true;

    // 0:空 1:墙 2:玩家 3:箱子 4:目标 5:石块
    // 根据用户提供的图片复刻布局 (9x8)
    private _pattern: number[][] = [
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 4, 1, 0, 0, 0],
        [0, 0, 0, 1, 3, 1, 0, 0, 0],
        [1, 1, 1, 1, 5, 1, 1, 1, 1],
        [1, 4, 5, 3, 2, 5, 3, 4, 1],
        [1, 1, 1, 1, 3, 1, 1, 1, 1],
        [0, 0, 0, 1, 4, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0]
    ];

    onLoad() {
        // 确保物理世界重力为0（俯视游戏）
        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.gravity = new Vec2(0, 0);
        }
    }

    start() {
        if (this.buildOnLoad) {
            this.buildLevel();
        }
    }

    public buildLevel() {
        // 清理旧节点
        this.node.removeAllChildren();

        // 创建分层节点
        const floorLayer = new Node('FloorLayer');
        floorLayer.parent = this.node;
        
        const objectLayer = new Node('ObjectLayer');
        objectLayer.parent = this.node;

        // 优先使用自定义大小，如果为0则尝试使用墙体原尺寸
        let w = this.tileSize.width;
        let h = this.tileSize.height;
        if (w <= 0 || h <= 0) {
            if (this.wallSprite) {
                w = this.wallSprite.originalSize.width;
                h = this.wallSprite.originalSize.height;
            } else {
                w = 50; h = 50; // 默认兜底
            }
        }

        const rows = this._pattern.length;
        const cols = this._pattern[0].length;
        const originX = -((cols - 1) * w) / 2;
        const originY = ((rows - 1) * h) / 2;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const val = this._pattern[r][c];
                const x = originX + c * w;
                const y = originY - r * h;

                // 1. 如果有地板图片，先铺地板（除了全空区域是否要铺？通常推箱子全铺或只铺墙内）
                // 这里简单处理：只要该位置有东西，或者就是单纯铺满背景
                // 暂时逻辑：凡是pattern中非空的地方，或者为了美观，我们可以全铺
                if (this.floorSprite && val !== ElementType.EMPTY) {
                     this.createNode(c, r, w, h, x, y, this.floorSprite, 'Floor', floorLayer, 0);
                }

                // 2. 生成具体元素
                switch (val) {
                    case ElementType.WALL:
                        this.createWall(c, r, w, h, x, y, objectLayer);
                        break;
                    case ElementType.PLAYER:
                        this.createStone(c, r, w, h, x, y, floorLayer); // 铺设地板（石头）
                        this.createPlayer(c, r, w, h, x, y, objectLayer);
                        break;
                    case ElementType.BOX:
                        this.createStone(c, r, w, h, x, y, floorLayer); // 铺设地板（石头）
                        this.createBox(c, r, w, h, x, y, objectLayer);
                        break;
                    case ElementType.TARGET:
                        this.createStone(c, r, w, h, x, y, floorLayer); // 铺设地板（石头）
                        this.createTarget(c, r, w, h, x, y, floorLayer); // 目标点作为地面标记，放入 FloorLayer，确保被箱子覆盖
                        break;
                    case ElementType.STONE:
                        this.createStone(c, r, w, h, x, y, floorLayer); // 纯铺设地板（石头）
                        break;
                }
            }
        }
        console.log(`[第一关场景] 关卡生成完毕，单块尺寸: ${w}x${h}`);
    }

    // 通用节点创建方法
    private createNode(c: number, r: number, w: number, h: number, x: number, y: number, spriteFrame: SpriteFrame, namePrefix: string, parent: Node, zIndex: number = 0): Node {
        const node = new Node(`${namePrefix}_${r}_${c}`);
        node.parent = parent;
        node.setPosition(new Vec3(x, y, 0));
        
        // 调整层级（Z轴）
        if (zIndex !== 0) {
            const p = node.position;
            node.setPosition(p.x, p.y, zIndex);
        }

        const sprite = node.addComponent(Sprite);
        sprite.spriteFrame = spriteFrame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;

        const ui = node.addComponent(UITransform);
        ui.setContentSize(new Size(w, h));

        return node;
    }

    private createWall(c: number, r: number, w: number, h: number, x: number, y: number, parent: Node) {
        if (!this.wallSprite) return;
        const node = this.createNode(c, r, w, h, x, y, this.wallSprite, 'Wall', parent);
        
        const rb = node.addComponent(RigidBody2D);
        rb.type = ERigidBody2DType.Static; // 墙是静止的
        
        const collider = node.addComponent(BoxCollider2D);
        collider.size = new Size(w, h);
    }

    private createStone(c: number, r: number, w: number, h: number, x: number, y: number, parent: Node) {
        if (!this.stoneSprite) return;
        // 石头现在作为通用地板，铺在下层，无刚体
        const node = this.createNode(c, r, w, h, x, y, this.stoneSprite, 'Stone', parent, 0);
    }

    private createPlayer(c: number, r: number, w: number, h: number, x: number, y: number, parent: Node) {
        if (!this.playerSprite) return;
        const node = this.createNode(c, r, w, h, x, y, this.playerSprite, 'Player', parent, 10); // 玩家层级高一点
        
        const rb = node.addComponent(RigidBody2D);
        rb.type = ERigidBody2DType.Dynamic; 
        rb.gravityScale = 0; // 无重力
        rb.fixedRotation = true; // 不旋转
        rb.linearDamping = 0.5; // 阻尼，防止一直滑
        
        const collider = node.addComponent(BoxCollider2D);
        collider.size = new Size(w * 0.9, h * 0.9); // 碰撞体稍微小一点，避免卡墙

        const controller = node.addComponent(PlayerController);
        controller.tileSize = w; // 同步尺寸
    }

    private createBox(c: number, r: number, w: number, h: number, x: number, y: number, parent: Node) {
        if (!this.boxSprite) return;
        const node = this.createNode(c, r, w, h, x, y, this.boxSprite, 'Box', parent, 5);
        
        const rb = node.addComponent(RigidBody2D);
        rb.type = ERigidBody2DType.Dynamic;
        rb.gravityScale = 0;
        rb.fixedRotation = true;
        rb.linearDamping = 2.0; // 箱子阻尼大一点，推一下走一点
        
        const collider = node.addComponent(BoxCollider2D);
        collider.size = new Size(w * 0.95, h * 0.95);
    }

    private createTarget(c: number, r: number, w: number, h: number, x: number, y: number, parent: Node) {
        if (!this.targetSprite) return;
        // 目标点通常在地面上，层级较低，或者作为 Sensor
        const node = this.createNode(c, r, w, h, x, y, this.targetSprite, 'Target', parent, 1);
        
        const rb = node.addComponent(RigidBody2D);
        rb.type = ERigidBody2DType.Static; 
        
        const collider = node.addComponent(BoxCollider2D);
        collider.size = new Size(w * 0.5, h * 0.5); // 判定区域小一点
        collider.sensor = true; // 设为触发器，不产生物理碰撞
    }
}
