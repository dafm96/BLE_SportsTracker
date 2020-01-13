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
router.get('/games/metrics/:ppgId', (req, res) => {
    let q = 'SELECT * FROM Metrics WHERE ppg_id = ?';
    connection.query(q, [req.params.ppgId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        res.send(result[0]);
    })
})

//TODO switch joins to view?
router.get('/games/:gameId/info', (req, res) => {
    // let q = 'SELECT * FROM Player_Peripheral_Game ppg '
    //     + 'inner join Player p on ppg.player_id = p.idPlayer '
    //     + 'inner join Team t on p.teamId = t.idTeam '
    //     + 'inner join Peripheral ph on ppg.peripheral_id = ph.idPeripheral '
    //     + 'where ppg.game_id = ?';
    // let q = "SELECT * FROM Player_Peripheral_Game ppg "
    //     + "inner join Player p on ppg.player_id = p.idPlayer "
    //     + "inner join Team t on p.teamId = t.idTeam "
    //     + "left join PG_Peripherals pgp on pgp.ppg_id = ppg.idPlayer_Peripheral_Game "
    //     + "left join Peripheral pp on pgp.peripheral_id = pp.idPeripheral "
    //     + "where ppg.game_id = ? ";

    let q = "SELECT idPlayer_Peripheral_Game, "
        + "player_id, "
        + "game_id, "
        + "idPlayer, "
        + "playerName, "
        + "teamId, "
        + "idTeam, "
        + "teamName,  "
        + "CONCAT('[', "
        + "GROUP_CONCAT(JSON_OBJECT( "
        + "'idPG_Peripherals', idPG_Peripherals, "
        + "'peripheral_id', peripheral_id,  "
        + "'peripheral_position', peripheral_position, "
        + "'ppg_id', ppg_id, "
        + "'idPeripheral', idPeripheral, "
        + "'peripheralAddress', peripheralAddress, "
        + "'number', number)),']') peripherals "
        + "FROM Player_Peripheral_Game ppg "
        + "inner join Player p on ppg.player_id = p.idPlayer "
        + "inner join Team t on p.teamId = t.idTeam  "
        + "left join PG_Peripherals pgp on pgp.ppg_id = ppg.idPlayer_Peripheral_Game "
        + "left join Peripheral pp on pgp.peripheral_id = pp.idPeripheral "
        + "where ppg.game_id = ? "
        + "group by idPlayer_Peripheral_Game";
    connection.query(q, [req.params.gameId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        res.send((result));
    })
})
//TODO make sure a device is not repeated on a game
router.put('/games/:ppgid', (req, res) => {
    // let q = "UPDATE Player_Peripheral_Game "
    //     + "SET peripheral_id = (SELECT idPeripheral FROM BLE_Sports_Tracker.Peripheral where peripheralAddress = ?), "
    //     + "peripheral_position = ? "
    //     + "WHERE (idPlayer_Peripheral_Game = ?)";
    let q = "INSERT INTO PG_Peripherals (peripheral_id, peripheral_position, ppg_id) "
        + "VALUES ((SELECT idPeripheral FROM Peripheral where peripheralAddress = ?), ?, ?)";

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