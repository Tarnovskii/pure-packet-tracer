export class LogicConnection {
    constructor(sender, receiver, network, ctx) {
        this.sender = sender;
        this.receiver = receiver
        this.network = network;
        this.ctx = ctx;
    }

    /*actionListener = (action) => {
        switch(action.type) {
            case 'SEND_OPEN_CONNECTION_REQUEST': {

            }
            case 'GET_OPEN_CONNECTION_REQUEST': {

            }
            case 'APPROVE_OPEN_CONNECTION_REQUEST': {

            }
            case 'SEND_DATA': {

            }
            case 'GET_DATA': {

            }
            case 'APPROVE_DATA': {

            }
            case 'SEND_CLOSE_CONNECTION_REQUEST': {

            }
            case 'GET_CLOSE_CONNECTION_REQUEST': {

            }
            case 'APPROVE_CLOSE_CONNECTION_REQUEST': {

            }
            default: {

            }
        }
    }*/
}
