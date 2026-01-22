import { _decorator, Component, Node, input, Input, EventTouch, Vec2, RigidBody2D, Vec3, tween, PhysicsSystem2D, ERaycast2DType, Collider2D, BoxCollider2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property({ tooltip: '移动步长（格子大小）' })
    tileSize: number = 150; 

    @property({ tooltip: '移动动画时间' })
    moveDuration: number = 0.2;

    private _startPos: Vec2 = new Vec2();
    private _minSwipeDistance: number = 20; // 最小滑动距离
    private _isMoving: boolean = false;

    start() {
        // 监听全局触摸事件
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch) {
        this._startPos.set(event.getLocation());
    }

    private onTouchEnd(event: EventTouch) {
        if (this._isMoving) return;

        const endPos = event.getLocation();
        const delta = new Vec2(endPos.x - this._startPos.x, endPos.y - this._startPos.y);

        if (delta.length() < this._minSwipeDistance) return;

        // 判断主要滑动方向
        let dir = new Vec2(0, 0);
        if (Math.abs(delta.x) > Math.abs(delta.y)) {
            dir.x = delta.x > 0 ? 1 : -1;
        } else {
            dir.y = delta.y > 0 ? 1 : -1;
        }

        this.tryMove(dir);
    }

    private tryMove(direction: Vec2) {
        const currentPos = this.node.position;
        // 计算目标位置
        const targetPos = new Vec3(
            currentPos.x + direction.x * this.tileSize,
            currentPos.y + direction.y * this.tileSize,
            currentPos.z
        );

        // 使用物理射线检测前方是否有障碍物
        // 射线起点：当前中心 + 偏移一点点，防止检测到自己
        // 射线终点：目标中心
        const start = new Vec2(currentPos.x, currentPos.y);
        const end = new Vec2(targetPos.x, targetPos.y);
        
        // 射线检测
        // 使用 All 类型检测所有物体，防止 Closest 漏掉墙体（例如 Start 在 Collider 内部时）
        const results = PhysicsSystem2D.instance.raycast(start, end, ERaycast2DType.All);

        let canMove = true;
        let boxNode: Node | null = null;

        if (results.length > 0) {
            for (const result of results) {
                // 忽略传感器（如目标点）和自己
                if (result.collider.sensor || result.collider.node === this.node) {
                    continue;
                }

                const hitNode = result.collider.node;
                
                if (hitNode.name.startsWith('Wall')) {
                    canMove = false;
                    break; // 只要碰到墙，绝对不能走
                } else if (hitNode.name.startsWith('Box')) {
                    // 如果是箱子，检查箱子后面有没有障碍
                    if (this.canBoxMove(hitNode, direction)) {
                        boxNode = hitNode;
                    } else {
                        canMove = false;
                        break; // 箱子推不动，我也不能走
                    }
                }
            }
        }

        if (canMove) {
            this._isMoving = true;
            
            // 移动玩家
            tween(this.node)
                .to(this.moveDuration, { position: targetPos })
                .call(() => {
                    this._isMoving = false;
                })
                .start();

            // 如果推动了箱子，箱子也一起移动
            if (boxNode) {
                const boxTargetPos = new Vec3(
                    boxNode.position.x + direction.x * this.tileSize,
                    boxNode.position.y + direction.y * this.tileSize,
                    boxNode.position.z
                );
                tween(boxNode)
                    .to(this.moveDuration, { position: boxTargetPos })
                    .start();
            }
        }
    }

    private canBoxMove(boxNode: Node, direction: Vec2): boolean {
        const currentPos = boxNode.position;
        // 箱子目标位置（中心）
        const targetPos = new Vec3(
            currentPos.x + direction.x * this.tileSize,
            currentPos.y + direction.y * this.tileSize,
            currentPos.z
        );

        // 射线从箱子当前中心 -> 箱子目标中心
        // 这样覆盖了移动路径
        const start = new Vec2(currentPos.x, currentPos.y);
        const end = new Vec2(targetPos.x, targetPos.y);

        const results = PhysicsSystem2D.instance.raycast(start, end, ERaycast2DType.All);
        
        for (const result of results) {
            // 忽略传感器、忽略自己、忽略玩家（因为玩家在推它，肯定在后面）
            if (result.collider.sensor || result.collider.node === boxNode || result.collider.node === this.node) {
                continue;
            }
            
            // 碰到了非传感器、非自己、非玩家的物体（墙或其他箱子）
            // 只要有一个阻挡，就不能动
            return false;
        }
        
        return true;
    }
}
