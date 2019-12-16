const express = require('express');
const router = new express.Router();

router.get('/games', (req, res) => {
    /* search by date and teams */
    res.send(/* send all games */);
})

router.get('/games/:gameId', (req, res) => {
    res.send(/* send specific team */);
})

router.post('/games', (req, res) => {
    /* send in body date and teams */
    res.send(/* add game */);
})

router.delete('/games/:gameId', (req, res) => {
    res.send(/* delete game */);
})