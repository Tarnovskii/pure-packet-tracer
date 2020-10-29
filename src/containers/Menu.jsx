import React from 'react'
import s from '../stylesheets/menu.module.css'
import File from "../components/MenuComponents/File";
import Simulation from "../components/MenuComponents/Simulation";
import Help from "../components/MenuComponents/Help";


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentWindow: 0
        }
    }

    updateSectionStatus = (selectedID) => {
        this.setState({currentWindow: selectedID || 0})
    }


    render() {
        return (
            <div className={s.menu_wrapper} onMouseLeave={this.updateSectionStatus}>
                <div className={s.menu_section_wrapper}>
                    <button isactive={`${this.state.currentWindow === 1}`} onMouseOver={() => this.updateSectionStatus(1)}>Файл</button>
                    <File isOpen={this.state.currentWindow === 1}/>
                </div>
                <div className={s.menu_section_wrapper}>
                    <button isactive={`${this.state.currentWindow === 2}`} onMouseOver={() => this.updateSectionStatus(2)}>Симуляція</button>
                    <Simulation isOpen={this.state.currentWindow === 2}/>
                </div>
                <div className={s.menu_section_wrapper}>
                    <button isactive={`${this.state.currentWindow === 3}`} onMouseOver={() => this.updateSectionStatus(3)}>Довідка</button>
                    <Help isOpen={this.state.currentWindow === 3}/>
                </div>
                <div className={s.menu_section_wrapper}>
                    <button onMouseOver={() => this.updateSectionStatus(0)}>Про програму</button>
                </div>
            </div>
        )
    }
}
