import React, {Fragment} from 'react'
import Menu from "./containers/Menu";

export default class extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Fragment>
                <Menu/>
            </Fragment>
        )
    }

}
