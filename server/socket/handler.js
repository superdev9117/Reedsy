const queueService = require('../services/queueService.js');

module.exports = function (socket) {
    socket.on('init', function (data) {
        // reset each queue on new connection
        // just assuming there will be just one active client at a time
        queueService.initQueue();
    });
    socket.on('processRequest', function (data) {
        const jobType = data.jobType;
        const jobId = data.jobId;
        var doneCallback = function doneCallback(jobId, jobType) {
            socket.emit('processed', {jobId: jobId, jobType: jobType});
            var queueSize = queueService.getQueueSize();
            if (queueSize > 0) {
                var theTask = queueService.dequeue();
                theTask.taskFunction(doneCallback);
                socket.emit('processing', {jobId: theTask.jobId, jobType: theTask.jobType});
                queueService.isProcessing = true;
            } else {
                queueService.isProcessing = false;
            }
        };
        queueService.enqueueJob(jobType, jobId, doneCallback);
        socket.emit('enqueued', {jobId: jobId, jobType: jobType});

        if (!queueService.isProcessing) {
            queueService.startProcessingQueue(doneCallback);
            socket.emit('processing', {jobId: jobId, jobType: jobType});
            queueService.isProcessing = true;
        }

    });
};