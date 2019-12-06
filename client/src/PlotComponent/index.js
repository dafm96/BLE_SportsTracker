import React from 'react';
import Plot from 'react-plotly.js';
import "./PlotComponent.css"

class UpdateButton extends React.Component {
    render() {
      return (
        <button onClick={this.props.handler} id="updateButton">
          {this.props.text}
        </button>
      );
    }
  }

class PlotComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [], layout: { width: 0, height: 0 } };
        this.updateHandler = this.updateHandler.bind(this)
    }

    updateHandler() {
        const that = this;
        fetch("/tracking")
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonData) {
                console.log(jsonData);
                that.setState({
                    data: [{
                        x: jsonData.data.map(d => d.X),
                        y: jsonData.data.map(d => d.Y),
                        type: 'scatter',
                        mode: 'lines',
                        marker: { color: 'red' }
                    }],
                    layout: { width: "100%", height: "100%" }
                });
            })
            .catch((e) => {
                let newState = { peripherals: '' };
                that.setState(newState);
                console.log('No connection to server.')
            })
    }


    render() {
        return (
            <div id="update">
                <UpdateButton handler={this.updateHandler} text={"Update"} />
                <div style={{ textAlign: 'center' }} >
                    <Plot
                        data={this.state.data}
                        layout={this.state.layout}
                    />
                </div>
            </div>
        );
    }
}

export default PlotComponent;