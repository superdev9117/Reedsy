'use strict';

const router = require('express').Router();
const queueService = require('../services/queueService.js');

/**
 *  The route handler for the root path. This puts a task in queue
 */
router.get('/', (req, res, next) => {
    const jobType = req.query.jobType;
    const jobId = req.query.jobId;
    var doneCallback = function doneCallback(jobId, jobType) {
        console.log("jobId,jobType: ",jobId,",",jobType," :Finished")
        var queueSize = queueService.getQueueSize();
        if (queueSize > 0) {
            queueService.dequeue().taskFunction(doneCallback);
            queueService.isProcessing=true;
        } else {
            queueService.isProcessing = false;
            console.log("all task processed!");
        }
    };
    queueService.enqueueJob(jobType, jobId, doneCallback);

    if (!queueService.isProcessing) {
        queueService.startProcessingQueue(doneCallback);
        queueService.isProcessing=true;
    }

    return res.json({
        message: "success"
    });
});
module.exports = router;