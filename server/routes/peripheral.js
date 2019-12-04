const express = require('express');
const router = new express.Router()
const ble = require('../services/ble')
//TODO ADD Errors when no peripheralAddress is found
router.get('/peripherals', function(req, res) {
    res.send({ peripherals: ble.getPeripherals() })
})

router.get('/peripherals/:peripheralAddress', function(req, res) {
    res.json(ble.getPeripheral(req.params.peripheralAddress))
})

router.post('/peripherals/:peripheralAddress/startRaw', function(req, res) {
    ble.startRaw(req.params.peripheralAddress)
    res.send()
})

router.post('/peripherals/:peripheralAddress/stopRaw', function(req, res) {
    ble.idle(req.params.peripheralAddress)
    res.send()
})

router.post('/peripherals/:peripheralAddress/shutdown', function(req, res) {
    ble.shutdown(req.params.peripheralAddress)
    res.send()
})

router.post('/startAllRaw', function(req, res) {
    let p = ble.getPeripherals();
    if (p.length > 0) {
        p.map(p => p.address).forEach(element => {
            ble.startRaw(element)
        });
        res.send()
    } else {
        res.status(400).send()
    }
})

router.post('/stopAllRaw', function(req, res) {
    let p = ble.getPeripherals();
    if (p.length > 0) {
        p.map(p => p.address).forEach(element => {
            ble.idle(element)
        });
        res.send()
    } else {
        res.status(400).send()
    }
})

router.post('/shutdownAll', function(req, res) {
    let p = ble.getPeripherals();
    if (p.length > 0) {
        p.map(p => p.address).forEach(element => {
            ble.shutdown(element)
        });
        res.send()
    } else {
        res.status(400).send()
    }
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