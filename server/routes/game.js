const express = require('express');
const router = new express.Router();
const connection = require('../db/mysql.js');

// Returns all games
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

// Returns a single game
router.get('/games/:gameId', (req, res) => {
    let q = 'SELECT * FROM gameTeams WHERE idGame = ?';
    connection.query(q, [req.params.gameId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        res.send((result));
    })
})

// Creates a game
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

// Deletes a Game
router.delete('/games/:gameId', (req, res) => {
    let q = 'DELETE FROM Game WHERE idGame = ?';
    connection.query(q, [req.params.gameId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error:' + err)
        }
        res.send((result));
    })
})

// Gets metrics for a given player in a game (ppgid)
router.get('/games/metrics/:ppgId', (req, res) => {
    let q = 'SELECT * FROM Metrics WHERE ppg_id = ?';
    connection.query(q, [req.params.ppgId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        res.send(result[0]);
    })
})

// Gets the info from a game
//      - Teams
//      - Players and peripherals
router.get('/games/:gameId/info', (req, res) => {
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

//Assigns a peripheral (sensor) to a player in a game (ppgid)
router.put('/games/ppg/:ppgid', (req, res) => {
    //TODO make sure a device is not repeated on a game
    let q = "INSERT INTO PG_Peripherals (peripheral_id, peripheral_position, ppg_id) "
        + "VALUES ((SELECT idPeripheral FROM Peripheral where peripheralAddress = ?), ?, ?)";

    connection.query(q, [req.body.peripheralAddress, req.body.peripheralPosition, req.params.ppgid], function (err, result) {
        if (err) {
            console.log(err)
            return res.status(400).send('DB error')
        }
        res.send((result));
    })
})

// Removes a peripheral (sensor) from a player in a game (ppgid)
router.delete('/games/ppg/:pgperipheralId', (req, res) => {
    let q = "DELETE FROM `BLE_Sports_Tracker`.`PG_Peripherals` WHERE (`idPG_Peripherals` = ?)";

    connection.query(q, [req.params.pgperipheralId], function (err, result) {
        if (err) {
            console.log(err)
            return res.status(400).send('DB error')
        }
        res.send((result));
    })
})

module.exports = router