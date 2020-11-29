import React, {Fragment} from 'react'

import s from '../stylesheets/workspace.module.css'
import {Network} from "../classes/Network";
import {LogicConnection} from "../controllers/LogicController";

export class Workspace extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            net: null,
            ctrlDown: false,
            zoom: 0.38,
            nc: 0,
        }
    }

    componentDidMount() {
        window.onkeydown = (e) => {
            switch (e.key.toUpperCase()) {
                case 'CONTROL': {
                    this.setState({
                        ctrlDown: true,
                    })
                    break;
                }
                case 'L': {
                    console.log(123)
                    break;
                }
                default: break;
            }
        }

        window.onkeyup = (e) => {
            if (e.key === 'Control') {
                this.setState({
                    ctrlDown: false,
                })
            }
        }
        window.onwheel = (e) => {
            if (this.state.ctrlDown) {
                this.setState({
                    zoom: this.state.zoom + (e.deltaY < 0 ? 0.05 : -0.05)
                })
            }
        }
    }

    clearCanvas = () => {
        this.canvasRef.current.getContext('2d').clearRect(0, 0, 5000, 2500)
    }

    createNetwork = () => {
        this.clearCanvas();
        const net = new Network(10, 10, 3, {
            width: 5000,
            height: 2500,
            padding: {
                top: 100,
                bottom: 100,
                left: 100,
                right: 100
            }
        });
        const nc = net.createNetwork(this.canvasRef.current.getContext('2d'))
        this.setState({
            net: net,
            nc: nc,
        }, () => this.drawAllNetwork())
    }

    drawAllNetwork = () => {
        this.clearCanvas();
        this.state.net.drawAllNetwork(this.canvasRef.current.getContext('2d'))
    }

    drawShortestPath = () => {
        this.clearCanvas();
        this.state.net.drawShortestPath(0, 2, this.canvasRef.current.getContext('2d'))
    }

    startLogicBroadcast = () => {
        const LC = new LogicConnection(this.state.net, this.canvasRef.current.getContext('2d'))
        LC.startTransmission(0, 2)
    }

    render() {
        return (
            <Fragment>
                <span>Кількість мереж: {this.state.nc.n - 1}; Середній ступінь мережі: {Math.round(this.state.nc.p)}; К-сть нод: {this.state.nc.c}; К-сть зв'язків: {this.state.nc.l}</span>
                <section className={s.controls}>
                    <button onClick={this.createNetwork}>Создать сеть</button>
                    <button onClick={this.drawAllNetwork}>Отрисовать всю сеть</button>
                    <button onClick={this.drawShortestPath}>Отрисовать Кратчайший путь</button>
                    <button onClick={this.startLogicBroadcast}>Начать логическое общение (WS1 -> WS3)</button>
                </section>
                <section style={{
                    zoom: this.state.zoom
                }} className={s.wrapper}>
                    <canvas width={5000} height={2500} ref={this.canvasRef}/>
                </section>
            </Fragment>
        );
    }

}
