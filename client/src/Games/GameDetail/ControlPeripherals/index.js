import React, { Component } from 'react';
import { Button, ButtonGroup } from "react-bootstrap";

class AllDevices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameId: props.gameId
        }
        this.startAllHandler = this.startAllHandler.bind(this)
        this.stopAllHandler = this.stopAllHandler.bind(this)
        this.shutdownAllHandler = this.shutdownAllHandler.bind(this)
    }

    startAllHandler() {
        let route = '/peripherals/game/' + this.state.gameId + '/start'

        fetch(route, {
            method: 'POST'
        }).then(() => {
            console.log("Started All");
        })
    }

    stopAllHandler() {
        let route = '/peripherals/game/' + this.state.gameId + '/stop'

        fetch(route, {
            method: 'POST'
        }).then(() => {
            console.log("Stopped All");
        })
    }

    shutdownAllHandler() {
        let route = '/peripherals/game/' + this.state.gameId + '/shutdown'

        fetch(route, {
            method: 'POST'
        }).then(() => {
            console.log("Shutdown All");
        })
    }

    render() {
        return (
            <div id="allDevices" >
                <ButtonGroup>
                    <Button onClick={this.startAllHandler} variant={"success"}>Start</Button>
                    <Button onClick={this.stopAllHandler} variant={"danger"}>Stop</Button>
                    <Button onClick={this.shutdownAllHandler} variant={"secondary"}>Shutdown</Button>
                </ButtonGroup>
            </div>
        )
    }
}
export default AllDevices