import {generateRandomInt} from "./general";

export const isPlaceBusy = (obj, pos, sub = 1, padding = 100) => {
    for (const n in obj[sub]) {
        const X = obj[sub][n].pos.x
        const Y = obj[sub][n].pos.y
        if ((pos.x >= X - padding) && (pos.x <= X + padding) && (pos.y >= Y - padding) && (pos.y <= Y + padding)) return true;
    }
}

export const generatePositionForObject = (canvas = {
    height: 100,
    width: 100,
    padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
}, sub = 1, subs = 1) => {
    const width = canvas.width / subs;

    return  {
        x:  generateRandomInt(canvas.padding.left + width * sub, width * (sub + 1) - canvas.padding.right),
        y:  generateRandomInt(canvas.padding.top, canvas.height - canvas.padding.bottom),
    };
}
