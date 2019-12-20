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
    res.send(/* send specific team */);
})

router.post('/games', (req, res) => {
    /* send in body date and teams */
    res.send(/* add game */);
})

router.delete('/games/:gameId', (req, res) => {
    res.send(/* delete game */);
})

module.exports = router