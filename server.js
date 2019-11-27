const express = require('express')
const app = express()
const ble = require('./ble')

app.use(express.json());
app.use(express.static('public')); //Send index.html page on GET /

app.get('/peripherals', function(req, res) {
    res.send({ peripherals: ble.getPeripherals().map(p => p.address) })
})

app.get('/peripherals/:peripheralAddress', function(req, res) {
    res.json(ble.getPeripherals().filter(p => p.address === req.params.peripheralAddress)[0])
})

app.post('/peripherals/:peripheralAddress/startRaw', function(req, res) {
    ble.startRaw(req.params.peripheralAddress)
    res.send()
})

app.post('/peripherals/:peripheralAddress/stopRaw', function(req, res) {
    ble.idle(req.params.peripheralAddress)
    res.send()
})

app.post('/peripherals/:peripheralAddress/shutdown', function(req, res) {
    ble.shutdown(req.params.peripheralAddress)
    res.send()
})

app.post('/startAllRaw', function(req, res) {
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

app.post('/stopAllRaw', function(req, res) {
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

app.post('/shutdownAll', function(req, res) {
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

app.listen(3000)