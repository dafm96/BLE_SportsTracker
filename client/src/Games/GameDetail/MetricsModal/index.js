import React, { Component } from 'react';
import { Modal, Spinner, ListGroup } from 'react-bootstrap';

class Metrics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ppgid: props.ppgid,
            metrics: {},
            isLoading: true,
            error: null
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        fetch('/games/metrics/' + this.state.ppgid)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => this.setState({ metrics: data, isLoading: false }))
            .catch(error => this.setState({ error, isLoading: false }));
    }


    render() {

        const { metrics, isLoading, error } = this.state;

        return (
            <>
                {error && <p>{error.message}</p>}
                {isLoading ?
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    <>
                        <ListGroup>
                            <ListGroup.Item>Jumps: {metrics.jumps || 0}</ListGroup.Item>
                            <ListGroup.Item>Steps: {metrics.steps || 0}</ListGroup.Item>
                            <ListGroup.Item>Distance: {metrics.distance || 0} m</ListGroup.Item>
                            <ListGroup.Item>Dribbles: {metrics.dribbles || 0}</ListGroup.Item>
                            <ListGroup.Item>Dribbling time: {metrics.dribbling_time || 0} s</ListGroup.Item>
                            <ListGroup.Item>Still Time: {metrics.still_time || 0} s</ListGroup.Item>
                            <ListGroup.Item>Walking Time: {metrics.walking_time || 0} s</ListGroup.Item>
                            <ListGroup.Item>Running Time: {metrics.running_time || 0} s</ListGroup.Item>
                        </ListGroup>
                    </>
                }
            </>
        );
    }
}

export default function MetricsModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Metrics
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Metrics ppgid={props.ppgid} />
            </Modal.Body>
        </Modal>
    );
}