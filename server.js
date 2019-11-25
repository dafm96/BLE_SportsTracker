const express = require('express')
const app = express()
const ble = require('./ble')

app.get('/peripherals', function (req, res) {
    res.send(ble.peripherals.map(p => p.peripheral.address))
})

app.get('/peripherals/:peripheralAddress', function (req, res) {
    res.send(ble.peripherals.filter(p => p.address === req.params.peripheralAddress))
})

app.post('/peripherals/:peripheralAddress/startRaw', function (req, res) {
    ble.startRaw(req.params.peripheralAddress)
    res.send()
})

app.post('/peripherals/:peripheralAddress/stopRaw', function (req, res) {
    ble.idle(req.params.peripheralAddress)
    res.send()
})

app.listen(3000)