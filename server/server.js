const express = require('express')
const peripheralRouter = require('./routes/peripheral');
const playerRouter = require('./routes/player');
const teamRouter = require('./routes/team');
const gameRouter = require('./routes/game');
const app = express()
const broker = require('./broker')

app.use(express.json());
app.use(express.static('./public')); //Send index.html page on GET /

app.use(peripheralRouter);
app.use(playerRouter);
app.use(teamRouter);
app.use(gameRouter);
app.listen(3000)