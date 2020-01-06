import React, { Component } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import AssignPeripheralModal from './AssignPeripheralModal'
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
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
                                                            <Button variant="primary" onClick={() => this.setState({ modalShow: ppg.idPlayer_Peripheral_Game })}>
                                                                Assign Peripheral
                                                            </Button>

                                                            <AssignPeripheralModal
                                                                ppgid={ppg.idPlayer_Peripheral_Game}
                                                                show={this.state.modalShow === ppg.idPlayer_Peripheral_Game}
                                                                onHide={() => this.setState({ modalShow: false })}
                                                            />
                                                        </>
                                                        : <>{ppg.peripheralAddress}</>}
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
                                                            <Button variant="primary" onClick={() => this.setState({ modalShow: ppg.idPlayer_Peripheral_Game })}>
                                                                Assign Peripheral
                                                            </Button>

                                                            <AssignPeripheralModal
                                                                ppgid={ppg.idPlayer_Peripheral_Game}
                                                                show={this.state.modalShow === ppg.idPlayer_Peripheral_Game}
                                                                onHide={() => this.setState({ modalShow: false })}
                                                            />
                                                        </>
                                                        : <>{ppg.peripheralAddress}</>}
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