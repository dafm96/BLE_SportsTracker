const express = require('express');
const router = new express.Router()
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://192.168.1.9')
let connectedDevices = []

client.on('connect', function () {
    client.subscribe('connected');
})


client.on('message', function (topic, message) {
    if (topic === 'connected') {
        connectedDevices = (JSON.parse(message.toString()))
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

module.exports = router