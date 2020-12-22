import {Package} from "../classes/Package";
import {drawPackage, getNextPathForLogicPackage, getStepSize} from "../Utils/controllersUtils";

export class LogicConnection {
    constructor(network, ctx, headerSize, maxPackageSize) {
        this.network = network;
        this.ctx = ctx;
        this.transmission = () => {};
        this.steps = 0;
        this.leftPackages = 0;
        this.sentPackages = 0;
        this.headerSize = headerSize;
        this.maxPackageSize = maxPackageSize;
    }

    getNumberOfPackages = (size) => {
        const d = this.maxPackageSize - this.headerSize;
        return Math.ceil(size / d)
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
            this.package = new Package(this.network.getStations()[this.sender], this.network.getStations()[this.receiver], `DATA ${this.sentPackages} / ${this.leftPackages}`)
            return true;
        }

        if (packageType.split(' ')[0] === 'DATA') {
            this.package = new Package(this.network.getStations()[this.receiver], this.network.getStations()[this.sender], 'APPROVE_DATA')
            return true;
        }

        if (packageType === 'APPROVE_DATA') {
            if (this.leftPackages > 0) {
                this.package = new Package(this.network.getStations()[this.sender], this.network.getStations()[this.receiver], `DATA ${this.sentPackages} / ${this.leftPackages}`)
                this.sentPackages++;
                this.leftPackages--;
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

    startTransmission = (sender, receiver, size) => {
        this.sender = sender;
        this.receiver = receiver;
        this.leftPackages = this.getNumberOfPackages(size)
        this.createPackage()
        this.createMoveInterval();
    }

    createMoveInterval = () => {
        const path = getNextPathForLogicPackage(this.network, this.package.getCurrentNode(), this.package.getReceiver())
        const step = getStepSize(this.package.getPos(), path.node[0].getPos(), path.link[0].getPower())

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
                drawPackage(this.ctx, this.package)
                this.package.updatePosition(step)
                this.steps++;
            }
        }, path.link[0].getPower())
    }
}
