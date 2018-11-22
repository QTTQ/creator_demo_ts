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
import asyncAwait from "./asyncFn"

@ccclass
export default class Block extends cc.Component {
    // public init(fallDuration: number, fallHeight: number, destroyCb: Function) {
    public async fallBlock(fallDuration: number, fallHeight: number, preIndex: number, insistRatio: number) {
        return new Promise((resolve, reject) => {
            return this.scheduleOnce(() => {
                let fallBlockAction = cc.moveBy(fallDuration, cc.v2(0, -fallHeight))
                this.node.runAction(fallBlockAction)
                resolve(preIndex)
            }, insistRatio)
        });
    }
    // update (dt) {}
}
