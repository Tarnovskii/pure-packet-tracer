export const parseNetworkToGraph = (network) => {
    let graph = {}

    network.forEach((node) => Object.assign(graph, nodeParser(node)))

    return graph;
}

export const dijkstra = (graph, startWs, endWs) => {
    const costs = Object.assign({[endWs]: Infinity}, graph[startWs]);
    const parents = {[endWs]: null};

    for (let child in graph.start) {
        parents[child] = startWs;
    }

    const processed = [];

    let node = lowestCostNode(costs, processed);

    while (node) {
        let cost = costs[node];
        let children = graph[node];
        for (let n in children) {
            let newCost = cost + children[n];
            if (!costs[n]) {
                costs[n] = newCost;
                parents[n] = node;
            }
            if (costs[n] > newCost) {
                costs[n] = newCost;
                parents[n] = node;
            }
        }
        processed.push(node);
        node = lowestCostNode(costs, processed);
    }
    let optimalPath = [endWs];
    let parent = parents[endWs];

    while (parent) {
        optimalPath.push(parent);
        parent = parents[parent];
    }

    optimalPath.push(startWs)
    optimalPath.reverse();


    const results = {
        distance: costs[endWs],
        path: optimalPath
    };

    return results;
}

const nodeParser = (node) => {
    let linkedNodes = {};

    node.getLinks().forEach((link) => link.getNodes().filter(n => n.getMac() !== node.getMac()).forEach((node) => {
        Object.assign(linkedNodes, {
            [node.getMac()]: link.getPower()
        })
    }))

    return {
        [node.getMac()]: linkedNodes
    }
}

const lowestCostNode = (costs, processed) => {
    return Object.keys(costs).reduce((lowest, node) => {
        if (lowest === null || costs[node] < costs[lowest]) {
            if (!processed.includes(node)) {
                lowest = node;
            }
        }
        return lowest;
    }, null);
};
