import React, { Component } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { Jumbotron, Container, CardColumns, Card, Button, Modal, Form } from 'react-bootstrap';
const API = '/games/';

class NameForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ppgid: props.ppgid,
            peripherals: [],
            peripheralAddress: ''
        };
        this.handlePeripheralChange = this.handlePeripheralChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handlePeripheralChange(event) {

        this.setState({ peripheralAddress: event.target.value });
        console.log(event.target.value)
    }

    handleSubmit = event => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        event.preventDefault();
        fetch('/games/' + this.state.ppgid, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "peripheralAddress": this.state.peripheralAddress
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
    }

    componentDidMount() {
        console.log(this.state.ppgid)
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
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Select Peripheral</Form.Label>
                    <Form.Control
                        required
                        as="select"
                        onChange={this.handlePeripheralChange}>
                        {this.state.peripherals.map(p => <option key={p.address} value={p.address}>{p.address}</option>)}
                        {console.log(this.state.peripherals)}
                    </Form.Control>
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
                    Choose Peripheral
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <NameForm ppgid={props.ppgid} />
            </Modal.Body>
        </Modal>
    );
}

class GameDetailComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameId: props.match.params.gameId,
            game: {},
            gameInfo: {},
            isLoading: true,
            error: null,
            modalShow: false
        };
    }
    // TODO do this in only 1 fetch?
    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(API + this.state.gameId)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => this.setState({ game: data[0] }))
            .then(
                fetch(API + this.state.gameId + '/info')
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error('Something went wrong ...');
                        }
                    })
                    .then(data => {
                        console.log(data);
                        this.setState({ gameInfo: data, isLoading: false })
                    })
            )
            .catch(error => this.setState({ error, isLoading: false }));
    }

    render() {
        const { game, gameInfo, isLoading, error } = this.state;

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
                            <h3 style={{ display: "inline" }}>{game.team1_name}</h3> X <h3 style={{ display: "inline" }}>{game.team2_name}</h3>
                            <h2>{game.gameDate}</h2>
                        </Jumbotron>
                        {/* TODO add button to start/stop/shutdown for all peripherals in game */}

                        <CardColumns style={{ columnCount: "2" }}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{game.team1_name}</Card.Title>
                                    {gameInfo.filter(g => g.teamId === game.team1_id)
                                        .map(ppg =>
                                            <>
                                                <Card.Text>
                                                    {ppg.playerName} {ppg.peripheral_id == null ?
                                                        <>
                                                            <Button variant="primary" onClick={() => this.setState({ modalShow: true })}>
                                                                Assign Peripheral
                                                            </Button>

                                                            <MyVerticallyCenteredModal
                                                                ppgid={ppg.idPlayer_Peripheral_Game}
                                                                show={this.state.modalShow}
                                                                onHide={() => this.setState({ modalShow: false })}
                                                            />
                                                        </>
                                                        : <>{ppg.peripheral_id}</>}
                                                    {/* TODO add button to start/stop/shutdown peripheral for each player and unbind */}
                                                </Card.Text>
                                            </>
                                        )}
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{game.team2_name}</Card.Title>
                                    {gameInfo.filter(g => g.teamId === game.team2_id)
                                        .map(ppg =>
                                            <>
                                                <Card.Text>
                                                    {ppg.playerName} {ppg.peripheral_id == null ?
                                                        <>
                                                            <Button variant="primary" onClick={() => this.setState({ modalShow: true })}>
                                                                Assign Peripheral
                                                            </Button>

                                                            <MyVerticallyCenteredModal
                                                                ppgid={ppg.idPlayer_Peripheral_Game}
                                                                show={this.state.modalShow}
                                                                onHide={() => this.setState({ modalShow: false })}
                                                            />
                                                        </>
                                                        : <>{ppg.peripheral_id}</>}
                                                    {/* TODO add button to start/stop/shutdown peripheral for each player and unbind */}
                                                </Card.Text>
                                            </>
                                        )}
                                </Card.Body>
                            </Card>
                        </CardColumns>
                    </>
                }
            </Container>
        );

    }
}

export default GameDetailComponent