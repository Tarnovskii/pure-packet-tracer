export class Node {
    constructor(ctx, pos = {}, params = {}) {
        this.ctx = ctx;
        this.pos = pos;
        this.params = params;
        this.links = [];
        this.mac = params.mac
        this.ip = params.ip
        this.table = {}
    }


    getId = () => this.params.id

    getIP = () => this.ip

    getTable = () => this.table;

    updateTable = (table) => this.table = table;

    getPos = () => this.pos;

    getMac = () => this.mac;

    getLinks = () => this.links;

    addLinks = (links) => this.links.push(...links)

    resetDraw = () => this.links.forEach(link => link.resetDraw())

    drawLinks = () => this.links.forEach(link => link.draw(this.ctx))

    draw = () => {
        this.ctx.globalCompositeOperation='source-over'
        this.ctx.fillStyle = this.params.region === 1 ? 'red' : this.params.region === 2 ? 'green' : this.params.region === null ? '#001cff' : 'yellow'

        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;
        this.ctx.shadowBlur = 2;
        this.ctx.shadowColor = 'black';
        this.ctx.fillRect(this.pos.x - 25, this.pos.y - 25, 50, 50)

        if (this.params.region === null) {
            this.ctx.fillRect(this.pos.x - 50, this.pos.y - 50, 100, 100)
        }


        this.ctx.font = 'bold 15px sans-serif';
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(this.params.id, this.pos.x, this.pos.y);
    }
}
