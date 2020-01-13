const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql.js');
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://192.168.0.122')
let connectedDevices = []

client.on('connect', function () {
    client.subscribe('connected');
})

client.on('message', function (topic, message) {
    if (topic === 'connected') {
        connectedDevices = (JSON.parse(message.toString()))
    }
    //TODO receive different topics and store accordingly
    else if (topic.match(/^metrics\/\d+\/activityTime/)) {
        const obj = JSON.parse(message.toString());
        let q = "UPDATE `BLE_Sports_Tracker`.`Metrics` "
            + "SET `still_time` = ?, `walking_time` = ?, `running_time` = ? "
            + "WHERE (`ppg_id` = ?)";
        connection.query(q, [obj.activityTime.STILL, obj.activityTime.WALKING, obj.activityTime.RUNNING, obj.ppgId], function (err, result) {
            if (err) {
                return res.status(400).send('DB error')
            }
        })
    }
    else if (topic.match(/^metrics\/\d+\/jumps/)) {
        const obj = JSON.parse(message.toString());
        console.log(obj)
        let q = "UPDATE `BLE_Sports_Tracker`.`Metrics` "
            + "SET `jumps` = ? "
            + "WHERE (`ppg_id` = ?)";
        connection.query(q, [obj.jumps, obj.ppgId], function (err, result) {
            if (err) {
                return res.status(400).send('DB error')
            }
        })
    }
})

router.get('/peripherals', function (req, res) {
    res.send({ peripherals: connectedDevices })
})

router.get('/peripherals/:peripheralAddress', function (req, res) {
    res.send(connectedDevices.filter(p => p.address === req.params.peripheralAddress))
})

router.post('/peripherals/:peripheralAddress/startRaw', function (req, res) {
    client.publish('operation', JSON.stringify({ operation: 'startRaw', address: req.params.peripheralAddress }))
    res.send()
})

router.post('/peripherals/:peripheralAddress/stopRaw', function (req, res) {
    client.publish('operation', JSON.stringify({ operation: 'stopRaw', address: req.params.peripheralAddress }))
    res.send()
})

router.post('/peripherals/:peripheralAddress/shutdown', function (req, res) {
    client.publish('operation', JSON.stringify({ operation: 'shutdown', address: req.params.peripheralAddress }))
    res.send()
})

router.post('/startAllRaw', function (req, res) {
    client.publish('operation', JSON.stringify({ operation: 'startAllRaw' }))
    res.send()
})

router.post('/stopAllRaw', function (req, res) {
    client.publish('operation', JSON.stringify({ operation: 'stopAllRaw' }))
    res.send()
})

router.post('/shutdownAll', function (req, res) {
    client.publish('operation', JSON.stringify({ operation: 'shutdownAll' }))
    res.send()
})

router.get('/tracking', (req, res) => {
    ble.tracking((error, data) => {
        if (error) {
            return res.status(400).send(error);
        }
        else {
            return res.send(JSON.parse(data));
        }
    });
})

router.post('/peripherals/game/:gameId/start', (req, res) => {
    // let q = 'SELECT * FROM BLE_Sports_Tracker.Player_Peripheral_Game ppg '
    //     + 'inner join Peripheral ph on ppg.peripheral_id = ph.idPeripheral '
    //     + 'where ppg.game_id = ?';
    let q = "SELECT * FROM BLE_Sports_Tracker.Player_Peripheral_Game ppg "
        + "inner join PG_Peripherals pgp on ppg.idPlayer_Peripheral_Game = pgp.ppg_id "
        + "inner join Peripheral p on pgp.peripheral_id = p.idPeripheral "
        + "where ppg.game_id = ?";
    connection.query(q, [req.params.gameId], function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        for (const item of result) {
            client.publish('operation',
                JSON.stringify({
                    operation: 'startRaw',
                    address: item.peripheralAddress,
                    gameId: item.game_id,
                    ppgId: item.idPlayer_Peripheral_Game,
                    peripheralPosition: item.peripheral_position
                }))
            switch (item.peripheral_position) {
                case 'FOOT':
                    client.subscribe('metrics/' + req.params.gameId + "/activityTime");
                    break;
                case 'HAND':
                    break;
                case 'HIP':
                    break;
                case 'BACK':
                    client.subscribe('metrics/' + req.params.gameId + "/jumps");
                    break;
            }
        }
        //TODO send body part and subscribed to correspondent topic(s)
        client.subscribe('metrics/' + req.params.gameId + "/activityTime");
        res.send();
    })
})

router.post('/peripherals/game/:gameId/stop', (req, res) => {
    // let q = 'SELECT * FROM BLE_Sports_Tracker.Player_Peripheral_Game ppg '
    //     + 'inner join Peripheral ph on ppg.peripheral_id = ph.idPeripheral '
    //     + 'where ppg.game_id = ?';
    let q = "SELECT * FROM BLE_Sports_Tracker.Player_Peripheral_Game ppg "
        + "inner join PG_Peripherals pgp on ppg.idPlayer_Peripheral_Game = pgp.ppg_id "
        + "inner join Peripheral p on pgp.peripheral_id = p.idPeripheral "
        + "where ppg.game_id = ?";

    connection.query(q, [req.params.gameId], async function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        for (const item of result) {
            client.publish('operation',
                JSON.stringify({
                    operation: 'stopRaw',
                    address: item.peripheralAddress,
                }))
            switch (item.peripheral_position) {
                case 'FOOT':
                    client.unsubscribe('metrics/' + req.params.gameId + "/activityTime");
                    break;
                case 'HAND':
                    break;
                case 'HIP':
                    break;
                case 'BACK':
                    client.unsubscribe('metrics/' + req.params.gameId + "/jumps");
                    break;
            }
        }
        res.send();
    })
})

router.post('/peripherals/game/:gameId/shutdown', (req, res) => {
    // let q = 'SELECT * FROM BLE_Sports_Tracker.Player_Peripheral_Game ppg '
    //     + 'inner join Peripheral ph on ppg.peripheral_id = ph.idPeripheral '
    //     + 'where ppg.game_id = ?';
    let q = "SELECT * FROM BLE_Sports_Tracker.Player_Peripheral_Game ppg "
        + "inner join PG_Peripherals pgp on ppg.idPlayer_Peripheral_Game = pgp.ppg_id "
        + "inner join Peripheral p on pgp.peripheral_id = p.idPeripheral "
        + "where ppg.game_id = ?";
    connection.query(q, [req.params.gameId], async function (err, result) {
        if (err) {
            return res.status(400).send('DB error')
        }
        for (const item of result) {
            console.log(item.peripheralAddress)
            client.publish('operation',
                JSON.stringify({
                    operation: 'shutdown',
                    address: item.peripheralAddress,
                }))
        }
        res.send();
    })
})

module.exports = router