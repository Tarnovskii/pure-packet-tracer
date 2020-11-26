export class Link {
    constructor(power, type, errorChance, nodes, token, style) {
        this.power = power;
        this.type = type;
        this.errorChance = errorChance;
        this.nodes = nodes
        this.token = token;
        this.isDraw = false;
        this.style = style
    }

    getToken = () => this.token

    draw = (ctx) => {
        if (!this.isDraw) {
            ctx.setLineDash([0,0]);
            ctx.lineWidth = '2'
            ctx.strokeStyle = 'black'
            ctx.globalCompositeOperation = 'destination-over'
            ctx.beginPath();
            ctx.moveTo(this.nodes[0].getPos().x, this.nodes[0].getPos().y);
            if (this.style === 'ground') {
                ctx.setLineDash([10, 16]);
                ctx.strokeStyle = '#ff6600'
                ctx.lineWidth = '10'
            }
            if (this.style === 'satellite') {
                ctx.setLineDash([10, 16]);
                ctx.strokeStyle = '#001cff'
                ctx.lineWidth = '10'
            }
            ctx.lineTo(this.nodes[1].getPos().x, this.nodes[1].getPos().y)
            ctx.stroke();
            this.isDraw = true;
        }
    }
}
