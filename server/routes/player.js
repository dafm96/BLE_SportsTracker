const express = require('express');
const router = new express.Router();

router.get('/players', (req, res) => {
    res.send(/* send all players */);
})

router.get('/players/:playerId', (req, res) => {
    res.send(/* send specific player */);
})

router.post('/players', (req, res) => {
    res.send(/* add player */);
})

router.delete('/players/:playerId', (req, res) => {
    res.send(/* delete player */);
})