'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const socket = require('./socket/handler');
const queueService = require('./services/queueService');

const endpoint = require('./controllers/queueController');

const app = express();

// initialize the queue
queueService.initQueue();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

//app.use('/queue', kue.app);
app.use('/endpoint', endpoint);
app.use('/testroute', function (req, res) {
    console.log("this hit");
    res.status(404);
    res.json({
        key: 'thisworks'
    })
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

const server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("host=",host);
    console.log("port=",port);
    console.log("Example app listening at http://%s:%s", host, port);
});

// socket.io code
const io = require('socket.io')(server);
io.on('connection', socket);

module.exports = app;