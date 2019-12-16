const express = require('express');
const router = new express.Router();

// TODO refactor select *
router.get('/teams', (req, res) => {
    let q = 'SELECT * FROM Team';
    connection.query(q, function (err, result) {
        if (err) {
            res.status(400).send('DB error')
        }
        res.send((result));
    })
})

// TODO refactor select *
router.get('/teams/:teamId', (req, res) => {
    let q = 'SELECT * FROM Team WHERE Team.idTeam = ?';
    connection.query(q, [req.params.teamId], function (err, result) {
        if (err) {
            res.status(400).send('DB error')
        }
        res.send((result));
    })
})

router.post('/teams', (req, res) => {
    res.send(/* add team */);
})

router.delete('/teams/:teamsId', (req, res) => {
    res.send(/* delete team */);
})