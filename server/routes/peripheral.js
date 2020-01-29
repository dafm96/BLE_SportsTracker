const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql.js');
var mqtt = require('mqtt')
//var client = mqtt.connect('mqtt://192.168.0.122')
var client = mqtt.connect('mqtt://192.168.1.1')
let connectedDevices = new Map()

client.on('connect', function () {
    client.subscribe('connected');
    client.subscribe('disconnected');
})

client.on('message', function (topic, message) {
    if (topic === 'connected') {
        let m = (JSON.parse(message.toString()))
        m.forEach(e => {
            connectedDevices.set(e.address, e)
        });
    }
    if (topic === 'disconnected') {
        if (connectedDevices.has(message.toString()))
            connectedDevices.delete(message.toString())
    }
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
    else if (topic.match(/^metrics\/\d+\/steps/)) {
        const obj = JSON.parse(message.toString());
        console.log(obj);
        let q = "UPDATE `BLE_Sports_Tracker`.`Metrics` "
            + "SET `steps` = ?, `distance` = ? "
            + "WHERE (`ppg_id` = ?)";
        connection.query(q, [obj.steps, obj.distance, obj.ppgId], function (err, result) {
            if (err) {
                return res.status(400).send('DB error')
            }
        })
    }
    else if (topic.match(/^metrics\/\d+\/jumps/)) {
        const obj = JSON.parse(message.toString());
        console.log(obj);
        let q = "UPDATE `BLE_Sports_Tracker`.`Metrics` "
            + "SET `jumps` = ? "
            + "WHERE (`ppg_id` = ?)";
        connection.query(q, [obj.jumps, obj.ppgId], function (err, result) {
            if (err) {
                return res.status(400).send('DB error')
            }
        })
    }
    else if (topic.match(/^metrics\/\d+\/dribble/)) {
        const obj = JSON.parse(message.toString());
        console.log(obj);
        let q = "UPDATE `BLE_Sports_Tracker`.`Metrics` "
            + "SET `dribbles` = ?, `dribbling_time` = ? "
            + "WHERE (`ppg_id` = ?)";
        connection.query(q, [obj.dribbleCount, Math.round(obj.dribblingTime * 100) / 100, obj.ppgId], function (err, result) {
            if (err) {
                return res.status(400).send('DB error')
            }
        })
    }
})

// Get all peripherals
router.get('/peripherals', function (req, res) {
    res.send({ peripherals: Array.from(connectedDevices.values()) })
})

// Get single peripheral
router.get('/peripherals/:peripheralAddress', function (req, res) {
    res.send(connectedDevices.filter(p => p.address === req.params.peripheralAddress))
})

// Starts a given peripherals
router.post('/peripherals/:peripheralAddress/startRaw', function (req, res) {
    client.publish('operation', JSON.stringify({ operation: 'startRaw', address: req.params.peripheralAddress }))
    res.send()
})

// Stops a given peripherals
router.post('/peripherals/:peripheralAddress/stopRaw', function (req, res) {
    client.publish('operation', JSON.stringify({ operation: 'stopRaw', address: req.params.peripheralAddress }))
    res.send()
})

// Shutdown a given peripherals
router.post('/peripherals/:peripheralAddress/shutdown', function (req, res) {
    client.publish('operation', JSON.stringify({ operation: 'shutdown', address: req.params.peripheralAddress }))
    res.send()
})

// Starts all peripherals
router.post('/startAllRaw', function (req, res) {
    client.publish('operation', JSON.stringify({ operation: 'startAllRaw' }))
    res.send()
})

// Stops all peripherals
router.post('/stopAllRaw', function (req, res) {
    client.publish('operation', JSON.stringify({ operation: 'stopAllRaw' }))
    res.send()
})

// Shutdown all peripherals
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

// Starts all peripherals for given game
router.post('/peripherals/game/:gameId/start', (req, res) => {
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
                    client.subscribe('metrics/' + req.params.gameId + "/steps");
                    break;
                case 'HAND':
                    client.subscribe('metrics/' + req.params.gameId + "/dribble");
                    break;
                case 'HIP':
                    break;
                case 'BACK':
                    client.subscribe('metrics/' + req.params.gameId + "/activityTime");
                    client.subscribe('metrics/' + req.params.gameId + "/jumps");
                    break;
            }
        }
        res.send();
    })
})

// Stops all peripherals for given game
router.post('/peripherals/game/:gameId/stop', (req, res) => {
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
                    client.unsubscribe('metrics/' + req.params.gameId + "/steps");
                    break;
                case 'HAND':
                    client.unsubscribe('metrics/' + req.params.gameId + "/dribble");
                    break;
                case 'HIP':
                    break;
                case 'BACK':
                    client.unsubscribe('metrics/' + req.params.gameId + "/activityTime");
                    client.unsubscribe('metrics/' + req.params.gameId + "/jumps");
                    break;
            }
        }
        res.send();
    })
})

// Shutdown all peripherals for given game
router.post('/peripherals/game/:gameId/shutdown', (req, res) => {
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
                    operation: 'shutdown',
                    address: item.peripheralAddress,
                }))
        }
        res.send();
    })
})

module.exports = router
