import React, { Component } from 'react';
import AddGameModal from "./AddGameModal"
import Spinner from 'react-bootstrap/Spinner';
import { ListGroup, Container, Jumbotron, ButtonToolbar, Button } from 'react-bootstrap';
const API = '/games';

class GameListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            games: [],
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
            .then(data => this.setState({ games: data, isLoading: false }))
            .catch(error => this.setState({ error, isLoading: false }));
    }

    render() {
        const { games, isLoading, error } = this.state;

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
                            <h1>Games</h1>
                        </Jumbotron>
                        <ButtonToolbar>
                            <Button variant="primary" onClick={() => this.setState({ modalShow: true })}>
                                Add New Team
                            </Button>

                            <AddGameModal
                                show={this.state.modalShow}
                                onHide={() => this.setState({ modalShow: false })}
                            />
                        </ButtonToolbar>
                        <ListGroup >
                            {games.map(game =>
                                <ListGroup.Item key={game.idGame}>
                                    <a href={"/games/" + game.idGame}>
                                        <h3 style={{ display: "inline" }}>{game.team1_name}</h3> X <h3 style={{ display: "inline" }}>{game.team2_name}</h3>

                                    </a>
                                    <br />
                                    {new Date(game.gameDate).toLocaleString('pt')}

                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </>
                }
            </Container>
        );

    }
}

export default GameListComponent