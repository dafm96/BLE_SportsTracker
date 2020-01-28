import React, { Component, useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import AssignPeripheralModal from './AssignPeripheralModal'
import MetricsModal from './MetricsModal'
import { Jumbotron, Container, CardColumns, Card, Button, Row, Col, ButtonGroup, Table, Alert } from 'react-bootstrap';
import AllDevices from './ControlPeripherals';
const API = '/games/';

const UnassignButton = (props) => {
    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
        if (isLoading) {
            fetch('/games/ppg/' + props.pgpid, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.ok) {
                        return window.location.reload();
                        // return response.json();
                    } else {
                        console.log("error")
                    }
                })
        }
    }, [isLoading, props.pgpid]);

    const handleClick = () => setLoading(true);

    return (
        <Button
            variant="danger"
            disabled={isLoading}
            onClick={!isLoading ? handleClick : null}
        >
            {isLoading ? 'Loading…' : 'Remove'}
        </Button>
    );
}

class TeamComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ppg: props.ppg,
            peripheralModalShow: false,
            metricsModalShow: false
        }
    }

    render() {
        const { ppg, peripheralModalShow, metricsModalShow } = this.state
        return (
            <Card key={ppg.idPlayer_Peripheral_Game}>
                <Card.Body>
                    <Card.Title><h4>{ppg.playerName}</h4></Card.Title>
                    <ButtonGroup>
                        <Button variant="primary" onClick={() => this.setState({ peripheralModalShow: ppg.idPlayer_Peripheral_Game })}>
                            Add Peripheral</Button>
                        <Button variant="success" onClick={() => this.setState({ metricsModalShow: ppg.idPlayer_Peripheral_Game })}>
                            Metrics</Button>
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
                                peripheral.peripheral_id &&
                                <tr key={peripheral.peripheral_id}>
                                    <td>{peripheral.number}</td>
                                    <td>{peripheral.peripheralAddress}</td>
                                    <td>{peripheral.peripheral_position}</td>
                                    <td><UnassignButton pgpid={peripheral.idPG_Peripherals} /></td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    <AssignPeripheralModal
                        ppgid={ppg.idPlayer_Peripheral_Game}
                        show={peripheralModalShow === ppg.idPlayer_Peripheral_Game}
                        onHide={() => this.setState({ peripheralModalShow: false })}
                    />
                    <MetricsModal
                        ppgid={ppg.idPlayer_Peripheral_Game}
                        show={metricsModalShow === ppg.idPlayer_Peripheral_Game}
                        onHide={() => this.setState({ metricsModalShow: false })}
                    />
                    {/*TODO ver se o sensor está conectado*/}
                    {/* TODO add button to start/stop/shutdown peripheral for each player and unbind */}
                </Card.Body>
            </Card>
        )
    }
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
            teamMetrics: {}
        };
        this.updateInterval = null;
        this.updateInfoOnTeamMetrics = this.updateInfoOnTeamMetrics.bind(this)
    }

    updateInfoOnTeamMetrics() {
        const that = this;
        fetch("/games/" + this.state.gameId + "/possession")
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonData) {
                that.setState({ teamMetrics: jsonData });
            })
            .catch((e) => {
                console.log('No connection to server.')
            })
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval)
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
                    .then(() => {
                        this.updateInfoOnTeamMetrics()
                        this.updateInterval = setInterval(() => {
                            this.updateInfoOnTeamMetrics()
                        }, 10000);
                    })
            )
            .catch(error => this.setState({ error, isLoading: false }));

    }

    render() {
        const { game, gameInfo, isLoading, error, teamMetrics } = this.state;

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
                                    <h2>{game.team1_name}</h2> <Alert variant='secondary'>Team dribbling time: {teamMetrics['team1Dribbling'] ? teamMetrics.team1Dribbling : '0 '} s</Alert>
                                    <CardColumns style={{ columnCount: "1" }}>
                                        {gameInfo.filter(g => g.teamId === game.team1_id)
                                            .map(ppg =>
                                                <TeamComponent key={ppg.idPlayer_Peripheral_Game} ppg={ppg} />
                                            )}
                                    </CardColumns>
                                </Col>
                                <Col>
                                    <h2>{game.team1_name}</h2> <Alert variant='secondary'>Team dribbling time: {teamMetrics['team2Dribbling'] ? teamMetrics.team2Dribbling : '0 '} s</Alert>
                                    <CardColumns style={{ columnCount: "1" }}>
                                        {gameInfo.filter(g => g.teamId === game.team2_id)
                                            .map(ppg =>
                                                <TeamComponent key={ppg.idPlayer_Peripheral_Game} ppg={ppg} />
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