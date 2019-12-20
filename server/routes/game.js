const express = require('express');
const router = new express.Router();
const connection = require('../db/mysql.js');

router.get('/games', (req, res) => {
    //TODO query params
    let q = 'SELECT * FROM Game';
    connection.query(q, function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        res.send((result));
    })
})

router.get('/games/:gameId', (req, res) => {
    let q = 'SELECT * FROM Game WHERE Game.idGame = ?';
    connection.query(q, [req.params.gameId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        res.send((result));
    })
})

router.post('/games', (req, res) => {
    //date must be "YYYY-MM-DD HH:MM:SS" 
    let q = 'INSERT INTO Game (date, team1_id, team2_id) VALUES (?, ?, ?)'
    connection.query(q, [req.body.date, req.body.teamId_1, req.body.teamId_2], function (err, result) {
        if (err) {
            return res.status(400).send('DB error:' + err)
        }
        res.send((result));
    })
})

router.delete('/games/:gameId', (req, res) => {
    res.send(/* delete game */);
})

module.exports = router