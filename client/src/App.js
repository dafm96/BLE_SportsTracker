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

function App() {
  return (
    <Router>
      <div>
        <h1 id='title'>BLE Sports Tracker</h1>
        <nav>
          <ul>
            <li>
              <Link to="/games">Games</Link>
            </li>
            <li>
              <Link to="/players">Players</Link>
            </li>
            <li>
              <Link to="/teams">Teams</Link>
            </li>
            <li>
              <Link to="/peripherals">Peripherals</Link>
            </li>
            <li>
              <Link to="/plot">Plot</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/players/:playerId" component={PlayerDetail} />
          <Route path="/players/" component={PlayerList} />
          <Route path="/games/:gameId" component={GameDetail} />
          <Route path="/games/" component={GameList} />
          <Route path="/teams/:teamId" component={TeamDetail} />
          <Route path="/teams" component={TeamList} />
          <Route path="/plot" component={PlotComponent} />
          <Route path="/peripherals" component={Peripherals} />

        </Switch>
      </div>
    </Router>
  );
}

export default App;
