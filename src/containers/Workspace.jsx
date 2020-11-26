import React from 'react'

import s from '../stylesheets/workspace.module.css'
import {Network} from "../classes/Network";

export class Workspace extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
            ctrlDown: false,
            zoom: 0.38,
            nc: 0,
        }
    }

    componentDidMount() {
        window.onkeydown = (e) => {
            if (e.key === 'Control') {
                this.setState({
                    ctrlDown: true,
                })
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

        const Net = new Network(10, 10, 3);

        this.setState({
            nc:  Net.createNetwork(this.canvasRef.current.getContext('2d'))
        })
    }

    render() {
        return (
            <section style={{
                zoom: this.state.zoom
            }} className={s.wrapper}>
                <span>Кількість мереж: {this.state.nc.n}; Середній ступінь мережі:  {this.state.nc.p}; К-сть нод: {this.state.nc.c}; К-сть зв'язків: {this.state.nc.l}</span>
                <canvas width={5000} height={2500} ref={this.canvasRef}/>
            </section>
        );
    }

}
