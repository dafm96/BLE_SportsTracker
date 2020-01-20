import React, { Component } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { ListGroup, Jumbotron, Container } from 'react-bootstrap';
const API = '/players/';

class PlayerDetailComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playerId: props.match.params.playerId,
            player: {},
            isLoading: true,
            error: null,
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(API + this.state.playerId)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => this.setState({ player: data[0], isLoading: false }))
            .catch(error => this.setState({ error, isLoading: false }));
    }

    render() {
        const { player, isLoading, error } = this.state;

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
                            <h1>{player.playerName}</h1>
                        </Jumbotron>
                        {/*TODO Add more info and edit fields? */}
                        <ListGroup >
                            <h2>Team: {player.teamName}</h2>
                        </ListGroup>
                    </>
                }
            </Container>
        );

    }
}

export default PlayerDetailComponent