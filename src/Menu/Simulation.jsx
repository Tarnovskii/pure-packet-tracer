import React from 'react'
import s from "../stylesheets/menu.module.css";

export default (props) => {
    return (
        <div isopen={`${props.isOpen}`} className={s.menu_section_content}>
            <p>Старт</p>
            <p>Стоп</p>
            <hr/>
            <p>Сгенерувати данні</p>
            <hr/>
            <p>Налаштування вузла</p>
            <p>Налаштування каналу</p>
            <p>Налаштування відображення</p>
            <p>Налаштування симуляції</p>
        </div>
    )
}
