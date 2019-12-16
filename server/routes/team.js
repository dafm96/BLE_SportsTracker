const express = require('express');
const router = new express.Router();

router.get('/teams', (req, res) => {
    res.send(/* send all teams */);
})

router.get('/teams/:teamId', (req, res) => {
    res.send(/* send specific team */);
})

router.post('/teams', (req, res) => {
    res.send(/* add team */);
})

router.delete('/teams/:teamsId', (req, res) => {
    res.send(/* delete team */);
})