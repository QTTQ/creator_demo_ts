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
export default class Player extends cc.Component {
    private stepDistance: number //跳跃距离
    private jumpHeight: number//跳跃高度
    private jumpDuration: number//跳跃持续时间
    private fallDuration: number //坠落持续的时间
    private fallHeight: number //坠落的高度
    public canJump: boolean
    public index: number

    @property({ type: cc.AudioClip })
    private oneAudio: cc.AudioClip = null
    @property({ type: cc.AudioClip })
    private twoAudio: cc.AudioClip = null
    @property({ type: cc.AudioClip })
    private dieAudio: cc.AudioClip = null

    public init(stepDistance: number, jumpHeight: number, jumpDuration: number, fallDuration: number, fallHeight: number) {
        this.stepDistance = stepDistance
        this.jumpHeight = jumpHeight
        this.jumpDuration = jumpDuration
        this.fallDuration = fallDuration
        this.fallHeight = fallHeight
        this.index = 0
        this.canJump = true
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }
    public jump(step: string) {
        const stepArr = { "1": [this.stepDistance, this.oneAudio], "2": [this.stepDistance * 2, this.twoAudio] }
        this.canJump = false
        this.index += parseInt(step)
        let jumpAction = cc.jumpBy(this.jumpDuration, cc.v2(stepArr[step][0], 0), this.jumpHeight, 1)
        let finshAction = cc.callFunc(() => { this.canJump = true })
        this.node.runAction(cc.sequence(jumpAction, finshAction))
        cc.audioEngine.play(stepArr[step][1], false, 1)
    }

    public playerDie() {
        console.log("die le")
        this.canJump=false
        let fallAction = cc.moveBy(this.fallDuration, cc.v2(0, -this.fallHeight))
        this.node.runAction(fallAction)
        cc.audioEngine.play(this.dieAudio, false, 1)

    }
    // update (dt) {}
}
