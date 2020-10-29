import React from 'react'

import s from '../../stylesheets/menu.module.css'

export default (props) => {
    return (
        <div isopen={`${props.isOpen}`} className={s.menu_section_content}>
            <p>Новий</p>
            <p>Відкрити</p>
            <hr/>
            <p>Зберегти</p>
            <p>Зберегти як...</p>
            <hr/>
            <p>Налаштування</p>
            <hr/>
            <p>Вийти</p>
        </div>
    )
}


