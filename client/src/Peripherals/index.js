import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, ButtonGroup } from 'react-bootstrap';

class ShutdownButton extends React.Component {
    render() {
        return (
            <Button variant={this.props.type} onClick={this.props.handler}>{this.props.text}</Button>
        );
    }
}

class StartButton extends React.Component {
    render() {
        return (
            <Button variant={this.props.type} onClick={this.props.handler}>{this.props.text}</Button>
        );
    }
}

class AllDevices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isButtonDisabled: false
        }
        this.onLaunchClicked = this.onLaunchClicked.bind(this);
        this.startAllHandler = this.startAllHandler.bind(this)
        this.stopAllHandler = this.stopAllHandler.bind(this)
        this.shutdownAllHandler = this.shutdownAllHandler.bind(this)
    }

    startAllHandler() {
        let route = '/startAllRaw'

        fetch(route, { method: 'POST' })
            .then(() => {
                console.log("Started All");
            })
    }

    stopAllHandler() {
        let route = '/stopAllRaw'

        fetch(route, { method: 'POST' })
            .then(() => {
                console.log("Stopped All");
            })
    }

    shutdownAllHandler() {
        let route = '/shutdownAll'

        fetch(route, { method: 'POST' })
            .then(() => {
                console.log("Shutdown All");
            })
    }


    onLaunchClicked(event) {
        event.preventDefault();
        this.setState({
            isButtonDisabled: true
        });

        this.startAllHandler();

        // **** here's the timeout ****
        setTimeout(() => {
            this.stopAllHandler();
            this.setState({ isButtonDisabled: false })
        }, 40000);

    }

    render() {
        return (
            <div id="allDevices" >
                <ButtonGroup>
                    <button className="btn bg-success" onClick={this.onLaunchClicked}
                        disabled={this.state.isButtonDisabled}>TEST</button>
                    <StartButton handler={this.startAllHandler} type={"success"} text={"Start All"} />
                    <StartButton handler={this.stopAllHandler} type={"danger"} text={"Stop All"} />
                    <ShutdownButton handler={this.shutdownAllHandler} type={"secondary"} text={"Shutdown All"} />
                </ButtonGroup>
            </div>
        )
    }
}

class PeripheralRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: props.index,
            address: props.address,
            connected: props.connected,
            startedRaw: props.startedRaw
        };

        this.startHandler = this.startHandler.bind(this)
        this.shutdownHandler = this.shutdownHandler.bind(this)

    }

    startHandler() {
        let route = ''
        if (this.props.startedRaw === true) {
            route = '/peripherals/' + this.props.address + '/stopRaw'
            console.log("Stopped " + this.props.address)
        }
        else {
            route = '/peripherals/' + this.props.address + '/startRaw'
            console.log("Started " + this.props.address)
        }

        fetch(route, { method: 'POST' })
            .then(
                this.setState({
                    startedRaw: !this.props.startedRaw
                })
            )
    }

    shutdownHandler() {
        let route = ''
        if (this.props.connected === true) {
            route = '/peripherals/' + this.props.address + '/shutdown'
            console.log("Shutdown " + this.props.address)

            fetch(route, { method: 'POST' })
                .then(
                    this.setState({
                        connected: !this.props.connected

                    })
                )
        }
    }

    render() {
        return (
            <tr>
                <td>{this.props.index}</td>
                <td>{this.props.address}</td>
                <td>{"" + this.props.connected}</td>
                <td>{"" + this.props.startedRaw}</td>
                <td>
                    <ButtonGroup >
                        <StartButton
                            handler={this.startHandler}
                            type={this.props.startedRaw ? "danger" : "success"}
                            text={this.props.startedRaw ? "Stop" : "Start"} />

                        <ShutdownButton
                            handler={this.shutdownHandler}
                            type={"secondary"}
                            text={"Shutdown"} />
                    </ButtonGroup>
                </td>
            </tr>

        )
    };

}

class Peripherals extends React.Component {

    constructor(props) {
        super(props);
        this.state = { peripherals: '' };
        this.updateInterval = null;
        this.updateInfoOnPeripherals = this.updateInfoOnPeripherals.bind(this)
    }

    updateInfoOnPeripherals() {
        const that = this;
        fetch("/peripherals")
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonData) {
                that.setState({ peripherals: jsonData.peripherals });
            })
            .catch((e) => {
                let newState = { peripherals: '' };
                that.setState(newState);
                console.log('No connection to server.')
            })
    }

    componentDidMount() {
        this.updateInfoOnPeripherals()
        this.updateInterval = setInterval(() => {
            this.updateInfoOnPeripherals()
        }, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval)
    }

    renderTableData() {
        let a = this.state.peripherals;
        if (a instanceof Object) {
            return a.map((peripheral, index) => {
                const { address, connected, startedRaw } = peripheral //destructuring
                return (
                    <PeripheralRow key={index}
                        index={index}
                        address={address}
                        connected={connected}
                        startedRaw={startedRaw}
                    />
                )
            })
        }
    }

    renderTableHeader() {
        let a = this.state.peripherals;
        if (a instanceof Object && a.length > 0) {
            let header = Object.keys(this.state.peripherals[0])
            return header.map((key, index) => {
                return <th key={index}>{key.toUpperCase()}</th>
            })
        }
    }

    onChangeHandler() {
        //this.updateInfoOnPeripherals();
    }

    render() {
        let a = this.state.peripherals;
        if (a instanceof Object && a.length > 0) {
            return (
                <div>
                    <AllDevices startedRaw={this.state.startedRaw} />
                    <table id='peripherals'>
                        <tbody>
                            <tr>
                                <th></th>
                                <th>ADDRESS</th>
                                <th>CONNECTED</th>
                                <th>STARTEDRAW</th>
                                <th>OPERATIONS</th>
                            </tr>
                            {this.renderTableData()}
                        </tbody>
                    </table>
                </div>
            )
        }
        else {
            return (
                <div id="noPeripherals"><p>No peripherals connected</p></div>
            )
        }
    }
}

export default Peripherals