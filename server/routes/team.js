const express = require('express');
const router = new express.Router();

// TODO refactor select *
router.get('/teams', (req, res) => {
    let q = 'SELECT * FROM Team';
    connection.query(q, function (err, result) {
        if (err) {
            res.status(400).send('DB error')
        }
        res.send((result));
    })
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