// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class OverPanel extends cc.Component {

    @property(cc.Label)
    scoreLabel: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    public showPanel(str: string) {
        this.node.active = true
        this.scoreLabel.string = str
    }
    public hide() {
        this.node.active = false
    }
    private panelEvent(e, str: string) {
        this.node.active = false
        cc.director.loadScene(str)
    }
    // update (dt) {}
}
