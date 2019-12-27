import React, { Component } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { Row, Col, ListGroup, Container, Jumbotron } from 'react-bootstrap';
const API = '/teams';

class TeamListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            isLoading: false,
            error: null,
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