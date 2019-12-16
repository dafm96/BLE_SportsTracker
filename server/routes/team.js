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

// TODO refactor select *
router.get('/teams/:teamId/players', (req, res) => {
    let q = 'SELECT * FROM BLE_Sports_Tracker.Team t INNER JOIN Player p on p.team_id = t.idTeam where t.idTeam = 1;';
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