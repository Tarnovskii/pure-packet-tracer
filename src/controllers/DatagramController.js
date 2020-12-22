import {Package} from "../classes/Package";
import {drawPackage, getNextPathForDatagramPackage, getStepSize} from "../Utils/controllersUtils";

export class DatagramController {
    constructor(network, ctx) {
        this.network = network;
        this.ctx = ctx;
        this.data = 5;
        this.packages = [];
        this.transmissions = new Array(this.data);
    }

    startTransmission = (sender, receiver) => {
        this.sender = sender;
        this.receiver = receiver;
        this.createPackages();
        this.packages.forEach((p, i) => this.createMoveInterval(p.pkg, p.steps, i))
    }


    createMoveInterval = (pkg, steps, index) => {
        getNextPathForDatagramPackage(
            this.network,
            pkg.getPrevNode(),
            pkg.getCurrentNode(),
            pkg.getReceiver(),
            (path) => {
                const step = getStepSize(pkg.getPos(), path.node.getPos(), path.link.getPower())
                path.link.updateIsBusyStatus(true)
                this.transmissions[index] = setInterval(async () => {
                    if (steps >= path.link.getPower()) {

                        pkg.setPrevNode(...path.link.getNodes().filter(n => n.getMac() !== path.node.getMac()))

                        pkg.updateCurrentNode(path.node)

                        if (pkg.getReceiver().getMac() === pkg.getCurrentNode().getMac()) {
                            path.link.updateIsBusyStatus(false)
                            clearInterval(this.transmissions[index])
                        } else {
                            clearInterval(this.transmissions[index])
                            steps = 0;
                            path.link.updateIsBusyStatus(false)
                            this.createMoveInterval(pkg, steps, index);
                        }
                    } else {
                        this.ctx.clearRect(0, 0, 5000, 2500)
                        this.network.drawAllNetwork(this.ctx);
                        this.packages.forEach((p) => {
                            drawPackage(this.ctx, p.pkg)
                        })
                        pkg.updatePosition(step)
                        steps++;
                    }
                }, path.link.getPower())
            }
        )
    }

    createPackages = () => {
        for (let i = 0; i < this.data; i++) {
            this.packages.push({
                pkg: new Package(
                    this.network.getStations()[this.sender],
                    this.network.getStations()[this.receiver],
                    `DATA_PACKAGE_${i}`
                ),
                steps: 0
            })
        }
    }
}
