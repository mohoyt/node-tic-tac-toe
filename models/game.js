// app/models/game.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var now = new Date;

var GameSchema = new Schema({
    name: { type: String, default: 'New Game (' + now.toISOString() + ')' },
    player0: {type: String, default: ''},
    player1: { type: String, default: '' },
    turn: { type: Number, default: 0 },
    grid: { type: Array, default: [['','',''],['','',''],['','','']] }
});

module.exports = mongoose.model('Game', GameSchema);
