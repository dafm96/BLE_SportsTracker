import React, { Component } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { Form, ListGroup, Container, Jumbotron, Button, ButtonToolbar, Modal } from 'react-bootstrap';
const API = '/teams';

class NameForm extends Component {
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

function MyVerticallyCenteredModal(props) {
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
                <NameForm />
            </Modal.Body>
        </Modal>
    );
}

class TeamListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            isLoading: false,
            error: null,
            modalShow: false
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(API)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => this.setState({ teams: data, isLoading: false }))
            .catch(error => this.setState({ error, isLoading: false }));
    }

    render() {
        const { teams, isLoading, error } = this.state;

        return (
            <Container>
                {error && <p>{error.message}</p>
                }
                {isLoading ?
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    <>
                        <Jumbotron fluid className="text-center">
                            <h1>Teams</h1>
                        </Jumbotron>
                        <ButtonToolbar>
                            <Button variant="primary" onClick={() => this.setState({ modalShow: true })}>
                                Add New Team
                            </Button>

                            <MyVerticallyCenteredModal
                                show={this.state.modalShow}
                                onHide={() => this.setState({ modalShow: false })}
                            />
                        </ButtonToolbar>
                        <ListGroup >
                            {teams.map(team =>
                                <ListGroup.Item key={team.idTeam}>
                                    <a href={"/teams/" + team.idTeam}>
                                        <p>{team.teamName}</p>
                                    </a>

                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </>
                }
            </Container>
        );

    }
}

export default TeamListComponent