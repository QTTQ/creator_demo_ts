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
import Player from './Player'
import Block from './Block'
import Game from './Game'
import OverPanel from './OverPanel'


@ccclass
export default class Stage extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property(Player)
    private player: Player = null
    // @property(Block)
    // private block: Block = null

    @property(OverPanel)
    private overPanel: OverPanel = null


    private game: Game = null
    // onLoad () {}

    @property(cc.Prefab)
    private blockNode: cc.Prefab = null

    @property(cc.Integer)
    private stepDistance: number = 200

    @property(cc.Integer)
    private jumpHeight: number = 100

    @property(cc.Integer)
    private jumpDuration: number = 0.3

    @property(cc.Float)
    private fallDuration: number = 0.3


    @property(cc.Integer)
    private fallHeight: number = 500

    private lastBlockX = 0//记录上一次添加Block的x坐标
    private lastBlock = true//记录上一次是否添加了Block
    private blockList: Array<Block>//记录添加的Block列表

    private insistRatio: number = 3 //板坚持存在系数

    private shiftNum: number = 0
    public init(game: Game) {
        this.game = game
        this.player.init(this.stepDistance, this.jumpHeight, this.jumpDuration, this.fallDuration, this.fallHeight)
        this.blockList = []
        this.addBlock(cc.v2(0, -158))
        this.overPanel.hide()
        for (let i = 0; i < 5; i++) {
            if (!this.lastBlock || Math.random() > 0.5) {
                this.addBlock(cc.v2(this.lastBlockX + this.stepDistance, -158))
                this.lastBlock = true
            } else {
                this.addNull()
                this.lastBlock = false
            }
            this.lastBlockX = this.lastBlockX + this.stepDistance
        }
    }
    private addNull() {
        this.blockList.push(null)
    }
    private addBlock(position: cc.Vec2) {
        let block = cc.instantiate(this.blockNode)
        block.position = position
        this.node.addChild(block)
        this.blockList.push(block.getComponent(Block))
    }
    public async playerJump(str: string) {
        if (this.player.canJump) {
            this.player.jump(str)
            this.addScore(parseInt(str))
            this.moveStage(str)
            let listIndex = this.player.index - this.shiftNum
            let die = this.isDie(listIndex)
            if (die) {
                this.scheduleOnce(() => {
                    this.player.playerDie()
                    this.dieShowPanel(this.game.scoreLabel.string)
                }, this.jumpDuration)
            } else {
                let preIndex = this.player.index
                let blockIndex = await this.blockList[listIndex].fallBlock(this.fallDuration, this.fallHeight, preIndex, this.insistRatio)
                console.log(blockIndex, "-------------------------")
                if (blockIndex === this.player.index) {
                    this.player.playerDie()
                    this.dieShowPanel(this.game.scoreLabel.string)
                }
            }
            if (this.player.index % 10 === 0) {
                this.addBlockFallRatio()
            }
        }
    }
    private addBlockFallRatio() {
        this.insistRatio -= 0.1
    }
    private dieShowPanel(str: string) {
        this.overPanel.showPanel(str)
    }
    public isDie(num: number) {
        if (this.blockList[num] === null) {
            return true
        } else {
            return false
        }
    }
    private randomAddBlock() {
        if (!this.lastBlock || Math.random() > 0.5) {
            this.addBlock(cc.v2(this.lastBlockX + this.stepDistance, -158))
            this.lastBlock = true
        } else {
            this.addNull()
            this.lastBlock = false
        }
        this.lastBlockX = this.lastBlockX + this.stepDistance
    }
    private shiftBlokListTop() {
        this.blockList.shift()
        this.shiftNum++
        console.log(this.blockList)
    }
    private moveStage(step: string) {
        const stepDistanceArr = { "1": -this.stepDistance, "2": -this.stepDistance * 2 }
        let moveAction = cc.moveBy(this.jumpDuration, cc.v2(stepDistanceArr[step], 0))
        this.node.runAction(moveAction)
        for (let i = 0; i < parseInt(step); i++) {
            this.randomAddBlock()
            this.shiftBlokListTop()
        }
    }
    private addScore(n: number) {
        this.game.score += n
        this.game.scoreLabel.string = this.game.score + ""
    }
    // update (dt) {}
}
