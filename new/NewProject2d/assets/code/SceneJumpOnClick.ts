import { _decorator, Component, director, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SceneJumpOnClick')
export class SceneJumpOnClick extends Component {
  @property
  scene: string = 'scene-第一关.scene';

  private _btn: Button | null = null;

  onEnable() {
    this._btn = this.getComponent(Button);
    if (this._btn) {
      this._btn.node.on(Button.EventType.CLICK, this._onClick, this);
    }
  }

  onDisable() {
    if (this._btn) {
      this._btn.node.off(Button.EventType.CLICK, this._onClick, this);
    }
  }

  private _onClick() {
    const name = this.scene.endsWith('.scene') ? this.scene.slice(0, -6) : this.scene;
    director.loadScene(name);
  }
}

