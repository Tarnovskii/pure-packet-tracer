import React, {Fragment} from 'react'
import Menu from "./containers/Menu";
import {Workspace} from "./containers/Workspace";

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Menu/>
                <Workspace/>
            </Fragment>
        )
    }

}
