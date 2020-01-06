import React, { Component } from 'react';
import { Button, ButtonGroup } from "react-bootstrap";

class AllDevices extends Component {
    constructor(props) {
        super(props);

        this.startAllHandler = this.startAllHandler.bind(this)
        this.stopAllHandler = this.stopAllHandler.bind(this)
    }

    startAllHandler() {
        let route = '/startAllRaw'

        fetch(route, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                //TODO send things here
            })
        })
            .then(() => {
                console.log("Started All");
            })
    }

    stopAllHandler() {
        let route = '/stopAllRaw'

        fetch(route, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                //TODO send things here
            })
        })
            .then(() => {
                console.log("Stopped All");
            })
    }

    shutdownAllHandler() {
        let route = '/shutdownAll'

        fetch(route, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                //TODO send things here
            })
        })
            .then(() => {
                console.log("Shutdown All");
            })
    }

    render() {
        return (
            <div id="allDevices" >
                <ButtonGroup>
                    <Button onClick={this.startAllHandler} variant={"success"}>Start</Button>
                    <Button onClick={this.stopAllHandler} variant={"danger"}>Stop</Button>
                </ButtonGroup>
            </div>
        )
    }
}
export default AllDevices