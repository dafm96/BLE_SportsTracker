import React, { Component } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

class AddPlayerForm extends Component {
    constructor(props) {
        super(props);
        this.state = { playerName: '', playerTeamId: -1, teams: [] };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleTeamIdChange = this.handleTeamIdChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleNameChange(event) {
        this.setState({ playerName: event.target.value });
    }

    handleTeamIdChange(event) {
        this.setState({ playerTeamId: event.target.value });
    };

    handleSubmit = event => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        event.preventDefault();
        fetch('/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "playerName": this.state.playerName,
                "teamId": this.state.playerTeamId
            })
        })
            .then(response => {
                if (response.ok) {
                    return window.open("/players", "_self");
                    // return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
    }

    componentDidMount() {
        fetch('/teams')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => this.setState({ teams: data, playerTeamId: data[0].idTeam}))
            .catch(error => console.log(error, 'error'));
    }


    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group>
                    <Form.Label>Player name</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Player Name"
                        onChange={this.handleNameChange}
                    />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Select Team</Form.Label>
                    <Form.Control
                        required
                        as="select"
                        onChange={this.handleTeamIdChange}>
                        {console.log(this.state.playerTeamId)}
                        {this.state.teams.map(team => <option key={team.idTeam} value={team.idTeam}>{team.teamName}</option>)}
                    </Form.Control>
                </Form.Group>
                <Button type="submit">Submit Player</Button>
            </Form>
        );
    }
}

export default function AddPlayerModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    New Player
          </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddPlayerForm />
            </Modal.Body>
        </Modal>
    );
}