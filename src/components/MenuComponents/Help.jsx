import React from 'react'
import s from "../../stylesheets/menu.module.css";

export default (props) => {
    return (
        <div isopen={`${props.isOpen}`} className={s.menu_section_content}>

        </div>
    )
}
