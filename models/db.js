/**
 * Created by valarsu on 16-4-17.
 */
var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host, settings.port),
    {safe : true});