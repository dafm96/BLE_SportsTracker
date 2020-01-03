import React, { Component } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

class AddTeamForm extends Component {
    constructor(props) {
        super(props);
        this.state = { teamName: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        this.setState({ teamName: event.target.value });
    }

    handleSubmit = event => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        console.log(this.state.teamName)
        event.preventDefault();
        fetch('/teams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "teamName": this.state.teamName
            })
        })
            .then(response => {
                if (response.ok) {
                    return window.open("/teams", "_self");
                    // return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })


    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group>
                    <Form.Label>Team name</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Team name"
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Button type="submit">Submit form</Button>
            </Form>
        );
    }
}

export default function AddTeamModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    New Team
          </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddTeamForm />
            </Modal.Body>
        </Modal>
    );
}