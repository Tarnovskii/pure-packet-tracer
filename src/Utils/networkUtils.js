export const generateMacAddress = () => {
    let result = '';
    const symbols = 'abcdef0123456789';
    const length = symbols.length
    for (let i = 0; i < 12; i++) {
        result += symbols.charAt(Math.floor(Math.random() * length));
    }
    return result
}


export const createLinkTokenByNodes = (node1, node2) => {
    return (parseInt(node1.getMac(), 16) + parseInt(node2.getMac(), 16)).toString(16)
}


export const getNodesByMacsArray = (allNodes, macs, subs) => {
    let nodes = [];
    macs.forEach((m) => {
        for (let i = 0; i <= subs; i++) nodes.push(...allNodes[i].filter(n => n.getMac() === m))
    })
    return nodes
}

export const getPathLength = (node1, node2) => {
    const pos1 = node1.getPos(), pos2 = node2.getPos();
    return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2))
}
