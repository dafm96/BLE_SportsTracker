const express = require('express');
const router = new express.Router();
const connection = require('../db/mysql.js');

router.get('/games', (req, res) => {
    //TODO query params
    let q = 'SELECT * FROM gameTeams';
    connection.query(q, function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        res.send((result));
    })
})

router.get('/games/:gameId', (req, res) => {
    let q = 'SELECT * FROM gameTeams WHERE idGame = ?';
    connection.query(q, [req.params.gameId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        res.send((result));
    })
})

//TODO switch joins to view?
router.get('/games/:gameId/info', (req, res) => {
    let q = 'SELECT * FROM Player_Peripheral_Game ppg '
        + 'inner join Player p on ppg.player_id = p.idPlayer '
        + 'inner join Team t on p.teamId = t.idTeam '
        + 'left join Peripheral ph on ppg.peripheral_id = ph.idPeripheral '
        + 'where ppg.game_id = ?';
    connection.query(q, [req.params.gameId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        res.send((result));
    })
})

router.put('/games/:ppgid', (req, res) => {
    let q = "UPDATE Player_Peripheral_Game SET peripheral_id = (SELECT idPeripheral FROM BLE_Sports_Tracker.Peripheral where peripheralAddress = ?), "
    + "peripheral_position = ? "
    +"WHERE (idPlayer_Peripheral_Game = ?)";
    connection.query(q, [req.body.peripheralAddress, req.body.peripheralPosition, req.params.ppgid], function (err, result) {
        if (err) {
            console.log(err)
            return res.status(400).send('DB error')
        }
        console.log(result)
        res.send((result));
    })
})


router.post('/games', (req, res) => {
    //date must be "YYYY-MM-DD HH:MM:SS" 
    let q = 'INSERT INTO Game (gameDate, team1_id, team2_id) VALUES (?, ?, ?)'
    connection.query(q, [req.body.date, req.body.teamId_1, req.body.teamId_2], function (err, result) {
        if (err) {
            return res.status(400).send('DB error:' + err)
        }
        res.send((result));
    })
})

router.delete('/games/:gameId', (req, res) => {
    let q = 'DELETE FROM Game WHERE idGame = ?';
    connection.query(q, [req.params.gameId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error:' + err)
        }
        res.send((result));
    })
})

module.exports = router