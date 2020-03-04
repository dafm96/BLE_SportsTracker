import React, { Component } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';

class AssignPeripheralToPlayerForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ppgid: props.ppgid,
            peripherals: [],
            peripheralAddress: '',
            peripheralPosition: '',
            showAlert: false
        };
        this.handlePeripheralLocationChange = this.handlePeripheralLocationChange.bind(this);
        this.handlePeripheralChange = this.handlePeripheralChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handlePeripheralChange(event) {
        this.setState({ peripheralAddress: event.target.value });
    }
    handlePeripheralLocationChange(event) {
        this.setState({ peripheralPosition: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        event.preventDefault();
        fetch('/games/ppg/' + this.state.ppgid, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "peripheralAddress": this.state.peripheralAddress,
                "peripheralPosition": this.state.peripheralPosition
            })
        })
            .then(response => {
                if (response.ok) {
                    return window.location.reload();
                    // return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .catch((e) =>
                this.setState({ showAlert: true })
            )
    }

    componentDidMount() {
        fetch('/peripherals')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => this.setState({ peripherals: data.peripherals, peripheralAddress: data.peripherals.length ? data.peripherals[0].address : '' }))
            .catch(error => console.log(error, 'error'));
    }


    render() {
        return (
            <>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Select Peripheral</Form.Label>
                        <Form.Control
                            required
                            as="select"
                            onChange={this.handlePeripheralChange}>
                            {/*TODO make already choosen devices unavailable */}
                            {/*TODO choose body location */}
                            {/*TODO peripheral number */}
                            {this.state.peripherals.map(p => <option key={p.address} value={p.address}>{p.address}</option>)}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.locationSelect">
                        <Form.Label>Peripheral Location</Form.Label>
                        <Form.Control
                            required
                            as="select"
                            onChange={this.handlePeripheralLocationChange}>
                            <option ></option>
                            <option value="FOOT">Foot</option>
                            <option value="HAND">Hand</option>
                            {/* <option value="HIP">Hip</option> */}
                            <option value="BACK">Back</option>
                        </Form.Control>
                    </Form.Group>
                    <Alert show={this.state.showAlert} variant="danger">Device already in use!</Alert>
                    <Button type="submit">Submit Peripheral</Button>
                </Form>

            </>
        );
    }
}

export default function MyVerticallyCenteredModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Choose Peripheral
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AssignPeripheralToPlayerForm ppgid={props.ppgid} />
            </Modal.Body>
        </Modal>
    );
}