import {getNodesByMacsArray} from "../Utils/networkUtils";

export class LogicConnection {
    constructor(network, ctx) {
        this.network = network;
        this.ctx = ctx;
        this.transmission = () => {};
        this.steps = 0;
        this.data = 3;
    }

    createPackage = () => {

        if (this.package === undefined) {
            this.package = new Package(this.network.getStations()[this.sender], this.network.getStations()[this.receiver], 'CONNECTION_REQUEST')
            return true;
        }

        const packageType = this.package.getPackageType()

        if (packageType === 'CONNECTION_REQUEST') {
            this.package = new Package(this.network.getStations()[this.receiver], this.network.getStations()[this.sender], 'APPROVE_CONNECTION_REQUEST')
            return true;
        }

        if (packageType === 'APPROVE_CONNECTION_REQUEST') {
            this.package = new Package(this.network.getStations()[this.sender], this.network.getStations()[this.receiver], 'DATA')
            return true;
        }

        if (packageType === 'DATA') {
            this.package = new Package(this.network.getStations()[this.receiver], this.network.getStations()[this.sender], 'APPROVE_DATA')
            return true;
        }

        if (packageType === 'APPROVE_DATA') {
            if (this.data > 0) {
                this.package = new Package(this.network.getStations()[this.sender], this.network.getStations()[this.receiver], 'DATA')
                this.data--;
            } else {
                this.package = new Package(this.network.getStations()[this.sender], this.network.getStations()[this.receiver], 'CLOSE_CONNECTION_REQUEST')
            }
            return true;
        }

        if (packageType === 'CLOSE_CONNECTION_REQUEST') {
            this.package = new Package(this.network.getStations()[this.receiver], this.network.getStations()[this.sender], 'APPROVE_CLOSE_CONNECTION_REQUEST')
            return true;
        }

        return false
    }

    startTransmission = (sender, receiver) => {
        this.sender = sender;
        this.receiver = receiver;
        this.createPackage(sender, receiver)
        this.createMoveInterval();
    }

    createMoveInterval = () => {
        const path = this.getNextPath(this.package.getCurrentNode(), this.package.getReceiver())
        const step = this.getStepSize(this.package.getPos(), path.node[0].getPos(), path.link[0].getPower())

        this.transmission = setInterval(() => {
            if (this.steps >= path.link[0].getPower()) {
                this.package.updateCurrentNode(path.node[0])
                if (this.package.getReceiver().getMac() === this.package.getCurrentNode().getMac()) {
                    clearInterval(this.transmission)
                    this.steps = 0;
                    if (this.createPackage()) this.createMoveInterval();
                } else {
                    clearInterval(this.transmission)
                    this.steps = 0;
                    this.createMoveInterval();
                }
            } else {
                this.ctx.clearRect(0, 0, 5000, 2500)
                this.network.drawShortestPath(this.sender, this.receiver, this.ctx);
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

        this.ctx.font = 'bold 30px sans-serif';
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "#0037ff";
        this.ctx.fillText(this.package.getPackageType(), pos.x, pos.y);

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

    getPackageType = () => this.packageType

    updateCurrentNode = (node) => {
        this.currentNode = node
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
