import {getNodesByMacsArray} from "../Utils/networkUtils";

export class LogicConnection {
    constructor(network, ctx) {
        this.network = network;
        this.ctx = ctx;
        this.transmission = () => {};
        this.steps = 0;
    }

    startTransmission = (sender, receiver) => {
        this.package = new Package(this.network.getStations()[sender], this.network.getStations()[receiver])
        this.createMoveInterval();
    }

    createMoveInterval = () => {
        const path = this.getNextPath(this.package.getCurrentNode(), this.package.getReceiver())
        this.package.updateCurrentNode(path.node[0])
        const step = this.getStepSize(this.package.getPos(), this.package.getCurrentNode().getPos(), path.link[0].getPower())

        this.transmission = setInterval(() => {
            if (this.steps >= path.link[0].getPower()) {
                clearInterval(this.transmission)
                this.steps = 0;
                this.createMoveInterval();
            } else {
                this.ctx.clearRect(0, 0, 5000, 2500)
                this.network.drawShortestPath(0, 2, this.ctx);
                this.moveTo(this.package.getPos())
                this.package.updatePosition(step)
                this.steps++;
            }
        }, path.link[0].getPower())
    }

    getNextPath = (currentNode, receiver) => {
        console.log(currentNode, receiver)
        return {
            node: this.network.getNodeByMac(currentNode.getTable()[receiver.getMac()].path[1]),
            link: this.network.getLinksByNodes([currentNode, ...this.network.getNodeByMac(currentNode.getTable()[receiver.getMac()].path[1])])
        }
    }

    moveTo = (pos) => {
        this.ctx.globalCompositeOperation = 'source-over'
        this.ctx.fillStyle = 'orange'
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;
        this.ctx.shadowBlur = 2;
        this.ctx.shadowColor = 'black';
        this.ctx.fillRect(pos.x, pos.y, 50, 50)
    }

    getStepSize = (startPos, endPos, power) => {
        return {
            x: (endPos.x - startPos.x) / power,
            y: (endPos.y - startPos.y) / power
        }
    }
}

class Package {
    constructor(sender, receiver, packageType) {
        this.sender = sender;
        this.receiver = receiver;
        this.currentPosition = sender.getPos();
        this.currentNode = sender;
        this.packageType = packageType;
    }

    updateCurrentNode = (node) => {
        this.currentNode = node;
    }

    getCurrentNode = () => this.currentNode

    getPos = () => this.currentPosition

    updatePosition = (incPos) => {
        this.currentPosition = {
            x: this.currentPosition.x + incPos.x,
            y: this.currentPosition.y + incPos.y
        }
    }

    getSender = () => this.sender
    getReceiver = () => this.receiver

}

/*draw = (ctx) => {
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = 'orange'

    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 2;
    ctx.shadowColor = 'black';
    ctx.fillRect(this.pos.x, this.pos.y, 50, 50)
}*/
