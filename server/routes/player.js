const express = require('express');
const router = new express.Router();
const connection = require('../db/mysql.js');
router.get('/players', (req, res) => {
    let q = 'SELECT * FROM Player';
    connection.query(q, function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        res.send((result));
    })
})

router.get('/players/:playerId', (req, res) => {
    let q = 'SELECT * FROM Player WHERE Player.idPlayer = ?';
    connection.query(q, [req.params.playerId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        res.send((result));
    })
})

router.post('/players', (req, res) => {
    console.log(req.body);
    let q = 'INSERT INTO Player (playerName, teamId) VALUES (?, ?)'
    connection.query(q, [req.body.playerName, req.body.teamId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error:' + err)
        }
        res.send((result));
    })
})

router.delete('/players/:playerId', (req, res) => {
    let q = 'DELETE FROM Player WHERE idPlayer = ?';
    connection.query(q, [req.params.playerId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error:' + err)
        }
        res.send((result));
    })
})


router.patch('/players/:playerId', (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['playerName', 'teamId']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    let q = 'UPDATE Player SET ? WHERE idPlayer = ?';
    connection.query(q, [req.body, req.params.playerId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error:' + err)
        }
        res.send((result));
    })
})

module.exports = router