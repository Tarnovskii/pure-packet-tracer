export class WorkStation {
    constructor(mac, pos, ip) {
        this.mac = mac;
        this.pos = pos;
        this.ip = ip;
        this.table = {}
    }

    updateTable = (table) => this.table = table;

    getTable = () => this.table

    getId = () => 'ws'

    getIP = () => this.ip

    getLinks = () => [this.link]

    getPos = () => this.pos

    createLink = (link) => {
        this.link = link;
    }

    resetDraw = () => {}

    drawLinks = () => {}

    getMac = () => this.mac

    draw = (ctx) => {
        ctx.globalCompositeOperation='source-over'
        ctx.fillStyle = 'black'
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 2;
        ctx.shadowColor = 'black';
        ctx.fillRect(this.pos.x - 50, this.pos.y - 50, 100, 100)

        ctx.textAlign = "center";
        ctx.font = 'bold 48px sans-serif';
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.fillText('WS', this.pos.x, this.pos.y);
    }
}
