// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Game = require('./models/game');

mongoose.connect('mongodb://localhost/node-tic-tac-toe'); //connect to our db

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// ROUTES FOR GAMES -------------------------------
router.route('/games')

// create a game (accessed at POST http://localhost:8080/api/games)
.post(function(req, res) {

        var game = new Game(); // make a new instance of a game
        game.name = req.body.name; // set the name of the game (from the request)
        game.player0 = req.body.player0; // set the first player's name from the request
        game.player1 = req.body.player1; // set the first player's name from the request

        game.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Game created!' });
            console.log("Game created: "+game.id);
        });

    })
    // get all the games (accessed at GET http://localhost:8080/api/games)
    .get(function(req, res) {
        Game.find(function(err, games) {
            if (err)
                res.send(err);

            res.json(games);
        });
    });

// on routes that end in /games/:id
// ----------------------------------------------------
router.route('/games/:id')

// get the game with that id (accessed at GET http://localhost:8080/api/games/:id)
.get(function(req, res) {
        Game.findById(req.params.id, function(err, game) {
            if (err)
                res.send(err);
            res.json(game);
        });
    })

// update the game with this id (accessed at PUT http://localhost:8080/api/games/:id)
.put(function(req, res) {

        // use our game model to find the game we want
        Game.findById(req.params.id, function(err, game) {

            if (err)
                res.send(err);

            game.name = req.body.name; // update the bears info

            // save the game
            game.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Game updated!' });
                console.log("Game updated: "+game.id);
            });
        });
    })

// delete the game with this id (accessed at DELETE http://localhost:8080/api/games/:id)
    .delete(function(req, res) {
        Game.remove({
            _id: req.params.id
        }, function(err, game) {
            if (err)
                res.send(err);

            res.json({ message: 'Game successfully deleted' });
        });
    });

// on routes that end in /games/play/:id
// ----------------------------------------------------
router.route('/games/play/:id')

// update the game with this id (accessed at PUT http://localhost:8080/api/games/play/:id)
.put(function(req, res) {

        // use our game model to find the game we want
        Game.findById(req.params.id, function(err, game) {

            if (err)
                res.send(err);

            if ((req.body.row > 2) || (req.body.row < 0) || (req.body.col > 2) || (req.body.col < 0))
            	res.send("Invalid request");

            if (game.player0 == '' || game.player1 == '')
            	res.send("You need two players in order to play.");

            if (game.grid[parseInt(req.body.row)][parseInt(req.body.col)]=="") {
            	console.log(parseInt(req.body.row) + " and " + parseInt(req.body.col));
            	game.grid[parseInt(req.body.row)][parseInt(req.body.col)] = (game.turn%2==0) ? "X" : "O";
            	console.log(game.grid[parseInt(req.body.row)][parseInt(req.body.col)]);
            	game.turn++;
            	game.markModified("grid");
            }
            else {
            	res.send("You can't play there.");
            }

            // save the game
            game.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Game updated!' });
                console.log("Game updated: "+game.id);
            });
        });
    })

// on routes that end in /games/join/:id
// ----------------------------------------------------
router.route('/games/join/:id')

// join the game with this id (accessed at PUT http://localhost:8080/api/games/join/:id)
.put(function(req, res) {

        // use our game model to find the game we want
        Game.findById(req.params.id, function(err, game) {

            if (err)
                res.send(err);

            if (req.body.player1 == '')
            	res.send("Invalid request");

            if (game.player1 != '')
            	res.send("Two people are already playing this game.");

            game.player1 = req.body.player1; // update the bears info

            // save the game
            game.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Game updated!' });
                console.log("Game updated: "+game.id);
            });
        });
    })

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
