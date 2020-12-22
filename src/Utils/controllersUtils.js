import {createLinkTokenByNodes} from "./networkUtils";
import {generateRandomInt} from "./general";

export const getStepSize = (startPos, endPos, power) => {
    return {
        x: (endPos.x - startPos.x) / power,
        y: (endPos.y - startPos.y) / power
    }
}

export const drawPackage = (ctx, pkg) => {
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = 'orange'
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 2;
    ctx.shadowColor = 'black';
    ctx.fillRect(pkg.getPos().x, pkg.getPos().y, 50, 50)

    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#0037ff";
    ctx.fillText(pkg.getPackageType(), pkg.getPos().x, pkg.getPos().y);
}

export const getNextPathForLogicPackage = (network, currentNode, receiver) => {
    return {
        node: network.getNodeByMac(currentNode.getTable()[receiver.getMac()].path[1]),
        link: network.getLinksByNodes([currentNode, ...network.getNodeByMac(currentNode.getTable()[receiver.getMac()].path[1])])
    }
}

export const getNextPathForDatagramPackage = (network, prevNode, currentNode, receiver, callback) => {
    let nodes = [];

    currentNode.getLinks().map(l => {
        return l.getNodes().filter(n => {
            return (n.getMac() !== currentNode.getMac()) && (n.getMac() !== prevNode.getMac())
        })
    }).forEach(n => nodes.push(...n))

    let bestNode = network.getNodeByMac(currentNode.getTable()[receiver.getMac()].path[1]);
    let bestLink = network.getLinksByNodes([currentNode, ...network.getNodeByMac(currentNode.getTable()[receiver.getMac()].path[1])])

    let searchInterval = setInterval(async () => {
        if (!bestLink[0].getIsBusyStatus() && (bestNode[0].getMac() !== prevNode.getMac())) {
            clearInterval(searchInterval)
            await callback({
                node: bestNode[0],
                link: bestLink[0],
            })
        } else {
            bestNode = [nodes[generateRandomInt(0, nodes.length)]]
            bestLink = network.getLinksByNodes([currentNode, bestNode[0]])
        }
    }, 50)
}
