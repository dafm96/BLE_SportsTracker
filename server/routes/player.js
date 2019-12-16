const express = require('express');
const router = new express.Router();
const connection = require('../db/mysql.js');
router.get('/players', (req, res) => {
    connection.query('SELECT * FROM Player', function (err, result) {
        if (err){
            res.status(400).send('DB error')
        }
        res.send((result));

    })
})

router.get('/players/:playerId', (req, res) => {
    res.send(/* send specific player */);
})

router.post('/players', (req, res) => {
    res.send(/* add player */);
})

router.delete('/players/:playerId', (req, res) => {
    res.send(/* delete player */);
})

module.exports = router