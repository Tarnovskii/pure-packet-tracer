export class Package {
    constructor(sender, receiver, packageType) {
        this.sender = sender;
        this.currentNode = sender;
        this.prevNode = sender;
        this.receiver = receiver;

        this.currentPosition = sender.getPos();
        this.packageType = packageType;
    }

    setPrevNode = (node) => this.prevNode = node;

    getPrevNode = () => this.prevNode

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

    getReceiver = () => this.receiver

}
