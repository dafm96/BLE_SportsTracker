const express = require('express')
const peripheralRouter = require('./routes/peripheral');
const playerRouter = require('./routes/player');
const app = express()

app.use(express.json());
app.use(express.static('./public')); //Send index.html page on GET /

app.use(peripheralRouter)
app.use(playerRouter)
app.listen(3000)