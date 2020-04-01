import React from 'react';
import './App.css';
import Peripherals from "./Peripherals"
import PlotComponent from "./PlotComponent";
import TeamList from "./Teams/TeamList";
import TeamDetail from './Teams/TeamDetail';
import GameList from "./Games/GameList";
import GameDetail from "./Games/GameDetail";
import PlayerList from "./Players/PlayerList";
import PlayerDetail from "./Players/PlayerDetail";


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import { Nav, Navbar } from 'react-bootstrap';

function App() {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <Router>
      <div>
        {/* <h1 id='title'>BLE Sports Tracker</h1> */}
        <Navbar expanded={expanded} expand="md" bg="dark" variant="dark">
          <Navbar.Brand>BLE Sports Tracker</Navbar.Brand>
          <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} onClick={() => setExpanded(false)} to="/games">Games</Nav.Link>
              <Nav.Link as={Link} onClick={() => setExpanded(false)} to="/players">Players</Nav.Link>
              <Nav.Link as={Link} onClick={() => setExpanded(false)} to="/teams">Teams</Nav.Link>
              {/* <Nav.Link as={Link} onClick={() => setExpanded(false)} to="/peripherals">Peripherals</Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Navbar>


        {/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/players/:playerId" component={PlayerDetail} />
          <Route path="/players/" component={PlayerList} />
          <Route path="/games/:gameId" component={GameDetail} />
          <Route path="/games/" component={GameList} />
          <Route path="/teams/:teamId" component={TeamDetail} />
          <Route path="/teams" component={TeamList} />
          <Route path="/peripherals" component={Peripherals} />

        </Switch>
      </div>
    </Router>
  );
}

export default App;
