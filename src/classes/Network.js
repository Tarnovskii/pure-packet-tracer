import {Node} from "./Node";
import {Link} from "./Link";
import {WorkStation} from "./WorkStation";

export class Network {
    constructor(minNodes, maxNodes, subs, avPower, workNode, weights) {
        this.avPower = avPower;
        this.workNode = workNode;
        this.weights = weights;
        this.minNodes = minNodes;
        this.maxNodes = maxNodes;
        this.subs = subs;
        this.nodes = [];
        this.stations = [];
    }

    _generateMacAddress = () => {
        let result = '';
        const symbols = 'abcdef0123456789';
        const length = symbols.length
        for (let i = 0; i < 12; i++) {
            result += symbols.charAt(Math.floor(Math.random() * length));
        }
        return result
    }

    _getLinkIdFromNodes = (node1, node2) => {
        return (parseInt(node1.getMac(), 16) + parseInt(node2.getMac(), 16)).toString(16)
    }

    _getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    _isPlaceBusy = (pos, j) => {
        for (const n in this.nodes[j]) {
            const X = this.nodes[j][n].pos.x
            const Y = this.nodes[j][n].pos.y
            if ((pos.x >= X - 300) && (pos.x <= X + 300) && (pos.y >= Y - 300) && (pos.y <= Y + 300)) return true;
        }
    }

    _generateNodePosition = (j) => {
        const width = 4900 / this.subs;

        let pos = {
            x: this._getRandomInt(100 + width * j, width * (j + 1)),
            y: this._getRandomInt(100, 2400),
        };
        while (this._isPlaceBusy(pos, j)) {
            pos = {
                x: this._getRandomInt(100 + width * j, width * (j + 1)),
                y: this._getRandomInt(100, 2400),
            }
        }
        return pos;
    }

    _createNodes = (ctx) => {
        for (let j = 0; j < this.subs; j++) {
            this.nodes.push([]);
            const c = this._getRandomInt(this.minNodes, this.maxNodes);
            for (let i = 0; i < c; i++) {
                this.nodes[j].push(new Node(ctx, this._generateNodePosition(j), {
                    id: this.nodes[j].length,
                    region: j + 1,
                    mac: this._generateMacAddress(),
                }))
            }
        }
    }

    _distributeFriends = () => {
        this.nodes.forEach(net => {
            const length = net.length
            const middle = Math.round(length / 2)
            const isOdd = (length % 2 === 0)
            net.forEach((node, index) => {
                if (index !== length - 1) {
                    const link = new Link(1,1,1, [node, net[index + 1]], this._getLinkIdFromNodes(node, net[index + 1]))
                    node.addLinks([link])
                    net[index + 1].addLinks([link])
                }
            })
            net.forEach((node, index) => {
                if (index < middle - 1) {
                    const link = new Link(1,1,1, [node, net[length - 1 - index]], this._getLinkIdFromNodes(node, net[length - 1 - index]))
                    node.addLinks([link])
                    net[length - 1 - index].addLinks([link])
                }
            })

            if (isOdd) {
                const link1 = new Link(1,1,1, [net[0], net[middle - 1]], this._getLinkIdFromNodes(net[0], net[middle - 1]))
                const link2 = new Link(1,1,1, [net[length - 1], net[middle]], this._getLinkIdFromNodes(net[length - 1], net[middle]))
                net[0].addLinks([link1])
                net[middle - 1].addLinks([link1])
                net[middle].addLinks([link2])
                net[length -1].addLinks([link2])
            } else {
                const link = new Link(1,1,1, [net[middle - 1], net[0]], this._getLinkIdFromNodes(net[middle - 1], net[0]))
                net[0].addLinks([link])
                net[middle - 1].addLinks([link])
            }
        })
    }

    _createStations = () => {
        for (let i = 0; i < this.subs; i++) {
            this.nodes[i].push(new WorkStation(this._generateMacAddress(), this._generateNodePosition(i)))
            const link = new Link(1,1,1, [this.nodes[i][3], this.nodes[i][this.nodes[i].length - 1]])
            this.nodes[i][3].addLinks([link])
            this.nodes[i][this.nodes[i].length - 1].createLink(link)
        }
    }

    _createSatellite = (node1, node2) => {
        const link = new Link(1,1,1, [node1, node2], this._getLinkIdFromNodes(node1, node2), 'satellite')
        node1.addLinks([link])
        node2.addLinks([link])
    }

    _createGroundConnection = (node1, node2) => {
        const link = new Link(1,1,1, [node1, node2], this._getLinkIdFromNodes(node1, node2), 'ground')
        node1.addLinks([link])
        node2.addLinks([link])
    }


    createNetwork = (ctx) => {
        this._createNodes(ctx);
        this._distributeFriends();
        this._createGroundConnection(this.nodes[0][this._getRandomInt(0, this.nodes[0].length)], this.nodes[1][this._getRandomInt(0, this.nodes[1].length)])
        this._createSatellite(this.nodes[1][this._getRandomInt(0, this.nodes[1].length)], this.nodes[2][this._getRandomInt(0, this.nodes[2].length)])
        this._createStations()
        this.nodes.forEach(s => s.forEach(n => n.draw(ctx)))
        let p = 0
        let c = 0
        this.nodes.forEach(net => {
            c += net.length;
            net.forEach(node => p += node.getLinks().length)
        })
        return {
            c: c,
            n: this.nodes.length,
            p: p / c,
            l: p
        }
    }
}
