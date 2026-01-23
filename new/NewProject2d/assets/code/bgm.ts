import { _decorator, Component, director } from 'cc';
const { ccclass } = _decorator;

@ccclass('bgm')
export class bgm extends Component {
    private static _instance: bgm | null = null;

    onLoad() {
        if (bgm._instance && bgm._instance !== this) {
            this.node.destroy();
            return;
        }

        bgm._instance = this;

        if (this.node.parent) {
            this.node.setParent(null);
        }

        director.addPersistRootNode(this.node);
    }
}

