const express = require('express');
const router = new express.Router();
const connection = require('../db/mysql.js');

// TODO refactor select *
router.get('/teams', (req, res) => {
    let q = 'SELECT * FROM Team';
    connection.query(q, function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        res.send((result));
    })
})

// TODO refactor select *
router.get('/teams/:teamId', (req, res) => {
    let q = 'SELECT * FROM Team WHERE Team.idTeam = ?';
    connection.query(q, [req.params.teamId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        res.send((result));
    })
})

// TODO refactor select *
router.get('/teams/:teamId/players', (req, res) => {
    let q = 'SELECT idTeam, teamName, idPlayer, playerName FROM teamPlayers WHERE idTeam = ?';
    connection.query(q, [req.params.teamId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        let out = {
            teamId: 0,
            teamName: '',
            players: []
        }
        result.map(data => {
            out.teamId = data.idTeam;
            out.teamName = data.teamName;
            out.players.push({playerId: data.idPlayer, playerName: data.playerName})
        })
        console.log(out)
        res.send(out);
    })
})

router.post('/teams', (req, res) => {
    let q = 'INSERT INTO Team (teamName) VALUES (?)'
    connection.query(q, [req.body.teamName], function (err, result) {
        if (err) {
            return res.status(400).send('DB error:' + err)
        }
        res.send((result));
    })
})

router.delete('/teams/:teamId', (req, res) => {
    let q = 'DELETE FROM Team WHERE idTeam = ?';
    connection.query(q, [req.params.teamId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error:' + err)
        }
        res.send((result));
    })
})

router.patch('/teams/:teamId', (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['teamName']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    let q = 'UPDATE Team SET ? WHERE idTeam = ?';
    connection.query(q, [req.body, req.params.teamId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error:' + err)
        }
        res.send((result));
    })
})

//test issue closing

module.exports = router