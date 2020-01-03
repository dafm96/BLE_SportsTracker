import React, { Component } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { ListGroup, Container, Jumbotron, Button, ButtonToolbar } from 'react-bootstrap';
import AddPlayerModal from './AddPlayer';
const API = '/players';

class PlayerListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: [],
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
            .then(data => this.setState({ players: data, isLoading: false }))
            .catch(error => this.setState({ error, isLoading: false }));
    }

    render() {
        const { players, isLoading, error } = this.state;

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
                            <h1>Players</h1>
                        </Jumbotron>
                        <ButtonToolbar>
                            <Button variant="primary" onClick={() => this.setState({ modalShow: true })}>
                                Add New Player
                            </Button>

                            <AddPlayerModal
                                show={this.state.modalShow}
                                onHide={() => this.setState({ modalShow: false })}
                            />
                        </ButtonToolbar>
                        <ListGroup >
                            {players.map(player =>
                                <ListGroup.Item key={player.idPlayer}>
                                    <a href={"/players/" + player.idPlayer}>
                                        <p>{player.playerName} - {player.teamName}</p>
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

export default PlayerListComponent