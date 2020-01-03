import React, { Component } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { ListGroup, Jumbotron, Container } from 'react-bootstrap';
const API = '/teams/';

class TeamDetailComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            teamId: props.match.params.teamId,
            team: {},
            isLoading: true,
            error: null,
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(API + this.state.teamId + '/players')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => this.setState({ team: data, isLoading: false }))
            .catch(error => this.setState({ error, isLoading: false }));
    }

    render() {
        const { team, isLoading, error } = this.state;

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
                            <h1>{team.teamName}</h1>
                        </Jumbotron>
                        <h3 >Players:</h3>
                        <ListGroup >
                            {team.players.map(player =>
                                <ListGroup.Item key={player.playerId}>
                                    <a href={'/players/' + player.playerId}>
                                     {console.log(player)}
                                    {player.playerName}
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

export default TeamDetailComponent