import React, { Component } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import AssignPeripheralModal from './AssignPeripheralModal'
import MetricsModal from './MetricsModal'
import { Jumbotron, Container, CardColumns, Card, Button, Row, Col, ButtonGroup, Table } from 'react-bootstrap';
import AllDevices from './ControlPeripherals';
const API = '/games/';

class GameDetailComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameId: props.match.params.gameId,
            game: {},
            gameInfo: {},
            isLoading: true,
            error: null,
            peripheralModalShow: false,
            metricsModalShow: false
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
                            <h2>{new Date(game.gameDate).toLocaleString('pt')}</h2>
                        </Jumbotron>
                        <Container>
                            <AllDevices gameId={game.idGame}></AllDevices>
                        </Container>

                        <Container>
                            <Row>
                                <Col>
                                    <h2>{game.team1_name}</h2>
                                    <CardColumns style={{ columnCount: "1" }}>
                                        {gameInfo.filter(g => g.teamId === game.team1_id)
                                            .map(ppg =>
                                                <Card key={ppg.idPlayer_Peripheral_Game}>
                                                    <Card.Body>
                                                        <Card.Title><h4>{ppg.playerName}</h4></Card.Title>
                                                        <ButtonGroup>
                                                            <Button variant="primary" onClick={() => this.setState({ peripheralModalShow: ppg.idPlayer_Peripheral_Game })}>
                                                                Add Peripheral
                                                                </Button>
                                                            <Button variant="success" onClick={() => this.setState({ metricsModalShow: ppg.idPlayer_Peripheral_Game })}>
                                                                Metrics
                                                                </Button>
                                                        </ButtonGroup>

                                                        <Table striped bordered hover responsive size="sm">
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Address</th>
                                                                    <th>Position</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {JSON.parse(ppg.peripherals).map(peripheral =>
                                                                    <tr key={peripheral.peripheral_id}>
                                                                        <td>{peripheral.number}</td>
                                                                        <td>{peripheral.peripheralAddress}</td>
                                                                        <td>{peripheral.peripheral_position}</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </Table>

                                                        <AssignPeripheralModal
                                                            ppgid={ppg.idPlayer_Peripheral_Game}
                                                            show={this.state.peripheralModalShow === ppg.idPlayer_Peripheral_Game}
                                                            onHide={() => this.setState({ peripheralModalShow: false })}
                                                        />
                                                        <MetricsModal
                                                            ppgid={ppg.idPlayer_Peripheral_Game}
                                                            show={this.state.metricsModalShow === ppg.idPlayer_Peripheral_Game}
                                                            onHide={() => this.setState({ metricsModalShow: false })}
                                                        />
                                                        {/*TODO ver se o sensor está conectado*/}
                                                        {/*TODO mudar sensor*/}
                                                        {/* TODO add button to start/stop/shutdown peripheral for each player and unbind */}
                                                    </Card.Body>
                                                </Card>
                                            )}
                                    </CardColumns>
                                </Col>
                                <Col><h2>{game.team2_name}</h2>
                                    <CardColumns style={{ columnCount: "1" }}>
                                        {gameInfo.filter(g => g.teamId === game.team2_id)
                                            .map(ppg =>
                                                <Card key={ppg.idPlayer_Peripheral_Game}>
                                                    <Card.Body>
                                                        <Card.Title><h4>{ppg.playerName}</h4></Card.Title>
                                                        <ButtonGroup>
                                                            <Button variant="primary" onClick={() => this.setState({ peripheralModalShow: ppg.idPlayer_Peripheral_Game })}>
                                                                Add Peripheral
                                                                </Button>
                                                            <Button variant="success" onClick={() => this.setState({ metricsModalShow: ppg.idPlayer_Peripheral_Game })}>
                                                                Metrics
                                                                </Button>
                                                        </ButtonGroup>

                                                        <Table striped bordered hover responsive size="sm">
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Address</th>
                                                                    <th>Position</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {JSON.parse(ppg.peripherals).map(peripheral =>
                                                                    <tr key={peripheral.peripheral_id}>
                                                                        <td>{peripheral.number}</td>
                                                                        <td>{peripheral.peripheralAddress}</td>
                                                                        <td>{peripheral.peripheral_position}</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </Table>

                                                        <AssignPeripheralModal
                                                            ppgid={ppg.idPlayer_Peripheral_Game}
                                                            show={this.state.peripheralModalShow === ppg.idPlayer_Peripheral_Game}
                                                            onHide={() => this.setState({ peripheralModalShow: false })}
                                                        />
                                                        <MetricsModal
                                                            ppgid={ppg.idPlayer_Peripheral_Game}
                                                            show={this.state.metricsModalShow === ppg.idPlayer_Peripheral_Game}
                                                            onHide={() => this.setState({ metricsModalShow: false })}
                                                        />
                                                        {/*TODO ver se o sensor está conectado*/}
                                                        {/*TODO mudar sensor*/}
                                                        {/* TODO add button to start/stop/shutdown peripheral for each player and unbind */}
                                                    </Card.Body>
                                                </Card>
                                            )}
                                    </CardColumns>
                                </Col>
                            </Row>
                        </Container>
                    </>
                }
            </Container>
        );

    }
}

export default GameDetailComponent