import React, {Fragment} from 'react'

const {ipcRenderer} = window.require('electron');

const stations = ['WS0', 'WS1', 'WS2'];

import s from '../stylesheets/workspace.module.css'
import {Network} from "../classes/Network";
import {LogicConnection} from "../controllers/LogicController";
import {DatagramController} from "../controllers/DatagramController";

export class Workspace extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            net: null,
            ctrlDown: false,
            zoom: 0.38,
            nc: 0,
            type: 'null',
            sender: 'WS0',
            receiver: 'WS1',
            isNetworkCreated: false
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
                    break;
                }
                default:
                    break;
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
        const LC = new LogicConnection(this.state.net, this.canvasRef.current.getContext('2d'), 18, 128)
        LC.startTransmission(+this.state.sender[2], +this.state.receiver[2], 256)
    }

    startDatagramBroadcast = () => {
        const DC = new DatagramController(this.state.net, this.canvasRef.current.getContext('2d'))
        DC.startTransmission(+this.state.sender[2], +this.state.receiver[2])
    }

    _displaySettings = () => (
        <>
            <button onClick={this.drawAllNetwork}>Вся мережа</button>
            <button onClick={this.drawShortestPath}>Найкоротший шлях</button>
            <select onClick={e => this.setState({
                type: e.target.value
            })}>
                <option value={'null'}>Режим</option>
                <option value={'lm'}>Логічний режим</option>
                <option value={'dm'}>Дейтаграмний режим</option>
            </select>
        </>
    )

    _targetsSettings = () => (
        <>
            <select onClick={e => this.setState({
                sender: e.target.value
            })}>
                {stations.filter(s => s !== this.state.receiver).map((s, index) => <option key={index} value={s}>{s}</option>)}
            </select>
            <select onClick={e => this.setState({
                receiver: e.target.value
            })}>
                {stations.filter(s => s !== this.state.sender).map((s, index) => <option key={index} value={s}>{s}</option>)}
            </select>
        </>
    )

    _start = () => (
        <>
            <button onClick={this._startHandler}>Почати</button>
        </>
    )

    _startHandler = () => {
        if (this.state.type === 'dm') this.startDatagramBroadcast()
        else this.startLogicBroadcast()
    }

    renderControls = () => (
        <section className={s.controls}>
            <button onClick={() => {
                this.createNetwork();
                this.setState({
                    isNetworkCreated: true
                })

            }}>Сгенерувати мережу
            </button>
            {this.state.isNetworkCreated ? this._displaySettings() : null}
            {this.state.type !== 'null' ? this._targetsSettings() : null}
            {this.state.isNetworkCreated && (this.state.type !== 'null') ? this._start() : null}
            {}
        </section>
    )

    render() {
        return (
            <Fragment>
                <span>Кількість мереж: {this.state.nc.n - 1}; Середній ступінь мережі: {Math.round(this.state.nc.p)}; К-сть нод: {this.state.nc.c}; К-сть зв'язків: {this.state.nc.l}</span>
                {this.renderControls()}
                <section style={{
                    zoom: this.state.zoom
                }} className={s.wrapper}>
                    <canvas width={5000} height={2500} ref={this.canvasRef}/>
                </section>
            </Fragment>
        );
    }

}
