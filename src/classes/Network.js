import {Node} from "./Node";
import {Link} from "./Link";
import {WorkStation} from "./WorkStation";
import {dijkstra, parseNetworkToGraph} from "../Utils/NetworkParser";
import {generateRandomInt} from "../Utils/general";
import {generatePositionForObject, isPlaceBusy} from "../Utils/canvasUtils";
import {createLinkTokenByNodes, generateMacAddress, getNodesByMacsArray} from "../Utils/networkUtils";

const WEIGHTS = [2, 3, 5, 7, 10, 12, 15, 20, 21, 25, 27, 28]

export class Network {
    constructor(minNodes, maxNodes, subs, canvas) {
        this.minNodes = minNodes;
        this.maxNodes = maxNodes;
        this.subs = subs;
        this.nodes = [];
        this.stations = [];
        this.canvas = canvas;
        this.packages = []
        this.listener = null
    }

    subscribe = (listener) => {
        this.listener = listener;
    }

    _createNodes = (ctx) => {
        for (let j = 0; j < this.subs; j++) {
            const ipBody = `172.${j}.0.`
            this.nodes.push([]);
            const c = generateRandomInt(this.minNodes, this.maxNodes);
            for (let i = 0; i < c; i++) {
                let position = {}
                while (true) {
                    position = generatePositionForObject(this.canvas, j, this.subs)
                    if (!isPlaceBusy(this.nodes, position, j, 300)) break;
                }
                this.nodes[j].push(new Node(ctx, position, {
                    id: this.nodes[j].length,
                    region: j + 1,
                    mac: generateMacAddress(),
                    ip: ipBody + (i + 1)
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
                    const link = new Link(
                        WEIGHTS[generateRandomInt(0, WEIGHTS.length)],
                        1, 1,
                        [node, net[index + 1]],
                        createLinkTokenByNodes(node, net[index + 1])
                    )
                    node.addLinks([link])
                    net[index + 1].addLinks([link])
                }
            })
            net.forEach((node, index) => {
                if (index < middle - 1) {
                    const link = new Link(
                        WEIGHTS[generateRandomInt(0, WEIGHTS.length)],
                        1, 1,
                        [node, net[length - 1 - index]],
                        createLinkTokenByNodes(node, net[length - 1 - index])
                    )
                    node.addLinks([link])
                    net[length - 1 - index].addLinks([link])
                }
            })


            if (isOdd) {
                const link1 = new Link(
                    WEIGHTS[generateRandomInt(0, WEIGHTS.length)],
                    1, 1,
                    [net[0], net[middle - 1]],
                    createLinkTokenByNodes(net[0], net[middle - 1])
                )
                const link2 = new Link(
                    WEIGHTS[generateRandomInt(0, WEIGHTS.length)],
                    1, 1,
                    [net[length - 1], net[middle]],
                    createLinkTokenByNodes(net[length - 1], net[middle])
                )
                net[0].addLinks([link1])
                net[middle - 1].addLinks([link1])
                net[middle].addLinks([link2])
                net[length - 1].addLinks([link2])
            } else {
                const link = new Link(
                    WEIGHTS[generateRandomInt(0, WEIGHTS.length)],
                    1, 1,
                    [net[middle - 1], net[0]],
                    createLinkTokenByNodes(net[middle - 1], net[0])
                )
                net[0].addLinks([link])
                net[middle - 1].addLinks([link])
            }
        })
    }

    _createStations = () => {
        for (let i = 0; i < this.subs; i++) {

            let position = {}
            while (true) {
                position = generatePositionForObject(this.canvas, i, this.subs)
                if (!isPlaceBusy(this.nodes, position, i, 300)) break;
            }

            let station = new WorkStation(generateMacAddress(), position, `172.${i}.0.0`)
            const link = new Link(
                WEIGHTS[generateRandomInt(0, WEIGHTS.length)],
                1, 1,
                [station, this.nodes[i][3]],
                createLinkTokenByNodes(this.nodes[i][3], station)
            )
            this.nodes[i][3].addLinks([link])
            station.createLink(link)
            this.nodes[i].push(station)
            this.stations.push(station);
        }
    }

    _createSatellite = (ctx, node1, node2) => {
        const node = new Node(ctx, {x: 2500, y: 100}, {
            id: 99,
            region: null,
            mac: generateMacAddress(),
            ip: `123.123.1.23`
        })
        const link1 = new Link(56, 1, 1,
            [node, node1],
            createLinkTokenByNodes(node, node1),
            'satellite'
        )
        const link2 = new Link(56, 1, 1,
            [node, node2],
            createLinkTokenByNodes(node, node2),
            'satellite'
        )
        node.addLinks([link1, link2])
        node1.addLinks([link1])
        node2.addLinks([link2])

        this.nodes.push([node])
    }

    _createGroundConnection = (node1, node2) => {
        const link = new Link(
            WEIGHTS[generateRandomInt(0, WEIGHTS.length)],
            1, 1,
            [node1, node2],
            createLinkTokenByNodes(node1, node2),
            'ground'
        )
        node1.addLinks([link])
        node2.addLinks([link])
    }

    _getNetworkObjects = () => {
        let allNodes = [];
        this.nodes.map(net => allNodes.push(...net))
        return allNodes;
    }

    _getLinksByNodes = (nodes) => {
        let links = [];
        nodes.forEach((n, index) => {
            if (index < nodes.length - 1) {
                let nodeLinks = n.getLinks().filter(l => l.getToken() === createLinkTokenByNodes(n, nodes[index + 1]));
                links.push(...nodeLinks)
            }
        })
        return links;
    }

    _drawNodes = (nodes, ctx) => {
        nodes.forEach(n => n.draw(ctx))
    }

    _drawLinks = (links, ctx) => {
        links.forEach(l => l.draw(ctx))
        links.forEach(n => n.resetDraw())
    }

    _drawAllLinks = (nodes) => {
        nodes.forEach(n => n.drawLinks())
        nodes.forEach(n => n.resetDraw())
    }

    addPackage = (pkg) => this.packages.push(pkg)

    getStations = () => this.stations;

    drawAllNetwork = (ctx) => {
        this._drawNodes(this._getNetworkObjects(this.nodes), ctx)
        this._drawAllLinks(this._getNetworkObjects(this.nodes));
    }

    createNetwork = (ctx) => {
        this._createNodes(ctx);
        this._distributeFriends();
        this._createGroundConnection(
            this.nodes[0][generateRandomInt(0, this.nodes[0].length)],
            this.nodes[1][generateRandomInt(0, this.nodes[1].length)]
        )
        this._createSatellite(ctx,
            this.nodes[1][generateRandomInt(0, this.nodes[1].length)],
            this.nodes[2][generateRandomInt(0, this.nodes[2].length)]
        )
        this._createStations()
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

    drawShortestPath(sender, receiver, ctx) {
        let graph = parseNetworkToGraph(this._getNetworkObjects());
        let nodes = dijkstra(graph, this.stations[sender].getMac(), this.stations[receiver].getMac())
        let ns = getNodesByMacsArray(this.nodes, nodes.path, this.subs)
        let ls = this._getLinksByNodes(ns);
        this._drawLinks(ls, ctx);
        this._drawNodes(ns, ctx);
    }
}
