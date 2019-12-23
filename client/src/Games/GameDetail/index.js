import React, { Component } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { Row, Col, ListGroup, Jumbotron, Container } from 'react-bootstrap';
const API = '/games/';

class GameDetailComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameId: props.match.params.gameId,
            game: {},
            isLoading: true,
            error: null,
        };
    }

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
            .then(data => this.setState({ game: data[0], isLoading: false }))
            .catch(error => this.setState({ error, isLoading: false }));
    }

    render() {
        const { game, isLoading, error } = this.state;

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
                        <h3 style={{display:"inline"}}>{game.team1_name}</h3> X <h3 style={{display:"inline"}}>{game.team2_name}</h3> 
                        </Jumbotron>
                        <ListGroup >
                            {/* {game.players.map(player =>
                                <ListGroup.Item key={player.idPlayer}>
                                    
                                    {player.playerName}
                                </ListGroup.Item>
                            )} */}
                        </ListGroup>
                    </>
                }
            </Container>
        );

    }
}

export default GameDetailComponent