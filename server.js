const express = require('express')
const app = express()
const ble = require('./ble')

app.get('/peripherals', function (req, res) {
    res.send(ble.getPeripherals().map(p => p.address))
})

app.get('/peripherals/:peripheralAddress', function (req, res) {
    res.json(ble.getPeripherals().filter(p => p.address === req.params.peripheralAddress)[0])
})

app.post('/peripherals/:peripheralAddress/startRaw', function (req, res) {
    ble.startRaw(req.params.peripheralAddress)
    res.send()
})

app.post('/peripherals/:peripheralAddress/stopRaw', function (req, res) {
    ble.idle(req.params.peripheralAddress)
    res.send()
})

app.post('/startAllRaw', function (req, res) {
    ble.getPeripherals().map(p => p.address).forEach(element => {
        ble.startRaw(element)
    });
    res.send()
})

app.post('/shutdownAll', function (req, res) {
    ble.getPeripherals().map(p => p.address).forEach(element => {
        ble.shutdown(element)
    });
    res.send()
})

app.listen(3000)