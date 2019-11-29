import React from 'react';
import './App.css';

class ShutdownButton extends React.Component {
  render() {
    return (
      <button onClick={this.props.handler}>
        {this.props.text}
      </button>
    );
  }
}

class StartButton extends React.Component {
  render() {
    return (
      <button onClick={this.props.handler}>
        {this.props.text}
      </button>
    );
  }
}

class AllDevices extends React.Component {
  constructor(props) {
    super(props);

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

  render() {
    return (
      <div id="allDevices" >
        <StartButton handler={this.startAllHandler} text={<i className="fa fa-play"></i>} />
        <StartButton handler={this.stopAllHandler} text={<i className="fa fa-stop"></i>} />
        <ShutdownButton
          handler={this.shutdownAllHandler}
          text={<i className="fa fa-power-off"></i>}
        />
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
          <StartButton
            handler={this.startHandler}
            text={this.props.startedRaw ? <i className="fa fa-stop"></i> : <i className="fa fa-play"></i>} />
        </td>
        <td>
          <ShutdownButton
            handler={this.shutdownHandler}
            text={<i className="fa fa-power-off"></i>} />
        </td>
      </tr>

    )
  };

}

class Peripherals extends React.Component {

  constructor(props) {
    super(props);
    this.state = { peripherals: '' };

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
        let newState  = { peripherals: '' };
        that.setState(newState);
        console.log('No connection to server.')
      })
  }

  async componentDidMount() {
    setInterval(() => {
      this.updateInfoOnPeripherals()
    }, 5000);
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
              <tr><th></th>{this.renderTableHeader()}<th colSpan="2">OPERATIONS</th></tr>
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

function App() {
  return (
    <div>
      <h1 id='title'>BLE Sports Tracker</h1>
      <Peripherals />
    </div>
  );
}

export default App;
