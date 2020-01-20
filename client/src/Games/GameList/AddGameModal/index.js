import React, { Component } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class AddGameForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team1Id: '',
            team2Id: '',
            date: new Date(),
            teams: []
        };
        this.handleChangeTeam1 = this.handleChangeTeam1.bind(this);
        this.handleChangeTeam2 = this.handleChangeTeam2.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChangeTeam1(event) {
        this.setState({ team1Id: event.target.value });
    }
    handleChangeTeam2(event) {
        this.setState({ team2Id: event.target.value });
    }
    handleChangeDate(date) {
        this.setState({ date: date });
    }

    handleSubmit = event => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        event.preventDefault();
        fetch('/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "date": this.state.date.toISOString().slice(0, 19).replace('T', ' '),
                "teamId_1": this.state.team1Id,
                "teamId_2": this.state.team2Id
            })
        })
            .then(response => {
                if (response.ok) {
                    return window.open("/games", "_self");
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
            .then(data => this.setState({ teams: data }))
            .catch(error => console.log(error));
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="selectTeam1">
                    <Form.Label>Select Team 1</Form.Label>
                    <Form.Control
                        required
                        as="select"
                        onChange={this.handleChangeTeam1}>
                        {this.state.teams.map(team => <option key={team.idTeam} value={team.idTeam}>{team.teamName}</option>)}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="selectTeam2">
                    <Form.Label>Select Team 2</Form.Label>
                    <Form.Control
                        required
                        as="select"
                        onChange={this.handleChangeTeam2}>
                        {this.state.teams.map(team => <option key={team.idTeam} value={team.idTeam}>{team.teamName}</option>)}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="selectDate">
                    <Form.Label>Select Date:</Form.Label>
                    <br/>
                    <DatePicker
                        selected={this.state.date}
                        onChange={date => this.handleChangeDate(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={30}
                        timeCaption="time"
                        dateFormat="yyyy-MM-dd HH:mm:ss"
                    />
                </Form.Group>
                <Button type="submit">Submit Game</Button>
            </Form>
        );
    }
}

export default function NewGameModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    New Game
          </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddGameForm />
            </Modal.Body>
        </Modal>
    );
}